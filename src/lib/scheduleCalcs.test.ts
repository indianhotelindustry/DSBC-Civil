import { describe, it, expect } from 'vitest';
import { addDays, subDays } from 'date-fns';
import type { SaleSchedule } from '../types';
import {
  deriveAutoStatus,
  scheduleBalance,
  scheduleOverpaid,
  buildWindowTotals,
  buildAgingBuckets,
  buildCollectionEfficiency,
  buildSaleScheduleSummary,
  openSchedules,
  computeAutoDistribution,
  resolveReceiptAllocations,
  summarizeAllocation,
  getReceiptAllocatedAmount,
  getReceiptUnappliedAmount,
} from './scheduleCalcs';

const TODAY = new Date('2026-04-22T00:00:00.000Z');
const iso = (d: Date) => d.toISOString();

function sch(over: Partial<SaleSchedule>): SaleSchedule {
  return {
    id: 'sch-1',
    saleId: 'sale-1',
    companyId: 'sipl',
    projectId: 'p1',
    subLocationId: 'u1',
    customerId: 'c1',
    installmentNo: 1,
    scheduleType: 'INSTALLMENT',
    dueDate: iso(TODAY),
    amount: 10000,
    status: 'PENDING',
    paidAmount: 0,
    balanceAmount: 10000,
    createdAt: iso(TODAY),
    createdBy: 'u',
    ...over,
  };
}

// ── Derivations ─────────────────────────────────────────────────────

describe('deriveAutoStatus', () => {
  it('returns PENDING when no payment recorded', () => {
    expect(deriveAutoStatus(10000, 0)).toBe('PENDING');
  });
  it('returns PARTIALLY_PAID when some payment recorded', () => {
    expect(deriveAutoStatus(10000, 4000)).toBe('PARTIALLY_PAID');
  });
  it('returns PAID when paidAmount >= amount (exact or overpay)', () => {
    expect(deriveAutoStatus(10000, 10000)).toBe('PAID');
    expect(deriveAutoStatus(10000, 12000)).toBe('PAID');
  });
});

describe('scheduleBalance / scheduleOverpaid', () => {
  it('balance is floored at 0 on overpayment', () => {
    expect(scheduleBalance(sch({ amount: 10000, paidAmount: 12000 }))).toBe(0);
  });
  it('overpaid is the excess over amount', () => {
    expect(scheduleOverpaid(sch({ amount: 10000, paidAmount: 12000 }))).toBe(2000);
  });
  it('balance and overpaid are mutually exclusive per schedule', () => {
    const a = sch({ amount: 10000, paidAmount: 4000 });
    const b = sch({ amount: 10000, paidAmount: 12000 });
    expect(scheduleBalance(a)).toBe(6000); expect(scheduleOverpaid(a)).toBe(0);
    expect(scheduleBalance(b)).toBe(0);     expect(scheduleOverpaid(b)).toBe(2000);
  });
});

describe('openSchedules', () => {
  it('keeps PENDING and PARTIALLY_PAID only', () => {
    const schs = [
      sch({ id: 'a', status: 'PENDING' }),
      sch({ id: 'b', status: 'PARTIALLY_PAID' }),
      sch({ id: 'c', status: 'PAID' }),
      sch({ id: 'd', status: 'WAIVED' }),
      sch({ id: 'e', status: 'CANCELLED' }),
    ];
    expect(openSchedules(schs).map(s => s.id).sort()).toEqual(['a', 'b']);
  });
});

// ── Window totals ───────────────────────────────────────────────────

describe('buildWindowTotals', () => {
  it('buckets overdue / today / next-7 / next-30 correctly on open schedules only', () => {
    const schs = [
      sch({ id: 'a', dueDate: iso(subDays(TODAY, 5)), balanceAmount: 1000, amount: 1000, paidAmount: 0 }), // overdue
      sch({ id: 'b', dueDate: iso(TODAY),             balanceAmount: 2000, amount: 2000, paidAmount: 0 }), // today
      sch({ id: 'c', dueDate: iso(addDays(TODAY, 3)), balanceAmount: 4000, amount: 4000, paidAmount: 0 }), // next 7 + next 30
      sch({ id: 'd', dueDate: iso(addDays(TODAY, 20)), balanceAmount: 8000, amount: 8000, paidAmount: 0 }), // next 30 only
      sch({ id: 'e', dueDate: iso(addDays(TODAY, 40)), balanceAmount: 5000, amount: 5000, paidAmount: 0 }), // outside
      sch({ id: 'f', dueDate: iso(TODAY), status: 'PAID', balanceAmount: 0, paidAmount: 999 }),            // excluded
      sch({ id: 'g', dueDate: iso(subDays(TODAY, 10)), status: 'WAIVED', balanceAmount: 999 }),            // excluded
    ];
    const t = buildWindowTotals(schs, TODAY);
    expect(t.overdue).toBe(1000);
    expect(t.dueToday).toBe(2000);
    expect(t.dueNext7Days).toBe(4000);
    expect(t.dueNext30Days).toBe(4000 + 8000);
  });
});

// ── Aging buckets ───────────────────────────────────────────────────

describe('buildAgingBuckets', () => {
  it('distributes open schedule balances across the six buckets', () => {
    const schs = [
      sch({ id: 'upcoming', dueDate: iso(addDays(TODAY, 10)), balanceAmount: 1000, amount: 1000 }),
      sch({ id: 'today', dueDate: iso(TODAY), balanceAmount: 2000, amount: 2000 }),
      sch({ id: '1-30', dueDate: iso(subDays(TODAY, 15)), balanceAmount: 3000, amount: 3000 }),
      sch({ id: '31-60', dueDate: iso(subDays(TODAY, 45)), balanceAmount: 4000, amount: 4000 }),
      sch({ id: '61-90', dueDate: iso(subDays(TODAY, 75)), balanceAmount: 5000, amount: 5000 }),
      sch({ id: '90+', dueDate: iso(subDays(TODAY, 120)), balanceAmount: 6000, amount: 6000 }),
      sch({ id: 'paid', status: 'PAID', dueDate: iso(subDays(TODAY, 45)), balanceAmount: 0, paidAmount: 999 }), // excluded
    ];
    const buckets = buildAgingBuckets(schs, TODAY);
    const byLabel = Object.fromEntries(buckets.map(b => [b.label, b.amount]));
    expect(byLabel['Upcoming']).toBe(1000);
    expect(byLabel['Due Today']).toBe(2000);
    expect(byLabel['1–30 days']).toBe(3000);
    expect(byLabel['31–60 days']).toBe(4000);
    expect(byLabel['61–90 days']).toBe(5000);
    expect(byLabel['90+ days']).toBe(6000);
  });
  it('returns a stable 6-element array in display order even when all buckets are empty', () => {
    const buckets = buildAgingBuckets([], TODAY);
    expect(buckets.map(b => b.label)).toEqual([
      'Upcoming', 'Due Today', '1–30 days', '31–60 days', '61–90 days', '90+ days'
    ]);
    expect(buckets.every(b => b.amount === 0 && b.count === 0)).toBe(true);
  });
});

// ── Collection efficiency ───────────────────────────────────────────

describe('buildCollectionEfficiency', () => {
  it('computes received-to-date vs due-to-date and caps at 100%', () => {
    const schs = [
      sch({ id: 'a', dueDate: iso(subDays(TODAY, 10)), amount: 10000, paidAmount: 10000 }), // fully paid, due past
      sch({ id: 'b', dueDate: iso(subDays(TODAY, 5)),  amount: 20000, paidAmount: 8000 }),  // partial
      sch({ id: 'c', dueDate: iso(addDays(TODAY, 5)),  amount: 50000, paidAmount: 0 }),     // not due yet, excluded
      sch({ id: 'd', status: 'WAIVED', dueDate: iso(subDays(TODAY, 1)), amount: 9000 }),    // excluded
    ];
    const e = buildCollectionEfficiency(schs, TODAY);
    expect(e.dueToDate).toBe(30000);
    expect(e.receivedToDate).toBe(18000);
    expect(e.percent).toBe(60);
    expect(e.scheduleCount).toBe(2);
  });
  it('caps received-to-date at amount per schedule (overpay does not inflate)', () => {
    const schs = [
      sch({ id: 'a', dueDate: iso(subDays(TODAY, 1)), amount: 10000, paidAmount: 15000 }),
    ];
    const e = buildCollectionEfficiency(schs, TODAY);
    expect(e.receivedToDate).toBe(10000);
    expect(e.percent).toBe(100);
  });
  it('returns 0% when no schedules are due yet', () => {
    const schs = [sch({ dueDate: iso(addDays(TODAY, 5)), amount: 10000 })];
    const e = buildCollectionEfficiency(schs, TODAY);
    expect(e.dueToDate).toBe(0);
    expect(e.percent).toBe(0);
  });
});

// ── Per-sale summary ────────────────────────────────────────────────

describe('buildSaleScheduleSummary', () => {
  it('excludes WAIVED and CANCELLED from totals but counts them', () => {
    const schs = [
      sch({ id: 'a', amount: 10000, paidAmount: 3000 }),
      sch({ id: 'b', amount: 20000, paidAmount: 20000, status: 'PAID' }),
      sch({ id: 'c', amount: 30000, paidAmount: 0, status: 'WAIVED' }),
      sch({ id: 'd', amount: 40000, paidAmount: 0, status: 'CANCELLED' }),
    ];
    const s = buildSaleScheduleSummary(schs, TODAY);
    expect(s.totalScheduled).toBe(30000);        // 10000 + 20000 only
    expect(s.scheduledPaid).toBe(23000);
    expect(s.scheduledBalance).toBe(7000);       // (10000-3000) + (20000-20000)
    expect(s.counts).toEqual({ active: 1, paid: 1, waived: 1, cancelled: 1 });
  });

  it('overdue amount covers open schedules with dueDate < today', () => {
    const schs = [
      sch({ id: 'a', dueDate: iso(subDays(TODAY, 5)), amount: 10000, paidAmount: 3000 }), // 7000 overdue
      sch({ id: 'b', dueDate: iso(TODAY),              amount: 5000,  paidAmount: 0 }),    // not overdue
      sch({ id: 'c', dueDate: iso(subDays(TODAY, 1)),  amount: 4000,  paidAmount: 4000, status: 'PAID' }), // paid, excluded
    ];
    const s = buildSaleScheduleSummary(schs, TODAY);
    expect(s.overdueAmount).toBe(7000);
  });

  it('deltaVsSaleValue surfaces schedule vs sale-total mismatch', () => {
    const schs = [sch({ amount: 100000 }), sch({ id: 'b', amount: 50000 })];
    const s = buildSaleScheduleSummary(schs, TODAY);
    expect(s.totalScheduled).toBe(150000);
    expect(s.deltaVsSaleValue(100000)).toBe(50000); // schedules exceed sale value
    expect(s.deltaVsSaleValue(200000)).toBe(-50000); // schedules short of sale value
    expect(s.deltaVsSaleValue(150000)).toBe(0);      // exact match
  });
});

// ── Auto-distribute ─────────────────────────────────────────────────

describe('computeAutoDistribution', () => {
  it('distributes a lump sum across open schedules in dueDate order', () => {
    const schs = [
      sch({ id: 'b', dueDate: iso(addDays(TODAY, 10)), amount: 20000, paidAmount: 0, balanceAmount: 20000 }),
      sch({ id: 'a', dueDate: iso(addDays(TODAY, 5)),  amount: 10000, paidAmount: 0, balanceAmount: 10000 }),
      sch({ id: 'c', dueDate: iso(addDays(TODAY, 20)), amount: 30000, paidAmount: 0, balanceAmount: 30000 }),
    ];
    const result = computeAutoDistribution(40000, schs);
    // a (5 days out) gets 10k, b (10 days out) gets 20k, c gets the rest (10k).
    expect(result.allocations).toEqual([
      { scheduleId: 'a', amount: 10000 },
      { scheduleId: 'b', amount: 20000 },
      { scheduleId: 'c', amount: 10000 },
    ]);
    expect(result.remainder).toBe(0);
  });

  it('breaks ties on identical dueDate by installmentNo ascending', () => {
    const sameDay = iso(addDays(TODAY, 3));
    const schs = [
      sch({ id: 'hi', installmentNo: 3, dueDate: sameDay, amount: 5000, balanceAmount: 5000 }),
      sch({ id: 'lo', installmentNo: 2, dueDate: sameDay, amount: 5000, balanceAmount: 5000 }),
    ];
    const result = computeAutoDistribution(5000, schs);
    expect(result.allocations).toEqual([{ scheduleId: 'lo', amount: 5000 }]);
  });

  it('breaks remaining ties on createdAt ascending (oldest row wins FIFO)', () => {
    // Same dueDate AND same installmentNo — only createdAt can decide.
    // Rare in practice but possible across recreated rows; pinning the
    // sort here keeps auto-distribute deterministic under that edge.
    const sameDay = iso(addDays(TODAY, 3));
    const schs = [
      sch({ id: 'newer', installmentNo: 5, dueDate: sameDay, createdAt: iso(addDays(TODAY, 2)), amount: 5000, balanceAmount: 5000 }),
      sch({ id: 'older', installmentNo: 5, dueDate: sameDay, createdAt: iso(TODAY),             amount: 5000, balanceAmount: 5000 }),
    ];
    const result = computeAutoDistribution(5000, schs);
    expect(result.allocations).toEqual([{ scheduleId: 'older', amount: 5000 }]);
  });

  it('skips PAID / WAIVED / CANCELLED and records remainder when amount > total open balance', () => {
    const schs = [
      sch({ id: 'paid',    status: 'PAID',      amount: 10000, paidAmount: 10000, balanceAmount: 0 }),
      sch({ id: 'waived',  status: 'WAIVED',    amount: 10000, paidAmount: 0,     balanceAmount: 0 }),
      sch({ id: 'cancel',  status: 'CANCELLED', amount: 10000, paidAmount: 0,     balanceAmount: 0 }),
      sch({ id: 'open',    dueDate: iso(TODAY), amount: 3000,  paidAmount: 0,     balanceAmount: 3000 }),
    ];
    const result = computeAutoDistribution(10000, schs);
    expect(result.allocations).toEqual([{ scheduleId: 'open', amount: 3000 }]);
    expect(result.remainder).toBe(7000);
  });

  it('fills a partial schedule up to its balance exactly once', () => {
    const schs = [
      sch({ id: 'a', dueDate: iso(TODAY), amount: 10000, paidAmount: 6000, balanceAmount: 4000, status: 'PARTIALLY_PAID' }),
    ];
    const result = computeAutoDistribution(10000, schs);
    expect(result.allocations).toEqual([{ scheduleId: 'a', amount: 4000 }]);
    expect(result.remainder).toBe(6000);
  });

  it('returns empty when amount is zero or negative', () => {
    const schs = [sch({ id: 'a', balanceAmount: 10000 })];
    expect(computeAutoDistribution(0, schs)).toEqual({ allocations: [], remainder: 0 });
    expect(computeAutoDistribution(-100, schs)).toEqual({ allocations: [], remainder: 0 });
  });
});

describe('resolveReceiptAllocations', () => {
  it('prefers allocations array over linkedScheduleId', () => {
    const list = resolveReceiptAllocations({
      amount: 100,
      allocations: [{ scheduleId: 'a', amount: 40 }, { scheduleId: 'b', amount: 60 }],
      linkedScheduleId: 'ignored',
    });
    expect(list).toEqual([{ scheduleId: 'a', amount: 40 }, { scheduleId: 'b', amount: 60 }]);
  });

  it('falls back to linkedScheduleId for Phase 2A receipts', () => {
    const list = resolveReceiptAllocations({ amount: 5000, linkedScheduleId: 'sch-legacy' });
    expect(list).toEqual([{ scheduleId: 'sch-legacy', amount: 5000 }]);
  });

  it('returns empty for unallocated receipts', () => {
    expect(resolveReceiptAllocations({ amount: 100 })).toEqual([]);
    expect(resolveReceiptAllocations({ amount: 100, allocations: [] })).toEqual([]);
  });
});

// ── Allocation summary (Phase 2B alignment) ─────────────────────────

describe('summarizeAllocation', () => {
  it('echoes the caller-declared mode and totals the allocations', () => {
    const s = summarizeAllocation(
      10000,
      [{ scheduleId: 'a', amount: 4000 }, { scheduleId: 'b', amount: 6000 }],
      'AUTO'
    );
    expect(s).toEqual({ allocationMode: 'AUTO', allocatedAmount: 10000, unappliedAmount: 0 });
  });

  it('records unapplied amount when allocations sum is less than the receipt', () => {
    const s = summarizeAllocation(
      10000,
      [{ scheduleId: 'a', amount: 3000 }],
      'SPECIFIC'
    );
    expect(s).toEqual({ allocationMode: 'SPECIFIC', allocatedAmount: 3000, unappliedAmount: 7000 });
  });

  it('marks unallocated receipts with zeros on both allocation fields', () => {
    const s = summarizeAllocation(5000, [], 'UNALLOCATED');
    expect(s).toEqual({ allocationMode: 'UNALLOCATED', allocatedAmount: 0, unappliedAmount: 5000 });
  });

  it('clamps negative receipt amounts and floors unapplied at zero', () => {
    const s = summarizeAllocation(-100, [], 'UNALLOCATED');
    expect(s).toEqual({ allocationMode: 'UNALLOCATED', allocatedAmount: 0, unappliedAmount: 0 });
  });
});

describe('getReceiptAllocatedAmount / getReceiptUnappliedAmount (legacy reads)', () => {
  it('prefers the explicit allocatedAmount field when the writer persisted it', () => {
    const r = {
      amount: 10000,
      allocations: [{ scheduleId: 'a', amount: 4000 }],
      allocatedAmount: 4000,
      unappliedAmount: 6000,
    };
    expect(getReceiptAllocatedAmount(r)).toBe(4000);
    expect(getReceiptUnappliedAmount(r)).toBe(6000);
  });

  it('falls back to summing allocations[] when explicit fields are absent', () => {
    // Legacy Phase 2B receipt written before alignment: allocations[]
    // exists but the denormalized fields do not.
    const r = {
      amount: 10000,
      allocations: [{ scheduleId: 'a', amount: 4000 }, { scheduleId: 'b', amount: 3000 }],
    };
    expect(getReceiptAllocatedAmount(r)).toBe(7000);
    expect(getReceiptUnappliedAmount(r)).toBe(3000);
  });

  it('treats legacy linkedScheduleId receipts as fully allocated', () => {
    // Phase 2A receipt: one schedule link, entire amount is applied.
    const r = { amount: 5000, linkedScheduleId: 'sch-legacy' };
    expect(getReceiptAllocatedAmount(r)).toBe(5000);
    expect(getReceiptUnappliedAmount(r)).toBe(0);
  });

  it('returns zeros for receipts with no allocation signal at all', () => {
    const r = { amount: 1500 };
    expect(getReceiptAllocatedAmount(r)).toBe(0);
    expect(getReceiptUnappliedAmount(r)).toBe(1500);
  });
});
