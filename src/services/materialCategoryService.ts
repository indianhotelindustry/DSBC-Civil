import { MaterialCategory, BusinessRuleError } from '../types';
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

const COLLECTION = 'materialCategories';

function sort(list: MaterialCategory[]): MaterialCategory[] {
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export const materialCategoryService = {
  getAll: (callback: (cats: MaterialCategory[]) => void) =>
    subscribeToCollection<MaterialCategory>(COLLECTION, data => callback(sort(data))),

  getActive: (callback: (cats: MaterialCategory[]) => void) =>
    subscribeToCollection<MaterialCategory>(COLLECTION, data =>
      callback(sort(data.filter(c => c.isActive !== false))),
    ),

  getById: async (id: string): Promise<MaterialCategory | null> =>
    getDocument<MaterialCategory>(COLLECTION, id),

  create: async (
    data: Omit<MaterialCategory, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>,
  ): Promise<string> => {
    const name = (data.name || '').trim();
    if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'Category name is required.');
    await assertNameUnique(name);
    const id = await createDocument(COLLECTION, {
      ...data,
      name,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('CREATE', 'MaterialCategory', id, `Created material category: ${name}`);
    return id;
  },

  update: async (id: string, data: Partial<MaterialCategory>): Promise<void> => {
    if (typeof data.name === 'string') {
      const trimmed = data.name.trim();
      if (!trimmed) throw new BusinessRuleError('DUPLICATE_NAME', 'Category name cannot be empty.');
      await assertNameUnique(trimmed, id);
      data = { ...data, name: trimmed };
    }
    await updateDocument(COLLECTION, id, {
      ...data,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('UPDATE', 'MaterialCategory', id, `Updated material category: ${data.name ?? id}`);
  },

  delete: async (id: string): Promise<void> => {
    const category = await getDocument<MaterialCategory>(COLLECTION, id);
    if (!category) return;
    const linked = await queryDocuments<{ id: string }>('materials', [
      where('materialCategoryId', '==', id),
    ]);
    if (linked.length > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `Cannot delete "${category.name}": ${linked.length} material(s) reference it. Mark Inactive instead.`,
      );
    }
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'MaterialCategory', id, `Deleted material category: ${category.name}`);
  },
};

async function assertNameUnique(name: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<MaterialCategory>(COLLECTION, []);
  const target = name.trim().toLowerCase();
  const clash = all.find(c => c.id !== excludeId && (c.name || '').trim().toLowerCase() === target);
  if (clash) {
    throw new BusinessRuleError('DUPLICATE_NAME', `A category named "${clash.name}" already exists.`);
  }
}
