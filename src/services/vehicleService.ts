import { Vehicle, BusinessRuleError } from '../types';
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
import { normaliseRegistrationNumber } from '../lib/masterValidations';

const COLLECTION = 'vehicles';

function sort(list: Vehicle[]): Vehicle[] {
  return [...list].sort((a, b) =>
    (a.registrationNumber || '').localeCompare(b.registrationNumber || ''),
  );
}

export const vehicleService = {
  getAll: (callback: (vehicles: Vehicle[]) => void) =>
    subscribeToCollection<Vehicle>(COLLECTION, data => callback(sort(data))),

  getActive: (callback: (vehicles: Vehicle[]) => void) =>
    subscribeToCollection<Vehicle>(COLLECTION, data =>
      callback(sort(data.filter(v => v.isActive !== false))),
    ),

  getByCompany: (companyId: string, callback: (vehicles: Vehicle[]) => void) =>
    subscribeToCollection<Vehicle>(
      COLLECTION,
      data => callback(sort(data)),
      [where('companyId', '==', companyId)],
    ),

  getById: async (id: string): Promise<Vehicle | null> => getDocument<Vehicle>(COLLECTION, id),

  create: async (
    data: Omit<Vehicle, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>,
  ): Promise<string> => {
    const regNum = normaliseRegistrationNumber(data.registrationNumber || '');
    if (!regNum) throw new BusinessRuleError('DUPLICATE_CODE', 'Registration number is required.');
    if (!data.companyId) throw new BusinessRuleError('CONFIG_REQUIRED', 'Company is required.');
    await assertRegNumUnique(regNum);

    const id = await createDocument(COLLECTION, {
      ...data,
      registrationNumber: regNum,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
    await logAction('CREATE', 'Vehicle', id, `Created vehicle: ${regNum}`);
    return id;
  },

  update: async (id: string, data: Partial<Vehicle>): Promise<void> => {
    const payload: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
    if (typeof data.registrationNumber === 'string') {
      const regNum = normaliseRegistrationNumber(data.registrationNumber);
      if (!regNum) throw new BusinessRuleError('DUPLICATE_CODE', 'Registration number cannot be empty.');
      await assertRegNumUnique(regNum, id);
      payload.registrationNumber = regNum;
    }
    await updateDocument(COLLECTION, id, payload);
    await logAction('UPDATE', 'Vehicle', id, `Updated vehicle: ${data.registrationNumber ?? id}`);
  },

  delete: async (id: string): Promise<void> => {
    const vehicle = await getDocument<Vehicle>(COLLECTION, id);
    if (!vehicle) return;
    // Guard: will be extended in R6 when delivery trips reference vehicles
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Vehicle', id, `Deleted vehicle: ${vehicle.registrationNumber}`);
  },
};

async function assertRegNumUnique(regNum: string, excludeId?: string): Promise<void> {
  const all = await queryDocuments<Vehicle>(COLLECTION, []);
  const clash = all.find(
    v =>
      v.id !== excludeId &&
      normaliseRegistrationNumber(v.registrationNumber) === regNum,
  );
  if (clash) {
    throw new BusinessRuleError(
      'DUPLICATE_CODE',
      `Vehicle registration "${clash.registrationNumber}" already exists.`,
    );
  }
}
