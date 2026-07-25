import { UOM, BusinessRuleError } from '../types';
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
import { normaliseSymbol } from '../lib/masterValidations';

const COLLECTION = 'uoms';

function sort(list: UOM[]): UOM[] {
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export const uomService = {
  getAll: (callback: (uoms: UOM[]) => void) =>
    subscribeToCollection<UOM>(COLLECTION, data => callback(sort(data))),

  getActive: (callback: (uoms: UOM[]) => void) =>
    subscribeToCollection<UOM>(COLLECTION, data =>
      callback(sort(data.filter(u => u.isActive !== false))),
    ),

  getById: async (id: string): Promise<UOM | null> => getDocument<UOM>(COLLECTION, id),

  create: async (
    data: Omit<UOM, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>,
  ): Promise<string> => {
    const name = (data.name || '').trim();
    if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'UOM name is required.');
    const symbol = normaliseSymbol(data.symbol || '');
    if (!symbol) throw new BusinessRuleError('DUPLICATE_CODE', 'UOM symbol is required.');
    await assertNameUnique(name);
    await assertSymbolUnique(symbol);
    const id = await createDocument(COLLECTION, {
      ...data,
      name,
      symbol,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('CREATE', 'UOM', id, `Created UOM: ${symbol} (${name})`);
    return id;
  },

  update: async (id: string, data: Partial<UOM>): Promise<void> => {
    if (typeof data.name === 'string') {
      const trimmed = data.name.trim();
      if (!trimmed) throw new BusinessRuleError('DUPLICATE_NAME', 'UOM name cannot be empty.');
      await assertNameUnique(trimmed, id);
      data = { ...data, name: trimmed };
    }
    if (typeof data.symbol === 'string') {
      const sym = normaliseSymbol(data.symbol);
      if (!sym) throw new BusinessRuleError('DUPLICATE_CODE', 'UOM symbol cannot be empty.');
      await assertSymbolUnique(sym, id);
      data = { ...data, symbol: sym };
    }
    await updateDocument(COLLECTION, id, {
      ...data,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('UPDATE', 'UOM', id, `Updated UOM: ${data.symbol ?? id}`);
  },

  delete: async (id: string): Promise<void> => {
    const uom = await getDocument<UOM>(COLLECTION, id);
    if (!uom) return;
    const linked = await queryDocuments<{ id: string }>('materials', [
      where('uomId', '==', id),
    ]);
    if (linked.length > 0) {
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `Cannot delete "${uom.symbol}": ${linked.length} material(s) use it. Mark Inactive instead.`,
      );
    }
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'UOM', id, `Deleted UOM: ${uom.symbol}`);
  },
};

async function assertNameUnique(name: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<UOM>(COLLECTION, []);
  const target = name.trim().toLowerCase();
  const clash = all.find(u => u.id !== excludeId && (u.name || '').trim().toLowerCase() === target);
  if (clash) throw new BusinessRuleError('DUPLICATE_NAME', `A UOM named "${clash.name}" already exists.`);
}

async function assertSymbolUnique(symbol: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<UOM>(COLLECTION, []);
  const target = symbol.toUpperCase();
  const clash = all.find(u => u.id !== excludeId && (u.symbol || '').toUpperCase() === target);
  if (clash) throw new BusinessRuleError('DUPLICATE_CODE', `Symbol "${clash.symbol}" is already used.`);
}
