/**
 * Pure aggregation helpers for the Customer Ledger page.
 *
 * Single source of truth for:
 *   - per-customer financial summary (active vs cancelled sales)
 *   - unified transaction stream (sales + receipts; adjustments will
 *     plug in during Phase 3 via extendTransactionStream).
 *
 * Deterministic — no time-of-day or Firestore calls. Pass in the data;
 * get pure, testable output back.
 */

import { Sale, SaleReceipt, SaleSchedule, Project, SubLocation } from '../types';
import { buildSaleScheduleSummary, scheduleBalance } from './scheduleCalcs';
import { parseISO, isBefore, startOfDay } from 'date-fns';

/** Non-CANCELLED sales contribute to headline totals. */
export function isActiveSale(sale: Sale): boolean {
  return sale.saleStatus !== 'CANCELLED';
}

/** Active = BOOKED | SOLD | POSSESSION_GIVEN (in pipeline). */
export function isBookedOrBeyond(sale: Sale): boolean {
  return sale.saleStatus === 'BOOKED'
    || sale.saleStatus === 'SOLD'
    || sale.saleStatus === 'POSSESSION_GIVEN';
}

/** Sold = SOLD | POSSESSION_GIVEN (ownership transferred). */
export function isSoldOrBeyond(sale: Sale): boolean {
  return sale.saleStatus === 'SOLD' || sale.saleStatus === 'POSSESSION_GIVEN';
}

export interface CustomerLedgerSummary {
  /** Headline totals — over non-cancelled sales only. */
  totalSaleValue: number;
  totalReceived: number;
  /** Signed: positive = owed to us, negative = customer overpaid. */
  netOutstanding: number;
  /** Display-safe outstanding (never negative). */
  outstanding: number;
  /** Display-safe overpaid amount (never negative). */
  overpaidAmount: number;

  /** Counts across non-cancelled sales. */
  unitsBooked: number;
  unitsSold: number;
  unitsPossession: number;

  /** Separate cancelled-sales context. */
  cancelledCount: number;
  /** Money received before cancellation — not refunded in Phase 2. */
  receivedOnCancelled: number;
}

export function buildCustomerSummary(
  customerId: string,
  sales: Sale[]
): CustomerLedgerSummary {
  const mine = sales.filter(s => s.customerId === customerId);
  const active = mine.filter(isActiveSale);
  const cancelled = mine.filter(s => s.saleStatus === 'CANCELLED');

  const totalSaleValue = round2(active.reduce((sum, s) => sum + (s.finalSaleValue || 0), 0));
  const totalReceived = round2(active.reduce((sum, s) => sum + (s.totalReceived || 0), 0));
  const netOutstanding = round2(totalSaleValue - totalReceived);

  return {
    totalSaleValue,
    totalReceived,
    netOutstanding,
    outstanding: Math.max(0, netOutstanding),
    overpaidAmount: Math.max(0, -netOutstanding),
    unitsBooked: active.filter(isBookedOrBeyond).length,
    unitsSold: active.filter(isSoldOrBeyond).length,
    unitsPossession: active.filter(s => s.saleStatus === 'POSSESSION_GIVEN').length,
    cancelledCount: cancelled.length,
    receivedOnCancelled: round2(cancelled.reduce((sum, s) => sum + (s.totalReceived || 0), 0))
  };
}

// ─────────────────────────────────────────────────────────────────────
// Unit-wise breakdown
// ─────────────────────────────────────────────────────────────────────

export interface CustomerUnitRow {
  saleId: string;
  unitName: string;
  projectName: string;
  saleStatus: Sale['saleStatus'];
  finalSaleValue: number;
  totalReceived: number;
  outstanding: number;
  saleDate: string;
}

export function buildUnitBreakdown(
  customerId: string,
  sales: Sale[],
  projects: Project[],
  subLocations: SubLocation[]
): CustomerUnitRow[] {
  const projectById: Record<string, Project> = {};
  for (const p of projects) projectById[p.id] = p;
  const subById: Record<string, SubLocation> = {};
  for (const sl of subLocations) subById[sl.id] = sl;

  return sales
    .filter(s => s.customerId === customerId)
    .map(s => {
      const outstanding = round2((s.finalSaleValue || 0) - (s.totalReceived || 0));
      return {
        saleId: s.id,
        unitName: subById[s.subLocationId]?.name || s.unitNameSnapshot,
        projectName: projectById[s.projectId]?.name || '—',
        saleStatus: s.saleStatus,
        finalSaleValue: s.finalSaleValue || 0,
        totalReceived: s.totalReceived || 0,
        outstanding,
        saleDate: s.saleDate
      };
    })
    .sort((a, b) => (b.saleDate || '').localeCompare(a.saleDate || ''));
}

// ─────────────────────────────────────────────────────────────────────
// Unified transaction stream (sale events + receipt events)
// ─────────────────────────────────────────────────────────────────────

export type LedgerTxKind = 'SALE' | 'RECEIPT' | 'SALE_CANCELLED';

export interface LedgerTx {
  kind: LedgerTxKind;
  date: string;
  unitName: string;
  description: string;
  /** Customer owes (debit side for customer). Positive = added to what the customer owes. */
  debit: number;
  /** Customer paid (credit side for customer). Positive = reduces what the customer owes. */
  credit: number;
  /** Running reference ids for debugging / deep links. */
  saleId: string;
  receiptId?: string;
  /** Optional metadata for display. */
  statusHint?: Sale['saleStatus'];
  mode?: SaleReceipt['mode'];
  reference?: string;
}

/**
 * Build the unified transaction stream for a customer.
 *
 * A SALE event debits the customer by finalSaleValue (they now owe this).
 * A RECEIPT event credits the customer by the received amount (they paid).
 * A SALE_CANCELLED event shows up as context but carries zero debit/credit —
 * in Phase 2 we do not auto-refund receipts; cancelled sales leave their
 * receipts in history for a future adjustment workflow to handle.
 *
 * Sorted by date descending (most recent first).
 */
export function buildTransactionStream(
  customerId: string,
  sales: Sale[],
  receipts: SaleReceipt[]
): LedgerTx[] {
  const mineSales = sales.filter(s => s.customerId === customerId);
  const saleById: Record<string, Sale> = {};
  for (const s of mineSales) saleById[s.id] = s;

  const txs: LedgerTx[] = [];

  for (const s of mineSales) {
    txs.push({
      kind: 'SALE',
      date: s.saleDate,
      unitName: s.unitNameSnapshot,
      description: `Sale created · ${s.unitNameSnapshot}`,
      debit: s.finalSaleValue || 0,
      credit: 0,
      saleId: s.id,
      statusHint: s.saleStatus
    });
    if (s.saleStatus === 'CANCELLED' && s.cancelledAt) {
      txs.push({
        kind: 'SALE_CANCELLED',
        date: s.cancelledAt,
        unitName: s.unitNameSnapshot,
        description: `Sale cancelled · ${s.cancelReason || 'no reason recorded'}`,
        debit: 0,
        credit: 0,
        saleId: s.id,
        statusHint: 'CANCELLED'
      });
    }
  }

  for (const r of receipts) {
    const s = saleById[r.saleId];
    if (!s) continue; // not this customer's receipt
    txs.push({
      kind: 'RECEIPT',
      date: r.receivedAt,
      unitName: s.unitNameSnapshot,
      description: `Receipt · ${r.mode}${r.reference ? ` · ${r.reference}` : ''}`,
      debit: 0,
      credit: r.amount || 0,
      saleId: s.id,
      receiptId: r.id,
      mode: r.mode,
      reference: r.reference
    });
  }

  txs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return txs;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────
// Per-sale installment schedules (Customer Ledger "Installments" section)
// ─────────────────────────────────────────────────────────────────────

export interface CustomerScheduleGroup {
  saleId: string;
  unitName: string;
  projectName: string;
  saleStatus: Sale['saleStatus'];
  saleDate: string;
  finalSaleValue: number;
  schedules: SaleSchedule[];    // sorted by installmentNo ascending
  /** Aggregate totals across all non-cancelled, non-waived rows. */
  totalScheduled: number;
  totalPaid: number;
  totalBalance: number;
  totalOverdue: number;
  /** Per-row balance/overdue lookups so the UI doesn't recompute. */
  rowMeta: Record<string, { balance: number; isOverdue: boolean }>;
}

/**
 * Groups a customer's schedules by their parent sale. Cancelled sales
 * are excluded (their schedules carry no recovery obligation and the
 * sale-cancel flow already hides them from everything else).
 *
 * Returns in the same order the ledger's Units table uses — saleDate
 * descending — so the "Installments" section below the units reads
 * top-to-bottom in matching order.
 */
export function buildCustomerSchedules(
  customerId: string,
  sales: Sale[],
  schedules: SaleSchedule[],
  projects: Project[],
  subLocations: SubLocation[],
  now: Date = new Date()
): CustomerScheduleGroup[] {
  const today = startOfDay(now);
  const projectById: Record<string, Project> = {};
  for (const p of projects) projectById[p.id] = p;
  const subById: Record<string, SubLocation> = {};
  for (const sl of subLocations) subById[sl.id] = sl;

  // Scope to this customer's non-cancelled sales; keep cancelled sales
  // out of the installment view (they're surfaced in Units/transactions
  // with an explicit cancelled badge already).
  const mineSales = sales.filter(s => s.customerId === customerId && s.saleStatus !== 'CANCELLED');
  const saleById: Record<string, Sale> = {};
  for (const s of mineSales) saleById[s.id] = s;

  // Bucket schedules by saleId.
  const bySale: Record<string, SaleSchedule[]> = {};
  for (const sch of schedules) {
    if (!saleById[sch.saleId]) continue;
    (bySale[sch.saleId] ||= []).push(sch);
  }

  const groups: CustomerScheduleGroup[] = [];
  for (const s of mineSales) {
    const rows = (bySale[s.id] || []).slice().sort(
      (a, b) => (a.installmentNo || 0) - (b.installmentNo || 0)
    );
    if (rows.length === 0) continue; // nothing to show
    const summary = buildSaleScheduleSummary(rows, now);
    const rowMeta: Record<string, { balance: number; isOverdue: boolean }> = {};
    for (const r of rows) {
      const bal = scheduleBalance(r);
      const isOpen = r.status === 'PENDING' || r.status === 'PARTIALLY_PAID';
      rowMeta[r.id] = {
        balance: bal,
        isOverdue: isOpen && isBefore(parseISO(r.dueDate), today),
      };
    }
    groups.push({
      saleId: s.id,
      unitName: subById[s.subLocationId]?.name || s.unitNameSnapshot || '—',
      projectName: projectById[s.projectId]?.name || '—',
      saleStatus: s.saleStatus,
      saleDate: s.saleDate,
      finalSaleValue: s.finalSaleValue || 0,
      schedules: rows,
      totalScheduled: summary.totalScheduled,
      totalPaid: summary.scheduledPaid,
      totalBalance: summary.scheduledBalance,
      totalOverdue: summary.overdueAmount,
      rowMeta,
    });
  }
  groups.sort((a, b) => (b.saleDate || '').localeCompare(a.saleDate || ''));
  return groups;
}
