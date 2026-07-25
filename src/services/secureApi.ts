/**
 * Client-side helper for calling server-authoritative API routes.
 *
 * When the Express server is running (local dev via `npm run dev`),
 * these call the server for full transaction-safe validation.
 *
 * When deployed to Firebase Hosting (no Express server), the server
 * routes return 404. In that case, we fall back to direct Firestore
 * writes with client-side validation.
 */

import { auth } from '../lib/firebase';
import { BusinessRuleError, BusinessRuleCode, Bill, Payment, VariationOrder, WorkOrder } from '../types';
import { getDocument, updateDocument, queryDocuments, executeBatch, logAction, where } from './db';
import { computeVariationOrderFinancials } from '../lib/financialCalculationService';

// ===============================================================
// Fallback status tracking
// ===============================================================

type SecureMode = 'unknown' | 'server' | 'client-fallback';

let _mode: SecureMode = 'unknown';
let _listeners: Array<(mode: SecureMode) => void> = [];

function setMode(mode: SecureMode) {
  if (_mode === mode) return;
  _mode = mode;
  if (mode === 'client-fallback') {
    console.warn('[secureApi] Server secure routes unavailable — using client-side fallback.');
  } else if (mode === 'server') {
    console.info('[secureApi] Server secure routes connected.');
  }
  _listeners.forEach(fn => fn(mode));
}

/** Current mode: 'unknown', 'server', or 'client-fallback' */
export function getSecureMode(): SecureMode { return _mode; }

/** Subscribe to mode changes. Returns unsubscribe function. */
export function onSecureModeChange(listener: (mode: SecureMode) => void): () => void {
  _listeners.push(listener);
  return () => { _listeners = _listeners.filter(fn => fn !== listener); };
}

// ===============================================================

interface SecureApiResponse {
  success: boolean;
  message: string;
  code?: string;
}

// ===============================================================
// Client fallback feature flag (Platform Stabilization v1.1, Step 3).
//
// The client-side fallback is a DEV-only safety net. In production the deployed
// backend is authoritative and the fallback is FORBIDDEN — a failed/unreachable
// server surfaces a typed error rather than a weaker direct Firestore write.
//
// Controlled by an EXPLICIT flag (never import.meta.env.DEV alone):
//   - Local dev: allowed.
//   - Production: allowed ONLY if VITE_ALLOW_CLIENT_FALLBACK === 'true'.
// Emergency rollback = set VITE_ALLOW_CLIENT_FALLBACK=true, rebuild, redeploy
// (one configuration change).
// ===============================================================
const CLIENT_FALLBACK_ENABLED =
  import.meta.env.VITE_ALLOW_CLIENT_FALLBACK === 'true' || import.meta.env.DEV === true;

/**
 * Called when the secure server is unreachable. Returns null to permit the
 * client fallback when it is enabled; otherwise throws a typed error so no
 * weaker client-side financial write occurs in production.
 */
function handleServerUnavailable(): null {
  if (CLIENT_FALLBACK_ENABLED) {
    setMode('client-fallback');
    return null;
  }
  throw new BusinessRuleError(
    'RECORD_LOCKED',
    'The secure service is temporarily unavailable. Please retry in a moment.'
  );
}

/**
 * Try calling the server. Returns null if the server is unreachable AND the
 * client fallback is enabled; throws in production where the fallback is forbidden.
 */
async function tryServerCall(path: string): Promise<SecureApiResponse | null> {
  const user = auth.currentUser;
  if (!user) {
    throw new BusinessRuleError('RECORD_LOCKED', 'You must be logged in to perform this action.');
  }

  try {
    const idToken = await user.getIdToken();
    const response = await fetch(`/api/secure${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
    });

    // If we got HTML back (SPA rewrite), the server route doesn't exist
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return handleServerUnavailable();
    }

    const data: SecureApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new BusinessRuleError(
        (data.code as BusinessRuleCode) || 'RECORD_LOCKED',
        data.message || 'Server operation failed.'
      );
    }

    setMode('server');
    return data;
  } catch (error) {
    if (error instanceof BusinessRuleError) throw error;
    return handleServerUnavailable();
  }
}

// ===============================================================
// Client-side fallback implementations
// ===============================================================

async function clientVerifyBill(billId: string): Promise<void> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new BusinessRuleError('RECORD_LOCKED', 'Not logged in.');

  const bill = await getDocument<Bill>('bills', billId);
  if (!bill) throw new BusinessRuleError('BILL_NOT_FOUND', `Bill ${billId} does not exist.`);
  if (bill.status !== 'DRAFT') {
    throw new BusinessRuleError('RECORD_LOCKED', `Bill ${bill.billNumber} must be DRAFT to verify (current: ${bill.status}).`);
  }

  await updateDocument('bills', billId, {
    status: 'VERIFIED',
    verifiedBy: userId,
    verifiedAt: new Date().toISOString()
  });
  await logAction('VERIFY', 'Bill', billId, `Verified bill: ${bill.billNumber}`);
}

async function clientApproveBill(billId: string): Promise<void> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new BusinessRuleError('RECORD_LOCKED', 'Not logged in.');

  const bill = await getDocument<Bill>('bills', billId);
  if (!bill) throw new BusinessRuleError('BILL_NOT_FOUND', `Bill ${billId} does not exist.`);
  if (bill.status !== 'VERIFIED') {
    throw new BusinessRuleError('RECORD_LOCKED', `Bill ${bill.billNumber} must be VERIFIED to approve (current: ${bill.status}).`);
  }

  await updateDocument('bills', billId, {
    status: 'APPROVED',
    approvedBy: userId,
    approvedAt: new Date().toISOString()
  });
  await logAction('APPROVE', 'Bill', billId, `Approved bill: ${bill.billNumber}`);
}

async function clientReleasePayment(paymentId: string): Promise<void> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new BusinessRuleError('RECORD_LOCKED', 'Not logged in.');

  const payment = await getDocument<Payment>('payments', paymentId);
  if (!payment) throw new BusinessRuleError('BILL_NOT_FOUND', `Payment ${paymentId} does not exist.`);
  if (payment.status !== 'APPROVED') {
    throw new BusinessRuleError('RECORD_LOCKED', `Payment must be APPROVED to release (current: ${payment.status}).`);
  }

  const bill = await getDocument<Bill>('bills', payment.billId);
  if (!bill) throw new BusinessRuleError('BILL_NOT_FOUND', `Bill ${payment.billId} does not exist.`);

  // Calculate total already released
  const allPayments = await queryDocuments<Payment>('payments', [
    where('billId', '==', payment.billId)
  ]);
  const alreadyReleased = allPayments
    .filter(p => p.id !== paymentId && p.status === 'RELEASED')
    .reduce((sum, p) => sum + p.amount, 0);

  if (alreadyReleased + payment.amount > bill.netPayable + 0.01) {
    throw new BusinessRuleError('PAYMENT_EXCEEDS_PAYABLE',
      `Releasing ${payment.amount} would exceed remaining payable.`);
  }

  const totalAfter = alreadyReleased + payment.amount;
  const isFullyPaid = totalAfter >= bill.netPayable - 0.01;

  await executeBatch([
    { type: 'update', collection: 'payments', id: paymentId, data: { status: 'RELEASED' } },
    { type: 'update', collection: 'bills', id: payment.billId, data: {
      status: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
      paidBy: userId,
      paidAt: new Date().toISOString()
    }}
  ]);
  await logAction('RELEASE', 'Payment', paymentId, `Released payment for bill: ${bill.billNumber}`);
}

async function clientApproveVariationOrder(voId: string): Promise<void> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new BusinessRuleError('RECORD_LOCKED', 'Not logged in.');

  const vo = await getDocument<VariationOrder>('variationOrders', voId);
  if (!vo) throw new BusinessRuleError('VARIATION_ORDER_NOT_FOUND', `VO ${voId} does not exist.`);
  if (vo.status !== 'DRAFT') {
    throw new BusinessRuleError('VARIATION_ORDER_INVALID_STATUS', `VO must be DRAFT to approve.`);
  }

  const wo = await getDocument<WorkOrder>('workOrders', vo.workOrderId);
  if (!wo) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Work order not found.`);

  const financials = wo.financials || {} as WorkOrder['financials'];
  const { totalAmount: newTotalAmount, gstAmount, subtotal, retentionAmount, grandTotal } =
    computeVariationOrderFinancials({
      totalAmount: financials.totalAmount,
      gstPercentage: financials.gstPercentage,
      otherCharges: financials.otherCharges,
      retentionPercentage: financials.retentionPercentage,
      voAmount: vo.amount,
    });
  const now = new Date().toISOString();

  await executeBatch([
    { type: 'update', collection: 'variationOrders', id: voId, data: {
      status: 'APPROVED', approvedBy: userId, approvedAt: now
    }},
    { type: 'update', collection: 'workOrders', id: wo.id, data: {
      amount: newTotalAmount,
      financials: { ...financials, totalAmount: newTotalAmount, gstAmount, subtotal, retentionAmount, grandTotal },
      billing: { ...wo.billing, totalValue: grandTotal }
    }}
  ]);
  await logAction('APPROVE', 'VariationOrder', voId, `Approved VO: ${vo.voNumber}`);
}

// ===============================================================
// Exported operations: try server first, fall back to client
// ===============================================================

export async function secureVerifyBill(billId: string): Promise<void> {
  const result = await tryServerCall(`/bills/${billId}/verify`);
  if (result) return; // Server handled it
  await clientVerifyBill(billId);
}

export async function secureApproveBill(billId: string): Promise<void> {
  const result = await tryServerCall(`/bills/${billId}/approve`);
  if (result) return;
  await clientApproveBill(billId);
}

export async function secureReleasePayment(paymentId: string): Promise<void> {
  const result = await tryServerCall(`/payments/${paymentId}/release`);
  if (result) return;
  await clientReleasePayment(paymentId);
}

export async function secureApproveVariationOrder(voId: string): Promise<void> {
  const result = await tryServerCall(`/variation-orders/${voId}/approve`);
  if (result) return;
  await clientApproveVariationOrder(voId);
}
