import { Alert } from '../types';
import { 
  updateDocument, 
  deleteDocument, 
  subscribeToCollection, 
  logAction 
} from './db';

const COLLECTION = 'alerts';

export const alertService = {
  getAll: (callback: (alerts: Alert[]) => void) => {
    return subscribeToCollection<Alert>(COLLECTION, (data) => {
      // Sort by timestamp descending
      const sorted = [...data].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      callback(sorted);
    });
  },
  
  markAsRead: async (id: string) => {
    await updateDocument(COLLECTION, id, { read: true });
  },
  
  delete: async (id: string) => {
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Alert', id, `Deleted alert: ${id}`);
  }
};
