import { Material, MaterialCategory, UOM, BusinessRuleError } from '../types';
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

const COLLECTION = 'materials';

function sort(list: Material[]): Material[] {
  return [...list].sort((a, b) => {
    const byCat = (a.categoryName || '').localeCompare(b.categoryName || '');
    if (byCat !== 0) return byCat;
    return (a.name || '').localeCompare(b.name || '');
  });
}

export const materialService = {
  getAll: (callback: (mats: Material[]) => void) =>
    subscribeToCollection<Material>(COLLECTION, data => callback(sort(data))),

  getActive: (callback: (mats: Material[]) => void) =>
    subscribeToCollection<Material>(COLLECTION, data =>
      callback(sort(data.filter(m => m.isActive !== false))),
    ),

  getByCategory: (categoryId: string, callback: (mats: Material[]) => void) =>
    subscribeToCollection<Material>(COLLECTION, data =>
      callback(sort(data.filter(m => m.materialCategoryId === categoryId))),
      [where('materialCategoryId', '==', categoryId)],
    ),

  getById: async (id: string): Promise<Material | null> =>
    getDocument<Material>(COLLECTION, id),

  create: async (
    data: Omit<Material, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'categoryName' | 'uomSymbol'>,
  ): Promise<string> => {
    const code = normaliseCode(data.code || '');
    if (!code) throw new BusinessRuleError('DUPLICATE_CODE', 'Material code is required.');
    const name = (data.name || '').trim();
    if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'Material name is required.');
    if (!data.materialCategoryId) throw new BusinessRuleError('CONFIG_REQUIRED', 'Category is required.');
    if (!data.uomId) throw new BusinessRuleError('CONFIG_REQUIRED', 'Unit of Measure is required.');

    await assertCodeUnique(code);

    const [category, uom] = await Promise.all([
      getDocument<MaterialCategory>('materialCategories', data.materialCategoryId),
      getDocument<UOM>('uoms', data.uomId),
    ]);

    const id = await createDocument(COLLECTION, {
      ...data,
      code,
      name,
      categoryName: category?.name ?? '',
      uomSymbol: uom?.symbol ?? '',
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('CREATE', 'Material', id, `Created material: ${code} – ${name}`);
    return id;
  },

  update: async (id: string, data: Partial<Material>): Promise<void> => {
    const payload: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };

    if (typeof data.code === 'string') {
      const code = normaliseCode(data.code);
      if (!code) throw new BusinessRuleError('DUPLICATE_CODE', 'Material code cannot be empty.');
      await assertCodeUnique(code, id);
      payload.code = code;
    }
    if (typeof data.name === 'string') {
      const name = data.name.trim();
      if (!name) throw new BusinessRuleError('DUPLICATE_NAME', 'Material name cannot be empty.');
      payload.name = name;
    }
    if (data.materialCategoryId) {
      const cat = await getDocument<MaterialCategory>('materialCategories', data.materialCategoryId);
      payload.categoryName = cat?.name ?? '';
    }
    if (data.uomId) {
      const uom = await getDocument<UOM>('uoms', data.uomId);
      payload.uomSymbol = uom?.symbol ?? '';
    }

    await updateDocument(COLLECTION, id, payload);
    await logAction('UPDATE', 'Material', id, `Updated material: ${data.code ?? id}`);
  },

  delete: async (id: string): Promise<void> => {
    const material = await getDocument<Material>(COLLECTION, id);
    if (!material) return;
    // Guard: will be extended in R3 when Material Requests reference materials
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Material', id, `Deleted material: ${material.code} – ${material.name}`);
  },
};

async function assertCodeUnique(code: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<Material>(COLLECTION, []);
  const clash = all.find(
    m => m.id !== excludeId && (m.code || '').toUpperCase() === code.toUpperCase(),
  );
  if (clash) {
    throw new BusinessRuleError('DUPLICATE_CODE', `Material code "${clash.code}" already exists.`);
  }
}
