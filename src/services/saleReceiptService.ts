import { Sale, SaleReceipt, SaleSchedule, ReceiptMode, ReceiptAllocation, AllocationMode, BusinessRuleError } from '../types';
import { collection, onSnapshot, query, where as fsWhere } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  getDocument,
  executeBatch,
  generateDocId,
  logAction,
  type BatchOperation,
} from './db';
import { deriveAutoStatus, resolveReceiptAllocations, summarizeAllocation } from '../lib/scheduleCalcs';

const COLLECTION = 'saleReceipts';
const SALES = 'sales';
const SCHEDULES = 'saleSchedules';

/**
 * Receipt service against a Sale.
 *
 * Phase 1 (unchanged):
 *   - Cannot add a receipt to a CANCELLED sale.
 *   - Overpayment on the sale as a whole is ALLOWED; UI warns.
 *   - Every create/delete re-computes and writes back
 *     `sales.totalReceived` atomically.
 *
 * Phase 2A/2B (allocation):
 *   - Receipt may carry an `allocations` array (Phase 2B) or the
 *     legacy `linkedScheduleId` single-link (Phase 2A). `allocations`
 *     is authoritative when present; otherwise `linkedScheduleId` is
 *     treated as one allocation for the full receipt amount.
 *   - Auto-distribute (Phase 2B): the UI computes the per-schedule
 *     split via `computeAutoDistribution` and passes the resulting
 *     `allocations` array. The service validates each target and
 *     applies the bumps atomically.
 *   - Every targeted schedule's `paidAmount` is bumped in the same
 *     executeBatch as the receipt write, with `balanceAmount` and
 *     auto-status recomputed (skipped if WAIVED/CANCELLED).
 *   - Unallocated portion (allocations sum < receipt amount, OR no
 *     allocations at all) still contributes to `sale.totalReceived`.
 *   - Receipts that target WAIVED or CANCELLED schedules are rejected.
 *   - Delete reverses every allocation symmetrically.
 */

export interface ReceiptCreateInput {
  saleId: string;
  amount: number;
  receivedAt: string;
  mode: ReceiptMode;
  reference?: string;
  remarks?: string;
  /** @deprecated Phase 2A single-link. Prefer `allocations`. */
  linkedScheduleId?: string;
  /** Phase 2B: optional multi-schedule allocation. Every element
   *  bumps the target schedule's `paidAmount` atomically with the
   *  receipt write. Sum may be ≤ receipt `amount`; excess is kept
   *  unallocated but still counted in `sale.totalReceived`. */
  allocations?: ReceiptAllocation[];
  /** Phase 2B alignment: caller-declared mode persisted on the receipt.
   *  When omitted, the service infers: UNALLOCATED (no target),
   *  SPECIFIC (linkedScheduleId or single allocation), AUTO (>1
   *  allocations). UI callers should pass explicitly so a user who
   *  clicked "auto" but got a single-schedule result still reads AUTO. */
  allocationMode?: AllocationMode;
}

async function loadSaleOrThrow(saleId: string): Promise<Sale> {
  const sale = await getDocument<Sale>(SALES, saleId);
  if (!sale) {
    throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Sale ${saleId} not found.`);
  }
  return sale;
}

async function loadScheduleForAllocation(saleId: string, scheduleId: string): Promise<SaleSchedule> {
  const sch = await getDocument<SaleSchedule>(SCHEDULES, scheduleId);
  if (!sch) {
    throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Target schedule no longer exists.');
  }
  if (sch.saleId !== saleId) {
    throw new BusinessRuleError(
      'RECORD_LOCKED',
      'Target schedule belongs to a different sale.'
    );
  }
  if (sch.status === 'WAIVED' || sch.status === 'CANCELLED') {
    throw new BusinessRuleError(
      'RECORD_LOCKED',
      'Cannot apply a receipt to a waived or cancelled schedule.'
    );
  }
  return sch;
}

/** Build the schedule-side update for a bump-by-amount allocation. */
function scheduleBumpUpdate(prior: SaleSchedule, delta: number, nowIso: string): Record<string, unknown> {
  const nextPaid = Math.max(0, +(Number(prior.paidAmount || 0) + delta).toFixed(2));
  const nextBalance = Math.max(0, +(Number(prior.amount || 0) - nextPaid).toFixed(2));
  const payload: Record<string, unknown> = {
    paidAmount: nextPaid,
    balanceAmount: nextBalance,
    updatedAt: nowIso,
  };
  // Auto-derive status only for the three auto-managed values. WAIVED
  // and CANCELLED are sticky and not reachable here anyway (rejected
  // at allocation time).
  if (prior.status !== 'WAIVED' && prior.status !== 'CANCELLED') {
    payload.status = deriveAutoStatus(prior.amount, nextPaid);
  }
  return payload;
}

export const saleReceiptService = {
  /** Live list of receipts for a given sale, ordered by receivedAt desc. */
  subscribeBySale: (saleId: string, callback: (receipts: SaleReceipt[]) => void) => {
    const q = query(collection(db, COLLECTION), fsWhere('saleId', '==', saleId));
    return onSnapshot(q, (snap) => {
      const receipts = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SaleReceipt, 'id'>) }));
      receipts.sort((a, b) => (b.receivedAt || '').localeCompare(a.receivedAt || ''));
      callback(receipts);
    });
  },

  create: async (input: ReceiptCreateInput): Promise<string> => {
    if (!input.amount || input.amount <= 0) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Receipt amount must be positive.');
    }
    const sale = await loadSaleOrThrow(input.saleId);
    if (sale.saleStatus === 'CANCELLED') {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'Cannot record a receipt against a cancelled sale.'
      );
    }

    const now = new Date().toISOString();
    const receiptId = generateDocId(COLLECTION);
    const amount = +input.amount.toFixed(2);
    const newTotal = +(Number(sale.totalReceived || 0) + amount).toFixed(2);

    // Normalize allocations: allocations[] is authoritative, then fall
    // back to linkedScheduleId as a single-item allocation for the full
    // receipt amount. Caller may also pass neither, meaning "unallocated".
    const rawAllocations: ReceiptAllocation[] =
      input.allocations && input.allocations.length > 0
        ? input.allocations.map(a => ({ scheduleId: a.scheduleId, amount: +a.amount.toFixed(2) }))
        : input.linkedScheduleId
          ? [{ scheduleId: input.linkedScheduleId, amount }]
          : [];

    // Validate the full allocation list BEFORE starting the batch so a
    // bad target fails cleanly without partially-applied state. Also
    // dedupes duplicate scheduleIds (caller shouldn't send them, but
    // defend against it by merging).
    const merged = new Map<string, number>();
    for (const a of rawAllocations) {
      if (a.amount <= 0) continue;
      merged.set(a.scheduleId, +((merged.get(a.scheduleId) || 0) + a.amount).toFixed(2));
    }
    const allocations: ReceiptAllocation[] = Array.from(merged, ([scheduleId, amt]) => ({ scheduleId, amount: amt }));
    const allocSum = allocations.reduce((s, a) => s + a.amount, 0);
    if (allocSum > amount + 0.01) {
      throw new BusinessRuleError(
        'PAYMENT_INVALID_AMOUNT',
        `Allocation total (${allocSum}) exceeds receipt amount (${amount}).`
      );
    }

    // Load every referenced schedule once; caches the instances for the
    // atomic batch's schedule-bump writes.
    const scheduleCache = new Map<string, SaleSchedule>();
    for (const a of allocations) {
      const sch = await loadScheduleForAllocation(input.saleId, a.scheduleId);
      scheduleCache.set(a.scheduleId, sch);
    }

    // Determine the mode to persist. Caller-declared wins; otherwise
    // infer from input shape: no target → UNALLOCATED, single target
    // (either legacy link or 1-item array) → SPECIFIC, many → AUTO.
    const inferredMode: AllocationMode =
      allocations.length === 0
        ? 'UNALLOCATED'
        : allocations.length === 1
          ? 'SPECIFIC'
          : 'AUTO';
    const allocationMode: AllocationMode = input.allocationMode ?? inferredMode;
    const allocSummary = summarizeAllocation(amount, allocations, allocationMode);

    const receiptDoc: Record<string, unknown> = {
      saleId: input.saleId,
      amount,
      receivedAt: input.receivedAt,
      mode: input.mode,
      // Phase 2B alignment: denormalized allocation summary persisted
      // at create time so downstream readers don't have to recompute.
      // Legacy receipts without these fields are still handled via
      // `getReceiptAllocatedAmount` / `getReceiptUnappliedAmount`.
      allocationMode: allocSummary.allocationMode,
      allocatedAmount: allocSummary.allocatedAmount,
      unappliedAmount: allocSummary.unappliedAmount,
      createdAt: now,
      createdBy: auth.currentUser?.uid || '',
    };
    if (input.reference?.trim()) receiptDoc.reference = input.reference.trim();
    if (input.remarks?.trim()) receiptDoc.remarks = input.remarks.trim();
    // Persist allocations on the receipt. Only write the array when
    // non-empty so unallocated receipts stay clean.
    if (allocations.length > 0) {
      receiptDoc.allocations = allocations;
    }

    const batch: BatchOperation[] = [
      { type: 'set', collection: COLLECTION, id: receiptId, data: receiptDoc },
      { type: 'update', collection: SALES, id: input.saleId, data: { totalReceived: newTotal, updatedAt: now } },
    ];
    for (const a of allocations) {
      const sch = scheduleCache.get(a.scheduleId)!;
      batch.push({
        type: 'update',
        collection: SCHEDULES,
        id: sch.id,
        data: scheduleBumpUpdate(sch, a.amount, now),
      });
    }

    await executeBatch(batch);

    const summary = allocations.length === 0
      ? 'unallocated'
      : allocations.length === 1
        ? `linked to schedule ${allocations[0].scheduleId.slice(0, 8)}`
        : `auto-distributed across ${allocations.length} schedules`;
    await logAction(
      'RECEIPT_CREATE',
      'SaleReceipt',
      receiptId,
      `Receipt ₹${amount} (${input.mode}) against sale ${input.saleId.slice(0, 8)} · ${summary}`
    );
    return receiptId;
  },

  delete: async (receiptId: string): Promise<void> => {
    const receipt = await getDocument<SaleReceipt>(COLLECTION, receiptId);
    if (!receipt) return;
    const sale = await loadSaleOrThrow(receipt.saleId);
    const now = new Date().toISOString();
    const newTotal = Math.max(0, +(Number(sale.totalReceived || 0) - receipt.amount).toFixed(2));

    const batch: BatchOperation[] = [
      { type: 'delete', collection: COLLECTION, id: receiptId },
      { type: 'update', collection: SALES, id: receipt.saleId, data: { totalReceived: newTotal, updatedAt: now } },
    ];

    // Reverse every allocation (multi or legacy single). `resolveReceiptAllocations`
    // normalizes Phase 2A linkedScheduleId receipts into an equivalent
    // single-item allocation list so both shapes reverse the same way.
    const toReverse = resolveReceiptAllocations(receipt);
    for (const a of toReverse) {
      const sch = await getDocument<SaleSchedule>(SCHEDULES, a.scheduleId);
      if (sch) {
        batch.push({
          type: 'update',
          collection: SCHEDULES,
          id: sch.id,
          // scheduleBumpUpdate floors paidAmount at 0.
          data: scheduleBumpUpdate(sch, -a.amount, now),
        });
      }
    }

    await executeBatch(batch);

    const summary = toReverse.length === 0
      ? 'unallocated'
      : toReverse.length === 1
        ? `unlinked from schedule ${toReverse[0].scheduleId.slice(0, 8)}`
        : `reversed ${toReverse.length} allocations`;
    await logAction(
      'RECEIPT_DELETE',
      'SaleReceipt',
      receiptId,
      `Deleted receipt ₹${receipt.amount} from sale ${receipt.saleId.slice(0, 8)} · ${summary}`
    );
  }
};
