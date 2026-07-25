import { WorkOrder, Bill, Payment, VariationOrder, BusinessRuleError } from '../types';
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
import { reserveNextWorkOrderNumber } from './numberSeriesService';

const COLLECTION = 'workOrders';

/**
 * Get all non-rejected bills for a work order.
 */
async function getActiveBillsForWO(workOrderId: string): Promise<Bill[]> {
  const bills = await queryDocuments<Bill>('bills', [
    where('workOrderId', '==', workOrderId)
  ]);
  return bills.filter(b => b.status !== 'REJECTED');
}

/**
 * Get all non-rejected payments linked to a work order's bills.
 */
async function getActivePaymentsForWO(workOrderId: string): Promise<Payment[]> {
  const bills = await getActiveBillsForWO(workOrderId);
  if (bills.length === 0) return [];
  const billIds = bills.map(b => b.id);
  const allPayments = await queryDocuments<Payment>('payments', []);
  return allPayments.filter(p => billIds.includes(p.billId) && p.status !== 'REJECTED');
}

/**
 * The financial fields on a WorkOrder that, if reduced, could conflict with existing billing.
 */
const FINANCIAL_KEYS = ['amount', 'financials', 'billing', 'boqItems'] as const;

export const workOrderService = {
  getAll: (callback: (workOrders: WorkOrder[]) => void) => {
    return subscribeToCollection<WorkOrder>(COLLECTION, callback);
  },

  getById: async (id: string): Promise<WorkOrder | null> => {
    return getDocument<WorkOrder>(COLLECTION, id);
  },

  create: async (
    data: Omit<WorkOrder, 'id' | 'createdAt' | 'createdBy' | 'woNumber'>
  ): Promise<{ id: string; woNumber: string; collisionDetected: boolean }> => {
    // Authoritative path: reserve the next number from the
    // Masters-managed series via a Firestore transaction. There is
    // NO timestamp fallback any more — that route allowed two
    // concurrent creates to race past it before the admin had
    // initialized the series, producing duplicate / inconsistent
    // numbers. Force the admin to configure the series in Masters
    // before any WO can be issued.
    const issued = await reserveNextWorkOrderNumber();
    if (!issued) {
      throw new BusinessRuleError(
        'CONFIG_REQUIRED',
        'Work Order Number Series is not configured. Please set it in Masters → WO Number Series before creating Work Orders.'
      );
    }
    let woNumber = issued;

    // Defense-in-depth uniqueness check. The series is authoritative,
    // but legacy duplicates from a pre-series migration could collide
    // — auto-correct with a short random tail rather than blocking
    // the user mid-form, and surface the collision to the caller so
    // the UI can toast it instead of silently fixing it.
    let collisionDetected = false;
    const existing = await queryDocuments<WorkOrder>(COLLECTION, [where('woNumber', '==', woNumber)]);
    if (existing.length > 0) {
      const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
      const corrected = `${woNumber}-${tail}`;
      console.warn(`[workOrderService] WO# collision on ${woNumber}; auto-corrected to ${corrected}`);
      woNumber = corrected;
      collisionDetected = true;
    }

    const id = await createDocument(COLLECTION, { ...data, woNumber } as Record<string, unknown>);
    await logAction('CREATE', 'WorkOrder', id, `Created work order: ${data.title} (${woNumber})`);
    return { id, woNumber, collisionDetected };
  },

  /**
   * Update a work order with financial-safety checks.
   *
   * If non-rejected bills exist:
   * - Non-financial fields (title, description, dates, etc.) can be edited freely
   * - Financial fields that would reduce the WO value below already-billed amounts are blocked
   * - Status-transition fields are always allowed
   */
  update: async (id: string, data: Partial<WorkOrder>): Promise<void> => {
    const existing = await getDocument<WorkOrder>(COLLECTION, id);
    if (!existing) {
      throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Work order ${id} does not exist.`);
    }

    // Strip server-managed / immutable fields. Even if a caller
    // accidentally passes them (form regression, partial state from
    // create flow), the WO's identity doesn't change on edit.
    if ('woNumber' in data) delete (data as Partial<WorkOrder>).woNumber;
    if ('createdAt' in data) delete (data as Partial<WorkOrder>).createdAt;
    if ('createdBy' in data) delete (data as Partial<WorkOrder>).createdBy;

    // Check if any financial fields are being changed
    const touchesFinancials = FINANCIAL_KEYS.some(k => k in data);

    if (touchesFinancials) {
      const activeBills = await getActiveBillsForWO(id);

      if (activeBills.length > 0) {
        const totalBilled = activeBills.reduce((sum, b) => sum + b.workDoneAmount, 0);

        // Determine the new effective WO limit
        const newGrandTotal = data.financials?.grandTotal
          ?? data.amount
          ?? existing.financials?.grandTotal
          ?? existing.amount;

        if (newGrandTotal < totalBilled) {
          throw new BusinessRuleError(
            'WORK_ORDER_FINANCIAL_CONFLICT',
            `Cannot reduce work order value to ${newGrandTotal}. Already billed: ${totalBilled}.`
          );
        }
      }
    }

    await updateDocument(COLLECTION, id, data as Record<string, unknown>);
    await logAction('UPDATE', 'WorkOrder', id, `Updated work order: ${data.title || existing.woNumber}`);
  },

  approve: async (id: string, userId: string): Promise<void> => {
    const wo = await getDocument<WorkOrder>(COLLECTION, id);
    if (!wo) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Work order ${id} does not exist.`);
    if (wo.status !== 'PENDING') {
      throw new BusinessRuleError('WORK_ORDER_LOCKED', `Work order ${wo.woNumber} must be PENDING to approve (current: ${wo.status}).`);
    }
    await updateDocument(COLLECTION, id, {
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: new Date().toISOString()
    });
    await logAction('APPROVE', 'WorkOrder', id, `Approved work order: ${wo.woNumber}`);
  },

  reject: async (id: string): Promise<void> => {
    const wo = await getDocument<WorkOrder>(COLLECTION, id);
    if (!wo) throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Work order ${id} does not exist.`);

    // Cannot reject if active bills exist
    const activeBills = await getActiveBillsForWO(id);
    if (activeBills.length > 0) {
      throw new BusinessRuleError('WORK_ORDER_HAS_BILLS', `Work order ${wo.woNumber} has ${activeBills.length} active bill(s) and cannot be rejected.`);
    }

    await updateDocument(COLLECTION, id, { status: 'REJECTED' });
    await logAction('REJECT', 'WorkOrder', id, `Rejected work order: ${wo.woNumber}`);
  },

  /**
   * Delete a work order. Blocked if it has:
   * - Any non-rejected bills
   * - Any non-rejected payments (through its bills)
   * - Any approved variation orders
   */
  delete: async (id: string): Promise<void> => {
    const wo = await getDocument<WorkOrder>(COLLECTION, id);
    if (!wo) return; // Already gone

    // Check for linked bills
    const activeBills = await getActiveBillsForWO(id);
    if (activeBills.length > 0) {
      throw new BusinessRuleError(
        'WORK_ORDER_HAS_BILLS',
        `Cannot delete work order ${wo.woNumber}: ${activeBills.length} active bill(s) exist.`
      );
    }

    // Check for linked payments (through bills, including rejected bills that may have payments)
    const activePayments = await getActivePaymentsForWO(id);
    if (activePayments.length > 0) {
      throw new BusinessRuleError(
        'WORK_ORDER_HAS_PAYMENTS',
        `Cannot delete work order ${wo.woNumber}: ${activePayments.length} active payment(s) exist.`
      );
    }

    // Check for approved variation orders
    const vos = await queryDocuments<VariationOrder>('variationOrders', [
      where('workOrderId', '==', id)
    ]);
    const approvedVOs = vos.filter(vo => vo.status === 'APPROVED');
    if (approvedVOs.length > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `Cannot delete work order ${wo.woNumber}: ${approvedVOs.length} approved variation order(s) exist.`
      );
    }

    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'WorkOrder', id, `Deleted work order: ${wo.woNumber}`);
  }
};
