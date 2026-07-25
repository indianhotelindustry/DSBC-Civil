import { UserProfile, UserRole, UserStatus, BusinessRuleError } from '../types';
import { collection, deleteField, doc, getDoc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { updateDocument, deleteDocument, logAction, queryDocuments, where } from './db';

const COLLECTION = 'users';

/**
 * Admin-facing user management service.
 *
 * All writes assume the caller is ADMIN — Firestore rules are the ultimate
 * gatekeeper. The service adds:
 *   - audit-log entries for every admin action
 *   - a self-edit guard (admins cannot change their OWN role or status via
 *     these helpers, matching the security posture)
 *   - an `updatedAt` timestamp on every mutation.
 *
 * Reads are subscription-based so the page stays live as the admin acts.
 */

function assertNotSelfSensitive(targetUid: string, field: 'role' | 'status' | 'company') {
  const selfUid = auth.currentUser?.uid;
  if (selfUid && selfUid === targetUid && (field === 'role' || field === 'status')) {
    throw new BusinessRuleError(
      'RECORD_LOCKED',
      `You cannot change your own ${field}. Ask another admin.`
    );
  }
}

/** Default to ACTIVE for legacy docs missing the status field (same rule as auth.ts). */
function normalize(profile: UserProfile): UserProfile {
  return { ...profile, status: profile.status ?? 'ACTIVE' };
}

/** Read a single user profile (used by guards that need the current state). */
async function fetchUserDoc(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return normalize(snap.data() as UserProfile);
}

/**
 * Last-admin safety check — prevents the system from ending up with zero
 * active admins. Called whenever an action *could* remove an ACTIVE ADMIN
 * from the pool (deactivation of an admin, or demoting an admin to a
 * non-ADMIN role).
 *
 * Queries by role then filters `status` in memory so legacy ADMIN docs
 * without a `status` field (treated as ACTIVE) are counted. Firestore rules
 * allow any authenticated user to read `users/{uid}`, so this works for
 * admins without extra permissions.
 */
async function assertNotLastActiveAdmin(targetUid: string) {
  const admins = await queryDocuments<UserProfile & { id: string }>('users', [
    where('role', '==', 'ADMIN')
  ]);
  const otherActive = admins.filter(
    a => a.uid !== targetUid && (a.status ?? 'ACTIVE') === 'ACTIVE'
  );
  if (otherActive.length === 0) {
    throw new BusinessRuleError(
      'RECORD_LOCKED',
      'Cannot remove the last active admin. Promote another user to ADMIN first.'
    );
  }
}

export const userService = {
  /** Subscribe to all user profiles. The users collection is keyed by uid. */
  getAll: (callback: (users: UserProfile[]) => void) => {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      const users = snap.docs.map(d => normalize(d.data() as UserProfile));
      callback(users);
    });
  },

  /** Approve a PENDING user → ACTIVE. Records approver uid + timestamp. */
  approve: async (uid: string, displayName: string) => {
    assertNotSelfSensitive(uid, 'status');
    const now = new Date().toISOString();
    const approver = auth.currentUser?.uid;
    await updateDocument(COLLECTION, uid, {
      status: 'ACTIVE',
      approvedBy: approver,
      approvedAt: now,
      updatedAt: now
    });
    await logAction('APPROVE', 'User', uid, `Approved user ${displayName} (${uid})`);
  },

  /** Change a user's role. Blocked if the admin targets themselves. Also
   *  blocked if demoting the last active admin. */
  changeRole: async (uid: string, role: UserRole, displayName: string) => {
    assertNotSelfSensitive(uid, 'role');
    if (role !== 'ADMIN') {
      const target = await fetchUserDoc(uid);
      if (target && target.role === 'ADMIN' && (target.status ?? 'ACTIVE') === 'ACTIVE') {
        await assertNotLastActiveAdmin(uid);
      }
    }
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, uid, { role, updatedAt: now });
    await logAction('CHANGE_ROLE', 'User', uid, `Changed role for ${displayName} to ${role}`);
  },

  /**
   * Assign (or clear) the user's companies. Multi-company replaces the
   * earlier single-company flow.
   *
   * Write strategy:
   *   - `assignedCompanyIds` is written as the authoritative list.
   *   - Legacy `companyId` is kept in sync with the first entry (or
   *     deleted when the list is empty) so any code still reading the
   *     old single-company field sees the primary assignment.
   */
  assignCompanies: async (
    uid: string,
    companyIds: string[],
    displayName: string,
    companyLabels: string[]
  ) => {
    assertNotSelfSensitive(uid, 'company');
    // Dedup + preserve order; ignore empty strings defensively.
    const unique = Array.from(new Set(companyIds.filter(Boolean)));
    const now = new Date().toISOString();
    const payload: Record<string, unknown> = {
      assignedCompanyIds: unique,
      updatedAt: now
    };
    if (unique.length > 0) {
      payload.companyId = unique[0];
    } else {
      payload.companyId = deleteField();
    }
    await updateDocument(COLLECTION, uid, payload);
    await logAction(
      'ASSIGN_COMPANIES',
      'User',
      uid,
      unique.length > 0
        ? `Assigned companies [${companyLabels.join(', ')}] to ${displayName}`
        : `Cleared all company assignments for ${displayName}`
    );
  },

  /** Set status to ACTIVE. Does not touch approvedBy/approvedAt (that's for first approval). */
  activate: async (uid: string, displayName: string) => {
    assertNotSelfSensitive(uid, 'status');
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, uid, { status: 'ACTIVE', updatedAt: now });
    await logAction('ACTIVATE', 'User', uid, `Activated user ${displayName}`);
  },

  /** Set status to INACTIVE. Blocks the user from app access on next request.
   *  Guarded against deactivating the last active admin. */
  deactivate: async (uid: string, displayName: string) => {
    assertNotSelfSensitive(uid, 'status');
    const target = await fetchUserDoc(uid);
    if (target && target.role === 'ADMIN' && (target.status ?? 'ACTIVE') === 'ACTIVE') {
      await assertNotLastActiveAdmin(uid);
    }
    const now = new Date().toISOString();
    await updateDocument(COLLECTION, uid, { status: 'INACTIVE', updatedAt: now });
    await logAction('DEACTIVATE', 'User', uid, `Deactivated user ${displayName}`);
  },

  /**
   * Admin-created pre-registered profile.
   *
   * Writes a placeholder user doc at `users/{normalizedEmail}` with
   * `uid: ''` as a sentinel. When the actual user signs in later, the
   * auth-sync flow finds this placeholder by email, creates the real
   * uid-keyed profile with the admin's chosen role/status, and deletes
   * the placeholder. See src/services/auth.ts#handleUserSync.
   *
   * Duplicate prevention: any existing user (real OR pre-registered)
   * with the same email (case-insensitive) blocks the create.
   */
  createPreRegistered: async (input: {
    displayName: string;
    email: string;
    role: UserRole;
    /** One or more companies to pre-assign. Legacy single `companyId` also
     *  accepted for callers that haven't migrated to the array yet. */
    companyIds?: string[];
    companyId?: string;
    status: UserStatus;
  }): Promise<string> => {
    const displayName = input.displayName.trim();
    const email = input.email.trim().toLowerCase();
    if (!displayName) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Name is required.');
    }
    if (!email || !email.includes('@')) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'A valid email is required.');
    }
    // Firestore doc IDs cannot contain '/' — emails never do in practice,
    // but guard anyway.
    if (email.includes('/')) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Email contains invalid characters.');
    }
    // Block pre-registering your own email — the sign-in claim flow
    // deletes the placeholder after migrating, but if an admin tries
    // to pre-register their own address, the claim never runs because
    // their real uid-keyed profile already exists.
    const selfEmail = auth.currentUser?.email?.trim().toLowerCase();
    if (selfEmail && selfEmail === email) {
      throw new BusinessRuleError(
        'RECORD_LOCKED',
        'Cannot pre-register your own email — your profile already exists.'
      );
    }

    const duplicates = await findUsersByEmail(email);
    if (duplicates.length > 0) {
      const other = duplicates[0];
      throw new BusinessRuleError(
        'DELETE_BLOCKED',
        `A user profile with this email already exists (${other.displayName || other.email}).`
      );
    }

    const now = new Date().toISOString();
    // Normalize companies: prefer the new array, fall back to legacy single id.
    const companyIds = Array.from(new Set(
      (input.companyIds && input.companyIds.length > 0)
        ? input.companyIds.filter(Boolean)
        : (input.companyId ? [input.companyId] : [])
    ));
    const profile: Record<string, unknown> = {
      uid: '',                       // sentinel — real uid is stamped at sign-in claim
      email,
      displayName,
      role: input.role,
      status: input.status,
      createdAt: now,
      createdBy: auth.currentUser?.uid || '',
      updatedAt: now
    };
    if (companyIds.length > 0) {
      profile.assignedCompanyIds = companyIds;
      profile.companyId = companyIds[0]; // legacy-reader compatibility
    }

    // Doc ID = lowercase email so the sign-in claim flow can look it up
    // via a deterministic path without querying.
    await setDoc(doc(db, COLLECTION, email), profile);

    await logAction(
      'CREATE_USER_PROFILE',
      'User',
      email,
      `Admin pre-registered ${email} as ${input.role} / ${input.status}`
    );
    return email;
  },

  /**
   * Delete an admin-created pre-registered placeholder that has not yet
   * been claimed by sign-in. Safe to call only on docs where uid === ''
   * (Firestore rules reinforce this).
   */
  cancelInvite: async (email: string): Promise<void> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;
    await deleteDocument(COLLECTION, normalized);
    await logAction(
      'CANCEL_USER_INVITE',
      'User',
      normalized,
      `Cancelled pre-registered invite for ${normalized}`
    );
  }
};

/**
 * Return all user docs whose email matches (case-insensitively).
 * Used for duplicate prevention in createPreRegistered. Reads the
 * full users collection, filters in memory — collection is small.
 */
async function findUsersByEmail(email: string): Promise<UserProfile[]> {
  const target = email.trim().toLowerCase();
  const all = await queryDocuments<UserProfile & { id: string }>(COLLECTION, []);
  return all.filter(u => (u.email || '').trim().toLowerCase() === target);
}

/** Re-export for status classes so the page stays stylistically consistent. */
export const STATUS_LABELS: Record<UserStatus, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};
