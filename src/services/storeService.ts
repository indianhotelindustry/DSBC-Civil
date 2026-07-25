import { Store, BusinessRuleError } from '../types';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  getDocument,
  queryDocuments,
  logAction,
  where,
} from './db';
import { normaliseCode } from '../lib/masterValidations';

const COLLECTION = 'stores';

function sort(list: Store[]): Store[] {
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export const storeService = {
  getAll: (callback: (stores: Store[]) => void) =>
    subscribeToCollection<Store>(COLLECTION, data => callback(sort(data))),

  getActive: (callback: (stores: Store[]) => void) =>
    subscribeToCollection<Store>(COLLECTION, data =>
      callback(sort(data.filter(s => s.isActive !== false))),
    ),

  getByCompany: (companyId: string, callback: (stores: Store[]) => void) =>
    subscribeToCollection<Store>(
      COLLECTION,
      data => callback(sort(data)),
      [where('companyId', '==', companyId)],
    ),

  getById: async (id: string): Promise<Store | null> => getDocument<Store>(COLLECTION, id),

  create: async (
    data: Omit<Store, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>,
  ): Promise<string> => {
    const code = normaliseCode(data.code || '');
    if (!code) throw new BusinessRuleError('DUPLICATE_CODE', 'Store code is required.');
    const name = (data.name || '').trim();
    if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'Store name is required.');
    if (!data.companyId) throw new BusinessRuleError('CONFIG_REQUIRED', 'Company is required.');
    await assertCodeUnique(code);

    const id = await createDocument(COLLECTION, {
      ...data,
      code,
      name,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('CREATE', 'Store', id, `Created store: ${code} – ${name}`);
    return id;
  },

  update: async (id: string, data: Partial<Store>): Promise<void> => {
    const payload: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
    if (typeof data.code === 'string') {
      const code = normaliseCode(data.code);
      if (!code) throw new BusinessRuleError('DUPLICATE_CODE', 'Store code cannot be empty.');
      await assertCodeUnique(code, id);
      payload.code = code;
    }
    if (typeof data.name === 'string') {
      const name = data.name.trim();
      if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'Store name cannot be empty.');
      payload.name = name;
    }
    await updateDocument(COLLECTION, id, payload);
    await logAction('UPDATE', 'Store', id, `Updated store: ${data.code ?? id}`);
  },

  delete: async (id: string): Promise<void> => {
    const store = await getDocument<Store>(COLLECTION, id);
    if (!store) return;
    // Guard: will be extended in R5/R6 when stock transactions reference stores
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Store', id, `Deleted store: ${store.code} – ${store.name}`);
  },
};

async function assertCodeUnique(code: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<Store>(COLLECTION, []);
  const clash = all.find(
    s => s.id !== excludeId && (s.code || '').toUpperCase() === code.toUpperCase(),
  );
  if (clash) {
    throw new BusinessRuleError('DUPLICATE_CODE', `Store code "${clash.code}" already exists.`);
  }
}
