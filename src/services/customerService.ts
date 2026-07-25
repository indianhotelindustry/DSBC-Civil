import { Customer, SubLocation, BusinessRuleError } from '../types';
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

const COLLECTION = 'customers';

/**
 * Customer master service.
 *
 * The `customers` collection is deliberately named broadly — it is used for
 * SubLocation unit ownership today, but may host other SIPL buyer/customer
 * records in the future. HOSPITALITY (SHSPL) does not use this collection.
 *
 * Duplicate-prevention rule: within the same company, (name + phone) must
 * be unique. Matching is normalized — name compared case-insensitively
 * after trim, phone compared as digits-only — so "Rahul Sharma / +91 98765-43210"
 * will not be allowed alongside "rahul sharma / 9876543210".
 *
 * Delete is blocked while any SubLocation still references the customer
 * via `ownerClientId` (prevents orphaned ownership snapshots from losing
 * their master record while the unit is still marked SOLD).
 */

/** Normalize a name for duplicate-detection comparison. */
function normName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}
/** Normalize a phone for duplicate-detection comparison (digits only). */
function normPhone(s: string): string {
  return (s || '').replace(/\D+/g, '');
}

/** Throws if another customer in the same company already has the same
 *  normalized (name, phone). `excludeId` skips a specific doc on update. */
async function assertNoDuplicate(
  companyId: string,
  name: string,
  phone: string,
  excludeId?: string
): Promise<void> {
  const existing = await queryDocuments<Customer>(COLLECTION, [
    where('companyId', '==', companyId)
  ]);
  const nName = normName(name);
  const nPhone = normPhone(phone);
  const dup = existing.find(c =>
    c.id !== excludeId &&
    normName(c.name) === nName &&
    normPhone(c.phone) === nPhone
  );
  if (dup) {
    throw new BusinessRuleError(
      'DELETE_BLOCKED',
      `A customer with this name and phone already exists for this company (${dup.name}).`
    );
  }
}
export const customerService = {
  getAll: (callback: (customers: Customer[]) => void) => {
    return subscribeToCollection<Customer>(COLLECTION, (data) => {
      callback(data.sort((a, b) => a.name.localeCompare(b.name)));
    });
  },

  getByCompany: (companyId: string, callback: (customers: Customer[]) => void) => {
    return subscribeToCollection<Customer>(COLLECTION, (data) => {
      callback(
        data
          .filter(c => c.companyId === companyId)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  },

  getById: async (id: string): Promise<Customer | null> => {
    return getDocument<Customer>(COLLECTION, id);
  },

  create: async (data: Omit<Customer, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>): Promise<string> => {
    await assertNoDuplicate(data.companyId, data.name, data.phone);
    const now = new Date().toISOString();
    const id = await createDocument(COLLECTION, { ...data, updatedAt: now } as Record<string, unknown>);
    await logAction('CREATE', 'Customer', id, `Created customer: ${data.name}`);
    return id;
  },

  update: async (id: string, data: Partial<Customer>): Promise<void> => {
    // If name or phone is being changed, re-check uniqueness within the company.
    if (data.name !== undefined || data.phone !== undefined) {
      const existing = await getDocument<Customer>(COLLECTION, id);
      if (existing) {
        const nextName = data.name ?? existing.name;
        const nextPhone = data.phone ?? existing.phone;
        const nextCompanyId = data.companyId ?? existing.companyId;
        await assertNoDuplicate(nextCompanyId, nextName, nextPhone, id);
      }
    }
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, id, { ...data, updatedAt: now } as Record<string, unknown>);
    await logAction('UPDATE', 'Customer', id, `Updated customer: ${data.name || id}`);
  },

  delete: async (id: string): Promise<void> => {
    const existing = await getDocument<Customer>(COLLECTION, id);
    if (!existing) return;
    // Block delete while any SubLocation still lists this customer as owner.
    const linkedUnits = await queryDocuments<SubLocation>('subLocations', [
      where('ownerClientId', '==', id)
    ]);
    if (linkedUnits.length > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `Cannot delete ${existing.name}: ${linkedUnits.length} unit(s) are still owned by this customer. Mark them UNSOLD or reassign first.`
      );
    }
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Customer', id, `Deleted customer: ${existing.name}`);
  }
};
