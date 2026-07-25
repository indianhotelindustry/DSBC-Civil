import { describe, it, expect } from 'vitest';
import { subDays, addDays } from 'date-fns';
import type { Project, WorkOrder, Bill, Payment, VariationOrder } from '../types';
import {
  pmScopedProjectIds,
  pmScopeSource,
  filterWorkOrders,
  filterBills,
  filterPayments,
  filterVariationOrders,
  buildPMSummary,
  buildPerProjectRows
} from './pmDashboardCalcs';

const TODAY = new Date('2026-04-21T00:00:00.000Z');
const iso = (d: Date) => d.toISOString();

function proj(over: Partial<Project>): Project {
  return {
    id: 'p1',
    companyId: 'sipl',
    name: 'Project 1',
    description: '',
    clientName: '',
    startDate: iso(TODAY),
    endDate: iso(addDays(TODAY, 90)),
    budget: 0,
    status: 'ACTIVE',
    createdAt: iso(TODAY),
    createdBy: 'u1',
    ...over
  };
}

function wo(over: Partial<WorkOrder>): WorkOrder {
  return {
    id: 'wo1',
    woNumber: 'WO-1',
    projectId: 'p1',
    contractorId: 'c1',
    title: 'WO',
    description: '',
    amount: 100000,
    status: 'APPROVED',
    issueDate: iso(TODAY),
    startDate: iso(TODAY),
    endDate: iso(addDays(TODAY, 30)),
    preparedBy: 'u1',
    scopeOfWork: 's',
    boqItems: [],
    financials: {
      totalAmount: 100000, advance: 0, subtotal: 100000,
      gstPercentage: 0, gstAmount: 0, retentionPercentage: 0,
      retentionAmount: 0, otherCharges: 0, grandTotal: 100000
    },
    billing: { totalValue: 100000 },
    createdAt: iso(TODAY),
    createdBy: 'u1',
    ...over
  };
}

function bill(over: Partial<Bill>): Bill {
  return {
    id: 'b1',
    billNumber: 'B-1',
    workOrderId: 'wo1',
    billDate: iso(TODAY),
    workDoneAmount: 10000,
    previousBillAmount: 0,
    currentBillAmount: 10000,
    tdsPercentage: 0, tdsAmount: 0,
    retentionPercentage: 0, retentionAmount: 0,
    advanceAdjustment: 0,
    netPayable: 10000,
    status: 'APPROVED',
    createdAt: iso(TODAY),
    createdBy: 'u1',
    ...over
  };
}

// ── Scoping ──────────────────────────────────────────────────────────

describe('pmScopedProjectIds', () => {
  const projects = [
    proj({ id: 'p1', companyId: 'sipl' }),
    proj({ id: 'p2', companyId: 'sipl' }),
    proj({ id: 'p3', companyId: 'shspl' }),
  ];

  it('prefers assignedProjectIds when present (multi-company companies ignored)', () => {
    const ids = pmScopedProjectIds(
      { assignedCompanyIds: ['sipl', 'shspl'], assignedProjectIds: ['p2'] },
      projects
    );
    expect(ids).toEqual(['p2']);
    expect(pmScopeSource({
      assignedCompanyIds: ['sipl'],
      assignedProjectIds: ['p2']
    })).toBe('ASSIGNED');
  });

  it('unions projects across all assignedCompanyIds', () => {
    const ids = pmScopedProjectIds({ assignedCompanyIds: ['sipl', 'shspl'] }, projects);
    expect(ids.sort()).toEqual(['p1', 'p2', 'p3']);
    expect(pmScopeSource({ assignedCompanyIds: ['sipl', 'shspl'] })).toBe('COMPANY');
  });

  it('falls back to legacy single companyId when assignedCompanyIds missing', () => {
    // Migration path: user provisioned before multi-company; only has companyId.
    const ids = pmScopedProjectIds({ companyId: 'sipl' }, projects);
    expect(ids.sort()).toEqual(['p1', 'p2']);
    expect(pmScopeSource({ companyId: 'sipl' })).toBe('COMPANY');
  });

  it('treats empty assignedCompanyIds as "no scope" (matches no-company semantics)', () => {
    expect(pmScopedProjectIds({ assignedCompanyIds: [] }, projects)).toEqual([]);
    expect(pmScopeSource({ assignedCompanyIds: [] })).toBe('NONE');
  });

  it('returns empty when no assignment and no company', () => {
    expect(pmScopedProjectIds({}, projects)).toEqual([]);
    expect(pmScopeSource({})).toBe('NONE');
  });

  it('returns empty when profile is null', () => {
    expect(pmScopedProjectIds(null, projects)).toEqual([]);
    expect(pmScopeSource(null)).toBe('NONE');
  });
});

// ── Cross-entity filtering ───────────────────────────────────────────

describe('filterWorkOrders / filterBills / filterPayments / filterVariationOrders', () => {
  it('chains scoping correctly — only data inside the PM project set survives', () => {
    const wos = [
      wo({ id: 'wo1', projectId: 'p1' }),
      wo({ id: 'wo2', projectId: 'p2' }),
      wo({ id: 'wo3', projectId: 'p-other' }),
    ];
    const bills = [
      bill({ id: 'b1', workOrderId: 'wo1' }),
      bill({ id: 'b2', workOrderId: 'wo2' }),
      bill({ id: 'b3', workOrderId: 'wo3' }), // out of scope
    ];
    const payments: Payment[] = [
      { id: 'pay1', billId: 'b1', amount: 5000, paymentDate: iso(TODAY), paymentMethod: '', status: 'RELEASED', createdAt: iso(TODAY), createdBy: 'u1' },
      { id: 'pay2', billId: 'b3', amount: 9999, paymentDate: iso(TODAY), paymentMethod: '', status: 'RELEASED', createdAt: iso(TODAY), createdBy: 'u1' },
    ];
    const vos: VariationOrder[] = [
      { id: 'vo1', workOrderId: 'wo1', voNumber: 'VO-1', description: '', reason: '', amount: 1000, status: 'DRAFT', createdAt: iso(TODAY), createdBy: 'u1' },
      { id: 'vo2', workOrderId: 'wo3', voNumber: 'VO-2', description: '', reason: '', amount: 2000, status: 'DRAFT', createdAt: iso(TODAY), createdBy: 'u1' },
    ];

    const scopedWOs = filterWorkOrders(wos, ['p1', 'p2']);
    expect(scopedWOs.map(w => w.id).sort()).toEqual(['wo1', 'wo2']);

    const scopedBills = filterBills(bills, scopedWOs);
    expect(scopedBills.map(b => b.id).sort()).toEqual(['b1', 'b2']);

    const scopedPayments = filterPayments(payments, scopedBills);
    expect(scopedPayments.map(p => p.id)).toEqual(['pay1']);

    const scopedVOs = filterVariationOrders(vos, scopedWOs);
    expect(scopedVOs.map(v => v.id)).toEqual(['vo1']);
  });
});

// ── Summary ──────────────────────────────────────────────────────────

describe('buildPMSummary', () => {
  it('counts projects, WOs, open VOs, unique contractors across the PM scope', () => {
    const projects = [proj({ id: 'p1' }), proj({ id: 'p2' })];
    const wos = [
      wo({ id: 'wo1', projectId: 'p1', contractorId: 'cA', status: 'APPROVED' }),
      wo({ id: 'wo2', projectId: 'p1', contractorId: 'cA', status: 'APPROVED' }),  // same contractor
      wo({ id: 'wo3', projectId: 'p2', contractorId: 'cB', status: 'PENDING' }),
      wo({ id: 'wo4', projectId: 'p2', contractorId: 'cC', status: 'REJECTED' }),  // excluded
    ];
    const vos: VariationOrder[] = [
      { id: 'vo1', workOrderId: 'wo1', voNumber: '', description: '', reason: '', amount: 1, status: 'DRAFT', createdAt: '', createdBy: '' },
      { id: 'vo2', workOrderId: 'wo3', voNumber: '', description: '', reason: '', amount: 1, status: 'APPROVED', createdAt: '', createdBy: '' },
    ];
    const s = buildPMSummary(projects, wos, [], vos, TODAY);
    expect(s.projectCount).toBe(2);
    expect(s.activeWOCount).toBe(2);          // 2 APPROVED
    expect(s.pendingWOCount).toBe(1);         // 1 PENDING
    expect(s.openVOCount).toBe(1);            // 1 DRAFT VO
    expect(s.contractorCount).toBe(2);        // cA (dedup) + cB; cC excluded (REJECTED)
  });

  it('computes overdue / due today / 7-day payable correctly', () => {
    const wos = [wo({ id: 'wo1' })];
    const bills = [
      bill({ id: 'b1', billDate: iso(subDays(TODAY, 3)), netPayable: 1000, status: 'APPROVED' }),
      bill({ id: 'b2', billDate: iso(TODAY),             netPayable: 2000, status: 'APPROVED' }),
      bill({ id: 'b3', billDate: iso(addDays(TODAY, 5)), netPayable: 4000, status: 'APPROVED' }),
      bill({ id: 'b4', billDate: iso(addDays(TODAY, 20)),netPayable: 8000, status: 'APPROVED' }), // outside 7d
    ];
    const s = buildPMSummary([], wos, bills, [], TODAY);
    expect(s.overduePayments).toBe(1000);
    expect(s.dueTodayAmount).toBe(2000);
    // payable7Days is inclusive of today through today+7
    expect(s.payable7Days).toBe(2000 + 4000);
  });
});

// ── Per-project rows ─────────────────────────────────────────────────

describe('buildPerProjectRows', () => {
  it('rolls up WO value / billed / outstanding per project and sorts by name', () => {
    const projects = [proj({ id: 'p1', name: 'Beta' }), proj({ id: 'p2', name: 'Alpha' })];
    const wos = [
      wo({ id: 'wo1', projectId: 'p1', financials: { totalAmount: 100000, advance: 0, subtotal: 100000, gstPercentage: 0, gstAmount: 0, retentionPercentage: 0, retentionAmount: 0, otherCharges: 0, grandTotal: 100000 } }),
      wo({ id: 'wo2', projectId: 'p2', financials: { totalAmount: 50000, advance: 0, subtotal: 50000, gstPercentage: 0, gstAmount: 0, retentionPercentage: 0, retentionAmount: 0, otherCharges: 0, grandTotal: 50000 } }),
    ];
    const bills = [
      bill({ id: 'b1', workOrderId: 'wo1', netPayable: 40000, status: 'APPROVED' }),
      bill({ id: 'b2', workOrderId: 'wo2', netPayable: 10000, status: 'APPROVED' }),
    ];
    const payments: Payment[] = [
      { id: 'pay1', billId: 'b1', amount: 15000, paymentDate: iso(TODAY), paymentMethod: '', status: 'RELEASED', createdAt: iso(TODAY), createdBy: 'u1' },
    ];
    const rows = buildPerProjectRows(projects, wos, bills, payments);
    expect(rows.map(r => r.name)).toEqual(['Alpha', 'Beta']); // sorted
    const beta = rows.find(r => r.name === 'Beta')!;
    expect(beta.totalWOValue).toBe(100000);
    expect(beta.totalBilled).toBe(40000);
    expect(beta.outstandingPayable).toBe(40000 - 15000);
  });
});
