import { DailySummary } from '../types';
import { 
  subscribeToCollection, 
} from './db';

const COLLECTION = 'dailySummaries';

export const summaryService = {
  getAll: (callback: (summaries: DailySummary[]) => void) => {
    return subscribeToCollection<DailySummary>(COLLECTION, (data) => {
      const sorted = [...data].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(sorted);
    });
  },

  getLatest: (callback: (summary: DailySummary | null) => void) => {
    return subscribeToCollection<DailySummary>(COLLECTION, (data) => {
      if (data.length === 0) {
        callback(null);
        return;
      }
      const sorted = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(sorted[0]);
    });
  }
};
