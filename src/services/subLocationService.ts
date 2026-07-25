import { SubLocation, WorkOrder, Customer, Company, Sale, BusinessRuleError } from '../types';
import { deleteField } from 'firebase/firestore';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  getDocument,
  queryDocuments,
  logAction,
  executeBatch,
  where
} from './db';

const COLLECTION = 'subLocations';

/**
 * Ownership rules (CONSTRUCTION / SIPL only — HOSPITALITY ignores these fields):
 *
 *   SOLD  → requires ownerClientId; we snapshot ownerClientName from the
 *           customer master at write time so display stays stable if the
 *           master is renamed later. soldAt defaults to now on first sale.
 *   UNSOLD → ownerClientId / ownerClientName / soldAt are cleared.
 *
 * Firestore gotcha: `updateDoc` with `undefined` throws, so clearing fields
 * requires the `deleteField()` sentinel. Create paths simply omit the field.
 */

/** True if the given company is CONSTRUCTION (SIPL). Ownership rules apply only here. */
async function isConstructionCompany(companyId: string | undefined): Promise<boolean> {
  if (!companyId) return false;
  const company = await getDocument<Company>('companies', companyId);
  return company?.businessType === 'CONSTRUCTION';
}

/** Error message surfaced when an admin tries to create/flip a unit to
 *  SOLD from Masters without going through Unit Sales. Kept as a module
 *  constant so the exact wording matches everywhere it surfaces — the
 *  service throw here AND any future UI-side preview hint. */
const MANUAL_SOLD_BLOCKED =
  'Sold units must be created through Unit Sales so sale, receipt, and recovery records stay complete.';

/** Build the ownership fields for a CREATE write (always UNSOLD).
 *  Manual SOLD creation is rejected — a SOLD unit must come into
 *  existence through the Sales module (saleService.create writes the
 *  ownership snapshots as part of the atomic Sale + SubLocation batch).
 *  Enforcing this here means even bulk import paths cannot seed a SOLD
 *  unit without a matching Sale record, which was the root cause of
 *  Unit Sales ↔ Masters drift. */
async function buildOwnershipForCreate(data: Partial<SubLocation>): Promise<Record<string, unknown>> {
  const status = data.ownershipStatus ?? 'UNSOLD';
  if (status === 'SOLD') {
    throw new BusinessRuleError('RECORD_LOCKED', MANUAL_SOLD_BLOCKED);
  }
  return { ownershipStatus: 'UNSOLD', saleStatus: 'AVAILABLE' };
}

/** Build the ownership fields for an UPDATE write — uses deleteField() to clear.
 *  When the unit has no active sale (`prior.activeSaleId` empty), saleStatus is
 *  synced to match ownership (UNSOLD↔AVAILABLE, SOLD↔SOLD) so a manual
 *  ownership flip on the Units dialog never leaves saleStatus stale.
 *  When an active sale exists, Sales module is authoritative and we do NOT
 *  touch saleStatus from here — saleService transitions own that field. */
async function buildOwnershipForUpdate(
  data: Partial<SubLocation>,
  prior: SubLocation | null
): Promise<Record<string, unknown>> {
  const status = data.ownershipStatus ?? prior?.ownershipStatus ?? 'UNSOLD';
  // If an active sale is attached, leave saleStatus alone — Sales module
  // drives BOOKED/SOLD/POSSESSION_GIVEN/CANCELLED on that field.
  const saleModuleOwnsStatus = !!prior?.activeSaleId;

  if (status === 'SOLD') {
    // Manual SOLD without an attached Sale is the root of the Masters ↔
    // Unit Sales drift this block prevents. Sales module writes
    // activeSaleId as part of its atomic batch, so if that field is
    // empty we know the caller is not saleService — reject the flip
    // and force the admin through the Sales create flow (or the
    // migration helper for pre-existing mismatched rows).
    if (!saleModuleOwnsStatus) {
      throw new BusinessRuleError('RECORD_LOCKED', MANUAL_SOLD_BLOCKED);
    }
    const clientId = data.ownerClientId ?? prior?.ownerClientId;
    if (!clientId) {
      throw new BusinessRuleError(
        'PAYMENT_INVALID_AMOUNT',
        'SOLD units require a customer. Pick one or change status to UNSOLD.'
      );
    }
    const customer = await getDocument<Customer>('customers', clientId);
    if (!customer) {
      throw new BusinessRuleError(
        'PAYMENT_INVALID_AMOUNT',
        'Selected customer no longer exists. Pick another.'
      );
    }
    const out: Record<string, unknown> = {
      ownershipStatus: 'SOLD',
      ownerClientId: clientId,
      ownerClientName: customer.name,
      soldAt: data.soldAt ?? prior?.soldAt ?? new Date().toISOString()
    };
    if (!saleModuleOwnsStatus) out.saleStatus = 'SOLD';
    return out;
  }

  // UNSOLD — actively clear sale-side fields in the existing doc.
  const out: Record<string, unknown> = {
    ownershipStatus: 'UNSOLD',
    ownerClientId: deleteField(),
    ownerClientName: deleteField(),
    soldAt: deleteField()
  };
  if (!saleModuleOwnsStatus) out.saleStatus = 'AVAILABLE';
  return out;
}

/** Audit message for an ownership transition; null if nothing material changed. */
function ownershipAuditMessage(
  name: string,
  prior: SubLocation | null,
  next: Record<string, unknown>
): string | null {
  const from = prior?.ownershipStatus ?? 'UNSOLD';
  const to = (next.ownershipStatus as string | undefined) ?? from;
  const fromClientId = prior?.ownerClientId ?? null;
  const toClientId =
    typeof next.ownerClientId === 'string' ? next.ownerClientId : null;
  if (from === to && fromClientId === toClientId) return null;

  const fromLabel = from === 'SOLD'
    ? `${from} (${prior?.ownerClientName ?? fromClientId ?? 'unknown'})`
    : from;
  const toLabel = to === 'SOLD'
    ? `${to} (${(next.ownerClientName as string | undefined) ?? toClientId ?? 'unknown'})`
    : to;
  return `Ownership change on ${name}: ${fromLabel} → ${toLabel}`;
}

/** Remove any ownership fields from a HOSPITALITY payload. */
function stripOwnership(data: Partial<SubLocation>): Record<string, unknown> {
  const { ownershipStatus, ownerClientId, ownerClientName, soldAt, ...rest } = data;
  void ownershipStatus; void ownerClientId; void ownerClientName; void soldAt;
  return rest as Record<string, unknown>;
}

/**
 * Normalize a sub-location name for duplicate detection:
 *   - trim leading/trailing whitespace
 *   - collapse internal whitespace runs to a single space
 *   - lowercase
 * So "Plot A", "  plot a  ", and "PLOT   A" all compare equal.
 * Stored name retains the admin's original casing/spacing — only the
 * comparison key is normalized.
 */
function normName(s: string): string {
  return (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Throw if another sub-location in the same project already has the same
 * normalized name. Scoped to projectId so two projects can independently
 * hold a "Plot A" without conflict. `excludeId` lets update-paths skip
 * the row being edited.
 *
 * Concurrency note: this is a read-then-write check, not atomic. Two
 * simultaneous creates with the same name in the same project could both
 * pass and succeed — the residual race window is acknowledged. Making it
 * fully race-proof would require either a deterministic doc id derived
 * from (projectId,name) or a server-side transaction. For the current
 * deployment profile (one admin, occasional bulk operations) the
 * pre-write check is sufficient.
 */
async function assertNameUniqueInProject(
  projectId: string,
  name: string,
  excludeId?: string
): Promise<void> {
  const n = normName(name);
  if (!n) return; // empty names are rejected elsewhere; nothing to dedup against
  const existing = await queryDocuments<SubLocation>(COLLECTION, [
    where('projectId', '==', projectId),
  ]);
  const clash = existing.find(sl => sl.id !== excludeId && normName(sl.name) === n);
  if (clash) {
    throw new BusinessRuleError(
      'DELETE_BLOCKED',
      `A sub-location named "${clash.name}" already exists in this project.`
    );
  }
}

export const subLocationService = {
  getAll: (callback: (subLocations: SubLocation[]) => void) => {
    return subscribeToCollection<SubLocation>(COLLECTION, (data) => {
      callback(data.sort((a, b) => a.name.localeCompare(b.name)));
    });
  },

  getByProject: (projectId: string, callback: (subLocations: SubLocation[]) => void) => {
    return subscribeToCollection<SubLocation>(COLLECTION, (data) => {
      callback(
        data.filter(sl => sl.projectId === projectId && sl.isActive)
            .sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  },

  getById: async (id: string): Promise<SubLocation | null> => {
    return getDocument<SubLocation>(COLLECTION, id);
  },

  create: async (data: Omit<SubLocation, 'id' | 'createdAt' | 'createdBy'>): Promise<string> => {
    // Duplicate guard (service-layer backstop for the UI preview in
    // BulkAdd / single-add dialogs). Runs BEFORE ownership resolution
    // so a race that sneaks the duplicate check fails fast.
    await assertNameUniqueInProject(data.projectId, data.name);
    const applyOwnership = await isConstructionCompany(data.companyId);
    const base = stripOwnership(data);
    const ownership = applyOwnership ? await buildOwnershipForCreate(data) : {};
    const payload = { ...base, ...ownership };
    const id = await createDocument(COLLECTION, payload);
    await logAction('CREATE', 'SubLocation', id, `Created sub-location: ${data.name}`);
    if (applyOwnership && ownership.ownershipStatus === 'SOLD') {
      await logAction('UPDATE_OWNERSHIP', 'SubLocation', id,
        `Initial ownership for ${data.name}: SOLD (${ownership.ownerClientName ?? 'unknown'})`
      );
    }
    return id;
  },

  update: async (id: string, data: Partial<SubLocation>): Promise<void> => {
    const prior = await getDocument<SubLocation>(COLLECTION, id);
    // Per-project uniqueness guard — runs BEFORE ownership resolution so a
    // rename clash fails fast without building any ownership snapshot.
    // Only runs when name or projectId is actually changing; a no-op
    // update (status flip, code edit, ownership toggle) skips the query.
    // Uses the SAME normName rule as create() so behavior is symmetric.
    if (prior && (data.name !== undefined || data.projectId !== undefined)) {
      const targetProjectId = data.projectId ?? prior.projectId;
      const targetName = data.name ?? prior.name;
      // Only actually check if the effective (projectId, normName) is
      // different from the prior one — renames within the same normalized
      // key (e.g. case/whitespace tweak of the existing name in the same
      // project) should pass through without pretending to collide with
      // themselves (excludeId handles that anyway, but this skip saves
      // a query for the common no-op case).
      const samePair = targetProjectId === prior.projectId
        && normName(targetName) === normName(prior.name);
      if (!samePair) {
        await assertNameUniqueInProject(targetProjectId, targetName, id);
      }
    }
    const companyId = data.companyId ?? prior?.companyId;
    const applyOwnership = await isConstructionCompany(companyId);
    const base = stripOwnership(data);
    const ownership = applyOwnership ? await buildOwnershipForUpdate(data, prior) : {};
    const payload = { ...base, ...ownership };
    await updateDocument(COLLECTION, id, payload);
    await logAction('UPDATE', 'SubLocation', id, `Updated sub-location: ${prior?.name ?? id}`);

    if (applyOwnership) {
      const msg = ownershipAuditMessage(prior?.name ?? id, prior, ownership);
      if (msg) await logAction('UPDATE_OWNERSHIP', 'SubLocation', id, msg);
    }
  },

  delete: async (id: string): Promise<void> => {
    const workOrders = await queryDocuments<WorkOrder>('workOrders', [
      where('subLocationId', '==', id)
    ]);
    const active = workOrders.filter(wo => wo.status !== 'REJECTED');
    if (active.length > 0) {
      throw new BusinessRuleError('DELETE_BLOCKED', `Cannot delete: ${active.length} active work order(s) reference this location.`);
    }
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'SubLocation', id, `Deleted sub-location: ${id}`);
  },

  /**
   * One-shot backfill — find SIPL (CONSTRUCTION) sub-locations whose
   * `saleStatus` disagrees with the derived-from-ownership expectation,
   * but only when no active sale is attached (an activeSaleId means
   * Sales module is authoritative and we must not override it).
   *
   * A unit is considered mismatched when:
   *   activeSaleId is empty AND ownership-derived expected ≠ current saleStatus
   * Expected rule: UNSOLD → AVAILABLE, SOLD → SOLD.
   *
   * Pure read. Use `normalizeMismatchedSaleStatus` to write fixes.
   */
  findMismatchedSaleStatus: async (): Promise<
    Array<{ id: string; name: string; projectId: string; companyId: string;
            ownershipStatus: 'SOLD' | 'UNSOLD'; currentSaleStatus: string; expected: 'SOLD' | 'AVAILABLE' }>
  > => {
    const [subLocations, companies] = await Promise.all([
      queryDocuments<SubLocation>(COLLECTION, []),
      queryDocuments<Company>('companies', []),
    ]);
    const construction = new Set(
      companies.filter(c => c.businessType === 'CONSTRUCTION').map(c => c.id)
    );
    const mismatched: Array<{ id: string; name: string; projectId: string; companyId: string;
            ownershipStatus: 'SOLD' | 'UNSOLD'; currentSaleStatus: string; expected: 'SOLD' | 'AVAILABLE' }> = [];
    for (const sl of subLocations) {
      if (!sl.companyId || !construction.has(sl.companyId)) continue;
      if (sl.activeSaleId) continue; // sales module owns it
      const ownership = (sl.ownershipStatus ?? 'UNSOLD') as 'SOLD' | 'UNSOLD';
      const expected = ownership === 'SOLD' ? 'SOLD' : 'AVAILABLE';
      const current = sl.saleStatus ?? 'AVAILABLE';
      if (current !== expected) {
        mismatched.push({
          id: sl.id,
          name: sl.name,
          projectId: sl.projectId,
          companyId: sl.companyId,
          ownershipStatus: ownership,
          currentSaleStatus: current,
          expected,
        });
      }
    }
    return mismatched;
  },

  /**
   * Write the expected saleStatus on every mismatched unit found by
   * `findMismatchedSaleStatus`. Idempotent — re-running after success
   * is a no-op because the mismatch list is empty. Batched for atomicity
   * and chunked at 400 ops per batch to stay well under Firestore's 500
   * op limit.
   *
   * Returns the count of units normalized. Writes a single summary audit
   * entry rather than one-per-row to keep the audit log readable.
   */
  /**
   * Detect SIPL units that were manually marked SOLD in Masters but
   * have no corresponding Sale record — the root cause of the Unit
   * Sales page missing these units.
   *
   * A unit is flagged when:
   *   - its company is CONSTRUCTION (SIPL)
   *   - ownershipStatus === 'SOLD'
   *   - activeSaleId is empty
   *   - no non-CANCELLED Sale doc exists for this subLocationId
   *
   * CANCELLED sales are excluded because saleService.cancel already
   * resets ownership on the unit if the sale had reached SOLD — so a
   * cancelled-sale unit with ownership still SOLD is a separate kind
   * of inconsistency (a stale cancel) and not what this helper targets.
   *
   * Pure read. The migration UI pairs this with
   * saleService.createFromManualSoldUnit to fix each entry.
   */
  findManualSoldWithoutSale: async (): Promise<
    Array<{
      id: string;
      name: string;
      projectId: string;
      companyId: string;
      ownerClientId?: string;
      ownerClientName?: string;
      soldAt?: string;
    }>
  > => {
    const [subLocations, companies, sales] = await Promise.all([
      queryDocuments<SubLocation>(COLLECTION, []),
      queryDocuments<Company>('companies', []),
      queryDocuments<Sale>('sales', []),
    ]);
    const construction = new Set(
      companies.filter(c => c.businessType === 'CONSTRUCTION').map(c => c.id)
    );
    const hasActiveSale = new Set<string>();
    for (const s of sales) {
      if (s.saleStatus !== 'CANCELLED') hasActiveSale.add(s.subLocationId);
    }
    const out: Array<{
      id: string;
      name: string;
      projectId: string;
      companyId: string;
      ownerClientId?: string;
      ownerClientName?: string;
      soldAt?: string;
    }> = [];
    for (const sl of subLocations) {
      if (!sl.companyId || !construction.has(sl.companyId)) continue;
      if ((sl.ownershipStatus ?? 'UNSOLD') !== 'SOLD') continue;
      if (sl.activeSaleId) continue;
      if (hasActiveSale.has(sl.id)) continue;
      out.push({
        id: sl.id,
        name: sl.name,
        projectId: sl.projectId,
        companyId: sl.companyId,
        ownerClientId: sl.ownerClientId,
        ownerClientName: sl.ownerClientName,
        soldAt: sl.soldAt,
      });
    }
    return out;
  },

  normalizeMismatchedSaleStatus: async (): Promise<number> => {
    const mismatched = await subLocationService.findMismatchedSaleStatus();
    if (mismatched.length === 0) return 0;
    const now = new Date().toISOString();
    const CHUNK = 400;
    for (let i = 0; i < mismatched.length; i += CHUNK) {
      const slice = mismatched.slice(i, i + CHUNK);
      await executeBatch(slice.map(m => ({
        type: 'update',
        collection: COLLECTION,
        id: m.id,
        data: { saleStatus: m.expected, updatedAt: now },
      })));
    }
    await logAction(
      'NORMALIZE_SALE_STATUS',
      'SubLocation',
      'bulk',
      `Synced saleStatus on ${mismatched.length} SIPL unit(s) to match ownershipStatus.`
    );
    return mismatched.length;
  }
};
