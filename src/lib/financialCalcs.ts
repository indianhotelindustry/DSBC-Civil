/**
 * SINGLE SOURCE OF TRUTH for all financial calculations.
 *
 * Every dashboard, ledger, KPI card, and report MUST use these functions.
 * Do not inline financial math in pages/components — import from here.
 *
 * ==============================================================
 * KPI DEFINITIONS (enforced below)
 * ==============================================================
 *
 * WORK ORDER INCLUSION
 *   "active" WOs = status in {PENDING, APPROVED, COMPLETED}
 *   REJECTED WOs are excluded from every aggregate.
 *
 * BILL INCLUSION
 *   "active" bills = status != REJECTED
 *   "pending" bills = status not in {PAID, REJECTED} (still owe money)
 *
 * PAYMENT INCLUSION
 *   "released" payments = status == RELEASED (money actually moved)
 *   PAYMENT (not ADVANCE) types reduce bill liability.
 *   ADVANCE payments are tracked separately (do not offset bills).
 *
 * GROSS vs NET (read this before adding a KPI)
 *   woGrossValue(wo)     = total BOQ amount BEFORE advance/GST/retention/other
 *                          charges. This is the CONTRACTUAL COMMITMENT and is what
 *                          every "value"/"liability"/"committed" aggregate uses.
 *   woRemainingAmount(wo)= NET grandTotal AFTER those deductions. Use only for
 *                          "Remaining Amount" / "Net Payable" displays.
 *   `woEffectiveValue` is a DEPRECATED alias of woRemainingAmount — do not use it
 *   in new aggregates. Conflating the two produced the ₹6,800-on-a-₹21,000-WO bug.
 *
 * KPI FORMULAS (dashboard)
 *   Total Work Order Value   = Σ woGrossValue(wo) over active WOs
 *   Approved Liability       = Σ woGrossValue(wo) over WOs in {APPROVED, COMPLETED}
 *   Total Billed Amount      = Σ netPayable over active bills
 *   Total Paid Amount        = Σ amount over released, non-advance payments
 *   Outstanding Payable      = Total Billed - Total Paid
 *   Unbilled Liability       = Total Work Order Value - Total Billed
 *   Overdue Payments         = Σ netPayable over pending bills with billDate < today
 *   Payable in N Days        = Σ netPayable over pending bills with today ≤ billDate ≤ today+N
 *   Advance Outstanding      = Σ advance (from released ADVANCE payments - RECOVERY adjustments)
 *
 * CONTRACTOR FORMULAS
 *   Total Billed (contractor) = Σ netPayable over active bills linked to contractor's WOs
 *   Total Paid (contractor)   = Σ amount over released, non-advance payments on those bills
 *   Outstanding (contractor)  = Total Billed - Total Paid
 *
 * PROJECT FORMULAS
 *   Committed      = Σ woGrossValue over active WOs in project
 *                    (gross, so it compares like-for-like against project.budget)
 *   Billed         = Σ netPayable over active bills on those WOs
 *   Paid           = Σ amount over released non-advance payments on those bills
 *
 * DATA SOURCE RULE
 *   Never read wo.billing.billedTillDate / paidTillDate / balancePayable.
 *   Those fields are legacy cache and are not reliably updated.
 *   Always derive from bills + payments collections.
 * ==============================================================
 */

import { WorkOrder, Bill, Payment, Contractor, Project, DashboardKPIs } from '../types';
import { isAfter, isBefore, addDays, startOfDay, endOfDay, parseISO, isSameDay, differenceInDays, format } from 'date-fns';

/**
 * Overdue / Due Today / Upcoming semantics (industry-standard):
 *   billDate < today  → OVERDUE
 *   billDate == today → DUE TODAY  (not overdue; attention-worthy)
 *   billDate > today  → UPCOMING
 * Display convention: Overdue (red) / Due Today (amber) / Upcoming (neutral).
 * Only pending bills are classified; PAID and REJECTED are excluded.
 */

// ===============================================================
// Primitive filters (reusable building blocks)
// ===============================================================

/** WOs that are not REJECTED — included in portfolio totals. */
export function activeWorkOrders(workOrders: WorkOrder[]): WorkOrder[] {
  return workOrders.filter(wo => wo.status !== 'REJECTED');
}

/** Bills that are not REJECTED — they represent real financial records. */
export function activeBills(bills: Bill[]): Bill[] {
  return bills.filter(b => b.status !== 'REJECTED');
}

/** Bills that still have outstanding payable (not fully PAID, not REJECTED). */
export function pendingBills(bills: Bill[]): Bill[] {
  return bills.filter(b => b.status !== 'PAID' && b.status !== 'REJECTED');
}

/** Payments that have been released (cash has left the account). */
export function releasedPayments(payments: Payment[]): Payment[] {
  return payments.filter(p => p.status === 'RELEASED');
}

/** Released payments that offset a bill (ADVANCE does not offset bill liability). */
export function releasedBillPayments(payments: Payment[]): Payment[] {
  return payments.filter(p => p.status === 'RELEASED' && p.type !== 'ADVANCE');
}

/**
 * NET remaining amount on a work order (after advance / GST /
 * retention / other-charges deductions). Use this for "Remaining
 * Amount" / "Net Payable" displays only — never for "Work Order
 * Value" or "Committed" cards (those want the gross BOQ side via
 * `woGrossValue`).
 *
 * Resolution: financials.grandTotal → wo.amount → 0. The legacy
 * `wo.amount` was net by convention (the form writes grandTotal
 * into it), so falling back there preserves Phase 1 reads.
 */
export function woRemainingAmount(wo: WorkOrder): number {
  return wo.financials?.grandTotal ?? wo.amount ?? 0;
}

/**
 * @deprecated Phase 1 callers used this for both gross and net
 * sums; that conflation produced ₹6,800-on-a-₹21,000-WO bugs.
 * New code must call `woGrossValue` (gross BOQ) or
 * `woRemainingAmount` (net) explicitly. Kept as a thin alias so
 * any straggler reads keep returning the same value they always
 * did (NET grandTotal). Will be removed once every caller is
 * migrated.
 */
export function woEffectiveValue(wo: WorkOrder): number {
  return woRemainingAmount(wo);
}

/**
 * GROSS work-order value — total BOQ amount BEFORE advance / GST /
 * retention / other-charges deductions. Use this for "Total Work
 * Order Value" / "Commitment" dashboards.
 *
 * This is deliberately distinct from `woEffectiveValue`, which
 * returns the NET grandTotal ("Remaining Amount"). The two were
 * being conflated on the Accounts Dashboard, making WO Value read
 * as the net remaining amount instead of the gross commitment.
 *
 * Resolution order:
 *   1. wo.financials.totalAmount — the cached BOQ sum the form
 *      writes on save; authoritative when present.
 *   2. Σ amount over wo.boqItems — computed from source if the
 *      cached total is missing for some reason.
 *   3. wo.amount — legacy single-number field. Imperfect because
 *      older write-paths stored net grandTotal there, but it is
 *      still the best last-resort signal for pre-financials WOs.
 */
export function woGrossValue(wo: WorkOrder): number {
  if (typeof wo.financials?.totalAmount === 'number') {
    return wo.financials.totalAmount;
  }
  if (Array.isArray(wo.boqItems) && wo.boqItems.length > 0) {
    return wo.boqItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
  return wo.amount ?? 0;
}

// ===============================================================
// Per-entity aggregates
// ===============================================================

/** Total workDoneAmount billed against a work order (excluding rejected). */
export function totalBilledForWO(workOrderId: string, bills: Bill[]): number {
  return activeBills(bills)
    .filter(b => b.workOrderId === workOrderId)
    .reduce((sum, b) => sum + b.workDoneAmount, 0);
}

/** Total netPayable billed against a work order (excluding rejected). */
export function totalNetPayableForWO(workOrderId: string, bills: Bill[]): number {
  return activeBills(bills)
    .filter(b => b.workOrderId === workOrderId)
    .reduce((sum, b) => sum + b.netPayable, 0);
}

/** Total released payments (excluding advances) for a specific bill. */
export function totalPaidForBill(billId: string, payments: Payment[]): number {
  return releasedBillPayments(payments)
    .filter(p => p.billId === billId)
    .reduce((sum, p) => sum + p.amount, 0);
}

/** Total released payments (excluding advances) for all bills linked to a work order. */
export function totalPaidForWO(workOrderId: string, bills: Bill[], payments: Payment[]): number {
  const woBillIds = new Set(activeBills(bills).filter(b => b.workOrderId === workOrderId).map(b => b.id));
  return releasedBillPayments(payments)
    .filter(p => woBillIds.has(p.billId))
    .reduce((sum, p) => sum + p.amount, 0);
}

// ===============================================================
// Contractor aggregates
// ===============================================================

export interface ContractorFinancials {
  contractorId: string;
  name: string;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
}

export function calculateContractorFinancials(
  contractor: Contractor,
  workOrders: WorkOrder[],
  bills: Bill[],
  payments: Payment[]
): ContractorFinancials {
  const cWOs = activeWorkOrders(workOrders).filter(wo => wo.contractorId === contractor.id);
  const woIds = new Set(cWOs.map(wo => wo.id));
  const cBills = activeBills(bills).filter(b => woIds.has(b.workOrderId));
  const totalBilled = cBills.reduce((sum, b) => sum + b.netPayable, 0);

  const billIds = new Set(cBills.map(b => b.id));
  const totalPaid = releasedBillPayments(payments)
    .filter(p => billIds.has(p.billId))
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    contractorId: contractor.id,
    name: contractor.name,
    totalBilled,
    totalPaid,
    outstanding: totalBilled - totalPaid
  };
}

// ===============================================================
// Project aggregates
// ===============================================================

export interface ProjectFinancials {
  projectId: string;
  name: string;
  budget: number;
  committed: number;
  billed: number;
  paid: number;
  variance: number;
  percentageUsed: number;
  riskStatus: 'CRITICAL' | 'HIGH' | 'LOW';
}

export function calculateProjectFinancials(
  project: Project,
  workOrders: WorkOrder[],
  bills: Bill[],
  payments: Payment[]
): ProjectFinancials {
  const projectWOs = activeWorkOrders(workOrders).filter(wo => wo.projectId === project.id);
  // Committed = contract value of every active WO. Gross BOQ side —
  // budget-vs-actual cards compare it to the project budget which is
  // also a gross figure.
  const committed = projectWOs.reduce((sum, wo) => sum + woGrossValue(wo), 0);

  const woIds = new Set(projectWOs.map(wo => wo.id));
  const projectBills = activeBills(bills).filter(b => woIds.has(b.workOrderId));
  const billed = projectBills.reduce((sum, b) => sum + b.netPayable, 0);

  const billIds = new Set(projectBills.map(b => b.id));
  const paid = releasedBillPayments(payments)
    .filter(p => billIds.has(p.billId))
    .reduce((sum, p) => sum + p.amount, 0);

  const budget = project.budget || 0;
  const variance = budget - committed;
  const percentageUsed = budget > 0 ? (committed / budget) * 100 : 0;

  return {
    projectId: project.id,
    name: project.name,
    budget,
    committed,
    billed,
    paid,
    variance,
    percentageUsed,
    riskStatus: percentageUsed > 100 ? 'CRITICAL' : percentageUsed > 90 ? 'HIGH' : 'LOW'
  };
}

// ===============================================================
// Time-windowed payable calculations
// ===============================================================

/** Sum netPayable of pending bills whose billDate falls within [start, end]. */
export function payableInWindow(bills: Bill[], start: Date, end: Date): number {
  return pendingBills(bills)
    .filter(b => {
      const d = parseISO(b.billDate);
      return (isAfter(d, start) || isSameDay(d, start)) && isBefore(d, end);
    })
    .reduce((sum, b) => sum + b.netPayable, 0);
}

/** Sum netPayable of pending bills whose billDate is before today.
 *  `today` is injectable for deterministic tests; defaults to real now. */
export function overdueAmount(bills: Bill[], today: Date = new Date()): number {
  const startToday = startOfDay(today);
  return pendingBills(bills)
    .filter(b => isBefore(parseISO(b.billDate), startToday))
    .reduce((sum, b) => sum + b.netPayable, 0);
}

/** Overdue bills (the actual bill objects).
 *  `today` is injectable for deterministic tests; defaults to real now. */
export function overdueBillsList(bills: Bill[], today: Date = new Date()): Bill[] {
  const startToday = startOfDay(today);
  return pendingBills(bills).filter(b => isBefore(parseISO(b.billDate), startToday));
}

/** Pending bills whose billDate falls on today (not overdue, not future).
 *  `today` is injectable for deterministic tests; defaults to real now. */
export function dueTodayBillsList(bills: Bill[], today: Date = new Date()): Bill[] {
  return pendingBills(bills).filter(b => isSameDay(parseISO(b.billDate), today));
}

/** Sum netPayable of bills returned by dueTodayBillsList. */
export function dueTodayAmount(bills: Bill[], today: Date = new Date()): number {
  return dueTodayBillsList(bills, today).reduce((sum, b) => sum + b.netPayable, 0);
}

// ===============================================================
// Chart data generators
// ===============================================================

export interface ForecastDataPoint {
  name: string;
  amount: number;
}

/** Daily forecast: netPayable per day for the next N days.
 *  `today` is injectable for deterministic tests; defaults to real now. */
export function dailyForecast(
  bills: Bill[],
  days: number,
  dateFormat: string = 'MMM dd',
  today: Date = new Date()
): ForecastDataPoint[] {
  const startToday = startOfDay(today);
  const pending = pendingBills(bills);
  const data: ForecastDataPoint[] = [];

  for (let i = 0; i < days; i++) {
    const day = addDays(startToday, i);
    const amount = pending
      .filter(b => isSameDay(parseISO(b.billDate), day))
      .reduce((sum, b) => sum + b.netPayable, 0);
    data.push({ name: format(day, dateFormat), amount });
  }

  return data;
}

export interface AgingBucket {
  range: string;
  amount: number;
}

/** Aging analysis: group pending bills into day-range buckets.
 *  `today` is injectable for deterministic tests; defaults to real now. */
export function agingAnalysis(bills: Bill[], today: Date = new Date()): AgingBucket[] {
  const startToday = startOfDay(today);
  const buckets: Record<string, number> = {
    '0-30': 0,
    '31-60': 0,
    '61-90': 0,
    '90+': 0
  };

  pendingBills(bills).forEach(b => {
    const days = differenceInDays(startToday, parseISO(b.billDate));
    if (days <= 30) buckets['0-30'] += b.netPayable;
    else if (days <= 60) buckets['31-60'] += b.netPayable;
    else if (days <= 90) buckets['61-90'] += b.netPayable;
    else buckets['90+'] += b.netPayable;
  });

  return Object.entries(buckets).map(([range, amount]) => ({ range, amount }));
}

// ===============================================================
// Full dashboard KPIs
// ===============================================================

export function calculateDashboardKPIs(
  workOrders: WorkOrder[],
  bills: Bill[],
  payments: Payment[],
  now: Date = new Date()
): DashboardKPIs {
  const today = startOfDay(now);
  const next7Days = endOfDay(addDays(today, 7));
  const next15Days = endOfDay(addDays(today, 15));
  const next30Days = endOfDay(addDays(today, 30));

  const activeWOs = activeWorkOrders(workOrders);
  const activeBillsList = activeBills(bills);
  const releasedBillPayList = releasedBillPayments(payments);

  const payable7Days = payableInWindow(bills, today, next7Days);
  const payable15Days = payableInWindow(bills, today, next15Days);
  const payable30Days = payableInWindow(bills, today, next30Days);
  const overduePayments = overdueAmount(bills, now);
  const dueToday = dueTodayAmount(bills, now);

  // Approved Liability: only APPROVED + COMPLETED WOs (excludes PENDING and REJECTED).
  // Reads GROSS BOQ value — this is the contractual commitment, not
  // the post-deduction net.
  const totalApprovedLiability = activeWOs
    .filter(wo => wo.status === 'APPROVED' || wo.status === 'COMPLETED')
    .reduce((sum, wo) => sum + woGrossValue(wo), 0);

  // Total WO Value: all active WOs (PENDING + APPROVED + COMPLETED). Excludes REJECTED.
  // GROSS BOQ value — what's "on our books" before deductions.
  const totalWorkOrderValue = activeWOs.reduce((sum, wo) => sum + woGrossValue(wo), 0);

  // Total Billed: active bills, netPayable.
  const totalBilledAmount = activeBillsList.reduce((sum, b) => sum + b.netPayable, 0);

  // Total Paid: released non-advance payments.
  const totalPaidAmount = releasedBillPayList.reduce((sum, p) => sum + p.amount, 0);

  const outstandingPayable = totalBilledAmount - totalPaidAmount;
  const unbilledLiability = totalWorkOrderValue - totalBilledAmount;

  // Advance outstanding: sum of advance payments released that haven't been recovered.
  // Note: recovery via adjustments is handled in contractor-specific calculations.
  const advanceOutstanding = releasedPayments(payments)
    .filter(p => p.type === 'ADVANCE')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    payable7Days,
    payable15Days,
    payable30Days,
    totalApprovedLiability,
    totalWorkOrderValue,
    totalBilledAmount,
    totalPaidAmount,
    outstandingPayable,
    unbilledLiability,
    overduePayments,
    dueToday,
    advanceOutstanding
  };
}
