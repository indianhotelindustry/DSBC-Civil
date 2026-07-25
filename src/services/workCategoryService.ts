import { WorkCategory, WorkOrder, BusinessRuleError } from '../types';
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

const COLLECTION = 'workCategories';

/**
 * Master-managed work categories used by the New Work Order form.
 *
 * Sort: displayOrder ASC, then name ASC. The seed assigns stable
 * displayOrder values 10, 20, 30… so an admin can insert custom
 * categories between defaults without mass-renumbering.
 *
 * Delete guard: a category is blocked from hard-delete while any
 * non-REJECTED work order references it by name. The correct admin
 * action is to toggle isActive=false so the category disappears from
 * the form but legacy WO reads still resolve.
 */

function sort(list: WorkCategory[]): WorkCategory[] {
  return [...list].sort((a, b) => {
    const byOrder = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    if (byOrder !== 0) return byOrder;
    return (a.name || '').localeCompare(b.name || '');
  });
}

export const workCategoryService = {
  getAll: (callback: (cats: WorkCategory[]) => void) => {
    return subscribeToCollection<WorkCategory>(COLLECTION, (data) => callback(sort(data)));
  },

  getActive: (callback: (cats: WorkCategory[]) => void) => {
    return subscribeToCollection<WorkCategory>(COLLECTION, (data) =>
      callback(sort(data.filter(c => c.isActive !== false)))
    );
  },

  getById: async (id: string): Promise<WorkCategory | null> => {
    return getDocument<WorkCategory>(COLLECTION, id);
  },

  create: async (
    data: Omit<WorkCategory, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>
  ): Promise<string> => {
    const name = (data.name || '').trim();
    if (!name) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Category name is required.');
    }
    await assertNameUnique(name);
    const id = await createDocument(COLLECTION, {
      ...data,
      name,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('CREATE', 'WorkCategory', id, `Created work category: ${name}`);
    return id;
  },

  update: async (id: string, data: Partial<WorkCategory>): Promise<void> => {
    if (typeof data.name === 'string') {
      const trimmed = data.name.trim();
      if (!trimmed) {
        throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Category name cannot be empty.');
      }
      await assertNameUnique(trimmed, id);
      data = { ...data, name: trimmed };
    }
    await updateDocument(COLLECTION, id, {
      ...data,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('UPDATE', 'WorkCategory', id, `Updated work category: ${data.name ?? id}`);
  },

  delete: async (id: string): Promise<void> => {
    const category = await getDocument<WorkCategory>(COLLECTION, id);
    if (!category) return;
    // Hard-delete guard: if any non-REJECTED work order references this
    // category by name, block and direct the admin to toggle isActive
    // instead so legacy WOs keep reading the name cleanly.
    const linked = await queryDocuments<WorkOrder>('workOrders', [
      where('workCategory', '==', category.name),
    ]);
    const activeLinked = linked.filter(wo => wo.status !== 'REJECTED');
    if (activeLinked.length > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `Cannot delete "${category.name}": ${activeLinked.length} work order(s) reference it. Toggle Inactive instead.`
      );
    }
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'WorkCategory', id, `Deleted work category: ${category.name}`);
  },
};

async function assertNameUnique(name: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<WorkCategory>(COLLECTION, []);
  const target = name.trim().toLowerCase();
  const clash = all.find(c => c.id !== excludeId && (c.name || '').trim().toLowerCase() === target);
  if (clash) {
    throw new BusinessRuleError(
      'DELETE_BLOCKED',
      `A work category named "${clash.name}" already exists.`
    );
  }
}
