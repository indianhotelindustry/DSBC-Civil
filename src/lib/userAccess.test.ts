import { describe, it, expect } from 'vitest';
import {
  getAssignedCompanyIds,
  hasAnyCompanyAssignment,
  getEffectiveCompanyScope,
  isInScope,
  getAssignedStoreIds,
  getEffectiveStoreScope,
} from './userAccess';

describe('getAssignedCompanyIds', () => {
  it('prefers assignedCompanyIds when present and non-empty', () => {
    expect(getAssignedCompanyIds({
      assignedCompanyIds: ['sipl', 'shspl'],
      companyId: 'legacy'
    })).toEqual(['sipl', 'shspl']);
  });

  it('falls back to legacy companyId as a one-item array', () => {
    expect(getAssignedCompanyIds({ companyId: 'sipl' })).toEqual(['sipl']);
  });

  it('treats empty assignedCompanyIds as missing and looks at legacy field', () => {
    expect(getAssignedCompanyIds({ assignedCompanyIds: [], companyId: 'sipl' }))
      .toEqual(['sipl']);
  });

  it('returns empty when neither field is set', () => {
    expect(getAssignedCompanyIds({})).toEqual([]);
  });

  it('returns empty for null / undefined profile', () => {
    expect(getAssignedCompanyIds(null)).toEqual([]);
    expect(getAssignedCompanyIds(undefined)).toEqual([]);
  });

  it('returns a fresh array (mutating result does not affect the source)', () => {
    const profile = { assignedCompanyIds: ['sipl'] };
    const result = getAssignedCompanyIds(profile);
    result.push('shspl');
    expect(profile.assignedCompanyIds).toEqual(['sipl']);
  });
});

describe('hasAnyCompanyAssignment', () => {
  it('is true when any scope exists (new or legacy field)', () => {
    expect(hasAnyCompanyAssignment({ assignedCompanyIds: ['sipl'] })).toBe(true);
    expect(hasAnyCompanyAssignment({ companyId: 'sipl' })).toBe(true);
  });

  it('is false when neither is set', () => {
    expect(hasAnyCompanyAssignment({})).toBe(false);
    expect(hasAnyCompanyAssignment(null)).toBe(false);
  });
});

// ── getEffectiveCompanyScope ────────────────────────────────────────

describe('getEffectiveCompanyScope', () => {
  it('marks ADMIN as unrestricted regardless of assignedCompanyIds', () => {
    const scope = getEffectiveCompanyScope({ role: 'ADMIN', assignedCompanyIds: ['sipl'] });
    expect(scope.unrestricted).toBe(true);
    expect(scope.ids).toEqual([]);
  });

  it('marks CEO as unrestricted regardless of assignedCompanyIds', () => {
    const scope = getEffectiveCompanyScope({ role: 'CEO', assignedCompanyIds: [] });
    expect(scope.unrestricted).toBe(true);
  });

  it('scopes ACCOUNTS to their assignedCompanyIds', () => {
    const scope = getEffectiveCompanyScope({
      role: 'ACCOUNTS',
      assignedCompanyIds: ['sipl', 'shspl']
    });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids.sort()).toEqual(['shspl', 'sipl']);
  });

  it('scopes PROJECT_MANAGER via legacy companyId fallback', () => {
    const scope = getEffectiveCompanyScope({ role: 'PROJECT_MANAGER', companyId: 'sipl' });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual(['sipl']);
  });

  it('returns empty scope for a scoped role with no assignment', () => {
    const scope = getEffectiveCompanyScope({ role: 'ACCOUNTS' });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual([]);
  });

  it('returns restricted + empty for null profile (safest default)', () => {
    const scope = getEffectiveCompanyScope(null);
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual([]);
  });
});

// ── isInScope ───────────────────────────────────────────────────────

describe('isInScope', () => {
  it('is true for any companyId when scope is unrestricted', () => {
    const scope = { ids: [], unrestricted: true };
    expect(isInScope(scope, 'anything')).toBe(true);
    expect(isInScope(scope, null)).toBe(true);
    expect(isInScope(scope, undefined)).toBe(true);
  });

  it('is true when companyId is in the scoped ids list', () => {
    const scope = { ids: ['sipl', 'shspl'], unrestricted: false };
    expect(isInScope(scope, 'sipl')).toBe(true);
    expect(isInScope(scope, 'shspl')).toBe(true);
  });

  it('is false when companyId is not in the scoped ids list', () => {
    const scope = { ids: ['sipl'], unrestricted: false };
    expect(isInScope(scope, 'shspl')).toBe(false);
  });

  it('is false for missing companyId under a scoped user (safest default)', () => {
    const scope = { ids: ['sipl'], unrestricted: false };
    expect(isInScope(scope, null)).toBe(false);
    expect(isInScope(scope, undefined)).toBe(false);
  });

  it('is false when scoped but ids list is empty (no assignment)', () => {
    const scope = { ids: [], unrestricted: false };
    expect(isInScope(scope, 'sipl')).toBe(false);
  });
});

// ── getEffectiveCompanyScope — R1 new roles ─────────────────────────

describe('getEffectiveCompanyScope — R1 new roles', () => {
  it('marks SUPER_ADMIN as unrestricted regardless of assignedCompanyIds', () => {
    const scope = getEffectiveCompanyScope({ role: 'SUPER_ADMIN', assignedCompanyIds: ['sipl'] });
    expect(scope.unrestricted).toBe(true);
    expect(scope.ids).toEqual([]);
  });

  it('scopes PURCHASE_MANAGER to their assignedCompanyIds', () => {
    const scope = getEffectiveCompanyScope({ role: 'PURCHASE_MANAGER', assignedCompanyIds: ['sipl', 'shspl'] });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids.sort()).toEqual(['shspl', 'sipl']);
  });

  it('scopes STORE_MANAGER to their assignedCompanyIds', () => {
    const scope = getEffectiveCompanyScope({ role: 'STORE_MANAGER', assignedCompanyIds: ['sipl'] });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual(['sipl']);
  });

  it('scopes STORE_KEEPER to their assignedCompanyIds', () => {
    const scope = getEffectiveCompanyScope({ role: 'STORE_KEEPER', assignedCompanyIds: ['sipl'] });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual(['sipl']);
  });
});

// ── getAssignedStoreIds ─────────────────────────────────────────────

describe('getAssignedStoreIds', () => {
  it('returns assignedStoreIds when present and non-empty', () => {
    expect(getAssignedStoreIds({ assignedStoreIds: ['store-a', 'store-b'] }))
      .toEqual(['store-a', 'store-b']);
  });

  it('returns empty array when assignedStoreIds is empty', () => {
    expect(getAssignedStoreIds({ assignedStoreIds: [] })).toEqual([]);
  });

  it('returns empty array when assignedStoreIds is absent', () => {
    expect(getAssignedStoreIds({})).toEqual([]);
  });

  it('returns empty for null / undefined profile', () => {
    expect(getAssignedStoreIds(null)).toEqual([]);
    expect(getAssignedStoreIds(undefined)).toEqual([]);
  });

  it('returns a fresh array (mutating result does not affect the source)', () => {
    const profile = { assignedStoreIds: ['store-a'] };
    const result = getAssignedStoreIds(profile);
    result.push('store-b');
    expect(profile.assignedStoreIds).toEqual(['store-a']);
  });
});

// ── getEffectiveStoreScope ──────────────────────────────────────────

describe('getEffectiveStoreScope', () => {
  it('marks SUPER_ADMIN as store-unrestricted', () => {
    const scope = getEffectiveStoreScope({ role: 'SUPER_ADMIN', assignedStoreIds: ['store-a'] });
    expect(scope.unrestricted).toBe(true);
    expect(scope.ids).toEqual([]);
  });

  it('marks ADMIN as store-unrestricted', () => {
    const scope = getEffectiveStoreScope({ role: 'ADMIN', assignedStoreIds: ['store-a'] });
    expect(scope.unrestricted).toBe(true);
  });

  it('marks CEO as store-unrestricted', () => {
    const scope = getEffectiveStoreScope({ role: 'CEO' });
    expect(scope.unrestricted).toBe(true);
  });

  it('marks ACCOUNTS as store-unrestricted', () => {
    const scope = getEffectiveStoreScope({ role: 'ACCOUNTS' });
    expect(scope.unrestricted).toBe(true);
  });

  it('marks PROJECT_MANAGER as store-unrestricted', () => {
    const scope = getEffectiveStoreScope({ role: 'PROJECT_MANAGER' });
    expect(scope.unrestricted).toBe(true);
  });

  it('marks PURCHASE_MANAGER as store-unrestricted', () => {
    const scope = getEffectiveStoreScope({ role: 'PURCHASE_MANAGER' });
    expect(scope.unrestricted).toBe(true);
  });

  it('scopes STORE_MANAGER to their assignedStoreIds', () => {
    const scope = getEffectiveStoreScope({ role: 'STORE_MANAGER', assignedStoreIds: ['store-a', 'store-b'] });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids.sort()).toEqual(['store-a', 'store-b']);
  });

  it('scopes STORE_KEEPER to their assignedStoreIds', () => {
    const scope = getEffectiveStoreScope({ role: 'STORE_KEEPER', assignedStoreIds: ['store-a'] });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual(['store-a']);
  });

  it('returns empty ids for STORE_MANAGER with no store assignment', () => {
    const scope = getEffectiveStoreScope({ role: 'STORE_MANAGER' });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual([]);
  });

  it('returns empty ids for STORE_KEEPER with empty assignedStoreIds', () => {
    const scope = getEffectiveStoreScope({ role: 'STORE_KEEPER', assignedStoreIds: [] });
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual([]);
  });

  it('returns restricted + empty for null profile (safest default)', () => {
    const scope = getEffectiveStoreScope(null);
    expect(scope.unrestricted).toBe(false);
    expect(scope.ids).toEqual([]);
  });
});
