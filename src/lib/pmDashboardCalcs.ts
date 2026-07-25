/**
 * Pure scoping + aggregation helpers for the Project Manager dashboard.
 *
 * The PM dashboard must show only data tied to projects the PM owns.
 * Project-level assignment doesn't exist yet; company-level assignment
 * does (multi-company since the `assignedCompanyIds` refactor). So we
 * compute the PM's project set with this priority:
 *
 *   1. profile.assignedProjectIds      (future-ready; not written yet)
 *   2. profile.assignedCompanyIds[]    (multi-company — all projects
 *                                       belonging to any of those
 *                                       companies) — legacy single
 *                                       `companyId` is folded into
 *                                       this list by getAssignedCompanyIds
 *   3. <none>                          (no scope — page renders empty
 *                                       state with a nudge to ask an
 *                                       admin)
 *
 * When the per-user project-assignment layer lands, (1) kicks in
 * automatically.
 */

import {
  Project,
  WorkOrder,
  Bill,
  Payment,
  VariationOrder,
  UserProfile
} from '../types';
import {
  activeWorkOrders,
  activeBills,
  pendingBills,
  payableInWindow,
  overdueBillsList,
  dueTodayBillsList,
  woGrossValue
} from './financialCalcs';
import { getAssignedCompanyIds } from './userAccess';
import { parseISO, isBefore, isAfter, addDays, endOfDay, startOfDay } from 'date-fns';

/** Future-ready fields. Optional so existing profiles still compile. */
export type PMAssignable = Pick<UserProfile, 'companyId' | 'assignedCompanyIds'> & {
  assignedProjectIds?: string[];
};

/**
 * Return the set of project ids the PM is scoped to, with the priority
 * documented above. Empty array = no scope (page renders empty state).
 */
export function pmScopedProjectIds(
  profile: PMAssignable | null | undefined,
  projects: Project[]
): string[] {
  if (!profile) return [];
  if (profile.assignedProjectIds && profile.assignedProjectIds.length > 0) {
    return profile.assignedProjectIds;
  }
  const assignedCompanyIds = getAssignedCompanyIds(profile);
  if (assignedCompanyIds.length > 0) {
    const scopedCompanies = new Set(assignedCompanyIds);
    return projects
      .filter(p => p.companyId && scopedCompanies.has(p.companyId))
      .map(p => p.id);
  }
  return [];
}

/** How the PM's scope was determined — used by the UI to render an
 *  accurate badge ("via company · SIPL, SHSPL" / "4 assigned projects"). */
export type PMScopeSource = 'ASSIGNED' | 'COMPANY' | 'NONE';

export function pmScopeSource(profile: PMAssignable | null | undefined): PMScopeSource {
  if (!profile) return 'NONE';
  if (profile.assignedProjectIds && profile.assignedProjectIds.length > 0) return 'ASSIGNED';
  if (getAssignedCompanyIds(profile).length > 0) return 'COMPANY';
  return 'NONE';
}

// ─────────────────────────────────────────────────────────────────────
// Filtering — every aggregate below takes the full dataset + scope,
// filters first, then reuses the shared financialCalcs aggregators.
// ─────────────────────────────────────────────────────────────────────

export function filterProjects(projects: Project[], projectIds: string[]): Project[] {
  const set = new Set(projectIds);
  return projects.filter(p => set.has(p.id));
}

export function filterWorkOrders(workOrders: WorkOrder[], projectIds: string[]): WorkOrder[] {
  const set = new Set(projectIds);
  return workOrders.filter(wo => set.has(wo.projectId));
}

export function filterBills(
  bills: Bill[],
  scopedWorkOrders: WorkOrder[]
): Bill[] {
  const woIds = new Set(scopedWorkOrders.map(wo => wo.id));
  return bills.filter(b => woIds.has(b.workOrderId));
}

export function filterPayments(
  payments: Payment[],
  scopedBills: Bill[]
): Payment[] {
  const billIds = new Set(scopedBills.map(b => b.id));
  // Advance payments are stored with billId = workOrderId (legacy convention),
  // so strict bill-scoping is fine for the PM dashboard.
  return payments.filter(p => billIds.has(p.billId));
}

export function filterVariationOrders(
  variationOrders: VariationOrder[],
  scopedWorkOrders: WorkOrder[]
): VariationOrder[] {
  const woIds = new Set(scopedWorkOrders.map(wo => wo.id));
  return variationOrders.filter(vo => woIds.has(vo.workOrderId));
}

// ─────────────────────────────────────────────────────────────────────
// Summary numbers for the top strip.
// ─────────────────────────────────────────────────────────────────────

export interface PMSummary {
  projectCount: number;
  activeWOCount: number;
  pendingWOCount: number;
  totalWOValue: number;
  totalBilled: number;
  payable7Days: number;
  overduePayments: number;
  dueTodayAmount: number;
  openVOCount: number;
  contractorCount: number;
}

export function buildPMSummary(
  projects: Project[],
  workOrders: WorkOrder[],
  bills: Bill[],
  variationOrders: VariationOrder[],
  now: Date = new Date()
): PMSummary {
  const today = startOfDay(now);
  const next7 = endOfDay(addDays(today, 7));

  const activeWOs = activeWorkOrders(workOrders);
  const activeBillsList = activeBills(bills);

  const totalWOValue = activeWOs.reduce((sum, wo) => sum + woGrossValue(wo), 0);
  const totalBilled = activeBillsList.reduce((sum, b) => sum + (b.netPayable || 0), 0);

  return {
    projectCount: projects.length,
    activeWOCount: activeWOs.filter(wo => wo.status === 'APPROVED').length,
    pendingWOCount: activeWOs.filter(wo => wo.status === 'PENDING').length,
    totalWOValue,
    totalBilled,
    payable7Days: payableInWindow(bills, today, next7),
    overduePayments: overdueBillsList(bills, now).reduce((s, b) => s + (b.netPayable || 0), 0),
    dueTodayAmount: dueTodayBillsList(bills, now).reduce((s, b) => s + (b.netPayable || 0), 0),
    openVOCount: variationOrders.filter(vo => vo.status === 'DRAFT').length,
    contractorCount: new Set(activeWOs.map(wo => wo.contractorId)).size
  };
}

// ─────────────────────────────────────────────────────────────────────
// Row builders for the tables on the PM dashboard.
// ─────────────────────────────────────────────────────────────────────

export interface PMProjectRow {
  projectId: string;
  name: string;
  status: Project['status'];
  activeWOCount: number;
  totalWOValue: number;
  totalBilled: number;
  outstandingPayable: number;
}

export function buildPerProjectRows(
  projects: Project[],
  workOrders: WorkOrder[],
  bills: Bill[],
  payments: Payment[]
): PMProjectRow[] {
  return projects.map(p => {
    const projectWOs = activeWorkOrders(workOrders).filter(wo => wo.projectId === p.id);
    const woIds = new Set(projectWOs.map(wo => wo.id));
    const projectBills = activeBills(bills).filter(b => woIds.has(b.workOrderId));
    const billIds = new Set(projectBills.map(b => b.id));
    const releasedNonAdvance = payments.filter(
      pay => pay.status === 'RELEASED' && pay.type !== 'ADVANCE' && billIds.has(pay.billId)
    );

    const totalWOValue = projectWOs.reduce((sum, wo) => sum + woGrossValue(wo), 0);
    const totalBilled = projectBills.reduce((sum, b) => sum + (b.netPayable || 0), 0);
    const totalPaid = releasedNonAdvance.reduce((sum, pay) => sum + (pay.amount || 0), 0);

    return {
      projectId: p.id,
      name: p.name,
      status: p.status,
      activeWOCount: projectWOs.length,
      totalWOValue,
      totalBilled,
      outstandingPayable: totalBilled - totalPaid
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

/** Upcoming/overdue bills within the PM's scope, sorted by billDate asc. */
export function buildDueAttentionRows(
  bills: Bill[],
  workOrdersById: Record<string, WorkOrder>,
  projectsById: Record<string, Project>,
  now: Date = new Date(),
  limit: number = 10
): Array<{
  bill: Bill;
  workOrder: WorkOrder | undefined;
  project: Project | undefined;
  isOverdue: boolean;
  isDueToday: boolean;
}> {
  const today = startOfDay(now);
  const pending = pendingBills(bills);
  return pending
    .sort((a, b) => (a.billDate || '').localeCompare(b.billDate || ''))
    .slice(0, limit)
    .map(bill => {
      const d = parseISO(bill.billDate);
      const wo = workOrdersById[bill.workOrderId];
      return {
        bill,
        workOrder: wo,
        project: wo ? projectsById[wo.projectId] : undefined,
        isOverdue: isBefore(d, today),
        isDueToday: !isBefore(d, today) && !isAfter(d, endOfDay(today))
      };
    });
}
