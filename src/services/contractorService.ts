import { Contractor, WorkOrder, BusinessRuleError } from '../types';
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

const COLLECTION = 'contractors';

export const contractorService = {
  getAll: (callback: (contractors: Contractor[]) => void) => {
    return subscribeToCollection<Contractor>(COLLECTION, callback);
  },

  getById: async (id: string): Promise<Contractor | null> => {
    return getDocument<Contractor>(COLLECTION, id);
  },

  create: async (data: Omit<Contractor, 'id' | 'createdAt' | 'createdBy'>) => {
    const id = await createDocument(COLLECTION, data);
    if (id) {
      await logAction('CREATE', 'Contractor', id, `Created contractor: ${data.name}`);
    }
    return id;
  },

  update: async (id: string, data: Partial<Contractor>) => {
    await updateDocument(COLLECTION, id, data);
    await logAction('UPDATE', 'Contractor', id, `Updated contractor: ${data.name || id}`);
  },

  delete: async (id: string) => {
    const contractor = await getDocument<Contractor>(COLLECTION, id);
    if (!contractor) return;

    // Block if any work orders reference this contractor
    const workOrders = await queryDocuments<WorkOrder>('workOrders', [
      where('contractorId', '==', id)
    ]);
    const activeWOs = workOrders.filter(wo => wo.status !== 'REJECTED');
    if (activeWOs.length > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `Cannot delete contractor ${contractor.name}: ${activeWOs.length} active work order(s) exist.`
      );
    }

    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Contractor', id, `Deleted contractor: ${contractor.name}`);
  }
};
