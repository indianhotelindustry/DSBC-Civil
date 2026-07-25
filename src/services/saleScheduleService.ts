import {
  Sale,
  SaleSchedule,
  ScheduleType,
  ScheduleStatus,
  BusinessRuleError,
} from '../types';
import { collection, onSnapshot, query, where as fsWhere } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  queryDocuments,
  logAction,
  where,
} from './db';
import { deriveAutoStatus, scheduleBalance } from '../lib/scheduleCalcs';

const COLLECTION = 'saleSchedules';
const SALES = 'sales';

/**
 * Installment plan service for a Sale (Phase 2A).
 *
 * Invariants enforced here:
 *   - CANCELLED sales cannot have schedules created, edited, or deleted.
 *   - `amount > 0` and `dueDate` required on every write.
 *   - `installmentNo` is auto-suggested as max+1 when omitted on create;
 *     callers can override (useful for BOOKING / POSSESSION / REGISTRY
 *     rows that precede or follow the installment sequence).
 *   - `companyId / projectId / subLocationId / customerId` are denormalized
 *     from the parent sale so dashboard queries stay flat.
 *   - `paidAmount` starts at 0; `balanceAmount` starts at `amount`.
 *     `saleReceiptService` is the sole writer that bumps these via
 *     atomic batches when a receipt carries `linkedScheduleId`.
 *   - `status` auto-derives from paidAmount for PENDING/PARTIALLY_PAID/PAID.
 *     WAIVED and CANCELLED are sticky — only `waive()` / `cancelRow()`
 *     set them and `reactivate()` moves back.
 */

export interface ScheduleCreateInput {
  saleId: string;
  installmentNo?: number;           // omitted → auto-next
  scheduleType: ScheduleType;
  dueDate: string;                   // ISO
  amount: number;
  remarks?: string;
}

export interface ScheduleEditableFields {
  installmentNo?: number;
  scheduleType?: ScheduleType;
  dueDate?: string;
  amount?: number;
  remarks?: string;
}

async function loadSaleOrThrow(saleId: string): Promise<Sale> {
  const sale = await getDocument<Sale>(SALES, saleId);
  if (!sale) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Sale ${saleId} not found.`);
  return sale;
}

async function assertSaleNotCancelled(saleId: string): Promise<Sale> {
  const sale = await loadSaleOrThrow(saleId);
  if (sale.saleStatus === 'CANCELLED') {
    throw new BusinessRuleError(
      'RECORD_LOCKED',
      'Cannot modify installment schedules on a cancelled sale.'
    );
  }
  return sale;
}

function assertValidAmountAndDate(amount: number | undefined, dueDate: string | undefined) {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) {
    throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Schedule amount must be greater than 0.');
  }
  if (!dueDate || !dueDate.trim()) {
    throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Due date is required.');
  }
}

async function nextInstallmentNo(saleId: string): Promise<number> {
  const existing = await queryDocuments<SaleSchedule>(COLLECTION, [where('saleId', '==', saleId)]);
  if (existing.length === 0) return 1;
  return Math.max(...existing.map(s => s.installmentNo || 0)) + 1;
}

export const saleScheduleService = {
  /** Live list of all schedules (used by the recovery dashboard). */
  getAll: (callback: (schedules: SaleSchedule[]) => void) => {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SaleSchedule, 'id'>) })));
    });
  },

  /** Live list scoped to a single sale (detail page). Sorted by
   *  installmentNo ascending to match dialog order. */
  subscribeBySale: (saleId: string, callback: (schedules: SaleSchedule[]) => void) => {
    const q = query(collection(db, COLLECTION), fsWhere('saleId', '==', saleId));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SaleSchedule, 'id'>) }));
      list.sort((a, b) => (a.installmentNo || 0) - (b.installmentNo || 0));
      callback(list);
    });
  },

  getById: async (id: string): Promise<SaleSchedule | null> => {
    return getDocument<SaleSchedule>(COLLECTION, id);
  },

  create: async (input: ScheduleCreateInput): Promise<string> => {
    assertValidAmountAndDate(input.amount, input.dueDate);
    const sale = await assertSaleNotCancelled(input.saleId);

    const installmentNo = input.installmentNo ?? await nextInstallmentNo(input.saleId);
    if (installmentNo <= 0 || !Number.isFinite(installmentNo)) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Installment number must be positive.');
    }

    const now = new Date().toISOString();
    const amount = +input.amount.toFixed(2);
    const doc: Omit<SaleSchedule, 'id'> = {
      saleId: input.saleId,
      companyId: sale.companyId,
      projectId: sale.projectId,
      subLocationId: sale.subLocationId,
      customerId: sale.customerId,
      installmentNo,
      scheduleType: input.scheduleType,
      dueDate: input.dueDate,
      amount,
      status: 'PENDING',
      paidAmount: 0,
      balanceAmount: amount,
      remarks: input.remarks?.trim() || undefined,
      createdAt: now,
      createdBy: auth.currentUser?.uid || '',
      updatedAt: now,
    };
    const id = await createDocument(COLLECTION, doc as Record<string, unknown>);
    await logAction(
      'SCHEDULE_CREATE',
      'SaleSchedule',
      id,
      `Created ${input.scheduleType} #${installmentNo} on sale ${input.saleId.slice(0, 8)}: ` +
      `${input.dueDate} · ₹${amount}`
    );
    return id;
  },

  /** Edit the editable fields of a schedule. Non-sticky statuses
   *  (PENDING/PARTIALLY_PAID/PAID) are auto-recomputed from the new
   *  amount + existing paidAmount. WAIVED/CANCELLED are preserved
   *  — admins must use `reactivate()` to unstick them. */
  update: async (id: string, data: ScheduleEditableFields): Promise<void> => {
    const prior = await getDocument<SaleSchedule>(COLLECTION, id);
    if (!prior) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Schedule not found.');
    await assertSaleNotCancelled(prior.saleId);

    const nextAmount = data.amount != null ? +data.amount.toFixed(2) : prior.amount;
    const nextDueDate = data.dueDate ?? prior.dueDate;
    assertValidAmountAndDate(nextAmount, nextDueDate);

    const now = new Date().toISOString();
    const payload: Record<string, unknown> = {
      updatedAt: now,
    };
    if (data.installmentNo != null) payload.installmentNo = data.installmentNo;
    if (data.scheduleType != null) payload.scheduleType = data.scheduleType;
    if (data.dueDate != null) payload.dueDate = data.dueDate;
    if (data.amount != null) {
      payload.amount = nextAmount;
      payload.balanceAmount = Math.max(0, nextAmount - (prior.paidAmount || 0));
      // Re-derive status only when not stuck
      if (prior.status !== 'WAIVED' && prior.status !== 'CANCELLED') {
        payload.status = deriveAutoStatus(nextAmount, prior.paidAmount || 0);
      }
    }
    if (data.remarks !== undefined) {
      payload.remarks = data.remarks?.trim() || null;
    }

    await updateDocument(COLLECTION, id, payload);
    await logAction(
      'SCHEDULE_UPDATE',
      'SaleSchedule',
      id,
      `Updated schedule #${prior.installmentNo} on sale ${prior.saleId.slice(0, 8)}`
    );
  },

  /** Mark a schedule as WAIVED (admin forgives the remaining balance).
   *  Stays WAIVED until `reactivate()`. Still allowed when paidAmount > 0
   *  — the paid portion stays on record, remaining balance is written off
   *  from the collection stats. */
  waive: async (id: string, reason?: string): Promise<void> => {
    const prior = await getDocument<SaleSchedule>(COLLECTION, id);
    if (!prior) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Schedule not found.');
    await assertSaleNotCancelled(prior.saleId);
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, id, {
      status: 'WAIVED' as ScheduleStatus,
      balanceAmount: 0,
      updatedAt: now,
    });
    await logAction(
      'SCHEDULE_WAIVE',
      'SaleSchedule',
      id,
      `Waived schedule #${prior.installmentNo} on sale ${prior.saleId.slice(0, 8)}` +
      (reason ? ` — ${reason}` : '')
    );
  },

  /** Mark a schedule as CANCELLED. Similar to waive but typically used
   *  when the schedule should not have existed at all. */
  cancelRow: async (id: string, reason?: string): Promise<void> => {
    const prior = await getDocument<SaleSchedule>(COLLECTION, id);
    if (!prior) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Schedule not found.');
    await assertSaleNotCancelled(prior.saleId);
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, id, {
      status: 'CANCELLED' as ScheduleStatus,
      balanceAmount: 0,
      updatedAt: now,
    });
    await logAction(
      'SCHEDULE_CANCEL',
      'SaleSchedule',
      id,
      `Cancelled schedule #${prior.installmentNo} on sale ${prior.saleId.slice(0, 8)}` +
      (reason ? ` — ${reason}` : '')
    );
  },

  /** Move a WAIVED/CANCELLED row back to its auto-derived status. */
  reactivate: async (id: string): Promise<void> => {
    const prior = await getDocument<SaleSchedule>(COLLECTION, id);
    if (!prior) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Schedule not found.');
    await assertSaleNotCancelled(prior.saleId);
    const now = new Date().toISOString();
    const status = deriveAutoStatus(prior.amount, prior.paidAmount || 0);
    await updateDocument(COLLECTION, id, {
      status,
      balanceAmount: scheduleBalance({ ...prior, status } as SaleSchedule),
      updatedAt: now,
    });
    await logAction(
      'SCHEDULE_REACTIVATE',
      'SaleSchedule',
      id,
      `Reactivated schedule #${prior.installmentNo} on sale ${prior.saleId.slice(0, 8)} → ${status}`
    );
  },

  /** Hard delete a schedule. Blocked when receipts are allocated to it
   *  (paidAmount > 0) — admins must waive/cancel instead so the
   *  historical allocation stays intact. */
  delete: async (id: string): Promise<void> => {
    const prior = await getDocument<SaleSchedule>(COLLECTION, id);
    if (!prior) return;
    await assertSaleNotCancelled(prior.saleId);
    if ((prior.paidAmount || 0) > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        'Cannot delete a schedule that has linked receipts. Waive or cancel instead.'
      );
    }
    await deleteDocument(COLLECTION, id);
    await logAction(
      'SCHEDULE_DELETE',
      'SaleSchedule',
      id,
      `Deleted schedule #${prior.installmentNo} on sale ${prior.saleId.slice(0, 8)}`
    );
  },
};
