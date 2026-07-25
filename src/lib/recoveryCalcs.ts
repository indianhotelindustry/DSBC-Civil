/**
 * Pure aggregation helpers for the SIPL Recovery Dashboard (Phase 1).
 *
 * Phase 1 rules (documented here as the single source of truth — every
 * aggregator below respects them):
 *   - Active sales set  A = { s | s.saleStatus ≠ 'CANCELLED' }
 *   - CANCELLED sales and their receipts are excluded from every total,
 *     including the 30-day trend.
 *   - Per-sale outstanding = finalSaleValue − totalReceived. Positive
 *     values feed Net Receivable; negative values feed Overpaid. The
 *     two are mutually exclusive per sale so an overpayment on one
 *     sale never offsets an unrelated balance.
 *
 * Phase 2 will add installment-level aging once `saleSchedules` writes
 * land. This file stays deterministic — no `new Date()` inside any
 * helper; callers inject `now` where time matters.
 */

import { Sale, SaleReceipt, Project, SubLocation } from '../types';
import { format, startOfDay, subDays, parseISO, differenceInCalendarDays } from 'date-fns';

// ─────────────────────────────────────────────────────────────────────
// Primitive filters
// ─────────────────────────────────────────────────────────────────────

export function activeSales(sales: Sale[]): Sale[] {
  return sales.filter(s => s.saleStatus !== 'CANCELLED');
}

/** Receipts whose sale is active (non-cancelled). */
export function activeReceipts(receipts: SaleReceipt[], sales: Sale[]): SaleReceipt[] {
  const activeIds = new Set(activeSales(sales).map(s => s.id));
  return receipts.filter(r => activeIds.has(r.saleId));
}

// ─────────────────────────────────────────────────────────────────────
// Top-strip KPIs
// ─────────────────────────────────────────────────────────────────────

export interface RecoverySummary {
  totalSaleValue: number;
  totalReceived: number;
  netReceivable: number;   // Σ max(0, finalSaleValue − totalReceived)
  overpaid: number;        // Σ max(0, totalReceived − finalSaleValue)
  unitsBooked: number;     // all active sales (BOOKED + SOLD + POSSESSION_GIVEN)
  unitsSold: number;       // SOLD + POSSESSION_GIVEN
  unitsPossession: number; // POSSESSION_GIVEN
  /** Roll-up recovery percentage — received / sale value × 100 (floored at 0,
   *  capped at 100 for the overpaid case so the headline never shows >100%
   *  even when a customer has paid extra). */
  recoveryPct: number;
}

export function buildRecoverySummary(sales: Sale[]): RecoverySummary {
  const active = activeSales(sales);
  let totalSaleValue = 0;
  let totalReceived = 0;
  let netReceivable = 0;
  let overpaid = 0;
  let unitsSold = 0;
  let unitsPossession = 0;
  for (const s of active) {
    totalSaleValue += s.finalSaleValue || 0;
    totalReceived += s.totalReceived || 0;
    const out = (s.finalSaleValue || 0) - (s.totalReceived || 0);
    if (out > 0) netReceivable += out;
    else overpaid += -out;
    if (s.saleStatus === 'SOLD' || s.saleStatus === 'POSSESSION_GIVEN') unitsSold++;
    if (s.saleStatus === 'POSSESSION_GIVEN') unitsPossession++;
  }
  const recoveryPct = totalSaleValue > 0
    ? Math.min(100, (totalReceived / totalSaleValue) * 100)
    : 0;
  return {
    totalSaleValue: round2(totalSaleValue),
    totalReceived: round2(totalReceived),
    netReceivable: round2(netReceivable),
    overpaid: round2(overpaid),
    unitsBooked: active.length,
    unitsSold,
    unitsPossession,
    recoveryPct: round2(recoveryPct),
  };
}

// ─────────────────────────────────────────────────────────────────────
// 30-day receipt trend
// ─────────────────────────────────────────────────────────────────────

export interface RecoveryTrendPoint {
  date: string;   // YYYY-MM-DD (local-day bucket key)
  label: string;  // "Apr 12"
  amount: number;
}

/**
 * Receipts bucketed by local day for the trailing N days (default 30)
 * anchored on `now`. Only receipts on active sales are counted.
 * Missing days render as zero so the bar chart x-axis is continuous.
 */
export function buildReceiptTrend(
  receipts: SaleReceipt[],
  sales: Sale[],
  days: number = 30,
  now: Date = new Date()
): RecoveryTrendPoint[] {
  const active = activeReceipts(receipts, sales);
  const today = startOfDay(now);
  const start = subDays(today, days - 1);

  const bucket: Record<string, number> = {};
  for (const r of active) {
    if (!r.receivedAt) continue;
    const d = parseISO(r.receivedAt);
    if (differenceInCalendarDays(d, start) < 0) continue;
    if (differenceInCalendarDays(d, today) > 0) continue;
    const key = format(startOfDay(d), 'yyyy-MM-dd');
    bucket[key] = (bucket[key] || 0) + (r.amount || 0);
  }

  const out: RecoveryTrendPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = subDays(today, days - 1 - i);
    const key = format(d, 'yyyy-MM-dd');
    out.push({ date: key, label: format(d, 'MMM d'), amount: round2(bucket[key] || 0) });
  }
  return out;
}

/** Convenience rollup on top of the trend — total collected in the window
 *  and daily average (over non-zero days, so a short history isn't
 *  distorted by leading zeros). */
export function buildTrendStats(trend: RecoveryTrendPoint[]): { total: number; avgPerDay: number; daysWithReceipts: number } {
  let total = 0;
  let daysWithReceipts = 0;
  for (const p of trend) {
    total += p.amount;
    if (p.amount > 0) daysWithReceipts++;
  }
  return {
    total: round2(total),
    avgPerDay: daysWithReceipts > 0 ? round2(total / daysWithReceipts) : 0,
    daysWithReceipts,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Per-customer outstanding rollup (top 10)
// ─────────────────────────────────────────────────────────────────────

export interface CustomerOutstandingRow {
  customerId: string;
  customerName: string;    // snapshot — stable even if master renamed
  projectId: string;       // most-recent sale's project
  projectName: string;
  unitLabel: string;       // "Plot 1A" or "Plot 1A +2"
  unitCount: number;
  totalSaleValue: number;
  totalReceived: number;
  outstanding: number;     // Σ max(0, out(s)) — positives only
  overpaid: number;        // Σ max(0, −out(s)) — negatives only
  recoveryPct: number;
}

export function buildCustomerOutstanding(
  sales: Sale[],
  projects: Project[],
  subLocations: SubLocation[],
  limit: number = 10
): CustomerOutstandingRow[] {
  const active = activeSales(sales);
  const projectById: Record<string, Project> = {};
  for (const p of projects) projectById[p.id] = p;
  const subById: Record<string, SubLocation> = {};
  for (const sl of subLocations) subById[sl.id] = sl;

  const groups: Record<string, Sale[]> = {};
  for (const s of active) {
    (groups[s.customerId] ||= []).push(s);
  }

  const rows: CustomerOutstandingRow[] = [];
  for (const [customerId, theirSales] of Object.entries(groups)) {
    // Pick the "primary" sale (most recent by saleDate) for project + unit label.
    const sorted = [...theirSales].sort((a, b) => (b.saleDate || '').localeCompare(a.saleDate || ''));
    const primary = sorted[0];
    const projectName = projectById[primary.projectId]?.name || '—';

    const primaryUnitName = subById[primary.subLocationId]?.name || primary.unitNameSnapshot || '—';
    const otherUnits = theirSales.length - 1;
    const unitLabel = otherUnits > 0 ? `${primaryUnitName} +${otherUnits}` : primaryUnitName;

    let totalSaleValue = 0;
    let totalReceived = 0;
    let outstanding = 0;
    let overpaid = 0;
    for (const s of theirSales) {
      totalSaleValue += s.finalSaleValue || 0;
      totalReceived += s.totalReceived || 0;
      const out = (s.finalSaleValue || 0) - (s.totalReceived || 0);
      if (out > 0) outstanding += out;
      else overpaid += -out;
    }
    const recoveryPct = totalSaleValue > 0
      ? Math.min(100, (totalReceived / totalSaleValue) * 100)
      : 0;

    rows.push({
      customerId,
      customerName: primary.customerNameSnapshot || '—',
      projectId: primary.projectId,
      projectName,
      unitLabel,
      unitCount: theirSales.length,
      totalSaleValue: round2(totalSaleValue),
      totalReceived: round2(totalReceived),
      outstanding: round2(outstanding),
      overpaid: round2(overpaid),
      recoveryPct: round2(recoveryPct),
    });
  }

  // Sort by outstanding desc; tie-break by totalSaleValue desc so customers
  // with high sales but zero outstanding don't drop off under a ledger-heavy
  // workspace.
  rows.sort((a, b) => b.outstanding - a.outstanding || b.totalSaleValue - a.totalSaleValue);
  return rows.slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────
// Per-project recovery summary
// ─────────────────────────────────────────────────────────────────────

export interface ProjectRecoveryRow {
  projectId: string;
  projectName: string;
  unitsSold: number;        // count of active sales in this project
  totalSaleValue: number;
  totalReceived: number;
  outstanding: number;
  overpaid: number;
  recoveryPct: number;
}

export function buildProjectRecovery(
  sales: Sale[],
  projects: Project[]
): ProjectRecoveryRow[] {
  const active = activeSales(sales);
  const projectById: Record<string, Project> = {};
  for (const p of projects) projectById[p.id] = p;

  const groups: Record<string, Sale[]> = {};
  for (const s of active) {
    (groups[s.projectId] ||= []).push(s);
  }

  const rows: ProjectRecoveryRow[] = [];
  for (const [projectId, theirSales] of Object.entries(groups)) {
    let totalSaleValue = 0;
    let totalReceived = 0;
    let outstanding = 0;
    let overpaid = 0;
    for (const s of theirSales) {
      totalSaleValue += s.finalSaleValue || 0;
      totalReceived += s.totalReceived || 0;
      const out = (s.finalSaleValue || 0) - (s.totalReceived || 0);
      if (out > 0) outstanding += out;
      else overpaid += -out;
    }
    const recoveryPct = totalSaleValue > 0
      ? Math.min(100, (totalReceived / totalSaleValue) * 100)
      : 0;
    rows.push({
      projectId,
      projectName: projectById[projectId]?.name || '—',
      unitsSold: theirSales.length,
      totalSaleValue: round2(totalSaleValue),
      totalReceived: round2(totalReceived),
      outstanding: round2(outstanding),
      overpaid: round2(overpaid),
      recoveryPct: round2(recoveryPct),
    });
  }
  rows.sort((a, b) => b.outstanding - a.outstanding || a.projectName.localeCompare(b.projectName));
  return rows;
}

// ─────────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
