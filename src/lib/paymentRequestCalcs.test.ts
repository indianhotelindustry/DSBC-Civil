import { describe, it, expect } from 'vitest';
import type { PaymentRequest, WorkOrder, Bill, Payment } from '../types';
import {
  getWOPlannedAdvance,
  getWOPaidAdvance,
  getWORequestedAmount,
  getWOAvailableRequestBalance,
  findBlockingAdvance,
  advanceStatusLabel,
  getTotalFinancialOutflow,
  getWOPaymentSummary,
} from './paymentRequestCalcs';

const iso = (d: Date) => d.toISOString();
const TODAY = new Date('2026-04-24T00:00:00.000Z');

function makeWO(over: Partial<WorkOrder> = {}): WorkOrder {
  return {
    id: 'wo1',
    woNumber: 'WO-001',
    projectId: 'p1',
    contractorId: 'c1',
    title: 'Test WO',
    description: 'd',
    amount: 6800,
    status: 'APPROVED',
    issueDate: iso(TODAY),
    startDate: iso(TODAY),
    endDate: iso(TODAY),
    preparedBy: 'u',
    scopeOfWork: 's',
    boqItems: [],
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
    billing: { totalValue: 6800 },
    createdAt: iso(TODAY),
    createdBy: 'u',
    ...over,
  };
}

function makeRequest(over: Partial<PaymentRequest>): PaymentRequest {
  return {
    id: 'pr-x',
    companyId: 'sipl',
    projectId: 'p1',
    workOrderId: 'wo1',
    contractorId: 'c1',
    type: 'ADVANCE',
    requestedAmount: 10000,
    requestedBy: 'u1',
    requestedAt: iso(TODAY),
    status: 'PENDING_APPROVAL',
    createdAt: iso(TODAY),
    createdBy: 'u1',
    ...over,
  };
}

// ── WO scalar helpers ───────────────────────────────────────────────

describe('getWOPlannedAdvance', () => {
  it('reads wo.financials.advance, defaults 0 when missing', () => {
    expect(getWOPlannedAdvance(makeWO())).toBe(10000);
    const noFinancials = makeWO({ financials: undefined as unknown as WorkOrder['financials'] });
    expect(getWOPlannedAdvance(noFinancials)).toBe(0);
  });
});

describe('getWOPaidAdvance', () => {
  it('sums PAID ADVANCE requests for the given WO', () => {
    const reqs: PaymentRequest[] = [
      makeRequest({ id: 'a1', type: 'ADVANCE', status: 'PAID', requestedAmount: 10000 }),
      makeRequest({ id: 'a2', type: 'PART', status: 'PAID', requestedAmount: 2000 }),     // ignored: not ADVANCE
      makeRequest({ id: 'a3', type: 'ADVANCE', status: 'APPROVED', requestedAmount: 3000 }), // ignored: not PAID
      makeRequest({ id: 'a4', type: 'ADVANCE', status: 'PAID', requestedAmount: 1500, workOrderId: 'wo2' }), // ignored: other WO
    ];
    expect(getWOPaidAdvance(reqs, 'wo1')).toBe(10000);
  });
});

// ── Ceiling / availability ──────────────────────────────────────────

describe('getWORequestedAmount + getWOAvailableRequestBalance', () => {
  it('sums non-REJECTED across all types and leaves the rest available', () => {
    const wo = makeWO(); // gross 21,000
    const reqs: PaymentRequest[] = [
      makeRequest({ id: 'a', type: 'ADVANCE', status: 'PAID', requestedAmount: 10000 }),
      makeRequest({ id: 'b', type: 'PART', status: 'APPROVED', requestedAmount: 4000 }),
      makeRequest({ id: 'c', type: 'PART', status: 'PENDING_APPROVAL', requestedAmount: 2000 }),
      makeRequest({ id: 'd', type: 'PART', status: 'REJECTED', requestedAmount: 5000 }), // ignored
    ];
    expect(getWORequestedAmount(reqs, 'wo1')).toBe(16000);
    expect(getWOAvailableRequestBalance(wo, reqs)).toBe(5000);
  });

  it('clamps available balance at zero when overspent', () => {
    const wo = makeWO(); // 21,000
    const reqs: PaymentRequest[] = [
      makeRequest({ id: 'x', type: 'PART', status: 'APPROVED', requestedAmount: 25000 }),
    ];
    expect(getWOAvailableRequestBalance(wo, reqs)).toBe(0);
  });
});

// ── ADVANCE duplicate guard ─────────────────────────────────────────

describe('findBlockingAdvance', () => {
  it('blocks when a PENDING_APPROVAL or APPROVED advance exists', () => {
    for (const status of ['PENDING_APPROVAL', 'APPROVED'] as const) {
      const reqs = [makeRequest({ type: 'ADVANCE', status })];
      expect(findBlockingAdvance(reqs, 'wo1')?.status).toBe(status);
    }
  });

  it('allows a fresh ADVANCE when the previous one was REJECTED', () => {
    const reqs = [makeRequest({ id: 'prev', type: 'ADVANCE', status: 'REJECTED' })];
    expect(findBlockingAdvance(reqs, 'wo1')).toBeNull();
  });

  it('allows a second ADVANCE after the first was PAID (Phase 1.2 policy)', () => {
    // Phase 1 blocked this; Phase 1.2 allows a follow-up advance so
    // businesses that take multiple tranches work without admin
    // intervention.
    const reqs = [makeRequest({ id: 'prev', type: 'ADVANCE', status: 'PAID' })];
    expect(findBlockingAdvance(reqs, 'wo1')).toBeNull();
  });

  it('returns null when no ADVANCE exists for that WO', () => {
    const reqs = [makeRequest({ id: 'other', type: 'PART', status: 'PAID' })];
    expect(findBlockingAdvance(reqs, 'wo1')).toBeNull();
  });
});

// ── Display label for advance state ─────────────────────────────────

describe('advanceStatusLabel', () => {
  it('reports NOT_REQUESTED when no advance exists', () => {
    expect(advanceStatusLabel([], 'wo1')).toBe('NOT_REQUESTED');
  });

  it('prefers the most-progressed state', () => {
    const reqs = [
      makeRequest({ id: 'a', type: 'ADVANCE', status: 'REJECTED' }),
      makeRequest({ id: 'b', type: 'ADVANCE', status: 'PENDING_APPROVAL' }),
    ];
    expect(advanceStatusLabel(reqs, 'wo1')).toBe('PENDING_APPROVAL');
    reqs.push(makeRequest({ id: 'c', type: 'ADVANCE', status: 'APPROVED' }));
    expect(advanceStatusLabel(reqs, 'wo1')).toBe('APPROVED');
    reqs.push(makeRequest({ id: 'd', type: 'ADVANCE', status: 'PAID' }));
    expect(advanceStatusLabel(reqs, 'wo1')).toBe('PAID');
  });

  it('returns REJECTED only when every ADVANCE was rejected', () => {
    const reqs = [
      makeRequest({ id: 'a', type: 'ADVANCE', status: 'REJECTED' }),
      makeRequest({ id: 'b', type: 'ADVANCE', status: 'REJECTED' }),
    ];
    expect(advanceStatusLabel(reqs, 'wo1')).toBe('REJECTED');
  });
});

// ── Cross-module overpayment guard (Phase 1.2) ──────────────────────

function makeBill(over: Partial<Bill> = {}): Bill {
  return {
    id: 'b1', billNumber: 'B-001', workOrderId: 'wo1', billDate: iso(TODAY),
    workDoneAmount: 0, previousBillAmount: 0, currentBillAmount: 0,
    tdsPercentage: 0, tdsAmount: 0,
    retentionPercentage: 0, retentionAmount: 0,
    advanceAdjustment: 0, netPayable: 0, status: 'APPROVED',
    createdAt: iso(TODAY), createdBy: 'u', ...over,
  };
}
function makePayment(over: Partial<Payment> = {}): Payment {
  return {
    id: 'p1', billId: 'b1', amount: 0, status: 'RELEASED',
    paymentDate: iso(TODAY), paymentMethod: 'BANK_TRANSFER',
    createdAt: iso(TODAY), createdBy: 'u',
    ...over,
  };
}

describe('getTotalFinancialOutflow', () => {
  it('sums PAID payment requests + released bill payments for the same WO', () => {
    const requests = [
      makeRequest({ id: 'r1', type: 'ADVANCE', status: 'PAID', requestedAmount: 10000 }),
      makeRequest({ id: 'r2', type: 'PART', status: 'APPROVED', requestedAmount: 3000 }), // not PAID → excluded
      makeRequest({ id: 'r3', type: 'PART', status: 'PAID', requestedAmount: 2000, workOrderId: 'wo2' }), // other WO
    ];
    const bills = [
      makeBill({ id: 'b1', workOrderId: 'wo1' }),
      makeBill({ id: 'b9', workOrderId: 'wo-other' }),
    ];
    const payments = [
      makePayment({ id: 'p1', billId: 'b1', status: 'RELEASED', amount: 5000 }), // counts
      makePayment({ id: 'p2', billId: 'b1', status: 'PENDING',  amount: 1000 }), // not released
      makePayment({ id: 'p3', billId: 'b9', status: 'RELEASED', amount: 9000 }), // other bill
      makePayment({ id: 'p4', billId: 'wo1', status: 'RELEASED', amount: 800 }), // legacy advance convention
    ];
    expect(getTotalFinancialOutflow('wo1', requests, bills, payments)).toBe(10000 + 5000 + 800);
  });

  it('returns 0 when no paid activity exists for the WO', () => {
    expect(getTotalFinancialOutflow('wo1', [], [], [])).toBe(0);
  });
});

// ── WO payment summary (Phase 1.2) ──────────────────────────────────

describe('getWOPaymentSummary', () => {
  it('computes every field from non-rejected / PAID buckets of payment requests', () => {
    const wo = makeWO(); // gross 21,000, plannedAdvance 10,000
    const reqs: PaymentRequest[] = [
      makeRequest({ id: 'a', type: 'ADVANCE', status: 'PAID', requestedAmount: 10000 }),
      makeRequest({ id: 'b', type: 'PART', status: 'APPROVED', requestedAmount: 4000 }),
      makeRequest({ id: 'c', type: 'PART', status: 'PENDING_APPROVAL', requestedAmount: 2000 }),
      makeRequest({ id: 'd', type: 'PART', status: 'REJECTED', requestedAmount: 9000 }),
      makeRequest({ id: 'e', type: 'ADVANCE', status: 'REJECTED', requestedAmount: 2500 }),
    ];
    const s = getWOPaymentSummary(wo, reqs);
    expect(s.grossValue).toBe(21000);
    expect(s.advancePlanned).toBe(10000);
    expect(s.advanceRequested).toBe(10000);  // REJECTED advance excluded
    expect(s.advancePaid).toBe(10000);
    expect(s.totalRequested).toBe(16000);    // a + b + c (REJECTED excluded)
    expect(s.totalPaid).toBe(10000);
    expect(s.remainingPayable).toBe(11000);  // 21000 − 10000
  });

  it('returns zeros for a WO with no payment requests', () => {
    const wo = makeWO();
    const s = getWOPaymentSummary(wo, []);
    expect(s.advanceRequested).toBe(0);
    expect(s.advancePaid).toBe(0);
    expect(s.totalRequested).toBe(0);
    expect(s.totalPaid).toBe(0);
    expect(s.remainingPayable).toBe(21000);
  });
});
