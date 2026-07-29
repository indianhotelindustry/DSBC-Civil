/**
 * Server-authoritative financial operations.
 *
 * Each route:
 * - Verifies the caller via authMiddleware (token + role)
 * - Performs all business validations server-side
 * - Uses Firestore transactions for atomicity
 * - Logs both success and failure to the audit trail
 * - Returns standardized ApiResponse
 */

import { Router, Response } from "express";
import rateLimit from "express-rate-limit";
import { db } from "./firebaseAdmin.ts";
import { AuthenticatedRequest, requireAuth, requireRole } from "./authMiddleware.ts";
import { writeAuditLog } from "./auditLog.ts";
import { sendSuccess, sendError, isBusinessError } from "./apiResponse.ts";
import { computeVariationOrderFinancials } from "../src/lib/financialCalculationService.ts";

/**
 * Rate limiter for secure financial routes.
 * 30 requests per minute per AUTHENTICATED USER — generous for normal use,
 * blocks automated abuse.
 *
 * DEPLOYMENT_READINESS_REPORT D-1 — why the key is the uid, not the IP:
 *
 * The default key is `req.ip`. Behind Firebase Hosting → Cloud Functions every
 * request reaches Express through the Google Front End, so `req.ip` resolves to
 * the proxy, not the caller. That would place EVERY user in a single 30/min
 * bucket and return 429 to the whole organisation on the 31st privileged
 * request — an outage of the money path. The defect is invisible in local dev,
 * where there is no proxy.
 *
 * Trusting the proxy chain is not a safe fix either: `trust proxy: true` lets a
 * client spoof `X-Forwarded-For` and is rejected by express-rate-limit
 * (ERR_ERL_PERMISSIVE_TRUST_PROXY), while a numeric hop count cannot be
 * verified without a deployed environment — so it could silently keep the bug.
 *
 * Every route on this router is authenticated (`router.use(requireAuth)`), so
 * `req.uid` is a verified Firebase ID-token subject: unspoofable, stable across
 * IP changes, and the thing we actually want to bound — privileged financial
 * operations per operator. This is correct regardless of the proxy topology.
 */
const secureLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req as AuthenticatedRequest).uid ?? 'unauthenticated',
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment.' },
});

// ===============================================================
// Helper: run handler with audit logging for both success and failure
// ===============================================================

type RouteHandler = (req: AuthenticatedRequest, res: Response) => Promise<void>;

function withAudit(action: string, entity: string, handler: RouteHandler): RouteHandler {
  return async (req: AuthenticatedRequest, res: Response) => {
    const entityId = req.params.id || 'unknown';
    const userId = req.uid || 'unknown';
    const userRole = req.userRole;

    try {
      await handler(req, res);
      // Success audit is written inside each handler after the transaction
    } catch (error) {
      // Log blocked/failed action
      const errCode = isBusinessError(error) ? error.code : 'INTERNAL_ERROR';
      const errMsg = isBusinessError(error) ? error.message : (error instanceof Error ? error.message : 'Unknown error');

      await writeAuditLog(userId, userRole, action, entity, entityId, 'BLOCKED', errMsg, errCode);
      sendError(res, error);
    }
  };
}

// ===============================================================
// POST /api/secure/bills/:id/verify
// ===============================================================

async function verifyBill(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.uid!;
  const userRole = req.userRole;

  await db.runTransaction(async (tx) => {
    const billRef = db.collection('bills').doc(id);
    const billSnap = await tx.get(billRef);
    if (!billSnap.exists) throw { code: 'BILL_NOT_FOUND', message: `Bill ${id} does not exist.` };

    const bill = billSnap.data()!;
    if (bill.status !== 'DRAFT') {
      throw { code: 'RECORD_LOCKED', message: `Bill ${bill.billNumber} must be DRAFT to verify (current: ${bill.status}).` };
    }

    const woRef = db.collection('workOrders').doc(bill.workOrderId);
    const woSnap = await tx.get(woRef);
    if (!woSnap.exists) throw { code: 'WORK_ORDER_NOT_FOUND', message: `Linked work order does not exist.` };
    const wo = woSnap.data()!;
    if (wo.status !== 'APPROVED' && wo.status !== 'COMPLETED') {
      throw { code: 'WORK_ORDER_NOT_APPROVED', message: `Work order ${wo.woNumber} is not approved (status: ${wo.status}).` };
    }

    tx.update(billRef, { status: 'VERIFIED', verifiedBy: userId, verifiedAt: new Date().toISOString() });
  });

  await writeAuditLog(userId, userRole, 'VERIFY', 'Bill', id, 'SUCCESS', `Verified bill ${id}`);
  sendSuccess(res, 'Bill verified successfully.');
}

// ===============================================================
// POST /api/secure/bills/:id/approve
// ===============================================================

async function approveBill(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.uid!;
  const userRole = req.userRole;

  await db.runTransaction(async (tx) => {
    const billRef = db.collection('bills').doc(id);
    const billSnap = await tx.get(billRef);
    if (!billSnap.exists) throw { code: 'BILL_NOT_FOUND', message: `Bill ${id} does not exist.` };

    const bill = billSnap.data()!;
    if (bill.status !== 'VERIFIED') {
      throw { code: 'RECORD_LOCKED', message: `Bill ${bill.billNumber} must be VERIFIED to approve (current: ${bill.status}).` };
    }

    const woRef = db.collection('workOrders').doc(bill.workOrderId);
    const woSnap = await tx.get(woRef);
    if (!woSnap.exists) throw { code: 'WORK_ORDER_NOT_FOUND', message: `Linked work order does not exist.` };
    const wo = woSnap.data()!;
    const woLimit = wo.financials?.grandTotal ?? wo.amount ?? 0;

    const allBillsSnap = await tx.get(db.collection('bills').where('workOrderId', '==', bill.workOrderId));
    const totalBilled = allBillsSnap.docs
      .filter(d => d.id !== id && d.data().status !== 'REJECTED')
      .reduce((sum, d) => sum + (d.data().workDoneAmount || 0), 0);

    if (totalBilled + (bill.workDoneAmount || 0) > woLimit) {
      throw { code: 'BILL_EXCEEDS_WO_BALANCE', message: `Cumulative billed (${totalBilled + bill.workDoneAmount}) exceeds work order value (${woLimit}).` };
    }

    tx.update(billRef, { status: 'APPROVED', approvedBy: userId, approvedAt: new Date().toISOString() });
  });

  await writeAuditLog(userId, userRole, 'APPROVE', 'Bill', id, 'SUCCESS', `Approved bill ${id}`);
  sendSuccess(res, 'Bill approved successfully.');
}

// ===============================================================
// POST /api/secure/payments/:id/release
// ===============================================================

async function releasePayment(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.uid!;
  const userRole = req.userRole;
  let billNumber = '';
  let isFullyPaid = false;

  await db.runTransaction(async (tx) => {
    const paymentRef = db.collection('payments').doc(id);
    const paymentSnap = await tx.get(paymentRef);
    if (!paymentSnap.exists) throw { code: 'BILL_NOT_FOUND', message: `Payment ${id} does not exist.` };

    const payment = paymentSnap.data()!;
    if (payment.status !== 'APPROVED') {
      throw { code: 'RECORD_LOCKED', message: `Payment must be APPROVED to release (current: ${payment.status}).` };
    }
    if (!payment.amount || payment.amount <= 0) {
      throw { code: 'PAYMENT_INVALID_AMOUNT', message: 'Payment amount must be greater than zero.' };
    }

    const billRef = db.collection('bills').doc(payment.billId);
    const billSnap = await tx.get(billRef);
    if (!billSnap.exists) throw { code: 'BILL_NOT_FOUND', message: `Bill ${payment.billId} does not exist.` };

    const bill = billSnap.data()!;
    billNumber = bill.billNumber || payment.billId;
    if (bill.status !== 'APPROVED' && bill.status !== 'PARTIALLY_PAID') {
      throw { code: 'BILL_NOT_APPROVED', message: `Bill ${billNumber} is not approved (status: ${bill.status}).` };
    }

    const allPaymentsSnap = await tx.get(db.collection('payments').where('billId', '==', payment.billId));
    const alreadyReleased = allPaymentsSnap.docs
      .filter(d => d.id !== id && d.data().status === 'RELEASED')
      .reduce((sum, d) => sum + (d.data().amount || 0), 0);

    if (alreadyReleased + payment.amount > bill.netPayable + 0.01) {
      throw { code: 'PAYMENT_EXCEEDS_PAYABLE', message: `Releasing ${payment.amount} would exceed remaining payable (${bill.netPayable - alreadyReleased}).` };
    }

    const totalAfter = alreadyReleased + payment.amount;
    isFullyPaid = totalAfter >= bill.netPayable - 0.01;
    const now = new Date().toISOString();

    tx.update(paymentRef, { status: 'RELEASED' });
    tx.update(billRef, { status: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID', paidBy: userId, paidAt: now });
  });

  const detail = `Released payment for bill ${billNumber} (${isFullyPaid ? 'fully paid' : 'partially paid'})`;
  await writeAuditLog(userId, userRole, 'RELEASE', 'Payment', id, 'SUCCESS', detail);
  sendSuccess(res, `Payment released. Bill ${isFullyPaid ? 'fully paid' : 'partially paid'}.`);
}

// ===============================================================
// POST /api/secure/variation-orders/:id/approve
// ===============================================================

async function approveVariationOrder(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.uid!;
  const userRole = req.userRole;
  let voNumber = '';
  let woNumber = '';

  await db.runTransaction(async (tx) => {
    const voRef = db.collection('variationOrders').doc(id);
    const voSnap = await tx.get(voRef);
    if (!voSnap.exists) throw { code: 'VARIATION_ORDER_NOT_FOUND', message: `Variation order ${id} does not exist.` };

    const vo = voSnap.data()!;
    voNumber = vo.voNumber || id;
    if (vo.status !== 'DRAFT') {
      throw { code: 'VARIATION_ORDER_INVALID_STATUS', message: `VO ${voNumber} must be DRAFT to approve (current: ${vo.status}).` };
    }
    if (!vo.amount || vo.amount <= 0) {
      throw { code: 'PAYMENT_INVALID_AMOUNT', message: 'Variation order amount must be positive.' };
    }

    const woRef = db.collection('workOrders').doc(vo.workOrderId);
    const woSnap = await tx.get(woRef);
    if (!woSnap.exists) throw { code: 'WORK_ORDER_NOT_FOUND', message: `Work order ${vo.workOrderId} does not exist.` };

    const wo = woSnap.data()!;
    woNumber = wo.woNumber || vo.workOrderId;
    const financials = wo.financials || {};
    const { totalAmount: newTotalAmount, gstAmount, subtotal, retentionAmount, grandTotal } =
      computeVariationOrderFinancials({
        totalAmount: financials.totalAmount || 0,
        gstPercentage: financials.gstPercentage || 0,
        otherCharges: financials.otherCharges || 0,
        retentionPercentage: financials.retentionPercentage || 0,
        voAmount: vo.amount,
      });
    const billing = wo.billing || {};
    const now = new Date().toISOString();

    tx.update(voRef, { status: 'APPROVED', approvedBy: userId, approvedAt: now });
    tx.update(woRef, {
      amount: newTotalAmount,
      financials: { ...financials, totalAmount: newTotalAmount, gstAmount, subtotal, retentionAmount, grandTotal },
      billing: { ...billing, totalValue: grandTotal }
    });
  });

  await writeAuditLog(userId, userRole, 'APPROVE', 'VariationOrder', id, 'SUCCESS', `Approved VO ${voNumber}. Updated WO ${woNumber}.`);
  sendSuccess(res, 'Variation order approved. Work order updated.');
}

// ===============================================================
// Router assembly
// ===============================================================

export function createSecureRoutes(): Router {
  const router = Router();

  // Authenticate BEFORE rate limiting so the limiter can key on the verified
  // uid (D-1). Every route below already required auth individually — hoisting
  // it changes no authorization outcome, it only makes `req.uid` available to
  // the limiter. Unauthenticated callers now get 401 rather than possibly 429.
  router.use(requireAuth);

  // Apply rate limiting to all secure routes (per authenticated user).
  router.use(secureLimiter);

  router.post('/bills/:id/verify',
    requireRole('PROJECT_MANAGER', 'ADMIN'),
    withAudit('VERIFY', 'Bill', verifyBill));

  router.post('/bills/:id/approve',
    requireRole('CEO', 'ADMIN'),
    withAudit('APPROVE', 'Bill', approveBill));

  router.post('/payments/:id/release',
    requireRole('ACCOUNTS', 'ADMIN'),
    withAudit('RELEASE', 'Payment', releasePayment));

  router.post('/variation-orders/:id/approve',
    requireRole('CEO', 'ADMIN'),
    withAudit('APPROVE', 'VariationOrder', approveVariationOrder));

  return router;
}
