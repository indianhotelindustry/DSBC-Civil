/**
 * FinancialCalculationService
 * ---------------------------
 * Single, centralized home for DSBC financial calculations.
 *
 * SCOPE OF THIS PASS (Platform Stabilization v1.1, Step 4):
 *   - Centralize EXISTING calculations verbatim. Behaviour is preserved exactly.
 *   - NO formula is changed. NO rounding is introduced (the current codebase does
 *     not round these values; adding rounding here would silently change behaviour).
 *   - Where two call-sites currently DISAGREE, both variants are reproduced faithfully
 *     and the conflict is flagged with `TODO: Finance Approval Required` — it is NOT
 *     silently unified.
 *
 * PURITY: this module imports no React and no Firebase. It takes plain inputs and
 * returns plain results, so it can be shared by the client UI and the server /
 * Cloud Functions (Architecture Constitution §4).
 *
 * Sources centralized here (as of v1.1):
 *   - Bill totals:  src/services/billService.ts (recalculateBillTotals) and the
 *                   identical copy in src/pages/Bills.tsx.
 *   - WO financials (form/canonical): src/components/WorkOrderForm.tsx.
 *   - VO financials (divergent):      server/secureRoutes.ts and
 *                                     src/services/secureApi.ts (client fallback).
 */

// ===============================================================
// Bill totals — identical in billService.ts and Bills.tsx today.
// Behaviour-preserving centralization (no change).
// ===============================================================

export interface BillTotalsInput {
  workDoneAmount: number;
  previousBillAmount: number;
  tdsPercentage: number;
  retentionPercentage: number;
  advanceAdjustment: number;
}

export interface BillTotalsResult {
  currentBillAmount: number;
  tdsAmount: number;
  retentionAmount: number;
  netPayable: number;
}

/**
 * Recalculate derived bill fields from source inputs.
 * Verbatim copy of billService.recalculateBillTotals — NO behaviour change.
 */
export function recalculateBillTotals(input: BillTotalsInput): BillTotalsResult {
  const currentBillAmount = input.workDoneAmount + input.previousBillAmount;
  const tdsAmount = (input.workDoneAmount * input.tdsPercentage) / 100;
  const retentionAmount = (input.workDoneAmount * input.retentionPercentage) / 100;
  const netPayable =
    input.workDoneAmount - tdsAmount - retentionAmount - input.advanceAdjustment;
  // TODO: Finance Approval Required — netPayable can currently go negative
  // (large advanceAdjustment / high percentages). Flooring at 0 would change
  // behaviour; left as-is pending finance sign-off.
  return { currentBillAmount, tdsAmount, retentionAmount, netPayable };
}

// ===============================================================
// Work Order financials — the FORM formula (authored, user-visible).
// Verbatim from WorkOrderForm.tsx. Treated as the canonical WO calculation.
// ===============================================================

export interface WorkOrderFinancialsInput {
  /** Sum source: individual BOQ item amounts. */
  items: { amount: number }[];
  advance: number;
  otherCharges: number;
  gstPercentage: number;
  retentionPercentage: number;
}

export interface WorkOrderFinancialsResult {
  totalAmount: number;
  subtotal: number;
  gstAmount: number;
  retentionAmount: number;
  grandTotal: number;
}

/**
 * Compute Work Order financials using the form's formula (verbatim).
 * NO behaviour change vs WorkOrderForm.tsx.
 */
export function computeWorkOrderFinancials(
  input: WorkOrderFinancialsInput
): WorkOrderFinancialsResult {
  const totalAmount = input.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const subtotal = totalAmount - (input.advance || 0);
  const gstAmount = (subtotal * (input.gstPercentage || 0)) / 100;
  const retentionAmount = (totalAmount * (input.retentionPercentage || 0)) / 100;
  const grandTotal = subtotal + gstAmount + (input.otherCharges || 0) - retentionAmount;
  return { totalAmount, subtotal, gstAmount, retentionAmount, grandTotal };
}

// ===============================================================
// Variation Order financials — DIVERGENT formula (server + client fallback).
//
// TODO: Finance Approval Required
//   The VO-approval formula below differs from computeWorkOrderFinancials (the
//   form/canonical formula): it does NOT subtract `advance` from the subtotal and
//   does NOT subtract `retentionAmount` from grandTotal, and it defines
//   subtotal = newTotalAmount + otherCharges. Consequently, after a VO is approved
//   the stored grandTotal is inflated relative to the form.
//   This function REPRODUCES the CURRENT behaviour verbatim (no silent change).
//   Unifying it with computeWorkOrderFinancials requires finance sign-off and is
//   deferred to the finance-approved pass (see PLATFORM_STABILIZATION_v1.1 T4).
// ===============================================================

export interface VariationOrderFinancialsInput {
  /** Existing WorkOrderFinancials on the WO being amended. */
  totalAmount: number;
  gstPercentage: number;
  otherCharges: number;
  retentionPercentage: number;
  /** The approved variation order amount to add. */
  voAmount: number;
}

/**
 * Compute post-VO Work Order financials — VERBATIM reproduction of the current
 * server/secureRoutes.ts and secureApi.ts behaviour. Behaviour-preserving.
 * See the TODO above: this diverges from computeWorkOrderFinancials by design of
 * the existing code, pending finance approval to unify.
 */
export function computeVariationOrderFinancials(
  input: VariationOrderFinancialsInput
): WorkOrderFinancialsResult {
  const newTotalAmount = (input.totalAmount || 0) + input.voAmount;
  const gstAmount = (newTotalAmount * (input.gstPercentage || 0)) / 100;
  const subtotal = newTotalAmount + (input.otherCharges || 0);
  const retentionAmount = (newTotalAmount * (input.retentionPercentage || 0)) / 100;
  const grandTotal = subtotal + gstAmount;
  return { totalAmount: newTotalAmount, subtotal, gstAmount, retentionAmount, grandTotal };
}

// ===============================================================
// Overbilling ceiling — CONFLICT, not centralized as a single value yet.
//
// TODO: Finance Approval Required
//   Three different ceilings exist in the current code and MUST NOT be unified
//   without finance sign-off (doing so changes which bills validate):
//     - billService.create           uses GROSS BOQ value (woGrossValue).
//     - secureRoutes.ts approveBill   uses NET grandTotal (financials.grandTotal ?? amount).
//     - workOrderService.update       uses NET grandTotal.
//   No unified `outflowCeiling` is provided in this behaviour-preserving pass.
//   The finance-approved pass (T4 follow-up) will designate one ceiling and route
//   every call-site through it. Left intentionally un-centralized here to avoid a
//   silent behavioural change.
// ===============================================================
