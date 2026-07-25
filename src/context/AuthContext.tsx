import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import { auth, db } from '../lib/firebase';
import { subscribeToAuth } from '../services/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isCEO: boolean;
  isPM: boolean;
  isAccounts: boolean;
  isSuperAdmin: boolean;
  isPurchaseManager: boolean;
  isStoreManager: boolean;
  isStoreKeeper: boolean;
  /** Check if current user has one of the given roles */
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Live subscription on users/{uid} so the profile stays authoritative
    // across devices. The earlier one-shot getDoc was the root cause of
    // cross-laptop menu drift: a user whose role was changed by an admin
    // kept the stale role in memory on any device that was already
    // logged in (only a hard refresh re-read it), while a second device
    // signing in after the change saw the new role. With onSnapshot,
    // every device converges on the server-side role the moment the
    // admin writes. See Layout.tsx nav filter which depends on
    // profile.role — drift there used to show Masters to an ACCOUNTS
    // user on one laptop but not another.
    let profileUnsub: (() => void) | null = null;

    const authUnsub = subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser);

      // Tear down any previous profile subscription before starting
      // a new one so we never have two listeners competing to set
      // state with data from different uids.
      if (profileUnsub) {
        profileUnsub();
        profileUnsub = null;
      }

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      profileUnsub = onSnapshot(
        doc(db, 'users', firebaseUser.uid),
        (snap) => {
          if (!snap.exists()) {
            // No uid-keyed profile — user hasn't been claimed or
            // provisioned yet. Sign-in handlers deal with the claim
            // flow; here we just reflect reality.
            setProfile(null);
          } else {
            const data = snap.data() as UserProfile;
            // Migration-safe default kept in sync with services/auth.ts
            // fetchUserProfile so legacy docs without `status` still
            // read as ACTIVE.
            setProfile({ ...data, status: data.status ?? 'ACTIVE' });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Profile subscription error:', error);
          setProfile(null);
          setLoading(false);
        }
      );
    });

    return () => {
      if (profileUnsub) profileUnsub();
      authUnsub();
    };
  }, []);

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'ADMIN',
    isCEO: profile?.role === 'CEO',
    isPM: profile?.role === 'PROJECT_MANAGER',
    isAccounts: profile?.role === 'ACCOUNTS',
    isSuperAdmin: profile?.role === 'SUPER_ADMIN',
    isPurchaseManager: profile?.role === 'PURCHASE_MANAGER',
    isStoreManager: profile?.role === 'STORE_MANAGER',
    isStoreKeeper: profile?.role === 'STORE_KEEPER',
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
