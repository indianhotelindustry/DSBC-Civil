import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/auth';
import { UserRole } from '../types';
import { ShieldAlert, Clock, Ban, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-lg bg-[#2563eb] shadow-lg flex items-center justify-center animate-bounce">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#111827]">
              Verifying Session
            </h3>
            <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">
              Securing your connection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in via Firebase Auth but no Firestore profile → account not provisioned
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] p-4">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="p-4 bg-amber-50 rounded-full">
            <ShieldAlert className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-lg font-black text-[#111827]">Account Pending</h2>
          <p className="text-sm text-[#6b7280]">
            Your account has been created but is not yet provisioned. Please contact an administrator to assign your role.
          </p>
          <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest font-bold mt-2">
            User ID: {user.uid}
          </p>
        </div>
      </div>
    );
  }

  // Profile status gating. ADMIN is always allowed through so an admin that
  // somehow ends up PENDING/INACTIVE can still reach the Admin Users page to
  // self-remediate (rules still block self-status changes). Legacy profiles
  // without a status field are treated as ACTIVE (see fetchUserProfile).
  const status = profile.status ?? 'ACTIVE';
  if (status === 'PENDING' && profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] p-4">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="p-4 bg-amber-50 rounded-full">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-lg font-black text-[#111827]">Account Pending Approval</h2>
          <p className="text-sm text-[#6b7280]">
            Your account has been created but has not yet been approved. An administrator will review and activate it shortly.
          </p>
          <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest font-bold mt-2">
            {profile.email}
          </p>
          <Button variant="outline" size="sm" onClick={() => logout()} className="mt-2">
            <LogOut className="h-3 w-3 mr-1.5" /> Sign out
          </Button>
        </div>
      </div>
    );
  }
  if (status === 'INACTIVE' && profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] p-4">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="p-4 bg-rose-50 rounded-full">
            <Ban className="h-10 w-10 text-rose-600" />
          </div>
          <h2 className="text-lg font-black text-[#111827]">Account Deactivated</h2>
          <p className="text-sm text-[#6b7280]">
            Your account has been deactivated. If you believe this is a mistake, please contact an administrator.
          </p>
          <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest font-bold mt-2">
            {profile.email}
          </p>
          <Button variant="outline" size="sm" onClick={() => logout()} className="mt-2">
            <LogOut className="h-3 w-3 mr-1.5" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  // User has a profile but doesn't have the required role for this route.
  // SUPER_ADMIN bypasses all role guards — it is unrestricted by architecture.
  if (allowedRoles && !allowedRoles.includes(profile.role) && profile.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] p-4">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="p-4 bg-rose-50 rounded-full">
            <ShieldAlert className="h-10 w-10 text-rose-600" />
          </div>
          <h2 className="text-lg font-black text-[#111827]">Access Denied</h2>
          <p className="text-sm text-[#6b7280]">
            Your role ({profile.role}) does not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
