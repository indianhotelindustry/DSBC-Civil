import { Bill, Payment, Adjustment, WorkOrder, Project, LedgerEntry } from '../types';
import { parseISO, compareAsc } from 'date-fns';
import { activeWorkOrders, activeBills, releasedBillPayments, releasedPayments, woGrossValue } from './financialCalcs';

export function calculateLedger(
  contractorId: string,
  workOrders: WorkOrder[],
  bills: Bill[],
  payments: Payment[],
  adjustments: Adjustment[],
  projects: Project[]
): LedgerEntry[] {
  const entries: LedgerEntry[] = [];

  // 1. Add Bills (Credits - Liability increases). Skip REJECTED.
  activeBills(bills).forEach(bill => {
    const wo = workOrders.find(w => w.id === bill.workOrderId);
    if (!wo || wo.contractorId !== contractorId || wo.status === 'REJECTED') return;
    
    const project = projects.find(p => p.id === wo.projectId);

    entries.push({
      id: bill.id,
      date: bill.billDate,
      type: 'BILL',
      referenceNumber: bill.id.slice(0, 8).toUpperCase(),
      projectName: project?.name || 'Unknown',
      workOrderNumber: wo.woNumber,
      description: `Bill for Work Order: ${wo.title}`,
      debit: 0,
      credit: bill.netPayable,
      balance: 0,
      status: bill.status,
      relatedId: bill.id
    });
  });

  // 2. Add Payments (Debits - Liability decreases)
  payments.forEach(payment => {
    if (payment.status !== 'RELEASED') return; // Only show released payments in ledger
    
    // Find the bill to find the work order to find the contractor
    const bill = bills.find(b => b.id === payment.billId);
    if (!bill) return;
    
    const wo = workOrders.find(w => w.id === bill.workOrderId);
    if (!wo || wo.contractorId !== contractorId) return;

    const project = projects.find(p => p.id === wo.projectId);

    entries.push({
      id: payment.id,
      date: payment.paymentDate,
      type: payment.type === 'ADVANCE' ? 'ADVANCE' : 'PAYMENT',
      referenceNumber: payment.transactionId || payment.id.slice(0, 8).toUpperCase(),
      projectName: project?.name || 'Unknown',
      workOrderNumber: wo.woNumber,
      description: payment.type === 'ADVANCE' ? `Advance Payment for WO: ${wo.woNumber}` : `Payment for Bill: ${bill.id.slice(0, 8).toUpperCase()}`,
      debit: payment.amount,
      credit: 0,
      balance: 0,
      status: 'COMPLETED',
      relatedId: payment.id
    });
  });

  // 3. Add Adjustments
  adjustments.forEach(adj => {
    if (adj.contractorId !== contractorId) return;

    const wo = adj.workOrderId ? workOrders.find(w => w.id === adj.workOrderId) : null;
    const project = adj.projectId ? projects.find(p => p.id === adj.projectId) : (wo ? projects.find(p => p.id === wo.projectId) : null);

    entries.push({
      id: adj.id,
      date: adj.date,
      type: 'ADJUSTMENT',
      referenceNumber: adj.id.slice(0, 8).toUpperCase(),
      projectName: project?.name || 'General',
      workOrderNumber: wo?.woNumber || 'N/A',
      description: `${adj.category}: ${adj.description}`,
      debit: adj.type === 'DEBIT' ? adj.amount : 0,
      credit: adj.type === 'CREDIT' ? adj.amount : 0,
      balance: 0,
      status: 'COMPLETED',
      relatedId: adj.id
    });
  });

  // 4. Sort by date
  entries.sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));

  // 5. Calculate Running Balance
  let runningBalance = 0;
  entries.forEach(entry => {
    runningBalance += (entry.credit - entry.debit);
    entry.balance = runningBalance;
  });

  return entries;
}

/**
 * Contractor KPIs — derived entirely from bills/payments, using the same
 * filter rules as financialCalcs (activeWorkOrders, activeBills, releasedBillPayments).
 *
 * outstandingPayable here includes adjustments (ledger-specific) — the
 * contractor ledger is the only place where DEBIT/CREDIT adjustments
 * modify outstanding. Dashboards do not include adjustments.
 */
export function calculateContractorKPIs(
  contractorId: string,
  workOrders: WorkOrder[],
  bills: Bill[],
  payments: Payment[],
  adjustments: Adjustment[]
) {
  const contractorWOs = activeWorkOrders(workOrders).filter(wo => wo.contractorId === contractorId);
  const woIds = new Set(contractorWOs.map(wo => wo.id));

  // Contractor's total contract value with this company — GROSS BOQ
  // sum across every active WO. Net remaining amounts come from
  // bills below; this is the commitment side.
  const totalWOValue = contractorWOs.reduce((sum, wo) => sum + woGrossValue(wo), 0);

  const contractorBills = activeBills(bills).filter(b => woIds.has(b.workOrderId));
  const totalApprovedBills = contractorBills.reduce((sum, b) => sum + b.netPayable, 0);

  const billIds = new Set(contractorBills.map(b => b.id));

  // Bill-payments: released, non-advance, linked to this contractor's bills.
  const billPaymentsForContractor = releasedBillPayments(payments).filter(p => billIds.has(p.billId));
  const totalPaymentsReleased = billPaymentsForContractor.reduce((sum, p) => sum + p.amount, 0);

  // Advance payments: stored with billId = workOrderId (legacy convention).
  // Counted separately; do NOT offset bill liability.
  const totalAdvancePaid = releasedPayments(payments)
    .filter(p => p.type === 'ADVANCE' && woIds.has(p.billId))
    .reduce((sum, p) => sum + p.amount, 0);

  // Ledger-specific: adjustments modify outstanding.
  const contractorAdjustments = adjustments.filter(a => a.contractorId === contractorId);
  const creditAdjustments = contractorAdjustments.filter(a => a.type === 'CREDIT').reduce((sum, a) => sum + a.amount, 0);
  const debitAdjustments = contractorAdjustments.filter(a => a.type === 'DEBIT').reduce((sum, a) => sum + a.amount, 0);

  // outstanding = (bills + credit adjustments) - (payments + debit adjustments)
  // Matches the running-balance calculation in calculateLedger (credits - debits).
  const outstandingPayable = (totalApprovedBills + creditAdjustments) - (totalPaymentsReleased + debitAdjustments);

  // Sum retention from financials (fallback 0 on legacy WOs).
  const retentionHeld = contractorWOs.reduce((sum, wo) => sum + (wo.financials?.retentionAmount || 0), 0);

  // Advance outstanding = advances paid - recoveries adjusted back
  const totalRecovered = contractorAdjustments
    .filter(a => a.category === 'RECOVERY')
    .reduce((sum, a) => sum + a.amount, 0);
  const advanceOutstanding = totalAdvancePaid - totalRecovered;

  return {
    totalWOValue,
    totalApprovedBills,
    totalAdvancePaid,
    totalPaymentsReleased,
    outstandingPayable,
    retentionHeld,
    advanceOutstanding
  };
}
