import { TermsTemplate } from '../types';
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

const COLLECTION = 'termsTemplates';

export const termsTemplateService = {
  getAll: (callback: (templates: TermsTemplate[]) => void) => {
    return subscribeToCollection<TermsTemplate>(COLLECTION, (data) => {
      const sorted = [...data].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return a.name.localeCompare(b.name);
      });
      callback(sorted);
    });
  },

  getActive: (callback: (templates: TermsTemplate[]) => void) => {
    return subscribeToCollection<TermsTemplate>(COLLECTION, (data) => {
      const active = data
        .filter(t => t.isActive)
        .sort((a, b) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return a.name.localeCompare(b.name);
        });
      callback(active);
    });
  },

  getById: async (id: string): Promise<TermsTemplate | null> => {
    return getDocument<TermsTemplate>(COLLECTION, id);
  },

  create: async (data: Omit<TermsTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> => {
    // If this is being set as default, unset other defaults first
    if (data.isDefault) {
      await termsTemplateService.clearDefaults();
    }

    const id = await createDocument(COLLECTION, {
      ...data,
      updatedAt: new Date().toISOString()
    } as Record<string, unknown>);
    await logAction('CREATE', 'TermsTemplate', id, `Created terms template: ${data.name}`);
    return id;
  },

  update: async (id: string, data: Partial<TermsTemplate>): Promise<void> => {
    // If setting as default, unset other defaults first
    if (data.isDefault) {
      await termsTemplateService.clearDefaults(id);
    }

    await updateDocument(COLLECTION, id, {
      ...data,
      updatedAt: new Date().toISOString()
    } as Record<string, unknown>);
    await logAction('UPDATE', 'TermsTemplate', id, `Updated terms template: ${id}`);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'TermsTemplate', id, `Deleted terms template: ${id}`);
  },

  /** Unset isDefault on all templates except the given excludeId */
  clearDefaults: async (excludeId?: string): Promise<void> => {
    const all = await queryDocuments<TermsTemplate>(COLLECTION, []);
    for (const t of all) {
      if (t.isDefault && t.id !== excludeId) {
        await updateDocument(COLLECTION, t.id, {
          isDefault: false,
          updatedAt: new Date().toISOString()
        });
      }
    }
  }
};
