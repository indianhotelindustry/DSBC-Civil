import { describe, it, expect } from 'vitest';
import { addDays, subDays } from 'date-fns';
import type { Sale, SaleReceipt, SaleSchedule, Project, SubLocation } from '../types';
import {
  buildCustomerSummary,
  buildUnitBreakdown,
  buildTransactionStream,
  buildCustomerSchedules,
} from './customerLedgerCalcs';

const CID = 'cust-1';

function sale(overrides: Partial<Sale>): Sale {
  return {
    id: overrides.id || 'sale-1',
    companyId: 'sipl',
    projectId: 'p1',
    subLocationId: 'u1',
    customerId: CID,
    saleDate: '2026-01-15',
    saleStatus: 'BOOKED',
    fundingModel: 'CASH',
    agreementValue: 1000000,
    discountAmount: 0,
    finalSaleValue: 1000000,
    bookingAmount: 100000,
    advanceAmount: 0,
    loanAmount: 0,
    selfFundingAmount: 900000,
    customerNameSnapshot: 'Rahul Sharma',
    unitNameSnapshot: 'Plot 1A',
    totalReceived: 0,
    createdAt: '2026-01-15T00:00:00.000Z',
    createdBy: 'u1',
    ...overrides
  };
}

function receipt(overrides: Partial<SaleReceipt>): SaleReceipt {
  return {
    id: overrides.id || 'r1',
    saleId: overrides.saleId || 'sale-1',
    amount: overrides.amount ?? 100000,
    receivedAt: overrides.receivedAt || '2026-01-20T00:00:00.000Z',
    mode: overrides.mode || 'BANK_TRANSFER',
    reference: overrides.reference,
    remarks: overrides.remarks,
    createdAt: overrides.createdAt || '2026-01-20T00:00:00.000Z',
    createdBy: 'u1'
  };
}

// ── Summary ──────────────────────────────────────────────────────────

describe('buildCustomerSummary', () => {
  it('returns zeros when customer has no sales', () => {
    const r = buildCustomerSummary(CID, []);
    expect(r.totalSaleValue).toBe(0);
    expect(r.totalReceived).toBe(0);
    expect(r.outstanding).toBe(0);
    expect(r.overpaidAmount).toBe(0);
    expect(r.unitsBooked).toBe(0);
    expect(r.unitsSold).toBe(0);
    expect(r.cancelledCount).toBe(0);
  });

  it('sums active sales only; excludes cancelled from headline totals', () => {
    const sales = [
      sale({ id: 's1', finalSaleValue: 1000000, totalReceived: 400000, saleStatus: 'BOOKED' }),
      sale({ id: 's2', finalSaleValue: 1500000, totalReceived: 1500000, saleStatus: 'SOLD' }),
      sale({ id: 's3', finalSaleValue: 800000, totalReceived: 300000, saleStatus: 'CANCELLED' }),
    ];
    const r = buildCustomerSummary(CID, sales);
    expect(r.totalSaleValue).toBe(2500000);     // excludes cancelled
    expect(r.totalReceived).toBe(1900000);      // excludes cancelled
    expect(r.outstanding).toBe(600000);
    expect(r.overpaidAmount).toBe(0);
    expect(r.unitsBooked).toBe(2);              // BOOKED + SOLD
    expect(r.unitsSold).toBe(1);                // SOLD only
    expect(r.cancelledCount).toBe(1);
    expect(r.receivedOnCancelled).toBe(300000); // money paid before cancellation
  });

  it('counts possession-given units as booked and sold', () => {
    const sales = [
      sale({ id: 's1', saleStatus: 'POSSESSION_GIVEN', totalReceived: 1000000 }),
    ];
    const r = buildCustomerSummary(CID, sales);
    expect(r.unitsBooked).toBe(1);
    expect(r.unitsSold).toBe(1);
    expect(r.unitsPossession).toBe(1);
  });

  it('surfaces overpayment as overpaidAmount with outstanding == 0', () => {
    const sales = [
      sale({ id: 's1', finalSaleValue: 500000, totalReceived: 550000, saleStatus: 'SOLD' }),
    ];
    const r = buildCustomerSummary(CID, sales);
    expect(r.netOutstanding).toBe(-50000);
    expect(r.outstanding).toBe(0);
    expect(r.overpaidAmount).toBe(50000);
  });

  it('ignores sales belonging to other customers', () => {
    const sales = [
      sale({ id: 's1', customerId: CID, finalSaleValue: 100000, totalReceived: 50000 }),
      sale({ id: 's2', customerId: 'other', finalSaleValue: 9_000_000, totalReceived: 0 }),
    ];
    const r = buildCustomerSummary(CID, sales);
    expect(r.totalSaleValue).toBe(100000);
    expect(r.outstanding).toBe(50000);
  });
});

// ── Unit breakdown ──────────────────────────────────────────────────

describe('buildUnitBreakdown', () => {
  it('returns per-unit rows with outstanding, sorted by saleDate desc', () => {
    const projects: Project[] = [
      { id: 'p1', name: 'Riverside', description: '', clientName: '', startDate: '', endDate: '', budget: 0, status: 'ACTIVE', createdAt: '', createdBy: '' },
      { id: 'p2', name: 'Greens', description: '', clientName: '', startDate: '', endDate: '', budget: 0, status: 'ACTIVE', createdAt: '', createdBy: '' },
    ];
    const subs: SubLocation[] = [
      { id: 'u1', companyId: 'sipl', projectId: 'p1', type: 'Plot', name: 'Plot 1A', isActive: true, createdAt: '', createdBy: '' },
      { id: 'u2', companyId: 'sipl', projectId: 'p2', type: 'Duplex', name: 'Duplex D', isActive: true, createdAt: '', createdBy: '' },
    ];
    const sales = [
      sale({ id: 's1', subLocationId: 'u1', projectId: 'p1', saleDate: '2026-01-10', finalSaleValue: 500000, totalReceived: 200000 }),
      sale({ id: 's2', subLocationId: 'u2', projectId: 'p2', saleDate: '2026-02-20', finalSaleValue: 800000, totalReceived: 800000, saleStatus: 'SOLD' }),
    ];
    const rows = buildUnitBreakdown(CID, sales, projects, subs);
    expect(rows.map(r => r.saleId)).toEqual(['s2', 's1']);
    expect(rows[0].projectName).toBe('Greens');
    expect(rows[0].outstanding).toBe(0);
    expect(rows[1].outstanding).toBe(300000);
  });

  it('falls back to unitNameSnapshot when the SubLocation is missing', () => {
    const sales = [sale({ id: 's1', subLocationId: 'gone', unitNameSnapshot: 'Plot X' })];
    const rows = buildUnitBreakdown(CID, sales, [], []);
    expect(rows[0].unitName).toBe('Plot X');
  });
});

// ── Transaction stream ──────────────────────────────────────────────

describe('buildTransactionStream', () => {
  it('builds SALE + RECEIPT events sorted by date desc', () => {
    const sales = [
      sale({ id: 's1', saleDate: '2026-01-15', finalSaleValue: 100000 }),
    ];
    const receipts = [
      receipt({ id: 'r1', saleId: 's1', amount: 30000, receivedAt: '2026-01-20T00:00:00.000Z' }),
      receipt({ id: 'r2', saleId: 's1', amount: 70000, receivedAt: '2026-02-05T00:00:00.000Z' }),
    ];
    const stream = buildTransactionStream(CID, sales, receipts);
    expect(stream.map(t => t.kind)).toEqual(['RECEIPT', 'RECEIPT', 'SALE']);
    expect(stream[0].credit).toBe(70000);
    expect(stream[2].debit).toBe(100000);
  });

  it('emits a SALE_CANCELLED event when a sale is cancelled', () => {
    const sales = [
      sale({
        id: 's1',
        saleDate: '2026-01-15',
        finalSaleValue: 200000,
        saleStatus: 'CANCELLED',
        cancelledAt: '2026-03-01T00:00:00.000Z',
        cancelReason: 'Buyer withdrew'
      }),
    ];
    const stream = buildTransactionStream(CID, sales, []);
    expect(stream[0].kind).toBe('SALE_CANCELLED');
    expect(stream[0].description).toContain('Buyer withdrew');
    expect(stream[1].kind).toBe('SALE');
    // Cancelled event carries no debit/credit — Phase 2 does not auto-refund.
    expect(stream[0].debit).toBe(0);
    expect(stream[0].credit).toBe(0);
  });

  it('excludes receipts not belonging to this customer', () => {
    const sales = [sale({ id: 's1' })];
    const receipts = [
      receipt({ id: 'r-mine', saleId: 's1', amount: 100 }),
      receipt({ id: 'r-other', saleId: 'other-sale', amount: 999 }),
    ];
    const stream = buildTransactionStream(CID, sales, receipts);
    expect(stream.some(t => t.receiptId === 'r-other')).toBe(false);
    expect(stream.some(t => t.receiptId === 'r-mine')).toBe(true);
  });
});

// ── buildCustomerSchedules ──────────────────────────────────────────

const TODAY = new Date('2026-04-22T00:00:00.000Z');

function schedule(over: Partial<SaleSchedule>): SaleSchedule {
  return {
    id: 'sch-1',
    saleId: 'sale-1',
    companyId: 'sipl',
    projectId: 'p1',
    subLocationId: 'u1',
    customerId: CID,
    installmentNo: 1,
    scheduleType: 'INSTALLMENT',
    dueDate: TODAY.toISOString(),
    amount: 10000,
    status: 'PENDING',
    paidAmount: 0,
    balanceAmount: 10000,
    createdAt: TODAY.toISOString(),
    createdBy: 'u',
    ...over,
  };
}

describe('buildCustomerSchedules', () => {
  it('groups schedules by saleId, sorts installments ascending, sums non-cancelled totals', () => {
    const sales = [
      sale({ id: 's1', subLocationId: 'u1', projectId: 'p1', saleDate: '2026-02-01', finalSaleValue: 100000 }),
      sale({ id: 's2', subLocationId: 'u2', projectId: 'p2', saleDate: '2026-03-15', finalSaleValue: 50000 }),
    ];
    const projects: Project[] = [
      { id: 'p1', name: 'Riverside', description: '', clientName: '', startDate: '', endDate: '', budget: 0, status: 'ACTIVE', createdAt: '', createdBy: '' },
      { id: 'p2', name: 'Greens', description: '', clientName: '', startDate: '', endDate: '', budget: 0, status: 'ACTIVE', createdAt: '', createdBy: '' },
    ];
    const subs: SubLocation[] = [
      { id: 'u1', companyId: 'sipl', projectId: 'p1', type: 'Plot', name: 'Plot A', isActive: true, createdAt: '', createdBy: '' },
      { id: 'u2', companyId: 'sipl', projectId: 'p2', type: 'Plot', name: 'Plot B', isActive: true, createdAt: '', createdBy: '' },
    ];
    const schs = [
      schedule({ id: 'x', saleId: 's1', installmentNo: 2, amount: 40000, paidAmount: 20000, balanceAmount: 20000, status: 'PARTIALLY_PAID' }),
      schedule({ id: 'y', saleId: 's1', installmentNo: 1, amount: 60000, paidAmount: 60000, balanceAmount: 0,     status: 'PAID' }),
      schedule({ id: 'z', saleId: 's1', installmentNo: 3, amount: 10000, paidAmount: 0,     balanceAmount: 10000, status: 'CANCELLED' }), // excluded from totals
      schedule({ id: 'w', saleId: 's2', installmentNo: 1, amount: 50000, paidAmount: 0,     balanceAmount: 50000 }),
    ];
    const groups = buildCustomerSchedules(CID, sales, schs, projects, subs, TODAY);
    // Ordered by saleDate desc — s2 (Mar 15) first, then s1 (Feb 1).
    expect(groups.map(g => g.saleId)).toEqual(['s2', 's1']);
    const g1 = groups.find(g => g.saleId === 's1')!;
    expect(g1.unitName).toBe('Plot A');
    expect(g1.projectName).toBe('Riverside');
    // Installments sorted 1 → 2 → 3 even though input order was 2, 1, 3.
    expect(g1.schedules.map(s => s.installmentNo)).toEqual([1, 2, 3]);
    // Totals exclude CANCELLED row z.
    expect(g1.totalScheduled).toBe(100000);
    expect(g1.totalPaid).toBe(80000);
    expect(g1.totalBalance).toBe(20000);
  });

  it('excludes sales belonging to another customer and cancelled sales', () => {
    const sales = [
      sale({ id: 's1', customerId: CID }),
      sale({ id: 's2', customerId: 'other' }),
      sale({ id: 's3', customerId: CID, saleStatus: 'CANCELLED' }),
    ];
    const schs = [
      schedule({ id: 'a', saleId: 's1' }),
      schedule({ id: 'b', saleId: 's2' }),
      schedule({ id: 'c', saleId: 's3' }),
    ];
    const groups = buildCustomerSchedules(CID, sales, schs, [], [], TODAY);
    expect(groups.map(g => g.saleId)).toEqual(['s1']);
  });

  it('flags overdue rows via rowMeta (only for open schedules dated before today)', () => {
    const sales = [sale({ id: 's1' })];
    const schs = [
      schedule({ id: 'a', saleId: 's1', installmentNo: 1, dueDate: subDays(TODAY, 5).toISOString() }), // overdue
      schedule({ id: 'b', saleId: 's1', installmentNo: 2, dueDate: addDays(TODAY, 3).toISOString() }), // future
      schedule({ id: 'c', saleId: 's1', installmentNo: 3, dueDate: subDays(TODAY, 10).toISOString(), status: 'PAID', paidAmount: 10000, balanceAmount: 0 }), // past due but paid → not overdue
    ];
    const g = buildCustomerSchedules(CID, sales, schs, [], [], TODAY)[0];
    expect(g.rowMeta['a'].isOverdue).toBe(true);
    expect(g.rowMeta['b'].isOverdue).toBe(false);
    expect(g.rowMeta['c'].isOverdue).toBe(false);
    // Only the one open, past-due row contributes to the group's totalOverdue.
    expect(g.totalOverdue).toBe(10000);
  });

  it('omits sales that have no schedules so the section stays clean', () => {
    const sales = [sale({ id: 's1', customerId: CID })];
    const groups = buildCustomerSchedules(CID, sales, [], [], [], TODAY);
    expect(groups).toEqual([]);
  });
});
