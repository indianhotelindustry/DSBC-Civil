import { describe, it, expect } from 'vitest';
import { addDays, subDays } from 'date-fns';
import type { WorkOrder, Bill, Payment, Contractor } from '../types';
import {
  activeWorkOrders,
  activeBills,
  releasedBillPayments,
  totalPaidForWO,
  calculateContractorFinancials,
  calculateDashboardKPIs,
  woEffectiveValue,
  woGrossValue,
  woRemainingAmount,
  overdueAmount,
  overdueBillsList,
  payableInWindow,
  agingAnalysis,
  dueTodayAmount,
  dueTodayBillsList,
} from './financialCalcs';

// ---------- test-data builders ----------
// Fixed "today" used across all tests so results never shift with real-world time.
// All date-dependent helpers accept an injectable `today`/`now` so assertions
// remain stable regardless of when the suite is run.

const iso = (d: Date) => d.toISOString();
const TODAY = new Date('2026-04-19T00:00:00.000Z');
const today = TODAY;

function makeWO(overrides: Partial<WorkOrder> = {}): WorkOrder {
  return {
    id: 'wo1',
    woNumber: 'WO-001',
    projectId: 'p1',
    contractorId: 'c1',
    title: 'Test WO',
    description: 'd',
    amount: 100000,
    status: 'APPROVED',
    issueDate: iso(today),
    startDate: iso(today),
    endDate: iso(addDays(today, 30)),
    preparedBy: 'u1',
    scopeOfWork: 's',
    boqItems: [],
    financials: {
      totalAmount: 100000,
      advance: 0,
      subtotal: 100000,
      gstPercentage: 18,
      gstAmount: 18000,
      retentionPercentage: 5,
      retentionAmount: 5000,
      otherCharges: 0,
      grandTotal: 118000,
    },
    billing: { totalValue: 118000 },
    createdAt: iso(today),
    createdBy: 'u1',
    ...overrides,
  };
}

function makeBill(overrides: Partial<Bill> = {}): Bill {
  return {
    id: 'b1',
    billNumber: 'B-001',
    workOrderId: 'wo1',
    billDate: iso(today),
    workDoneAmount: 50000,
    previousBillAmount: 0,
    currentBillAmount: 50000,
    tdsPercentage: 0,
    tdsAmount: 0,
    retentionPercentage: 0,
    retentionAmount: 0,
    advanceAdjustment: 0,
    netPayable: 50000,
    status: 'APPROVED',
    createdAt: iso(today),
    createdBy: 'u1',
    ...overrides,
  };
}

function makePayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: 'pay1',
    billId: 'b1',
    amount: 25000,
    paymentDate: iso(today),
    paymentMethod: 'BANK',
    createdAt: iso(today),
    createdBy: 'u1',
    status: 'RELEASED',
    ...overrides,
  };
}

// ---------- primitive filters ----------

describe('activeWorkOrders', () => {
  it('excludes REJECTED, keeps PENDING/APPROVED/COMPLETED', () => {
    const wos: WorkOrder[] = [
      makeWO({ id: 'a', status: 'PENDING' }),
      makeWO({ id: 'b', status: 'APPROVED' }),
      makeWO({ id: 'c', status: 'COMPLETED' }),
      makeWO({ id: 'd', status: 'REJECTED' }),
    ];
    const active = activeWorkOrders(wos);
    expect(active.map(w => w.id).sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('activeBills', () => {
  it('excludes REJECTED; keeps all other statuses including PAID', () => {
    const bills: Bill[] = [
      makeBill({ id: 'b1', status: 'DRAFT' }),
      makeBill({ id: 'b2', status: 'APPROVED' }),
      makeBill({ id: 'b3', status: 'PAID' }),
      makeBill({ id: 'b4', status: 'REJECTED' }),
    ];
    expect(activeBills(bills).map(b => b.id).sort()).toEqual(['b1', 'b2', 'b3']);
  });
});

describe('releasedBillPayments', () => {
  it('keeps only RELEASED non-ADVANCE payments', () => {
    const payments: Payment[] = [
      makePayment({ id: 'p1', status: 'RELEASED', type: 'PAYMENT' }),
      makePayment({ id: 'p2', status: 'RELEASED', type: 'ADVANCE' }),
      makePayment({ id: 'p3', status: 'PENDING', type: 'PAYMENT' }),
      makePayment({ id: 'p4', status: 'APPROVED', type: 'PAYMENT' }),
      makePayment({ id: 'p5', status: 'RELEASED' }), // undefined type = bill payment
    ];
    const res = releasedBillPayments(payments);
    expect(res.map(p => p.id).sort()).toEqual(['p1', 'p5']);
  });
});

// ---------- per-entity ----------

describe('totalPaidForWO', () => {
  it('sums only released non-advance payments for bills on the WO, excluding rejected bills', () => {
    const wos = [makeWO({ id: 'wo1' })];
    const bills = [
      makeBill({ id: 'b1', workOrderId: 'wo1', status: 'APPROVED' }),
      makeBill({ id: 'b2', workOrderId: 'wo1', status: 'REJECTED' }),
      makeBill({ id: 'b3', workOrderId: 'other', status: 'APPROVED' }),
    ];
    const payments = [
      makePayment({ id: 'p1', billId: 'b1', amount: 10000, status: 'RELEASED' }),
      makePayment({ id: 'p2', billId: 'b1', amount: 5000, status: 'PENDING' }),         // not released
      makePayment({ id: 'p3', billId: 'b2', amount: 4000, status: 'RELEASED' }),        // rejected bill
      makePayment({ id: 'p4', billId: 'b3', amount: 7000, status: 'RELEASED' }),        // other WO
      makePayment({ id: 'p5', billId: 'wo1', amount: 9000, status: 'RELEASED', type: 'ADVANCE' }), // advance, not a bill-payment
    ];
    expect(totalPaidForWO('wo1', bills, payments)).toBe(10000);
    // Verify our WO builder returns the expected active WO list
    expect(activeWorkOrders(wos)).toHaveLength(1);
  });
});

// ---------- woEffectiveValue ----------

describe('woEffectiveValue', () => {
  it('prefers financials.grandTotal, falls back to amount for legacy WOs', () => {
    const withFinancials = makeWO({ amount: 100000 });
    expect(woEffectiveValue(withFinancials)).toBe(118000);

    const legacy = makeWO({
      amount: 75000,
      // Simulate legacy WO without financials — assert fallback
      financials: undefined as unknown as WorkOrder['financials'],
    });
    expect(woEffectiveValue(legacy)).toBe(75000);
  });
});

// ---------- woGrossValue ----------
// Distinct from woEffectiveValue: must return the BOQ gross (before
// advance / GST / retention / other-charges), which is what dashboards
// use for "Total Work Order Value" / commitment cards.
describe('woGrossValue', () => {
  it('returns financials.totalAmount (BOQ gross) when present — not grandTotal', () => {
    // Classic shape saved by the WO form: BOQ=21000, deductions bring
    // grandTotal down to 6800. Gross must read 21000, not 6800.
    const wo = makeWO({
      amount: 6800,
      financials: {
        totalAmount: 21000,
        advance: 10000,
        subtotal: 11000,
        gstPercentage: 0,
        gstAmount: 0,
        retentionPercentage: 20,
        retentionAmount: 4200,
        otherCharges: 0,
        grandTotal: 6800,
      },
    });
    expect(woGrossValue(wo)).toBe(21000);
    expect(woEffectiveValue(wo)).toBe(6800); // sanity: the two are distinct
  });

  it('falls back to sum of boqItems when financials.totalAmount is missing', () => {
    const wo = makeWO({
      financials: undefined as unknown as WorkOrder['financials'],
      boqItems: [
        { description: 'Labour', unit: 'Day', quantity: 10, rate: 1000, amount: 10000 },
        { description: 'Material', unit: 'LS', quantity: 1, rate: 5000, amount: 5000 },
      ],
    });
    expect(woGrossValue(wo)).toBe(15000);
  });

  it('falls back to wo.amount as last resort for pre-financials WOs', () => {
    const wo = makeWO({
      amount: 50000,
      financials: undefined as unknown as WorkOrder['financials'],
      boqItems: [],
    });
    expect(woGrossValue(wo)).toBe(50000);
  });

  it('returns 0 for a WO with no money signal at all', () => {
    const wo = makeWO({
      amount: 0,
      financials: undefined as unknown as WorkOrder['financials'],
      boqItems: [],
    });
    expect(woGrossValue(wo)).toBe(0);
  });
});

// ---------- woRemainingAmount ----------
// Counterpart to woGrossValue. Reads grandTotal — the post-deduction
// figure shown anywhere labelled "Remaining Amount" / "Net Payable".
describe('woRemainingAmount', () => {
  it('returns financials.grandTotal — distinct from woGrossValue on the same WO', () => {
    // Spec example: BOQ 21,000 / advance 10,000 / 20% retention →
    // remaining 6,800. Both helpers must read different sides.
    const wo = makeWO({
      amount: 6800,
      financials: {
        totalAmount: 21000,
        advance: 10000,
        subtotal: 11000,
        gstPercentage: 0,
        gstAmount: 0,
        retentionPercentage: 20,
        retentionAmount: 4200,
        otherCharges: 0,
        grandTotal: 6800,
      },
    });
    expect(woGrossValue(wo)).toBe(21000);
    expect(woRemainingAmount(wo)).toBe(6800);
  });

  it('falls back to wo.amount when financials is missing (legacy)', () => {
    const wo = makeWO({
      amount: 50000,
      financials: undefined as unknown as WorkOrder['financials'],
    });
    expect(woRemainingAmount(wo)).toBe(50000);
  });

  it('woEffectiveValue stays as a backward-compat alias of woRemainingAmount', () => {
    const wo = makeWO();
    expect(woEffectiveValue(wo)).toBe(woRemainingAmount(wo));
  });
});

// ---------- contractor aggregate ----------

describe('calculateContractorFinancials', () => {
  it('uses active bills only and subtracts released bill payments', () => {
    const contractor: Contractor = {
      id: 'c1', name: 'Acme', email: '', phone: '', address: '', trade: '',
      createdAt: iso(today), createdBy: 'u1',
    };
    const wos = [
      makeWO({ id: 'wo1', contractorId: 'c1' }),
      makeWO({ id: 'wo2', contractorId: 'c1', status: 'REJECTED' }), // excluded
      makeWO({ id: 'wo3', contractorId: 'other' }),                  // wrong contractor
    ];
    const bills = [
      makeBill({ id: 'b1', workOrderId: 'wo1', netPayable: 50000, status: 'APPROVED' }),
      makeBill({ id: 'b2', workOrderId: 'wo1', netPayable: 30000, status: 'REJECTED' }), // excluded
      makeBill({ id: 'b3', workOrderId: 'wo2', netPayable: 20000, status: 'APPROVED' }), // WO rejected
      makeBill({ id: 'b4', workOrderId: 'wo3', netPayable: 10000, status: 'APPROVED' }), // other contractor
    ];
    const payments = [
      makePayment({ id: 'p1', billId: 'b1', amount: 20000, status: 'RELEASED' }),
      makePayment({ id: 'p2', billId: 'b1', amount: 5000,  status: 'PENDING' }),        // not released
      makePayment({ id: 'p3', billId: 'b1', amount: 9000,  status: 'RELEASED', type: 'ADVANCE' }), // advance
    ];
    const r = calculateContractorFinancials(contractor, wos, bills, payments);
    expect(r.totalBilled).toBe(50000);
    expect(r.totalPaid).toBe(20000);
    expect(r.outstanding).toBe(30000);
  });
});

// ---------- dashboard KPIs ----------

describe('calculateDashboardKPIs', () => {
  it('Total WO Value includes PENDING; Approved Liability does not', () => {
    // Both KPIs now read GROSS BOQ (financials.totalAmount = 100,000
    // on the makeWO default), not the post-deduction grandTotal.
    const wos = [
      makeWO({ id: 'wo1', status: 'PENDING' }),
      makeWO({ id: 'wo2', status: 'APPROVED' }),
      makeWO({ id: 'wo3', status: 'COMPLETED' }),
      makeWO({ id: 'wo4', status: 'REJECTED' }), // excluded everywhere
    ];
    const k = calculateDashboardKPIs(wos, [], [], TODAY);
    expect(k.totalWorkOrderValue).toBe(100000 * 3);       // PENDING + APPROVED + COMPLETED, gross
    expect(k.totalApprovedLiability).toBe(100000 * 2);    // APPROVED + COMPLETED, gross
  });

  it('Overdue uses bills with billDate before today; excludes rejected/paid', () => {
    const wos = [makeWO()];
    const bills = [
      makeBill({ id: 'b1', billDate: iso(subDays(today, 5)), netPayable: 1000, status: 'APPROVED' }),
      makeBill({ id: 'b2', billDate: iso(subDays(today, 2)), netPayable: 2000, status: 'REJECTED' }), // excluded
      makeBill({ id: 'b3', billDate: iso(subDays(today, 1)), netPayable: 4000, status: 'PAID' }),     // excluded (pending filter)
      makeBill({ id: 'b4', billDate: iso(subDays(today, 3)), netPayable: 8000, status: 'PARTIALLY_PAID' }),
    ];
    const k = calculateDashboardKPIs(wos, bills, [], TODAY);
    expect(k.overduePayments).toBe(1000 + 8000);
  });

  it('Advance outstanding counts released ADVANCE payments and does not reduce bill liability', () => {
    const wos = [makeWO()];
    const bills = [makeBill({ id: 'b1', netPayable: 50000, status: 'APPROVED' })];
    const payments = [
      makePayment({ id: 'p1', billId: 'b1', amount: 20000, status: 'RELEASED', type: 'PAYMENT' }),
      makePayment({ id: 'p2', billId: 'wo1', amount: 15000, status: 'RELEASED', type: 'ADVANCE' }),
      makePayment({ id: 'p3', billId: 'wo1', amount: 9000,  status: 'PENDING',  type: 'ADVANCE' }), // not released
    ];
    const k = calculateDashboardKPIs(wos, bills, payments, TODAY);
    expect(k.totalBilledAmount).toBe(50000);
    expect(k.totalPaidAmount).toBe(20000);              // ADVANCE NOT counted here
    expect(k.outstandingPayable).toBe(30000);
    expect(k.advanceOutstanding).toBe(15000);           // only released advances
  });

  it('handles legacy WO without financials — falls back to amount for gross', () => {
    // Legacy WO (no financials) contributes wo.amount; modern WO
    // contributes financials.totalAmount = 100,000.
    const legacy = makeWO({
      id: 'legacy',
      status: 'APPROVED',
      amount: 42000,
      financials: undefined as unknown as WorkOrder['financials'],
    });
    const modern = makeWO({ id: 'modern', status: 'APPROVED' });
    const k = calculateDashboardKPIs([legacy, modern], [], [], TODAY);
    expect(k.totalWorkOrderValue).toBe(42000 + 100000);
    expect(k.totalApprovedLiability).toBe(42000 + 100000);
  });

  it('unbilled liability = total WO value (gross) - total billed', () => {
    const wos = [makeWO({ id: 'wo1', status: 'APPROVED' })];
    const bills = [makeBill({ workOrderId: 'wo1', netPayable: 40000, status: 'APPROVED' })];
    const k = calculateDashboardKPIs(wos, bills, [], TODAY);
    expect(k.unbilledLiability).toBe(100000 - 40000);
  });
});

// ---------- date-dependent helpers (with injectable today) ----------

describe('overdueAmount / overdueBillsList (with injected today)', () => {
  const bills = [
    makeBill({ id: 'b1', billDate: iso(subDays(TODAY, 10)), netPayable: 1000, status: 'APPROVED' }),
    makeBill({ id: 'b2', billDate: iso(subDays(TODAY, 1)),  netPayable: 2000, status: 'VERIFIED' }),
    makeBill({ id: 'b3', billDate: iso(TODAY),              netPayable: 3000, status: 'APPROVED' }),   // today, not overdue
    makeBill({ id: 'b4', billDate: iso(addDays(TODAY, 5)),  netPayable: 4000, status: 'APPROVED' }),   // future
    makeBill({ id: 'b5', billDate: iso(subDays(TODAY, 5)),  netPayable: 5000, status: 'REJECTED' }),   // excluded
    makeBill({ id: 'b6', billDate: iso(subDays(TODAY, 5)),  netPayable: 6000, status: 'PAID' }),       // excluded (pending filter)
  ];

  it('overdueAmount sums only pending bills dated strictly before injected today', () => {
    expect(overdueAmount(bills, TODAY)).toBe(1000 + 2000);
  });

  it('overdueBillsList returns only the overdue pending bills', () => {
    expect(overdueBillsList(bills, TODAY).map(b => b.id).sort()).toEqual(['b1', 'b2']);
  });

  it('shifting the injected today moves the overdue boundary', () => {
    // Pretend it is 7 days later. Relative to later:
    //   b1 (-17d), b2 (-8d), b3 (-7d), b4 (-2d) all become overdue.
    //   b5 REJECTED and b6 PAID remain excluded by the pending filter.
    const later = addDays(TODAY, 7);
    expect(overdueBillsList(bills, later).map(b => b.id).sort()).toEqual(['b1', 'b2', 'b3', 'b4']);
  });
});

describe('payableInWindow (already date-explicit)', () => {
  it('sums pending bills with billDate inside [start, end]', () => {
    const bills = [
      makeBill({ id: 'b1', billDate: iso(TODAY),             netPayable: 1000, status: 'APPROVED' }),
      makeBill({ id: 'b2', billDate: iso(addDays(TODAY, 3)), netPayable: 2000, status: 'APPROVED' }),
      makeBill({ id: 'b3', billDate: iso(addDays(TODAY, 8)), netPayable: 4000, status: 'APPROVED' }), // outside 7-day window
      makeBill({ id: 'b4', billDate: iso(addDays(TODAY, 2)), netPayable: 8000, status: 'REJECTED' }), // excluded
    ];
    const sum = payableInWindow(bills, TODAY, addDays(TODAY, 7));
    expect(sum).toBe(1000 + 2000);
  });
});

describe('dueTodayAmount / dueTodayBillsList (with injected today)', () => {
  const bills = [
    makeBill({ id: 'b1', billDate: iso(subDays(TODAY, 1)), netPayable: 1000, status: 'APPROVED' }), // overdue
    makeBill({ id: 'b2', billDate: iso(TODAY),             netPayable: 2000, status: 'APPROVED' }), // due today
    makeBill({ id: 'b3', billDate: iso(TODAY),             netPayable: 3000, status: 'VERIFIED' }), // due today
    makeBill({ id: 'b4', billDate: iso(TODAY),             netPayable: 4000, status: 'REJECTED' }), // excluded
    makeBill({ id: 'b5', billDate: iso(TODAY),             netPayable: 5000, status: 'PAID' }),     // excluded (pending)
    makeBill({ id: 'b6', billDate: iso(addDays(TODAY, 1)), netPayable: 6000, status: 'APPROVED' }), // upcoming
  ];

  it('classifies bills dated today as due-today (distinct from overdue and upcoming)', () => {
    expect(dueTodayBillsList(bills, TODAY).map(b => b.id).sort()).toEqual(['b2', 'b3']);
    expect(dueTodayAmount(bills, TODAY)).toBe(2000 + 3000);
  });

  it('due-today and overdue are mutually exclusive for the same bill set', () => {
    const overdueIds = overdueBillsList(bills, TODAY).map(b => b.id);
    const dueTodayIds = dueTodayBillsList(bills, TODAY).map(b => b.id);
    const intersection = overdueIds.filter(id => dueTodayIds.includes(id));
    expect(intersection).toEqual([]);
  });

  it('calculateDashboardKPIs exposes dueToday separately from overduePayments', () => {
    const wos = [makeWO()];
    const k = calculateDashboardKPIs(wos, bills, [], TODAY);
    expect(k.dueToday).toBe(2000 + 3000);
    expect(k.overduePayments).toBe(1000);
    // Next 7 Days is a wider window that includes today + upcoming (but not overdue).
    expect(k.payable7Days).toBe(2000 + 3000 + 6000);
  });
});

describe('agingAnalysis (with injected today)', () => {
  it('groups pending bills into 0-30 / 31-60 / 61-90 / 90+ buckets relative to injected today', () => {
    const bills = [
      makeBill({ id: 'b1', billDate: iso(subDays(TODAY, 10)),  netPayable: 1000, status: 'APPROVED' }),
      makeBill({ id: 'b2', billDate: iso(subDays(TODAY, 45)),  netPayable: 2000, status: 'APPROVED' }),
      makeBill({ id: 'b3', billDate: iso(subDays(TODAY, 75)),  netPayable: 4000, status: 'APPROVED' }),
      makeBill({ id: 'b4', billDate: iso(subDays(TODAY, 120)), netPayable: 8000, status: 'APPROVED' }),
      makeBill({ id: 'b5', billDate: iso(subDays(TODAY, 20)),  netPayable: 9000, status: 'REJECTED' }), // excluded
    ];
    const buckets = agingAnalysis(bills, TODAY);
    const byRange = Object.fromEntries(buckets.map(b => [b.range, b.amount]));
    expect(byRange['0-30']).toBe(1000);
    expect(byRange['31-60']).toBe(2000);
    expect(byRange['61-90']).toBe(4000);
    expect(byRange['90+']).toBe(8000);
  });
});
