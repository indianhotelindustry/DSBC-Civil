/**
 * Pure helpers for the Phase 1 Payment Request workflow.
 *
 * Contract in one line:
 *   Advance on a Work Order is PLANNED, not paid. A PaymentRequest
 *   in status PAID is the only thing that indicates real money
 *   movement for that advance.
 *
 * Helpers here are read-only derivations over lists of requests —
 * none of them write to Firestore. Service-layer validation
 * (paymentRequestService) reuses the same helpers so the UI and
 * the service agree on what counts as "active" or "allowed".
 */

import { PaymentRequest, WorkOrder, Bill, Payment } from '../types';
import { woGrossValue } from './financialCalcs';

/**
 * Requests that block a new ADVANCE (duplicate-guard rule — Phase 1.2).
 *
 * Active = PENDING_APPROVAL or APPROVED. A PAID advance does NOT block
 * a follow-up advance (second advance is allowed by business policy);
 * a REJECTED advance also does not block (the admin may try again).
 * This is a deliberate policy change from the original Phase 1 rule
 * which also blocked on PAID.
 */
export function isActiveAdvance(r: PaymentRequest): boolean {
  return r.type === 'ADVANCE' && (r.status === 'PENDING_APPROVAL' || r.status === 'APPROVED');
}

/** Requests that consume the WO value ceiling (everything except REJECTED). */
export function countsAgainstCeiling(r: PaymentRequest): boolean {
  return r.status !== 'REJECTED';
}

/** The WO's planned advance amount (what CAN be requested as ADVANCE). */
export function getWOPlannedAdvance(wo: WorkOrder): number {
  return Number(wo.financials?.advance) || 0;
}

/**
 * How much advance has actually moved — sum of PAID ADVANCE requests
 * for this WO. Zero until Accounts marks an approved advance as paid.
 */
export function getWOPaidAdvance(requests: PaymentRequest[], workOrderId: string): number {
  return requests
    .filter(r => r.workOrderId === workOrderId && r.type === 'ADVANCE' && r.status === 'PAID')
    .reduce((sum, r) => sum + (r.requestedAmount || 0), 0);
}

/**
 * Sum of requested amounts that currently occupy the WO's request
 * "budget". Excludes REJECTED since those free their ceiling back up.
 */
export function getWORequestedAmount(requests: PaymentRequest[], workOrderId: string): number {
  return requests
    .filter(r => r.workOrderId === workOrderId && countsAgainstCeiling(r))
    .reduce((sum, r) => sum + (r.requestedAmount || 0), 0);
}

/**
 * What's still available to request against this WO.
 *
 * Phase 1 assumption (reported back to the user):
 *   total non-REJECTED requested amount ≤ woGrossValue(wo)
 *
 * The ceiling is checked only against other Payment Requests — NOT
 * against the legacy Bills/Payments module, because the two flows
 * are intentionally independent for Phase 1. This is conservative
 * on the payment-request side; if the WO is also being billed, the
 * admin has to watch both channels.
 */
export function getWOAvailableRequestBalance(
  wo: WorkOrder,
  requests: PaymentRequest[]
): number {
  const ceiling = woGrossValue(wo);
  const used = getWORequestedAmount(requests, wo.id);
  return round2(Math.max(0, ceiling - used));
}

/**
 * Find an ADVANCE request that blocks a new one. Duplicate rule:
 * one active ADVANCE per WO (active = PENDING_APPROVAL, APPROVED,
 * or PAID). Returns null when a fresh ADVANCE request is allowed
 * (either none exists yet, or every previous ADVANCE was REJECTED).
 */
export function findBlockingAdvance(
  requests: PaymentRequest[],
  workOrderId: string
): PaymentRequest | null {
  return requests.find(r => r.workOrderId === workOrderId && isActiveAdvance(r)) || null;
}

/** Display-friendly label for the current ADVANCE state on a WO. */
export function advanceStatusLabel(
  requests: PaymentRequest[],
  workOrderId: string
):
  | 'NOT_REQUESTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PAID'
  | 'REJECTED' {
  const mine = requests.filter(r => r.workOrderId === workOrderId && r.type === 'ADVANCE');
  if (mine.length === 0) return 'NOT_REQUESTED';
  // Prefer the "strongest" (most-progressed) state. Order:
  // PAID > APPROVED > PENDING_APPROVAL > REJECTED.
  if (mine.some(r => r.status === 'PAID')) return 'PAID';
  if (mine.some(r => r.status === 'APPROVED')) return 'APPROVED';
  if (mine.some(r => r.status === 'PENDING_APPROVAL')) return 'PENDING_APPROVAL';
  return 'REJECTED';
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ───────────────────────────────────────────────────────────────────
// Phase 1.2 — cross-module overpayment guard
// ───────────────────────────────────────────────────────────────────

/**
 * Total actual money already spent against a Work Order, summed
 * across BOTH the new Payment Requests module AND the legacy
 * Bills/Payments module:
 *
 *   + Σ PAID payment requests for this WO
 *   + Σ RELEASED payments on bills attached to this WO
 *   + Σ RELEASED payments whose billId is the WO id (legacy
 *     advance convention stored directly against the WO)
 *
 * This is the "real money out" figure used to enforce a ceiling
 * where both modules could otherwise over-commit the WO.
 */
export function getTotalFinancialOutflow(
  workOrderId: string,
  paymentRequests: PaymentRequest[],
  bills: Bill[],
  payments: Payment[]
): number {
  const paidFromRequests = paymentRequests
    .filter(r => r.workOrderId === workOrderId && r.status === 'PAID')
    .reduce((s, r) => s + Math.max(0, r.requestedAmount || 0), 0);

  const woBillIds = new Set(bills.filter(b => b.workOrderId === workOrderId).map(b => b.id));
  const billOutflow = payments
    .filter(p => p.status === 'RELEASED' && (woBillIds.has(p.billId) || p.billId === workOrderId))
    .reduce((s, p) => s + Math.max(0, p.amount || 0), 0);

  return round2(paidFromRequests + billOutflow);
}

// ───────────────────────────────────────────────────────────────────
// Phase 1.2 — computed payment summary for WO detail / dialog panels
// ───────────────────────────────────────────────────────────────────

export interface WOPaymentSummary {
  grossValue: number;
  advancePlanned: number;
  advanceRequested: number;
  advancePaid: number;
  totalRequested: number;
  totalPaid: number;
  /** grossValue − totalPaid. May be negative in pathological cases;
   *  callers should display max(0, …) if they need a display value. */
  remainingPayable: number;
}

/**
 * Pure, read-only summary of a Work Order's payment-request posture.
 * Focuses on the new Payment Requests module — the legacy
 * Bills/Payments module is NOT rolled in here (that's what
 * getTotalFinancialOutflow is for).
 */
export function getWOPaymentSummary(
  wo: WorkOrder,
  paymentRequests: PaymentRequest[]
): WOPaymentSummary {
  const mine = paymentRequests.filter(r => r.workOrderId === wo.id);

  const advanceRequested = mine
    .filter(r => r.type === 'ADVANCE' && r.status !== 'REJECTED')
    .reduce((s, r) => s + (r.requestedAmount || 0), 0);

  const advancePaid = mine
    .filter(r => r.type === 'ADVANCE' && r.status === 'PAID')
    .reduce((s, r) => s + (r.requestedAmount || 0), 0);

  const totalRequested = mine
    .filter(r => r.status !== 'REJECTED')
    .reduce((s, r) => s + (r.requestedAmount || 0), 0);

  const totalPaid = mine
    .filter(r => r.status === 'PAID')
    .reduce((s, r) => s + (r.requestedAmount || 0), 0);

  const grossValue = woGrossValue(wo);

  return {
    grossValue,
    advancePlanned: getWOPlannedAdvance(wo),
    advanceRequested: round2(advanceRequested),
    advancePaid: round2(advancePaid),
    totalRequested: round2(totalRequested),
    totalPaid: round2(totalPaid),
    remainingPayable: round2(grossValue - totalPaid),
  };
}
