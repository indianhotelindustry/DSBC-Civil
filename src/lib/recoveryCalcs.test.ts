import { describe, it, expect } from 'vitest';
import { subDays } from 'date-fns';
import type { Sale, SaleReceipt, Project, SubLocation } from '../types';
import {
  activeSales,
  activeReceipts,
  buildRecoverySummary,
  buildReceiptTrend,
  buildTrendStats,
  buildCustomerOutstanding,
  buildProjectRecovery,
} from './recoveryCalcs';

const TODAY = new Date('2026-04-22T00:00:00.000Z');
const iso = (d: Date) => d.toISOString();

function sale(over: Partial<Sale>): Sale {
  return {
    id: 's1', companyId: 'sipl', projectId: 'p1', subLocationId: 'u1', customerId: 'c1',
    saleDate: iso(TODAY),
    saleStatus: 'BOOKED',
    fundingModel: 'CASH',
    agreementValue: 100000, discountAmount: 0, finalSaleValue: 100000,
    bookingAmount: 10000, advanceAmount: 0, loanAmount: 0, selfFundingAmount: 90000,
    customerNameSnapshot: 'Rahul', unitNameSnapshot: 'Plot A',
    totalReceived: 0,
    createdAt: iso(TODAY), createdBy: 'u', updatedAt: iso(TODAY),
    ...over
  };
}
function receipt(over: Partial<SaleReceipt>): SaleReceipt {
  return {
    id: 'r1', saleId: 's1', amount: 10000,
    receivedAt: iso(TODAY), mode: 'BANK_TRANSFER',
    createdAt: iso(TODAY), createdBy: 'u',
    ...over
  };
}

// ── Primitive filters ───────────────────────────────────────────────

describe('activeSales / activeReceipts', () => {
  it('excludes CANCELLED sales from activeSales', () => {
    const sales = [
      sale({ id: 's1', saleStatus: 'BOOKED' }),
      sale({ id: 's2', saleStatus: 'SOLD' }),
      sale({ id: 's3', saleStatus: 'POSSESSION_GIVEN' }),
      sale({ id: 's4', saleStatus: 'CANCELLED' }),
    ];
    expect(activeSales(sales).map(s => s.id).sort()).toEqual(['s1', 's2', 's3']);
  });

  it('drops receipts whose sale is CANCELLED', () => {
    const sales = [
      sale({ id: 's1', saleStatus: 'BOOKED' }),
      sale({ id: 's2', saleStatus: 'CANCELLED' }),
    ];
    const receipts = [
      receipt({ id: 'r1', saleId: 's1' }),
      receipt({ id: 'r2', saleId: 's2' }),
      receipt({ id: 'r3', saleId: 'ghost' }),
    ];
    expect(activeReceipts(receipts, sales).map(r => r.id)).toEqual(['r1']);
  });
});

// ── Top-strip KPIs ──────────────────────────────────────────────────

describe('buildRecoverySummary', () => {
  it('excludes CANCELLED from all totals', () => {
    const sales = [
      sale({ id: 's1', finalSaleValue: 100000, totalReceived: 40000, saleStatus: 'BOOKED' }),
      sale({ id: 's2', finalSaleValue: 200000, totalReceived: 200000, saleStatus: 'SOLD' }),
      sale({ id: 's3', finalSaleValue: 50000,  totalReceived: 10000, saleStatus: 'CANCELLED' }),
    ];
    const r = buildRecoverySummary(sales);
    expect(r.totalSaleValue).toBe(300000);
    expect(r.totalReceived).toBe(240000);
    expect(r.netReceivable).toBe(60000);
    expect(r.overpaid).toBe(0);
    expect(r.unitsBooked).toBe(2);
    expect(r.unitsSold).toBe(1);
    expect(r.unitsPossession).toBe(0);
  });

  it('separates Net Receivable from Overpaid per-sale (never nets)', () => {
    const sales = [
      sale({ id: 's1', finalSaleValue: 100000, totalReceived: 60000, saleStatus: 'BOOKED' }),   // 40000 owed
      sale({ id: 's2', finalSaleValue: 100000, totalReceived: 130000, saleStatus: 'SOLD' }),    // 30000 overpaid
    ];
    const r = buildRecoverySummary(sales);
    // Total sale value = 200000, total received = 190000 — naive signed
    // subtraction would give 10000 receivable. We track them separately:
    expect(r.netReceivable).toBe(40000);
    expect(r.overpaid).toBe(30000);
  });

  it('counts possession-given units as both sold and possession', () => {
    const sales = [
      sale({ id: 's1', saleStatus: 'POSSESSION_GIVEN', totalReceived: 100000 }),
    ];
    const r = buildRecoverySummary(sales);
    expect(r.unitsBooked).toBe(1);
    expect(r.unitsSold).toBe(1);
    expect(r.unitsPossession).toBe(1);
  });

  it('caps roll-up recovery percentage at 100 even with overpayment', () => {
    const sales = [sale({ id: 's1', finalSaleValue: 100000, totalReceived: 150000, saleStatus: 'SOLD' })];
    expect(buildRecoverySummary(sales).recoveryPct).toBe(100);
  });

  it('returns zeros safely for an empty workspace', () => {
    const r = buildRecoverySummary([]);
    expect(r.totalSaleValue).toBe(0);
    expect(r.recoveryPct).toBe(0);
    expect(r.unitsBooked).toBe(0);
  });
});

// ── 30-day trend ────────────────────────────────────────────────────

describe('buildReceiptTrend', () => {
  it('buckets receipts by local day for the trailing N days and zeros the rest', () => {
    const sales = [sale({ id: 's1', saleStatus: 'BOOKED' })];
    const receipts = [
      receipt({ id: 'r1', saleId: 's1', amount: 5000, receivedAt: iso(TODAY) }),
      receipt({ id: 'r2', saleId: 's1', amount: 3000, receivedAt: iso(subDays(TODAY, 5)) }),
      receipt({ id: 'r3', saleId: 's1', amount: 7000, receivedAt: iso(TODAY) }), // same day
      receipt({ id: 'r4', saleId: 's1', amount: 9999, receivedAt: iso(subDays(TODAY, 45)) }), // outside window
    ];
    const trend = buildReceiptTrend(receipts, sales, 30, TODAY);
    expect(trend).toHaveLength(30);
    expect(trend[trend.length - 1].amount).toBe(5000 + 7000);
    expect(trend[trend.length - 6].amount).toBe(3000);
    // Beyond-window receipt must not appear anywhere
    const sum = trend.reduce((acc, p) => acc + p.amount, 0);
    expect(sum).toBe(5000 + 7000 + 3000);
  });

  it('ignores receipts on CANCELLED sales', () => {
    const sales = [sale({ id: 's1', saleStatus: 'CANCELLED' })];
    const receipts = [
      receipt({ id: 'r1', saleId: 's1', amount: 5000, receivedAt: iso(TODAY) }),
    ];
    const trend = buildReceiptTrend(receipts, sales, 30, TODAY);
    expect(trend.every(p => p.amount === 0)).toBe(true);
  });

  it('trend stats report total + avg-per-day over non-zero days only', () => {
    const trend = [
      { date: 'a', label: 'a', amount: 1000 },
      { date: 'b', label: 'b', amount: 0 },
      { date: 'c', label: 'c', amount: 3000 },
    ];
    const stats = buildTrendStats(trend);
    expect(stats.total).toBe(4000);
    expect(stats.daysWithReceipts).toBe(2);
    expect(stats.avgPerDay).toBe(2000);
  });
});

// ── Customer / Project rollups ──────────────────────────────────────

describe('buildCustomerOutstanding', () => {
  it('rolls up across a customer\'s active sales, labels extra units with +N, excludes CANCELLED', () => {
    const projects: Project[] = [
      { id: 'p1', name: 'Riverside', description: '', clientName: '', startDate: '', endDate: '', budget: 0, status: 'ACTIVE', createdAt: '', createdBy: '' },
    ];
    const subs: SubLocation[] = [
      { id: 'u1', companyId: 'sipl', projectId: 'p1', type: 'Plot', name: 'Plot 1', isActive: true, createdAt: '', createdBy: '' },
      { id: 'u2', companyId: 'sipl', projectId: 'p1', type: 'Plot', name: 'Plot 2', isActive: true, createdAt: '', createdBy: '' },
      { id: 'u3', companyId: 'sipl', projectId: 'p1', type: 'Plot', name: 'Plot 3', isActive: true, createdAt: '', createdBy: '' },
    ];
    const sales = [
      sale({ id: 's1', customerId: 'c1', subLocationId: 'u1', saleDate: '2026-01-01', finalSaleValue: 100000, totalReceived: 50000 }),
      sale({ id: 's2', customerId: 'c1', subLocationId: 'u2', saleDate: '2026-03-01', finalSaleValue: 150000, totalReceived: 100000 }),
      sale({ id: 's3', customerId: 'c1', subLocationId: 'u3', saleDate: '2026-02-01', finalSaleValue: 200000, totalReceived: 0, saleStatus: 'CANCELLED' }),
    ];
    const rows = buildCustomerOutstanding(sales, projects, subs);
    expect(rows).toHaveLength(1);
    const r = rows[0];
    expect(r.unitCount).toBe(2);                              // cancelled excluded
    expect(r.totalSaleValue).toBe(250000);
    expect(r.totalReceived).toBe(150000);
    expect(r.outstanding).toBe(100000);
    expect(r.overpaid).toBe(0);
    expect(r.unitLabel).toBe('Plot 2 +1');                    // primary is most-recent non-cancelled
    expect(r.recoveryPct).toBe(60);
  });

  it('sorts by outstanding desc and respects limit', () => {
    const sales = [
      sale({ id: 's1', customerId: 'cA', finalSaleValue: 100000, totalReceived: 10000 }), // 90k
      sale({ id: 's2', customerId: 'cB', finalSaleValue: 100000, totalReceived: 80000 }), // 20k
      sale({ id: 's3', customerId: 'cC', finalSaleValue: 100000, totalReceived: 50000 }), // 50k
    ];
    const rows = buildCustomerOutstanding(sales, [], [], 2);
    expect(rows.map(r => r.customerId)).toEqual(['cA', 'cC']);
  });
});

describe('buildProjectRecovery', () => {
  it('rolls up active sales per project and reports recovery %', () => {
    const projects: Project[] = [
      { id: 'p1', name: 'Riverside', description: '', clientName: '', startDate: '', endDate: '', budget: 0, status: 'ACTIVE', createdAt: '', createdBy: '' },
      { id: 'p2', name: 'Greens', description: '', clientName: '', startDate: '', endDate: '', budget: 0, status: 'ACTIVE', createdAt: '', createdBy: '' },
    ];
    const sales = [
      sale({ id: 's1', projectId: 'p1', finalSaleValue: 100000, totalReceived: 50000 }),
      sale({ id: 's2', projectId: 'p1', finalSaleValue: 200000, totalReceived: 200000, saleStatus: 'SOLD' }),
      sale({ id: 's3', projectId: 'p2', finalSaleValue: 50000,  totalReceived: 0, saleStatus: 'CANCELLED' }),
      sale({ id: 's4', projectId: 'p2', finalSaleValue: 80000,  totalReceived: 20000 }),
    ];
    const rows = buildProjectRecovery(sales, projects);
    const riverside = rows.find(r => r.projectId === 'p1')!;
    const greens = rows.find(r => r.projectId === 'p2')!;
    expect(riverside.unitsSold).toBe(2);
    expect(riverside.outstanding).toBe(50000);
    expect(riverside.recoveryPct).toBe(round2((250000 / 300000) * 100));
    expect(greens.unitsSold).toBe(1);                          // cancelled excluded
    expect(greens.outstanding).toBe(60000);
    expect(greens.totalSaleValue).toBe(80000);
  });
});

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
