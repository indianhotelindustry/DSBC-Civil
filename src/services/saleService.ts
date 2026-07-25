import {
  Sale,
  SubLocation,
  Customer,
  Company,
  FundingModel,
  BusinessRuleError
} from '../types';
import { deleteField, doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  subscribeToCollection,
  getDocument,
  queryDocuments,
  executeBatch,
  generateDocId,
  logAction,
  where
} from './db';

const COLLECTION = 'sales';

/**
 * Sale master service (SIPL / CONSTRUCTION only).
 *
 * Ownership sync (authoritative — takes precedence over manual SubLocation
 * ownership edits once a Sale exists):
 *
 *   saleStatus       SubLocation.ownershipStatus   SubLocation.activeSaleId
 *   ──────────────   ───────────────────────────   ────────────────────────
 *   BOOKED           UNSOLD                        set
 *   SOLD             SOLD + owner snapshots         set
 *   POSSESSION_GIVEN SOLD                          set
 *   CANCELLED (Sale) → SubLocation.saleStatus = AVAILABLE, activeSaleId cleared,
 *                      ownership fields cleared if they were set by this sale.
 *
 * Rules:
 *   - A SubLocation can have only ONE active (non-CANCELLED) Sale at a time.
 *   - finalSaleValue must equal agreementValue - discountAmount (strict).
 *   - Funding-total mismatch (booking + advance + loan + selfFunding vs
 *     finalSaleValue) is NOT blocked — UI surfaces a warning.
 *   - Sale can only be created for CONSTRUCTION companies.
 */

export interface SaleCreateInput {
  companyId: string;
  projectId: string;
  subLocationId: string;
  customerId: string;
  saleDate: string;
  fundingModel: FundingModel;
  agreementValue: number;
  discountAmount: number;
  finalSaleValue: number;
  bookingAmount: number;
  advanceAmount: number;
  loanAmount: number;
  selfFundingAmount: number;
  remarks?: string;
}

async function ensureConstructionCompany(companyId: string): Promise<void> {
  const company = await getDocument<Company>('companies', companyId);
  if (!company) {
    throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Company not found.');
  }
  if (company.businessType !== 'CONSTRUCTION') {
    throw new BusinessRuleError(
      'RECORD_LOCKED',
      'Sales module is available only for CONSTRUCTION (SIPL) companies.'
    );
  }
}

async function loadSubLocationOrThrow(subLocationId: string): Promise<SubLocation> {
  const sl = await getDocument<SubLocation>('subLocations', subLocationId);
  if (!sl) {
    throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', 'Unit not found.');
  }
  return sl;
}

async function loadSaleOrThrow(saleId: string): Promise<Sale> {
  const sale = await getDocument<Sale>('sales', saleId);
  if (!sale) {
    throw new BusinessRuleError('WORK_ORDER_NOT_FOUND', `Sale ${saleId} not found.`);
  }
  return sale;
}

function assertFinalSaleValue(agreementValue: number, discountAmount: number, finalSaleValue: number) {
  const expected = +(agreementValue - discountAmount).toFixed(2);
  const actual = +finalSaleValue.toFixed(2);
  if (Math.abs(expected - actual) > 0.01) {
    throw new BusinessRuleError(
      'PAYMENT_INVALID_AMOUNT',
      `Final sale value must equal agreement value minus discount (expected ${expected}, got ${actual}).`
    );
  }
}

/**
 * Phase 1 service surface. Phase 2 will add pricing updates after BOOKED,
 * installment schedule generation, and post-sale adjustments.
 */
export const saleService = {
  getAll: (callback: (sales: Sale[]) => void) => {
    return subscribeToCollection<Sale>(COLLECTION, (data) => {
      callback(data.sort((a, b) => (b.saleDate || '').localeCompare(a.saleDate || '')));
    });
  },

  getById: async (id: string): Promise<Sale | null> => {
    return getDocument<Sale>(COLLECTION, id);
  },

  /** Live subscription on a single sale doc — used by the detail page so
   *  `totalReceived` updates appear instantly after a receipt is recorded. */
  subscribeById: (id: string, callback: (sale: Sale | null) => void) => {
    const ref = doc(db, COLLECTION, id);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback({ id: snap.id, ...(snap.data() as Omit<Sale, 'id'>) });
    });
  },

  /** Find the active (non-CANCELLED) sale for a unit, if any. */
  getActiveBySubLocation: async (subLocationId: string): Promise<Sale | null> => {
    const all = await queryDocuments<Sale>(COLLECTION, [
      where('subLocationId', '==', subLocationId)
    ]);
    return all.find(s => s.saleStatus !== 'CANCELLED') || null;
  },

  /**
   * Create a new sale as BOOKED. Batches:
   *   sales/{new}.create
   *   subLocations/{unit}.saleStatus='BOOKED', activeSaleId=<new>
   */
  create: async (input: SaleCreateInput): Promise<string> => {
    await ensureConstructionCompany(input.companyId);
    const sl = await loadSubLocationOrThrow(input.subLocationId);
    if (sl.companyId !== input.companyId || sl.projectId !== input.projectId) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'Unit does not belong to the selected company/project.'
      );
    }
    if (sl.activeSaleId) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'This unit already has an active sale. Cancel it before creating a new one.'
      );
    }

    assertFinalSaleValue(input.agreementValue, input.discountAmount, input.finalSaleValue);

    const customer = await getDocument<Customer>('customers', input.customerId);
    if (!customer) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Customer not found.');
    }
    if (customer.companyId !== input.companyId) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'Customer belongs to a different company.'
      );
    }

    const saleId = generateDocId(COLLECTION);
    const now = new Date().toISOString();
    const saleDoc: Omit<Sale, 'id'> = {
      companyId: input.companyId,
      projectId: input.projectId,
      subLocationId: input.subLocationId,
      customerId: input.customerId,
      saleDate: input.saleDate,
      saleStatus: 'BOOKED',
      fundingModel: input.fundingModel,
      agreementValue: input.agreementValue,
      discountAmount: input.discountAmount,
      finalSaleValue: input.finalSaleValue,
      bookingAmount: input.bookingAmount,
      advanceAmount: input.advanceAmount,
      loanAmount: input.loanAmount,
      selfFundingAmount: input.selfFundingAmount,
      customerNameSnapshot: customer.name,
      unitNameSnapshot: sl.name,
      totalReceived: 0,
      remarks: input.remarks?.trim() || undefined,
      createdAt: now,
      createdBy: auth.currentUser?.uid || '',
      updatedAt: now
    };

    await executeBatch([
      { type: 'set', collection: COLLECTION, id: saleId, data: saleDoc as Record<string, unknown> },
      {
        type: 'update',
        collection: 'subLocations',
        id: input.subLocationId,
        data: { saleStatus: 'BOOKED', activeSaleId: saleId, updatedAt: now }
      }
    ]);

    await logAction(
      'SALE_CREATE',
      'Sale',
      saleId,
      `Created sale ${saleId.slice(0, 8)} for ${sl.name} → ${customer.name} (BOOKED, ₹${input.finalSaleValue})`
    );
    return saleId;
  },

  /**
   * Migration helper — create a Sale for a unit that was manually marked
   * SOLD in Masters before the Sales module existed (or before the
   * Masters-side manual-SOLD block was enforced). Unlike `create`, which
   * starts at BOOKED, this writes the Sale directly as SOLD because the
   * unit is already paid-off in the real world; the admin is just filling
   * in the missing commercial record.
   *
   * Strict preconditions:
   *   - Unit exists, belongs to a CONSTRUCTION company and the requested
   *     company/project matches.
   *   - Unit's ownershipStatus is SOLD and activeSaleId is empty.
   *   - No non-CANCELLED Sale already exists for this unit.
   *
   * Atomic batch writes the Sale doc and the SubLocation's activeSaleId.
   * Ownership snapshots already sit on the unit from the manual flip
   * and are preserved (not rewritten) so we do not accidentally clobber
   * admin-curated data.
   */
  createFromManualSoldUnit: async (input: SaleCreateInput): Promise<string> => {
    await ensureConstructionCompany(input.companyId);
    const sl = await loadSubLocationOrThrow(input.subLocationId);
    if (sl.companyId !== input.companyId || sl.projectId !== input.projectId) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'Unit does not belong to the selected company/project.'
      );
    }
    if ((sl.ownershipStatus ?? 'UNSOLD') !== 'SOLD') {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'Migration only applies to units already marked SOLD in Masters.'
      );
    }
    if (sl.activeSaleId) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'This unit already has an active sale.'
      );
    }
    const existing = await queryDocuments<Sale>(COLLECTION, [
      where('subLocationId', '==', input.subLocationId),
    ]);
    const alreadyActive = existing.find(s => s.saleStatus !== 'CANCELLED');
    if (alreadyActive) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'An active sale already exists for this unit — nothing to migrate.'
      );
    }

    assertFinalSaleValue(input.agreementValue, input.discountAmount, input.finalSaleValue);

    const customer = await getDocument<Customer>('customers', input.customerId);
    if (!customer) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Customer not found.');
    }
    if (customer.companyId !== input.companyId) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'Customer belongs to a different company.'
      );
    }

    const saleId = generateDocId(COLLECTION);
    const now = new Date().toISOString();
    const saleDoc: Omit<Sale, 'id'> = {
      companyId: input.companyId,
      projectId: input.projectId,
      subLocationId: input.subLocationId,
      customerId: input.customerId,
      saleDate: input.saleDate,
      saleStatus: 'SOLD',
      fundingModel: input.fundingModel,
      agreementValue: input.agreementValue,
      discountAmount: input.discountAmount,
      finalSaleValue: input.finalSaleValue,
      bookingAmount: input.bookingAmount,
      advanceAmount: input.advanceAmount,
      loanAmount: input.loanAmount,
      selfFundingAmount: input.selfFundingAmount,
      customerNameSnapshot: customer.name,
      unitNameSnapshot: sl.name,
      totalReceived: 0,
      remarks: input.remarks?.trim() || undefined,
      createdAt: now,
      createdBy: auth.currentUser?.uid || '',
      updatedAt: now
    };

    await executeBatch([
      { type: 'set', collection: COLLECTION, id: saleId, data: saleDoc as Record<string, unknown> },
      {
        type: 'update',
        collection: 'subLocations',
        id: input.subLocationId,
        // Ownership snapshots (ownershipStatus / ownerClientId /
        // ownerClientName / soldAt) are already correct on the unit
        // from the manual flip — we only attach activeSaleId and sync
        // saleStatus to SOLD so the Unit Sales page sees this unit.
        data: { saleStatus: 'SOLD', activeSaleId: saleId, updatedAt: now }
      }
    ]);

    await logAction(
      'SALE_CREATE',
      'Sale',
      saleId,
      `Migrated manual-SOLD unit ${sl.name} → ${customer.name} (SOLD, ₹${input.finalSaleValue})`
    );
    return saleId;
  },

  /**
   * Mark a sale as SOLD. Flips SubLocation ownership to the buyer and
   * writes snapshots. Only allowed from BOOKED.
   */
  markSold: async (saleId: string): Promise<void> => {
    const sale = await loadSaleOrThrow(saleId);
    if (sale.saleStatus !== 'BOOKED') {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        `Sale must be in BOOKED state to mark SOLD (currently ${sale.saleStatus}).`
      );
    }
    const now = new Date().toISOString();
    await executeBatch([
      {
        type: 'update',
        collection: COLLECTION,
        id: saleId,
        data: { saleStatus: 'SOLD', updatedAt: now }
      },
      {
        type: 'update',
        collection: 'subLocations',
        id: sale.subLocationId,
        data: {
          saleStatus: 'SOLD',
          ownershipStatus: 'SOLD',
          ownerClientId: sale.customerId,
          ownerClientName: sale.customerNameSnapshot,
          soldAt: sale.saleDate,
          updatedAt: now
        }
      }
    ]);
    await logAction('SALE_MARK_SOLD', 'Sale', saleId, `Sale ${saleId.slice(0, 8)} marked SOLD`);
    await logAction(
      'UPDATE_OWNERSHIP',
      'SubLocation',
      sale.subLocationId,
      `Ownership change on ${sale.unitNameSnapshot}: UNSOLD → SOLD (${sale.customerNameSnapshot}) via sale ${saleId.slice(0, 8)}`
    );
  },

  /** Mark a sale as POSSESSION_GIVEN. Ownership unchanged (already SOLD). */
  markPossessionGiven: async (saleId: string): Promise<void> => {
    const sale = await loadSaleOrThrow(saleId);
    if (sale.saleStatus !== 'SOLD') {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        `Sale must be SOLD to mark POSSESSION_GIVEN (currently ${sale.saleStatus}).`
      );
    }
    const now = new Date().toISOString();
    await executeBatch([
      {
        type: 'update',
        collection: COLLECTION,
        id: saleId,
        data: { saleStatus: 'POSSESSION_GIVEN', possessionGivenAt: now, updatedAt: now }
      },
      {
        type: 'update',
        collection: 'subLocations',
        id: sale.subLocationId,
        data: { saleStatus: 'POSSESSION_GIVEN', updatedAt: now }
      }
    ]);
    await logAction(
      'SALE_MARK_POSSESSION',
      'Sale',
      saleId,
      `Sale ${saleId.slice(0, 8)} possession given`
    );
  },

  /**
   * Cancel a sale. Requires a non-empty reason.
   * - Sale doc is preserved (saleStatus=CANCELLED) for history.
   * - SubLocation flips back to AVAILABLE, activeSaleId cleared.
   * - If the sale had reached SOLD/POSSESSION_GIVEN, ownership snapshots
   *   on the SubLocation are reverted to UNSOLD.
   */
  cancel: async (saleId: string, reason: string): Promise<void> => {
    const trimmed = (reason || '').trim();
    if (!trimmed) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Cancel reason is required.');
    }
    const sale = await loadSaleOrThrow(saleId);
    if (sale.saleStatus === 'CANCELLED') {
      throw new BusinessRuleError('RECORD_LOCKED', 'Sale is already cancelled.');
    }
    const wasOwnershipTransferred =
      sale.saleStatus === 'SOLD' || sale.saleStatus === 'POSSESSION_GIVEN';
    const now = new Date().toISOString();

    const unitUpdate: Record<string, unknown> = {
      saleStatus: 'AVAILABLE',
      activeSaleId: deleteField(),
      updatedAt: now
    };
    if (wasOwnershipTransferred) {
      unitUpdate.ownershipStatus = 'UNSOLD';
      unitUpdate.ownerClientId = deleteField();
      unitUpdate.ownerClientName = deleteField();
      unitUpdate.soldAt = deleteField();
    }

    await executeBatch([
      {
        type: 'update',
        collection: COLLECTION,
        id: saleId,
        data: {
          saleStatus: 'CANCELLED',
          cancelledAt: now,
          cancelReason: trimmed,
          updatedAt: now
        }
      },
      {
        type: 'update',
        collection: 'subLocations',
        id: sale.subLocationId,
        data: unitUpdate
      }
    ]);

    await logAction(
      'SALE_CANCEL',
      'Sale',
      saleId,
      `Cancelled sale ${saleId.slice(0, 8)}: ${trimmed}`
    );
    if (wasOwnershipTransferred) {
      await logAction(
        'UPDATE_OWNERSHIP',
        'SubLocation',
        sale.subLocationId,
        `Ownership reverted on ${sale.unitNameSnapshot}: SOLD (${sale.customerNameSnapshot}) → UNSOLD (sale cancelled)`
      );
    }
  }
};
