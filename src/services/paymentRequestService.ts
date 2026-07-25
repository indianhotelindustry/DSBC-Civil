import {
  PaymentRequest,
  PaymentRequestType,
  PaymentRequestMode,
  WorkOrder,
  Bill,
  Payment,
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
import {
  findBlockingAdvance,
  getTotalFinancialOutflow,
  getWOPlannedAdvance,
} from '../lib/paymentRequestCalcs';
import { woGrossValue } from '../lib/financialCalcs';

/**
 * Above this amount an ADVANCE request must carry an explicit reason.
 * PART and FINAL always require a reason regardless of amount.
 */
const REASON_REQUIRED_ADVANCE_THRESHOLD = 50_000;

const COLLECTION = 'paymentRequests';

/**
 * Payment Request service (Phase 1.2 hardening).
 *
 * Status flow — enforced in BOTH the service and the Firestore rules:
 *
 *   PENDING_APPROVAL ─approve─> APPROVED ─markPaid─> PAID (terminal)
 *           └────reject────> REJECTED
 *
 *   No direct PENDING_APPROVAL → PAID.
 *   No updates after PAID (except admin emergency override at the
 *   rules layer).
 *
 * Defense-in-depth: every transition helper re-fetches the doc
 * fresh and re-asserts the expected `from` status before calling
 * updateDocument. The update writes only the transition-specific
 * fields — no incoming payload is trusted blindly.
 *
 * Creation guards (service-layer, re-checked by the caller):
 *   - Work order exists and is not REJECTED.
 *   - ADVANCE: Active advance = PENDING_APPROVAL or APPROVED. A PAID
 *              advance does NOT block a follow-up advance; a
 *              REJECTED advance does not block either. Amount is
 *              fixed to wo.financials.advance (service ignores any
 *              caller-supplied amount for ADVANCE).
 *   - PART / FINAL: reason is required; amount > 0.
 *   - ADVANCE over ₹50,000: reason is required.
 *   - Cross-module ceiling: actual-outflow (PAID requests + released
 *              bill payments via the legacy module) + pending/
 *              approved requests not yet paid + new amount must stay
 *              ≤ woGrossValue. Throws LIMIT_EXCEEDED otherwise.
 */

export interface PaymentRequestCreateInput {
  workOrderId: string;
  type: PaymentRequestType;
  requestedAmount: number;        // Ignored for ADVANCE — pulled from WO.
  reason?: string;
  remarks?: string;
}

export interface PaymentRequestPayInput {
  paymentMode: PaymentRequestMode;
  paymentReference?: string;
  paymentRemarks?: string;
}

async function loadRequestOrThrow(id: string): Promise<PaymentRequest> {
  const pr = await getDocument<PaymentRequest>(COLLECTION, id);
  if (!pr) {
    throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Payment request not found.');
  }
  return pr;
}

async function loadWorkOrderOrThrow(id: string): Promise<WorkOrder> {
  const wo = await getDocument<WorkOrder>('workOrders', id);
  if (!wo) {
    throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Work order not found.');
  }
  if (wo.status === 'REJECTED') {
    throw new BusinessRuleError(
      'RECORD_LOCKED',
      'Cannot raise a payment request against a rejected work order.'
    );
  }
  return wo;
}

/** Returns every payment request for the WO — used by both the
 *  duplicate guard and the ceiling check. Caller filters further. */
async function siblingRequests(workOrderId: string): Promise<PaymentRequest[]> {
  return queryDocuments<PaymentRequest>(COLLECTION, [
    where('workOrderId', '==', workOrderId),
  ]);
}

/** Pulls bills + released payments needed by the cross-module ceiling.
 *  Bills filtered server-side; payments fetched once and filtered in
 *  memory (a single WO rarely has enough payments for this to matter,
 *  and the `in` operator caps at 10 bill ids on Firestore). */
async function billPaymentsForWO(workOrderId: string): Promise<{ bills: Bill[]; payments: Payment[] }> {
  const bills = await queryDocuments<Bill>('bills', [where('workOrderId', '==', workOrderId)]);
  const allPayments = await queryDocuments<Payment>('payments', []);
  const billIds = new Set(bills.map(b => b.id));
  // Keep: released payments whose bill is this WO's bill, or whose
  // billId equals the WO id directly (legacy advance convention).
  const payments = allPayments.filter(
    p => p.status === 'RELEASED' && (billIds.has(p.billId) || p.billId === workOrderId)
  );
  return { bills, payments };
}

function requireReason(reason: string | undefined, context: string): string {
  const trimmed = (reason || '').trim().replace(/\s+/g, ' ');
  if (!trimmed) {
    throw new BusinessRuleError(
      'REASON_REQUIRED',
      `Reason is required for ${context}.`
    );
  }
  return trimmed;
}

export const paymentRequestService = {
  /** Live subscription over the full collection. Page filters by scope. */
  getAll: (callback: (requests: PaymentRequest[]) => void) => {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<PaymentRequest, 'id'>) }));
      rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(rows);
    });
  },

  /** Live subscription scoped to one WO — used on the WO row badge. */
  subscribeByWorkOrder: (
    workOrderId: string,
    callback: (requests: PaymentRequest[]) => void
  ) => {
    const q = query(collection(db, COLLECTION), fsWhere('workOrderId', '==', workOrderId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<PaymentRequest, 'id'>) })));
    });
  },

  create: async (input: PaymentRequestCreateInput): Promise<string> => {
    if (!input.workOrderId) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Work order is required.');
    }
    const wo = await loadWorkOrderOrThrow(input.workOrderId);
    const existing = await siblingRequests(wo.id);

    // Determine the amount by type. ADVANCE is fixed to the WO's
    // planned advance so callers cannot smuggle a different number
    // through this path even if the UI form were tampered with.
    let amount: number;
    if (input.type === 'ADVANCE') {
      amount = getWOPlannedAdvance(wo);
      if (amount <= 0) {
        throw new BusinessRuleError(
          'PAYMENT_INVALID_AMOUNT',
          'This work order has no planned advance — nothing to request.'
        );
      }
      const blocking = findBlockingAdvance(existing, wo.id);
      if (blocking) {
        throw new BusinessRuleError(
          'RECORD_LOCKED',
          `An advance request already exists for this work order (status ${blocking.status}). ` +
          'Reject the existing one first if a new advance is needed.'
        );
      }
    } else {
      amount = +Number(input.requestedAmount || 0).toFixed(2);
      if (amount <= 0) {
        throw new BusinessRuleError(
          'PAYMENT_INVALID_AMOUNT',
          'Requested amount must be greater than zero.'
        );
      }
    }

    // Reason discipline:
    //   - PART / FINAL require a reason regardless of amount.
    //   - ADVANCE requires a reason above the high-value threshold.
    // Trimmed + whitespace-collapsed before storing.
    let reasonToStore: string | undefined;
    if (input.type === 'PART' || input.type === 'FINAL') {
      reasonToStore = requireReason(input.reason, `${input.type} requests`);
    } else if (amount > REASON_REQUIRED_ADVANCE_THRESHOLD) {
      reasonToStore = requireReason(
        input.reason,
        `advance requests above ₹${REASON_REQUIRED_ADVANCE_THRESHOLD.toLocaleString('en-IN')}`
      );
    } else if (input.reason?.trim()) {
      reasonToStore = input.reason.trim().replace(/\s+/g, ' ');
    }

    // Cross-module ceiling. Actual money already out (bills/payments
    // + PAID requests) plus everything still committed (PENDING /
    // APPROVED requests) plus the NEW amount must stay ≤ gross WO
    // value. Throws LIMIT_EXCEEDED otherwise.
    const { bills, payments } = await billPaymentsForWO(wo.id);
    const alreadyOut = getTotalFinancialOutflow(wo.id, existing, bills, payments);
    const committedNotYetPaid = existing
      .filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'APPROVED')
      .reduce((s, r) => s + (r.requestedAmount || 0), 0);
    const ceiling = woGrossValue(wo);
    const projected = alreadyOut + committedNotYetPaid + amount;
    if (projected > ceiling + 0.01) {
      throw new BusinessRuleError(
        'LIMIT_EXCEEDED',
        `Total payout (₹${projected.toFixed(0)}) would exceed the Work Order value (₹${ceiling.toFixed(0)}). ` +
        `Already out: ₹${alreadyOut.toFixed(0)} · committed: ₹${committedNotYetPaid.toFixed(0)} · new: ₹${amount.toFixed(0)}.`
      );
    }

    const now = new Date().toISOString();
    const uid = auth.currentUser?.uid || '';
    const doc: Record<string, unknown> = {
      companyId: wo.companyId || '',
      projectId: wo.projectId,
      workOrderId: wo.id,
      contractorId: wo.contractorId,
      type: input.type,
      requestedAmount: amount,
      requestedBy: uid,
      requestedAt: now,
      status: 'PENDING_APPROVAL',
      createdAt: now,
      createdBy: uid,
      updatedAt: now,
    };
    if (reasonToStore) doc.reason = reasonToStore;
    if (input.remarks?.trim()) doc.remarks = input.remarks.trim();

    const id = await createDocument(COLLECTION, doc);
    await logAction(
      'PAYMENT_REQUEST_CREATED',
      'PaymentRequest',
      id,
      `Created ${input.type} request for WO ${wo.woNumber || wo.id.slice(0, 8)} · ₹${amount}`
    );
    return id;
  },

  approve: async (id: string): Promise<void> => {
    const pr = await loadRequestOrThrow(id);
    if (pr.status !== 'PENDING_APPROVAL') {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        `Only PENDING_APPROVAL requests can be approved (current: ${pr.status}).`
      );
    }
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, id, {
      status: 'APPROVED',
      approvedBy: auth.currentUser?.uid || '',
      approvedAt: now,
      updatedAt: now,
    });
    await logAction(
      'PAYMENT_REQUEST_APPROVED',
      'PaymentRequest',
      id,
      `Approved ${pr.type} request · ₹${pr.requestedAmount} · WO ${pr.workOrderId.slice(0, 8)}`
    );
  },

  reject: async (id: string, reason: string): Promise<void> => {
    const trimmed = (reason || '').trim();
    if (!trimmed) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Rejection reason is required.');
    }
    const pr = await loadRequestOrThrow(id);
    if (pr.status !== 'PENDING_APPROVAL') {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        `Only PENDING_APPROVAL requests can be rejected (current: ${pr.status}).`
      );
    }
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, id, {
      status: 'REJECTED',
      rejectionReason: trimmed,
      updatedAt: now,
    });
    await logAction(
      'PAYMENT_REQUEST_REJECTED',
      'PaymentRequest',
      id,
      `Rejected ${pr.type} request · ₹${pr.requestedAmount} · reason: ${trimmed}`
    );
  },

  markPaid: async (id: string, input: PaymentRequestPayInput): Promise<void> => {
    const pr = await loadRequestOrThrow(id);
    if (pr.status !== 'APPROVED') {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        `Only APPROVED requests can be marked paid (current: ${pr.status}).`
      );
    }
    if (!input.paymentMode) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Payment mode is required.');
    }
    const now = new Date().toISOString();
    const data: Record<string, unknown> = {
      status: 'PAID',
      paidBy: auth.currentUser?.uid || '',
      paidAt: now,
      paymentMode: input.paymentMode,
      updatedAt: now,
    };
    if (input.paymentReference?.trim()) data.paymentReference = input.paymentReference.trim();
    if (input.paymentRemarks?.trim()) data.paymentRemarks = input.paymentRemarks.trim();
    await updateDocument(COLLECTION, id, data);
    await logAction(
      'PAYMENT_REQUEST_PAID',
      'PaymentRequest',
      id,
      `Paid ${pr.type} request · ₹${pr.requestedAmount} · ${input.paymentMode}`
    );
  },

  /** Admin-only hard delete. Not exposed via default UI. */
  delete: async (id: string): Promise<void> => {
    const pr = await getDocument<PaymentRequest>(COLLECTION, id);
    await deleteDocument(COLLECTION, id);
    await logAction(
      'PAYMENT_REQUEST_DELETED',
      'PaymentRequest',
      id,
      pr ? `Deleted ${pr.type} request · ₹${pr.requestedAmount}` : `Deleted request ${id}`
    );
  },
};
