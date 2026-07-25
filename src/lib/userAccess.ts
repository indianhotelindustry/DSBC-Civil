/**
 * Helpers that resolve access-scope fields on a UserProfile regardless
 * of whether the user was provisioned with the old single-company
 * `companyId` field or the new multi-company `assignedCompanyIds` array.
 *
 * Every place that previously did `profile.companyId` for access gating
 * should use `getAssignedCompanyIds(profile)` instead — it collapses both
 * representations into a single `string[]` result, so existing users
 * keep working while new users get the multi-company behavior.
 */

import type { UserProfile } from '../types';

/**
 * Subset of UserProfile needed for scope resolution. Accepts any object
 * that carries the two fields so helpers can be shared with test fixtures
 * and other shapes that don't need a full profile.
 */
export type ScopeCarrier = Pick<UserProfile, 'assignedCompanyIds' | 'companyId'>;

/**
 * Returns the list of company ids this user has access to.
 *
 *   1. Prefer `assignedCompanyIds` when present and non-empty.
 *   2. Fall back to `companyId` treated as a one-item array.
 *   3. Otherwise return [].
 *
 * Callers can check `.length === 0` to detect "no scope assigned" and
 * render a helpful empty state.
 */
export function getAssignedCompanyIds(
  profile: ScopeCarrier | null | undefined
): string[] {
  if (!profile) return [];
  if (profile.assignedCompanyIds && profile.assignedCompanyIds.length > 0) {
    return [...profile.assignedCompanyIds];
  }
  if (profile.companyId) return [profile.companyId];
  return [];
}

/** Convenience: true when the profile has ≥ 1 assigned company. */
export function hasAnyCompanyAssignment(profile: ScopeCarrier | null | undefined): boolean {
  return getAssignedCompanyIds(profile).length > 0;
}

/**
 * Effective company scope for data visibility.
 *
 *   - ADMIN and CEO are always unrestricted — they see every company's
 *     data regardless of any `assignedCompanyIds` on their profile.
 *   - Other roles (ACCOUNTS, PROJECT_MANAGER) are scoped to their
 *     assignedCompanyIds. A user with no assignment and no legacy
 *     companyId gets an empty scope and will see nothing in
 *     company-filtered views.
 *
 * Consumers should call `isInScope(scope, someCompanyId)` per row
 * (or build a Set for bulk filtering).
 */
export interface CompanyScope {
  /** Company ids the user is allowed to see. Empty when unrestricted
   *  OR when the user has no assignment (caller must check `unrestricted`
   *  to distinguish "see everything" from "see nothing"). */
  ids: string[];
  /** True when the user bypasses company filtering entirely. */
  unrestricted: boolean;
}

/** Minimal role info needed by the scope helpers. */
export type RoleCarrier = { role?: string };

export function getEffectiveCompanyScope(
  profile: (ScopeCarrier & RoleCarrier) | null | undefined
): CompanyScope {
  if (!profile) return { ids: [], unrestricted: false };
  if (profile.role === 'ADMIN' || profile.role === 'CEO' || profile.role === 'SUPER_ADMIN') {
    return { ids: [], unrestricted: true };
  }
  return { ids: getAssignedCompanyIds(profile), unrestricted: false };
}

/** Whether a given companyId belongs to the scope. Treats undefined /
 *  null companyId on the subject as "out of scope" for scoped users;
 *  for unrestricted users, always true. */
export function isInScope(scope: CompanyScope, companyId: string | null | undefined): boolean {
  if (scope.unrestricted) return true;
  if (!companyId) return false;
  return scope.ids.includes(companyId);
}

// ── Store scope helpers ──────────────────────────────────────────────────────
// STORE_MANAGER and STORE_KEEPER are scoped to assignedStoreIds[].
// All other roles are store-unrestricted.

export type StoreScopeCarrier = Pick<UserProfile, 'assignedStoreIds'>;

export interface StoreScope {
  ids: string[];
  unrestricted: boolean;
}

export function getAssignedStoreIds(
  profile: StoreScopeCarrier | null | undefined
): string[] {
  if (!profile) return [];
  if (profile.assignedStoreIds && profile.assignedStoreIds.length > 0) {
    return [...profile.assignedStoreIds];
  }
  return [];
}

export function getEffectiveStoreScope(
  profile: (StoreScopeCarrier & RoleCarrier) | null | undefined
): StoreScope {
  if (!profile) return { ids: [], unrestricted: false };
  if (profile.role !== 'STORE_MANAGER' && profile.role !== 'STORE_KEEPER') {
    return { ids: [], unrestricted: true };
  }
  return { ids: getAssignedStoreIds(profile), unrestricted: false };
}
