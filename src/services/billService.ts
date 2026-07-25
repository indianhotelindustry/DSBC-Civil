import { Bill, Payment, WorkOrder, BusinessRuleError } from '../types';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  getDocument,
  queryDocuments,
  logAction,
  where
} from './db';
import { secureVerifyBill, secureApproveBill } from './secureApi';
import { woGrossValue } from '../lib/financialCalcs';
import { recalculateBillTotals } from '../lib/financialCalculationService';

const COLLECTION = 'bills';

export const billService = {
  getAll: (callback: (bills: Bill[]) => void) => {
    return subscribeToCollection<Bill>(COLLECTION, callback);
  },

  getById: async (id: string): Promise<Bill | null> => {
    return getDocument<Bill>(COLLECTION, id);
  },

  /**
   * Create a bill with full validation:
   * - Work order must exist and be APPROVED
   * - No duplicate bill number for the same contractor
   * - Cumulative billed amount must not exceed work order value
   * - Calculated fields are recomputed from inputs
   */
  create: async (data: Omit<Bill, 'id' | 'createdAt' | 'createdBy'>): Promise<string> => {
    // 1. Work order must exist
    const wo = await getDocument<WorkOrder>('workOrders', data.workOrderId);
    if (!wo) {
      throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Work order ${data.workOrderId} does not exist.`);
    }

    // 2. Work order must be approved
    if (wo.status !== 'APPROVED' && wo.status !== 'COMPLETED') {
      throw new BusinessRuleError('WORK_ORDER_NOT_APPROVED', `Work order ${wo.woNumber} is not approved (status: ${wo.status}).`);
    }

    // 3. No duplicate bill number for the same contractor
    const existingBills = await queryDocuments<Bill>(COLLECTION, [
      where('workOrderId', '==', data.workOrderId)
    ]);
    const duplicateBillNumber = existingBills.find(
      b => b.billNumber === data.billNumber && b.status !== 'REJECTED'
    );
    if (duplicateBillNumber) {
      throw new BusinessRuleError('DUPLICATE_BILL_NUMBER', `Bill number ${data.billNumber} already exists for this work order.`);
    }

    // 4. Cumulative billed must not exceed WO value.
    //    The contractual ceiling is the GROSS BOQ total — bills can be
    //    raised up to the work-done amount agreed in the WO. Net
    //    grandTotal (which subtracts advance / retention / GST /
    //    other charges) was previously used here and would block
    //    legitimate billing as soon as cumulative work done crossed
    //    the post-deduction figure even though the work was within
    //    contract scope.
    const previouslyBilled = existingBills
      .filter(b => b.status !== 'REJECTED')
      .reduce((sum, b) => sum + b.workDoneAmount, 0);
    const woLimit = woGrossValue(wo);
    if (previouslyBilled + data.workDoneAmount > woLimit) {
      throw new BusinessRuleError(
        'BILL_EXCEEDS_WO_BALANCE',
        `Cumulative billed (${previouslyBilled + data.workDoneAmount}) exceeds work order value (${woLimit}).`
      );
    }

    // 5. Recalculate derived fields from source inputs
    const calculated = recalculateBillTotals(data);
    const finalData: Omit<Bill, 'id' | 'createdAt' | 'createdBy'> = {
      ...data,
      ...calculated
    };

    const id = await createDocument(COLLECTION, finalData as Record<string, unknown>);
    await logAction('CREATE', 'Bill', id, `Created bill ${data.billNumber} for WO: ${wo.woNumber}`);
    return id;
  },

  /**
   * Update a bill. Blocks edits on approved/paid/rejected bills.
   * Recalculates derived fields if source inputs are being changed.
   */
  update: async (id: string, data: Partial<Bill>): Promise<void> => {
    const existing = await getDocument<Bill>(COLLECTION, id);
    if (!existing) {
      throw new BusinessRuleError('BILL_NOT_FOUND', `Bill ${id} does not exist.`);
    }

    // Block edits on locked records (only DRAFT and VERIFIED are editable)
    if (existing.status === 'APPROVED' || existing.status === 'PARTIALLY_PAID' || existing.status === 'PAID') {
      // Allow only status-transition updates (handled by verify/approve/markAsPaid)
      const isStatusTransition = Object.keys(data).every(k =>
        ['status', 'verifiedBy', 'verifiedAt', 'approvedBy', 'approvedAt', 'paidBy', 'paidAt'].includes(k)
      );
      if (!isStatusTransition) {
        throw new BusinessRuleError('RECORD_LOCKED', `Bill ${existing.billNumber} is ${existing.status} and cannot be edited.`);
      }
    }

    // If financial source fields are being changed, recalculate derived fields
    const hasFinancialChange = ['workDoneAmount', 'previousBillAmount', 'tdsPercentage', 'retentionPercentage', 'advanceAdjustment']
      .some(k => k in data);

    let finalData = { ...data };
    if (hasFinancialChange) {
      const merged = {
        workDoneAmount: data.workDoneAmount ?? existing.workDoneAmount,
        previousBillAmount: data.previousBillAmount ?? existing.previousBillAmount,
        tdsPercentage: data.tdsPercentage ?? existing.tdsPercentage,
        retentionPercentage: data.retentionPercentage ?? existing.retentionPercentage,
        advanceAdjustment: data.advanceAdjustment ?? existing.advanceAdjustment,
      };
      const calculated = recalculateBillTotals(merged);
      finalData = { ...finalData, ...calculated };
    }

    await updateDocument(COLLECTION, id, finalData as Record<string, unknown>);
    await logAction('UPDATE', 'Bill', id, `Updated bill: ${existing.billNumber}`);
  },

  /**
   * Verify a bill (DRAFT → VERIFIED).
   * Delegated to server for authoritative validation.
   */
  verify: async (id: string, _userId: string): Promise<void> => {
    await secureVerifyBill(id);
  },

  /**
   * Approve a bill (VERIFIED → APPROVED).
   * Delegated to server for authoritative validation including WO cross-checks.
   */
  approve: async (id: string, _userId: string): Promise<void> => {
    await secureApproveBill(id);
  },

  /**
   * Mark a bill as partially paid. Called by paymentService when a release
   * does not cover the full netPayable.
   */
  markAsPartiallyPaid: async (id: string, userId: string): Promise<void> => {
    const bill = await getDocument<Bill>(COLLECTION, id);
    if (!bill) throw new BusinessRuleError('BILL_NOT_FOUND', `Bill ${id} does not exist.`);
    if (bill.status !== 'APPROVED' && bill.status !== 'PARTIALLY_PAID') {
      throw new BusinessRuleError('RECORD_LOCKED', `Bill ${bill.billNumber} must be APPROVED or PARTIALLY_PAID to record partial payment (current: ${bill.status}).`);
    }
    await updateDocument(COLLECTION, id, {
      status: 'PARTIALLY_PAID',
      paidBy: userId,
      paidAt: new Date().toISOString()
    });
    await logAction('PARTIAL_PAY', 'Bill', id, `Marked bill as partially paid: ${bill.billNumber}`);
  },

  markAsPaid: async (id: string, userId: string): Promise<void> => {
    const bill = await getDocument<Bill>(COLLECTION, id);
    if (!bill) throw new BusinessRuleError('BILL_NOT_FOUND', `Bill ${id} does not exist.`);
    if (bill.status !== 'APPROVED' && bill.status !== 'PARTIALLY_PAID') {
      throw new BusinessRuleError('RECORD_LOCKED', `Bill ${bill.billNumber} must be APPROVED or PARTIALLY_PAID to mark as paid (current: ${bill.status}).`);
    }
    await updateDocument(COLLECTION, id, {
      status: 'PAID',
      paidBy: userId,
      paidAt: new Date().toISOString()
    });
    await logAction('PAY', 'Bill', id, `Marked bill as paid: ${bill.billNumber}`);
  },

  delete: async (id: string): Promise<void> => {
    const bill = await getDocument<Bill>(COLLECTION, id);
    if (!bill) return; // Already gone

    if (bill.status === 'APPROVED' || bill.status === 'PARTIALLY_PAID' || bill.status === 'PAID') {
      throw new BusinessRuleError('RECORD_LOCKED', `Bill ${bill.billNumber} is ${bill.status} and cannot be deleted.`);
    }

    // Check for linked payments
    const payments = await queryDocuments<Payment>('payments', [
      where('billId', '==', id)
    ]);
    const activePayments = payments.filter(p => p.status !== 'REJECTED');
    if (activePayments.length > 0) {
      throw new BusinessRuleError('BILL_HAS_PAYMENTS', `Bill ${bill.billNumber} has ${activePayments.length} active payment(s) and cannot be deleted.`);
    }

    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Bill', id, `Deleted bill: ${bill.billNumber}`);
  }
};
