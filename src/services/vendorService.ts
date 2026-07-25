import { Vendor, BusinessRuleError } from '../types';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  getDocument,
  queryDocuments,
  logAction,
} from './db';
import { normaliseCode } from '../lib/masterValidations';

const COLLECTION = 'vendors';

function sort(list: Vendor[]): Vendor[] {
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export const vendorService = {
  getAll: (callback: (vendors: Vendor[]) => void) =>
    subscribeToCollection<Vendor>(COLLECTION, data => callback(sort(data))),

  getActive: (callback: (vendors: Vendor[]) => void) =>
    subscribeToCollection<Vendor>(COLLECTION, data =>
      callback(sort(data.filter(v => v.isActive !== false))),
    ),

  getById: async (id: string): Promise<Vendor | null> => getDocument<Vendor>(COLLECTION, id),

  create: async (
    data: Omit<Vendor, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>,
  ): Promise<string> => {
    const name = (data.name || '').trim();
    if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'Vendor name is required.');
    const code = data.code ? normaliseCode(data.code) : undefined;
    if (code) await assertCodeUnique(code);

    const id = await createDocument(COLLECTION, {
      ...data,
      name,
      ...(code !== undefined && { code }),
      gstin: data.gstin ? data.gstin.trim().toUpperCase() : undefined,
      pan: data.pan ? data.pan.trim().toUpperCase() : undefined,
      bankIfsc: data.bankIfsc ? data.bankIfsc.trim().toUpperCase() : undefined,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('CREATE', 'Vendor', id, `Created vendor: ${name}`);
    return id;
  },

  update: async (id: string, data: Partial<Vendor>): Promise<void> => {
    const payload: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
    if (typeof data.name === 'string') {
      const name = data.name.trim();
      if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'Vendor name cannot be empty.');
      payload.name = name;
    }
    if (typeof data.code === 'string' && data.code.trim()) {
      const code = normaliseCode(data.code);
      await assertCodeUnique(code, id);
      payload.code = code;
    }
    if (typeof data.gstin === 'string') payload.gstin = data.gstin.trim().toUpperCase();
    if (typeof data.pan === 'string') payload.pan = data.pan.trim().toUpperCase();
    if (typeof data.bankIfsc === 'string') payload.bankIfsc = data.bankIfsc.trim().toUpperCase();

    await updateDocument(COLLECTION, id, payload);
    await logAction('UPDATE', 'Vendor', id, `Updated vendor: ${data.name ?? id}`);
  },

  delete: async (id: string): Promise<void> => {
    const vendor = await getDocument<Vendor>(COLLECTION, id);
    if (!vendor) return;
    // Guard: will be extended in R3 when Purchase Orders reference vendors
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Vendor', id, `Deleted vendor: ${vendor.name}`);
  },
};

async function assertCodeUnique(code: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<Vendor>(COLLECTION, []);
  const clash = all.find(
    v => v.id !== excludeId && v.code && v.code.toUpperCase() === code.toUpperCase(),
  );
  if (clash) {
    throw new BusinessRuleError('DUPLICATE_CODE', `Vendor code "${clash.code}" already exists.`);
  }
}
