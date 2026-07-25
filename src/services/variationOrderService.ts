import { VariationOrder, WorkOrder, Bill, BusinessRuleError } from '../types';
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
import { workOrderService } from './workOrderService';
import { secureApproveVariationOrder } from './secureApi';

const COLLECTION = 'variationOrders';

export const variationOrderService = {
  getAll: (callback: (vos: VariationOrder[]) => void) => {
    return subscribeToCollection<VariationOrder>(COLLECTION, callback);
  },

  /**
   * Real-time subscription filtered to a specific work order.
   */
  getByWorkOrderId: (workOrderId: string, callback: (vos: VariationOrder[]) => void) => {
    return subscribeToCollection<VariationOrder>(COLLECTION, (allVOs) => {
      callback(allVOs.filter(vo => vo.workOrderId === workOrderId));
    });
  },

  /**
   * Create a variation order with validation:
   * - Work order must exist
   * - Work order must be APPROVED or COMPLETED
   * - VO must start as DRAFT
   */
  create: async (data: Omit<VariationOrder, 'id' | 'createdAt' | 'createdBy'>): Promise<string> => {
    // Work order must exist
    const wo = await getDocument<WorkOrder>('workOrders', data.workOrderId);
    if (!wo) {
      throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Work order ${data.workOrderId} does not exist.`);
    }

    // Work order must be in an active state
    if (wo.status !== 'APPROVED' && wo.status !== 'COMPLETED') {
      throw new BusinessRuleError('WORK_ORDER_NOT_APPROVED', `Work order ${wo.woNumber} is not approved (status: ${wo.status}).`);
    }

    // VO must start as DRAFT
    if (data.status !== 'DRAFT') {
      throw new BusinessRuleError('VARIATION_ORDER_INVALID_STATUS', `Variation orders must be created with DRAFT status.`);
    }

    const id = await createDocument(COLLECTION, data as Record<string, unknown>);
    await logAction('CREATE', 'VariationOrder', id, `Created VO: ${data.voNumber} for WO: ${wo.woNumber}`);
    return id;
  },

  /**
   * Approve a variation order and update the linked work order's financial totals.
   * Delegated to server for authoritative validation and Firestore transaction.
   * Status flow: DRAFT → APPROVED
   */
  approve: async (id: string, _userId: string): Promise<void> => {
    await secureApproveVariationOrder(id);
  },

  /**
   * Reject a variation order. Status flow: DRAFT → REJECTED
   */
  reject: async (id: string, userId: string): Promise<void> => {
    const vo = await getDocument<VariationOrder>(COLLECTION, id);
    if (!vo) {
      throw new BusinessRuleError('VARIATION_ORDER_NOT_FOUND', `Variation order ${id} does not exist.`);
    }

    if (vo.status !== 'DRAFT') {
      throw new BusinessRuleError('VARIATION_ORDER_INVALID_STATUS', `VO ${vo.voNumber} must be DRAFT to reject (current: ${vo.status}).`);
    }

    await updateDocument(COLLECTION, id, { status: 'REJECTED' });
    await logAction('REJECT', 'VariationOrder', id, `Rejected VO: ${vo.voNumber}`);
  },

  /**
   * Update a variation order. Only DRAFT VOs can be edited.
   */
  update: async (id: string, data: Partial<VariationOrder>): Promise<void> => {
    const existing = await getDocument<VariationOrder>(COLLECTION, id);
    if (!existing) {
      throw new BusinessRuleError('VARIATION_ORDER_NOT_FOUND', `Variation order ${id} does not exist.`);
    }

    if (existing.status !== 'DRAFT') {
      // Allow only status-transition updates
      const isStatusTransition = Object.keys(data).every(k =>
        ['status', 'approvedBy', 'approvedAt'].includes(k)
      );
      if (!isStatusTransition) {
        throw new BusinessRuleError('VARIATION_ORDER_LOCKED', `VO ${existing.voNumber} is ${existing.status} and cannot be edited.`);
      }
    }

    await updateDocument(COLLECTION, id, data as Record<string, unknown>);
    await logAction('UPDATE', 'VariationOrder', id, `Updated VO: ${existing.voNumber}`);
  },

  /**
   * Delete a variation order.
   * Approved VOs cannot be deleted (they've already modified the WO value).
   */
  delete: async (id: string): Promise<void> => {
    const vo = await getDocument<VariationOrder>(COLLECTION, id);
    if (!vo) return; // Already gone

    if (vo.status === 'APPROVED') {
      throw new BusinessRuleError(
        'VARIATION_ORDER_LOCKED',
        `VO ${vo.voNumber} is APPROVED and has modified the work order value. It cannot be deleted.`
      );
    }

    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'VariationOrder', id, `Deleted VO: ${vo.voNumber}`);
  }
};
