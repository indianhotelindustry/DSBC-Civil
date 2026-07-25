import { Company, Project, BusinessRuleError } from '../types';
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

const COLLECTION = 'companies';

export const companyService = {
  getAll: (callback: (companies: Company[]) => void) => {
    return subscribeToCollection<Company>(COLLECTION, (data) => {
      callback(data.sort((a, b) => a.code.localeCompare(b.code)));
    });
  },

  getById: async (id: string): Promise<Company | null> => {
    return getDocument<Company>(COLLECTION, id);
  },

  create: async (data: Omit<Company, 'id' | 'createdAt' | 'createdBy'>): Promise<string> => {
    const id = await createDocument(COLLECTION, data as Record<string, unknown>);
    await logAction('CREATE', 'Company', id, `Created company: ${data.name}`);
    return id;
  },

  update: async (id: string, data: Partial<Company>): Promise<void> => {
    await updateDocument(COLLECTION, id, data as Record<string, unknown>);
    await logAction('UPDATE', 'Company', id, `Updated company: ${id}`);
  },

  delete: async (id: string): Promise<void> => {
    const projects = await queryDocuments<Project>('projects', [
      where('companyId', '==', id)
    ]);
    if (projects.length > 0) {
      throw new BusinessRuleError('DELETE_BLOCKED', `Cannot delete company: ${projects.length} project(s) exist.`);
    }
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Company', id, `Deleted company: ${id}`);
  }
};
