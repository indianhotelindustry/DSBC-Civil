import { Adjustment } from '../types';
import { 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  subscribeToCollection, 
  logAction 
} from './db';

const COLLECTION = 'adjustments';

export const adjustmentService = {
  getAll: (callback: (adjustments: Adjustment[]) => void) => {
    return subscribeToCollection<Adjustment>(COLLECTION, callback);
  },
  
  create: async (data: Omit<Adjustment, 'id' | 'createdAt' | 'createdBy'>) => {
    const id = await createDocument(COLLECTION, data);
    if (id) {
      await logAction('CREATE', 'Adjustment', id, `Created adjustment for contractor: ${data.contractorId}`);
    }
    return id;
  },
  
  update: async (id: string, data: Partial<Adjustment>) => {
    await updateDocument(COLLECTION, id, data);
    await logAction('UPDATE', 'Adjustment', id, `Updated adjustment: ${id}`);
  },
  
  delete: async (id: string) => {
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Adjustment', id, `Deleted adjustment: ${id}`);
  }
};
