import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
  connectAuthEmulator
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole, UserStatus } from '../types';

// Connect to emulator ONLY in dev mode AND when explicitly opted in
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

const googleProvider = new GoogleAuthProvider();

/**
 * Handles common Firebase Auth errors and returns user-friendly messages
 */
const handleAuthError = (error: unknown): string => {
  console.error('Auth Error:', error);
  const code = (error as { code?: string })?.code || '';

  switch (code) {
    case 'auth/operation-not-allowed':
      return "Authentication method is not enabled. Please contact support.";
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return "Invalid email or password.";
    case 'auth/email-already-in-use':
      return "This email is already registered.";
    case 'auth/weak-password':
      return "Password should be at least 6 characters.";
    case 'auth/popup-closed-by-user':
      return "Sign-in was cancelled.";
    case 'auth/network-request-failed':
      return "Network error. Please check your connection.";
    default:
      return (error instanceof Error ? error.message : null) || "An unexpected authentication error occurred.";
  }
};

/**
 * The default role for new users who sign up.
 * This is deliberately unprivileged — an admin must promote users via the Admin Users page.
 */
const DEFAULT_NEW_USER_ROLE: UserRole = 'PROJECT_MANAGER';

/**
 * The default status for new users who sign up.
 * PENDING blocks normal app access until an admin approves via the Admin Users page.
 */
const DEFAULT_NEW_USER_STATUS: UserStatus = 'PENDING';

/**
 * Fetches the existing Firestore profile for a Firebase Auth user.
 * Returns null if no profile exists (user needs to be provisioned by an admin).
 *
 * Migration-safe: profiles written before the `status` field existed are
 * treated as ACTIVE so existing users are not locked out by the rollout.
 */
const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;
    const data = userDoc.data() as UserProfile;
    return { ...data, status: data.status ?? 'ACTIVE' };
  } catch (error) {
    console.error('Fetch User Profile Error:', error);
    return null;
  }
};

/**
 * Creates a Firestore user profile for a newly registered user.
 * Role is always DEFAULT_NEW_USER_ROLE — never determined by email or other client input.
 *
 * Payload is built incrementally so optional fields that happen to be
 * null (e.g. `photoURL` on email/password signup) never leak an
 * `undefined` value into `setDoc`, which Firestore rejects and which
 * was silently preventing some accounts from showing up in Admin Users.
 */
const createUserProfile = async (user: User, name?: string): Promise<UserProfile> => {
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    uid: user.uid,
    email: user.email || '',
    displayName: name || user.displayName || 'User',
    role: DEFAULT_NEW_USER_ROLE,
    status: DEFAULT_NEW_USER_STATUS,
    createdAt: now,
    updatedAt: serverTimestamp()
  };
  if (user.photoURL) payload.photoURL = user.photoURL;

  await setDoc(doc(db, 'users', user.uid), payload);

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: name || user.displayName || 'User',
    role: DEFAULT_NEW_USER_ROLE,
    status: DEFAULT_NEW_USER_STATUS,
    createdAt: now,
    updatedAt: now
  };
  if (user.photoURL) profile.photoURL = user.photoURL;
  return profile;
};

/**
 * Look up a pre-registered profile (admin-created placeholder) by email.
 * Pre-registered docs live at `users/{lowercaseEmail}` with `uid: ''` —
 * see `userService.createPreRegistered`. Returns null if none found.
 */
const findPreRegisteredProfile = async (email: string | null): Promise<UserProfile | null> => {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  try {
    const snap = await getDoc(doc(db, 'users', normalized));
    if (!snap.exists()) return null;
    const data = snap.data() as UserProfile;
    // Guard: only treat docs with uid === '' as pre-registered placeholders.
    if (data.uid && data.uid !== '') return null;
    return data;
  } catch (error) {
    console.error('Find Pre-Registered Error:', error);
    return null;
  }
};

/**
 * "Claim" a pre-registered profile for the signing-in user.
 *
 * Writes a real uid-keyed doc at `users/{uid}` carrying the admin's
 * chosen role/status/companyId, then deletes the email-keyed placeholder.
 * Firestore rules explicitly permit both writes via matching exists/get
 * checks (see firestore.rules `users/{uid}` block).
 */
const claimPreRegistered = async (user: User, preReg: UserProfile): Promise<UserProfile> => {
  const now = new Date().toISOString();
  // Build the Firestore payload incrementally so optional fields that
  // aren't present (photoURL on email/password sign-in, companyId when
  // no company was assigned) don't leak an `undefined` value into
  // `setDoc`, which Firestore rejects with a cryptic error.
  const payload: Record<string, unknown> = {
    uid: user.uid,
    email: preReg.email,
    displayName: user.displayName || preReg.displayName || 'User',
    role: preReg.role,
    status: preReg.status ?? 'ACTIVE',
    createdAt: preReg.createdAt || now,
    updatedAt: serverTimestamp(),
  };
  if (user.photoURL) payload.photoURL = user.photoURL;
  if (preReg.companyId) payload.companyId = preReg.companyId;
  if (preReg.approvedBy) payload.approvedBy = preReg.approvedBy;
  if (preReg.approvedAt) payload.approvedAt = preReg.approvedAt;

  await setDoc(doc(db, 'users', user.uid), payload);
  // Delete the email-keyed placeholder so it doesn't keep appearing in the
  // admin list after claim. The rule allows this because uid === '' and
  // the placeholder's email matches the signing-in user's auth email.
  await deleteDoc(doc(db, 'users', preReg.email));

  // Return the in-memory view with ISO updatedAt for immediate use.
  const claimed: UserProfile = {
    uid: user.uid,
    email: preReg.email,
    displayName: user.displayName || preReg.displayName || 'User',
    role: preReg.role,
    status: preReg.status ?? 'ACTIVE',
    createdAt: preReg.createdAt || now,
    updatedAt: now,
  };
  if (user.photoURL) claimed.photoURL = user.photoURL;
  if (preReg.companyId) claimed.companyId = preReg.companyId;
  if (preReg.approvedBy) claimed.approvedBy = preReg.approvedBy;
  if (preReg.approvedAt) claimed.approvedAt = preReg.approvedAt;
  return claimed;
};

/**
 * Ensures a Firebase Auth user has a Firestore profile.
 * For login flows (Google, email): fetches existing profile, or claims a
 * pre-registered placeholder by email, or creates a default PENDING one.
 * For registration: always creates a new profile.
 */
const handleUserSync = async (user: User, options?: { name?: string; isNewRegistration?: boolean }): Promise<UserProfile> => {
  try {
    if (!options?.isNewRegistration) {
      // Login flow — try to fetch existing profile.
      const existing = await fetchUserProfile(user.uid);
      if (existing) return existing;

      // No uid-keyed profile yet. Look for an admin-created pre-registered
      // placeholder keyed by this user's email and claim it so the user
      // arrives with the role/status the admin intended.
      const preReg = await findPreRegisteredProfile(user.email);
      if (preReg) {
        return await claimPreRegistered(user, preReg);
      }
    }
    // New user — create profile with default role and PENDING status.
    return await createUserProfile(user, options?.name);
  } catch (error) {
    console.error('User Sync Error:', error);
    throw new Error("Failed to synchronize user profile. Please try again.");
  }
};

/**
 * Authentication Service
 */
export const authService = {
  signInWithGoogle: async (): Promise<UserProfile> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return await handleUserSync(result.user);
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  loginWithEmail: async (email: string, pass: string): Promise<UserProfile> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return await handleUserSync(result.user);
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  registerWithEmail: async (email: string, pass: string, name: string): Promise<UserProfile> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: name });
      return await handleUserSync(result.user, { name, isNewRegistration: true });
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  /**
   * Development-only login using anonymous authentication.
   * Triple-guarded:
   *   1. import.meta.env.DEV (compile-time — stripped from production builds)
   *   2. VITE_ENABLE_DEV_LOGIN env var (must be explicitly set)
   *   3. signInAnonymously must be enabled in Firebase console
   *
   * Dev users get DEFAULT_NEW_USER_ROLE, never ADMIN.
   */
  devLogin: async (): Promise<UserProfile> => {
    if (!import.meta.env.DEV) {
      throw new Error("Development login is not available.");
    }
    if (import.meta.env.VITE_ENABLE_DEV_LOGIN !== 'true') {
      throw new Error("Development login is not enabled. Set VITE_ENABLE_DEV_LOGIN=true in .env.");
    }
    try {
      const result = await signInAnonymously(auth);
      // Dev user gets default role — not admin — and is ACTIVE so local dev is not blocked.
      const now = new Date().toISOString();
      const profile: UserProfile = {
        uid: result.user.uid,
        email: 'dev@sipl.local',
        displayName: 'Dev User',
        role: DEFAULT_NEW_USER_ROLE,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now
      };
      // Write to Firestore so auth context can read it
      await setDoc(doc(db, 'users', result.user.uid), {
        ...profile,
        updatedAt: serverTimestamp()
      });
      return profile;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  logout: () => signOut(auth),

  subscribeToAuth: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  getUserProfile: fetchUserProfile
};

// Backward compatibility exports
export const {
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
  devLogin,
  logout,
  subscribeToAuth,
  getUserProfile
} = authService;
