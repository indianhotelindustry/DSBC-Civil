/**
 * Pure aggregation helpers for SaleSchedule data (Phase 2A recovery engine).
 *
 * Rules documented here are the single source of truth for every
 * dashboard read:
 *   - "Open" schedules are those NOT in {PAID, WAIVED, CANCELLED}.
 *     They're the rows that still owe money.
 *   - Overdue / due-today / due-in-window filters run on OPEN schedules
 *     only — paid / waived / cancelled rows never contribute.
 *   - Balance used in dashboard sums is `balanceAmount` (cached from
 *     the service); an overpayment on one schedule does NOT offset
 *     another schedule's balance.
 *   - Collection efficiency is computed against "due-to-date" (schedules
 *     whose dueDate ≤ today), including PAID/PARTIALLY_PAID but not
 *     WAIVED/CANCELLED. Received-to-date is capped per schedule at
 *     its amount so extras on one schedule don't inflate efficiency.
 *
 * Deterministic — every time-dependent helper takes `now` as an argument
 * so tests can pin a fixed TODAY.
 */

import { SaleSchedule, ReceiptAllocation, AllocationMode } from '../types';
import { startOfDay, endOfDay, addDays, parseISO, isBefore, isAfter, isSameDay, differenceInCalendarDays } from 'date-fns';

/** A schedule that still owes money (not paid, not waived, not cancelled). */
export function isOpen(sch: SaleSchedule): boolean {
  return sch.status === 'PENDING' || sch.status === 'PARTIALLY_PAID';
}

/** Filter helper for use at the top of every aggregator. */
export function openSchedules(schedules: SaleSchedule[]): SaleSchedule[] {
  return schedules.filter(isOpen);
}

/**
 * Auto-derive a schedule's status from paidAmount vs amount. Only
 * returns the three auto-managed values. Callers must preserve
 * WAIVED / CANCELLED explicitly — those are admin-set and sticky.
 */
export function deriveAutoStatus(amount: number, paidAmount: number): 'PENDING' | 'PARTIALLY_PAID' | 'PAID' {
  if (paidAmount >= amount) return 'PAID';
  if (paidAmount > 0) return 'PARTIALLY_PAID';
  return 'PENDING';
}

/** Balance owed on a single schedule (floored at 0). */
export function scheduleBalance(sch: SaleSchedule): number {
  return Math.max(0, (sch.amount || 0) - (sch.paidAmount || 0));
}

/** Excess paid on a schedule (0 when paidAmount ≤ amount). */
export function scheduleOverpaid(sch: SaleSchedule): number {
  return Math.max(0, (sch.paidAmount || 0) - (sch.amount || 0));
}

// ─────────────────────────────────────────────────────────────────────
// Time-window sums
// ─────────────────────────────────────────────────────────────────────

export interface ScheduleWindowTotals {
  overdue: number;         // dueDate < today
  dueToday: number;        // dueDate == today
  dueNext7Days: number;    // today < dueDate ≤ today+7
  dueNext30Days: number;   // today < dueDate ≤ today+30
}

export function buildWindowTotals(schedules: SaleSchedule[], now: Date = new Date()): ScheduleWindowTotals {
  const today = startOfDay(now);
  const in7 = endOfDay(addDays(today, 7));
  const in30 = endOfDay(addDays(today, 30));
  const totals: ScheduleWindowTotals = { overdue: 0, dueToday: 0, dueNext7Days: 0, dueNext30Days: 0 };

  for (const sch of openSchedules(schedules)) {
    const d = parseISO(sch.dueDate);
    const bal = scheduleBalance(sch);
    if (isBefore(d, today)) {
      totals.overdue += bal;
    } else if (isSameDay(d, today)) {
      totals.dueToday += bal;
    } else {
      if (!isAfter(d, in7)) totals.dueNext7Days += bal;
      if (!isAfter(d, in30)) totals.dueNext30Days += bal;
    }
  }
  return {
    overdue: round2(totals.overdue),
    dueToday: round2(totals.dueToday),
    dueNext7Days: round2(totals.dueNext7Days),
    dueNext30Days: round2(totals.dueNext30Days),
  };
}

// ─────────────────────────────────────────────────────────────────────
// Aging buckets (open schedules only)
// ─────────────────────────────────────────────────────────────────────

export interface AgingBucket {
  /** Display key — one of "Upcoming", "Due Today", "1–30 days", "31–60 days", "61–90 days", "90+ days". */
  label: string;
  amount: number;
  /** Count of schedules that fell in this bucket (useful for the chart tooltip). */
  count: number;
}

const AGING_ORDER = [
  'Upcoming',
  'Due Today',
  '1–30 days',
  '31–60 days',
  '61–90 days',
  '90+ days',
] as const;

export function buildAgingBuckets(schedules: SaleSchedule[], now: Date = new Date()): AgingBucket[] {
  const today = startOfDay(now);
  const init: Record<string, { amount: number; count: number }> = {};
  for (const label of AGING_ORDER) init[label] = { amount: 0, count: 0 };

  for (const sch of openSchedules(schedules)) {
    const d = startOfDay(parseISO(sch.dueDate));
    const days = differenceInCalendarDays(today, d);
    let label: string;
    if (days < 0) label = 'Upcoming';
    else if (days === 0) label = 'Due Today';
    else if (days <= 30) label = '1–30 days';
    else if (days <= 60) label = '31–60 days';
    else if (days <= 90) label = '61–90 days';
    else label = '90+ days';
    init[label].amount += scheduleBalance(sch);
    init[label].count += 1;
  }

  return AGING_ORDER.map(label => ({
    label,
    amount: round2(init[label].amount),
    count: init[label].count,
  }));
}

// ─────────────────────────────────────────────────────────────────────
// Collection efficiency
// ─────────────────────────────────────────────────────────────────────

export interface CollectionEfficiency {
  dueToDate: number;         // Σ amount over schedules due on or before today (excl. WAIVED/CANCELLED)
  receivedToDate: number;    // Σ min(paidAmount, amount) on same set — overpay excluded
  percent: number;           // 0..100
  /** Schedules counted in the computation. */
  scheduleCount: number;
}

export function buildCollectionEfficiency(
  schedules: SaleSchedule[],
  now: Date = new Date()
): CollectionEfficiency {
  const today = endOfDay(startOfDay(now));
  let dueToDate = 0;
  let receivedToDate = 0;
  let scheduleCount = 0;
  for (const sch of schedules) {
    if (sch.status === 'WAIVED' || sch.status === 'CANCELLED') continue;
    const d = parseISO(sch.dueDate);
    if (isAfter(d, today)) continue;
    dueToDate += sch.amount || 0;
    receivedToDate += Math.min(sch.paidAmount || 0, sch.amount || 0);
    scheduleCount++;
  }
  const percent = dueToDate > 0
    ? Math.min(100, (receivedToDate / dueToDate) * 100)
    : 0;
  return {
    dueToDate: round2(dueToDate),
    receivedToDate: round2(receivedToDate),
    percent: round2(percent),
    scheduleCount,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Per-sale schedule summary (for SaleDetail)
// ─────────────────────────────────────────────────────────────────────

export interface SaleScheduleSummary {
  totalScheduled: number;    // Σ amount over non-{WAIVED, CANCELLED}
  scheduledPaid: number;     // Σ paidAmount on same set
  scheduledBalance: number;  // Σ balance on same set
  overdueAmount: number;     // Σ balance where status open AND dueDate < today
  /** Delta vs a sale's finalSaleValue. Positive = schedules exceed sale value. */
  deltaVsSaleValue: (finalSaleValue: number) => number;
  /** How many schedules are active vs waived vs cancelled. */
  counts: { active: number; paid: number; waived: number; cancelled: number };
}

export function buildSaleScheduleSummary(
  schedules: SaleSchedule[],
  now: Date = new Date()
): SaleScheduleSummary {
  const today = startOfDay(now);
  let totalScheduled = 0;
  let scheduledPaid = 0;
  let scheduledBalance = 0;
  let overdueAmount = 0;
  const counts = { active: 0, paid: 0, waived: 0, cancelled: 0 };
  for (const sch of schedules) {
    if (sch.status === 'CANCELLED') { counts.cancelled++; continue; }
    if (sch.status === 'WAIVED') { counts.waived++; continue; }
    totalScheduled += sch.amount || 0;
    scheduledPaid += sch.paidAmount || 0;
    const bal = scheduleBalance(sch);
    scheduledBalance += bal;
    if (sch.status === 'PAID') counts.paid++;
    else counts.active++;
    if (isOpen(sch) && isBefore(parseISO(sch.dueDate), today)) {
      overdueAmount += bal;
    }
  }
  const totalScheduledFinal = round2(totalScheduled);
  return {
    totalScheduled: totalScheduledFinal,
    scheduledPaid: round2(scheduledPaid),
    scheduledBalance: round2(scheduledBalance),
    overdueAmount: round2(overdueAmount),
    deltaVsSaleValue: (finalSaleValue: number) => round2(totalScheduledFinal - finalSaleValue),
    counts,
  };
}

// ─────────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────
// Auto-distribute a lump-sum receipt across open schedules
// ─────────────────────────────────────────────────────────────────────

export interface AutoDistributionResult {
  /** One allocation per schedule that received money, in due-date order. */
  allocations: ReceiptAllocation[];
  /** Unallocated remainder (when `amount` exceeds total open balance). */
  remainder: number;
}

/**
 * Greedy allocation: walk open schedules in dueDate ascending order and
 * fill each up to its balance until the receipt amount is exhausted.
 * Any remaining amount stays unallocated — it still counts in
 * `sale.totalReceived` but isn't applied to a specific installment.
 *
 * Tie-breaker when two schedules share a dueDate: earlier installmentNo
 * first so "Installment #2 vs #3 both due today" allocates #2 before #3.
 *
 * Pure — no mutation of the input schedules. Only considers PENDING /
 * PARTIALLY_PAID schedules (`isOpen`).
 */
export function computeAutoDistribution(
  amount: number,
  schedules: SaleSchedule[]
): AutoDistributionResult {
  const total = round2(Math.max(0, amount));
  if (total === 0) return { allocations: [], remainder: 0 };

  const sorted = [...openSchedules(schedules)].sort((a, b) => {
    const byDate = (a.dueDate || '').localeCompare(b.dueDate || '');
    if (byDate !== 0) return byDate;
    const byInstallment = (a.installmentNo || 0) - (b.installmentNo || 0);
    if (byInstallment !== 0) return byInstallment;
    // Deterministic final tiebreak — matters only if two schedules
    // share both dueDate AND installmentNo (rare; possible across
    // recreated rows). Older row wins so FIFO stays stable.
    return (a.createdAt || '').localeCompare(b.createdAt || '');
  });

  const allocations: ReceiptAllocation[] = [];
  let remaining = total;
  for (const sch of sorted) {
    if (remaining <= 0) break;
    const bal = scheduleBalance(sch);
    if (bal <= 0) continue;
    const take = round2(Math.min(remaining, bal));
    if (take <= 0) continue;
    allocations.push({ scheduleId: sch.id, amount: take });
    remaining = round2(remaining - take);
  }
  return { allocations, remainder: round2(Math.max(0, remaining)) };
}

/**
 * Normalize whatever allocation form a receipt carries into a flat
 * `ReceiptAllocation[]`. Used by services when reading back existing
 * receipts and by the customer-ledger view when attributing paid
 * amounts to schedules.
 *
 * Precedence:
 *   (1) `allocations` array — authoritative multi-schedule link.
 *   (2) `linkedScheduleId` — legacy Phase 2A single-link; treated
 *       as one allocation for the full receipt amount.
 *   (3) neither — empty array (receipt is unallocated).
 */
export function resolveReceiptAllocations(receipt: {
  amount: number;
  allocations?: ReceiptAllocation[];
  linkedScheduleId?: string;
}): ReceiptAllocation[] {
  if (receipt.allocations && receipt.allocations.length > 0) {
    return receipt.allocations.map(a => ({ scheduleId: a.scheduleId, amount: round2(a.amount) }));
  }
  if (receipt.linkedScheduleId) {
    return [{ scheduleId: receipt.linkedScheduleId, amount: round2(receipt.amount || 0) }];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────
// Phase 2B alignment helpers (Path B): denormalized receipt-level
// allocation summary and legacy-read fallbacks. The service writes
// these explicit values at create time so future readers don't need
// to recompute; helpers below exist so older receipts (written
// before these fields existed) still look right everywhere.
// ─────────────────────────────────────────────────────────────────────

export interface AllocationSummary {
  allocationMode: AllocationMode;
  allocatedAmount: number;
  unappliedAmount: number;
}

/**
 * Pure packaging helper — given the receipt amount, its merged
 * allocations array, and the caller-declared mode, compute the three
 * denormalized fields that get written on the receipt doc.
 *
 * `mode` is declared by the caller rather than inferred so a user who
 * clicked "auto" but got a single-schedule result still reads as AUTO.
 */
export function summarizeAllocation(
  amount: number,
  allocations: ReceiptAllocation[],
  mode: AllocationMode
): AllocationSummary {
  const safeAmount = round2(Math.max(0, amount || 0));
  const allocatedAmount = round2(
    allocations.reduce((s, a) => s + Math.max(0, a.amount || 0), 0)
  );
  const unappliedAmount = round2(Math.max(0, safeAmount - allocatedAmount));
  return { allocationMode: mode, allocatedAmount, unappliedAmount };
}

/**
 * Legacy-safe read of `allocatedAmount`.
 *
 * Precedence:
 *   (1) explicit field when the writer persisted it (Phase 2B aligned).
 *   (2) sum of `allocations[]` when present.
 *   (3) full receipt amount when only a legacy `linkedScheduleId` is set.
 *   (4) 0 otherwise (unallocated receipt).
 */
export function getReceiptAllocatedAmount(r: {
  amount: number;
  allocations?: ReceiptAllocation[];
  allocatedAmount?: number;
  linkedScheduleId?: string;
}): number {
  if (typeof r.allocatedAmount === 'number') return round2(r.allocatedAmount);
  if (r.allocations && r.allocations.length > 0) {
    return round2(r.allocations.reduce((s, a) => s + Math.max(0, a.amount || 0), 0));
  }
  if (r.linkedScheduleId) return round2(Math.max(0, r.amount || 0));
  return 0;
}

/**
 * Legacy-safe read of `unappliedAmount` — falls back to
 * `amount - allocatedAmount` when the explicit field is missing.
 */
export function getReceiptUnappliedAmount(r: {
  amount: number;
  allocations?: ReceiptAllocation[];
  allocatedAmount?: number;
  unappliedAmount?: number;
  linkedScheduleId?: string;
}): number {
  if (typeof r.unappliedAmount === 'number') return round2(Math.max(0, r.unappliedAmount));
  const allocated = getReceiptAllocatedAmount(r);
  return round2(Math.max(0, round2(r.amount || 0) - allocated));
}
