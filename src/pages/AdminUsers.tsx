import React, { useEffect, useMemo, useState } from 'react';
import { Check, Search, UserCog, Building2, Shield, Clock, ShieldOff, Users as UsersIcon, AlertTriangle, Plus, MailPlus, Warehouse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { companyService } from '../services/companyService';
import { getAssignedCompanyIds } from '../lib/userAccess';
import { Company, UserProfile, UserRole, UserStatus, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { SkeletonRow } from '../components/Skeleton';
import { cn } from '../lib/utils';

type StatusFilter = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'ALL';

const ROLE_OPTIONS: UserRole[] = [
  'PROJECT_MANAGER', 'ACCOUNTS', 'CEO', 'ADMIN',
  'PURCHASE_MANAGER', 'STORE_MANAGER', 'STORE_KEEPER', 'SUPER_ADMIN',
];

function statusBadge(status: UserStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px] font-black uppercase">Pending</Badge>;
    case 'ACTIVE':
      return <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] font-black uppercase">Active</Badge>;
    case 'INACTIVE':
      return <Badge className="bg-rose-100 text-rose-800 border-0 text-[10px] font-black uppercase">Inactive</Badge>;
  }
}

function roleBadge(role: UserRole) {
  const cls =
    role === 'SUPER_ADMIN' ? 'bg-slate-900 text-yellow-300' :
    role === 'ADMIN' ? 'bg-slate-900 text-white' :
    role === 'CEO' ? 'bg-indigo-100 text-indigo-800' :
    role === 'ACCOUNTS' ? 'bg-blue-100 text-blue-800' :
    role === 'PURCHASE_MANAGER' ? 'bg-violet-100 text-violet-800' :
    role === 'STORE_MANAGER' ? 'bg-emerald-100 text-emerald-800' :
    role === 'STORE_KEEPER' ? 'bg-teal-100 text-teal-800' :
    'bg-slate-100 text-slate-700';
  return <Badge className={cn('border-0 text-[10px] font-black uppercase tracking-wider', cls)}>{role}</Badge>;
}

export default function AdminUsers() {
  const { profile: me } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('PENDING');

  // Role-change dialog
  const [roleTarget, setRoleTarget] = useState<UserProfile | null>(null);
  const [roleSelection, setRoleSelection] = useState<UserRole>('PROJECT_MANAGER');
  // Second-step confirm for sensitive role assignments (ADMIN / CEO).
  const [sensitiveRoleConfirm, setSensitiveRoleConfirm] = useState<{ target: UserProfile; role: UserRole } | null>(null);

  // Company-assign dialog — now multi-select. Set holds the chosen ids.
  const [companyTarget, setCompanyTarget] = useState<UserProfile | null>(null);
  const [companySelections, setCompanySelections] = useState<Set<string>>(new Set());

  // Store-assign dialog — placeholder until R2 creates the stores collection.
  const [storeTarget, setStoreTarget] = useState<UserProfile | null>(null);

  // Deactivate confirmation dialog
  const [deactivateTarget, setDeactivateTarget] = useState<UserProfile | null>(null);

  // Create User dialog (admin pre-register flow)
  const [createOpen, setCreateOpen] = useState(false);

  // Track whether the admin has manually picked a tab. Prevents the
  // "auto-select first non-empty tab" effect below from overriding a
  // deliberate tab click once users data becomes available.
  const [hasAutoSelectedTab, setHasAutoSelectedTab] = useState(false);

  useEffect(() => {
    const unsubUsers = userService.getAll((u) => {
      setUsers(u);
      setLoading(false);
    });
    const unsubCompanies = companyService.getAll(setCompanies);
    return () => {
      unsubUsers();
      unsubCompanies();
    };
  }, []);

  const companyById = useMemo(() => {
    const m: Record<string, Company> = {};
    for (const c of companies) m[c.id] = c;
    return m;
  }, [companies]);

  const counts = useMemo(() => ({
    PENDING: users.filter(u => (u.status ?? 'ACTIVE') === 'PENDING').length,
    ACTIVE: users.filter(u => (u.status ?? 'ACTIVE') === 'ACTIVE').length,
    INACTIVE: users.filter(u => (u.status ?? 'ACTIVE') === 'INACTIVE').length,
    ALL: users.length
  }), [users]);

  // Root-cause fix for the "counts show N but table says 'No users match'"
  // confusion: the initial tab was hard-coded to PENDING. On a fresh
  // workspace with only ACTIVE users, the PENDING tab opened empty even
  // though the Active/All tab buttons correctly displayed (1). We now
  // switch to the first non-empty tab once users arrive, preferring
  // PENDING when there actually are pending users. The flag guards
  // against overriding a tab the admin has manually clicked.
  useEffect(() => {
    if (hasAutoSelectedTab) return;
    if (loading) return;
    if (users.length === 0) return;
    if (counts.PENDING > 0) { setFilter('PENDING'); }
    else if (counts.ACTIVE > 0) { setFilter('ACTIVE'); }
    else if (counts.INACTIVE > 0) { setFilter('INACTIVE'); }
    else { setFilter('ALL'); }
    setHasAutoSelectedTab(true);
  }, [loading, users, counts, hasAutoSelectedTab]);

  const handleTabClick = (tab: StatusFilter) => {
    setFilter(tab);
    setHasAutoSelectedTab(true);
  };

  const filtered = useMemo(() => {
    const byStatus = filter === 'ALL'
      ? users
      : users.filter(u => (u.status ?? 'ACTIVE') === filter);
    const needle = search.trim().toLowerCase();
    if (!needle) return byStatus;
    return byStatus.filter(u =>
      u.displayName?.toLowerCase().includes(needle) ||
      u.email?.toLowerCase().includes(needle) ||
      u.role?.toLowerCase().includes(needle)
    );
  }, [users, filter, search]);

  const isSelf = (u: UserProfile) => me?.uid === u.uid;

  // ── Actions ─────────────────────────────────────────────────────────

  const handleApprove = async (u: UserProfile) => {
    try {
      await userService.approve(u.uid, u.displayName);
      toast.success(`Approved ${u.displayName}`);
    } catch (err) {
      handleErr(err);
    }
  };

  const handleActivate = async (u: UserProfile) => {
    try {
      await userService.activate(u.uid, u.displayName);
      toast.success(`Activated ${u.displayName}`);
    } catch (err) {
      handleErr(err);
    }
  };

  const requestDeactivate = (u: UserProfile) => setDeactivateTarget(u);

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await userService.deactivate(deactivateTarget.uid, deactivateTarget.displayName);
      toast.success(`Deactivated ${deactivateTarget.displayName}`);
      setDeactivateTarget(null);
    } catch (err) {
      handleErr(err);
      // Keep the dialog open on failure so the admin sees the toast in
      // context (e.g. "cannot remove the last active admin").
    }
  };

  const openRoleDialog = (u: UserProfile) => {
    setRoleTarget(u);
    setRoleSelection(u.role);
  };

  /** Submit from the role dialog. For ADMIN/CEO assignments, divert into a
   *  second confirmation step rather than committing immediately. */
  const submitRoleChange = async () => {
    if (!roleTarget) return;
    const isSensitive = roleSelection === 'SUPER_ADMIN' || roleSelection === 'ADMIN' || roleSelection === 'CEO';
    const isActualChange = roleSelection !== roleTarget.role;
    if (isSensitive && isActualChange) {
      setSensitiveRoleConfirm({ target: roleTarget, role: roleSelection });
      return;
    }
    await commitRoleChange(roleTarget, roleSelection);
  };

  const commitRoleChange = async (target: UserProfile, role: UserRole) => {
    try {
      await userService.changeRole(target.uid, role, target.displayName);
      toast.success(`Role set to ${role}`);
      setRoleTarget(null);
      setSensitiveRoleConfirm(null);
    } catch (err) {
      handleErr(err);
    }
  };

  const openCompanyDialog = (u: UserProfile) => {
    setCompanyTarget(u);
    setCompanySelections(new Set(getAssignedCompanyIds(u)));
  };

  const toggleCompanySelection = (id: string) => {
    setCompanySelections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submitCompanyAssign = async () => {
    if (!companyTarget) return;
    try {
      const ids = Array.from(companySelections);
      const labels = ids.map(id => companyById[id]?.name || companyById[id]?.code || id);
      await userService.assignCompanies(
        companyTarget.uid,
        ids,
        companyTarget.displayName,
        labels
      );
      toast.success(
        ids.length > 0
          ? `Assigned ${ids.length} compan${ids.length === 1 ? 'y' : 'ies'}`
          : 'Cleared all company assignments'
      );
      setCompanyTarget(null);
    } catch (err) {
      handleErr(err);
    }
  };

  const handleErr = (err: unknown) => {
    if (err instanceof BusinessRuleError) {
      toast.error(err.message);
    } else {
      const msg = err instanceof Error ? err.message : 'Action failed';
      toast.error(msg);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827] flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-[#2563eb]" />
            User Management
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Approve new sign-ups, pre-register new users, assign roles and companies, and activate or deactivate accounts.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
          <Plus className="h-4 w-4 mr-1.5" /> Create User
        </Button>
      </div>

      {/* Filter buttons + Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 gap-1">
          {([
            ['PENDING', `Pending (${counts.PENDING})`],
            ['ACTIVE', `Active (${counts.ACTIVE})`],
            ['INACTIVE', `Inactive (${counts.INACTIVE})`],
            ['ALL', `All (${counts.ALL})`]
          ] as [StatusFilter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors',
                filter === key
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-[#6b7280] hover:text-[#111827]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
          <Input
            placeholder="Search by name, email, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb]">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={7} />)}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#9ca3af] text-sm">
                  {(() => {
                    // Three distinct empty-state messages so an admin always
                    // knows where to go next.
                    if (users.length === 0) {
                      return (
                        <div className="space-y-2">
                          <p className="font-semibold text-[#6b7280]">No users yet.</p>
                          <p className="text-xs">
                            Click <strong>Create User</strong> to pre-register someone, or wait for a user to sign in.
                          </p>
                        </div>
                      );
                    }
                    const needle = search.trim();
                    if (needle) {
                      return (
                        <div className="space-y-2">
                          <p className="font-semibold text-[#6b7280]">
                            No users match &ldquo;{needle}&rdquo; in the <strong>{filter}</strong> tab.
                          </p>
                          <Button variant="outline" size="sm" onClick={() => setSearch('')}>Clear search</Button>
                        </div>
                      );
                    }
                    // No matches in this tab but other tabs have users.
                    const candidates: StatusFilter[] = ['PENDING', 'ACTIVE', 'INACTIVE'];
                    const suggestion = candidates.find(k => k !== filter && counts[k] > 0);
                    const suggestionLabel =
                      suggestion === 'PENDING' ? 'Pending' :
                      suggestion === 'ACTIVE' ? 'Active' :
                      suggestion === 'INACTIVE' ? 'Inactive' : 'All';
                    return (
                      <div className="space-y-2">
                        <p className="font-semibold text-[#6b7280]">
                          No {filter.toLowerCase()} users.
                        </p>
                        {suggestion && (
                          <Button variant="outline" size="sm" onClick={() => handleTabClick(suggestion)}>
                            Show {suggestionLabel} ({counts[suggestion]})
                          </Button>
                        )}
                      </div>
                    );
                  })()}
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((u) => {
              const status = u.status ?? 'ACTIVE';
              const assignedIds = getAssignedCompanyIds(u);
              const created = u.createdAt ? format(parseISO(u.createdAt), 'MMM dd, yyyy') : '—';
              const self = isSelf(u);
              const isPreRegistered = !u.uid;
              return (
                <TableRow key={u.uid || u.email} className={cn(self && 'bg-slate-50/60', isPreRegistered && 'bg-sky-50/40')}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{u.displayName}</span>
                      {self && <span className="text-[9px] uppercase font-bold tracking-widest text-[#6b7280]">(you)</span>}
                      {isPreRegistered && (
                        <Badge className="bg-sky-100 text-sky-800 border-0 text-[9px] font-black uppercase tracking-wider">
                          <MailPlus className="h-2.5 w-2.5 mr-1" /> Pre-registered
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#6b7280]">{u.email}</TableCell>
                  <TableCell>{roleBadge(u.role)}</TableCell>
                  <TableCell>{statusBadge(status)}</TableCell>
                  <TableCell className="text-sm text-[#6b7280]">
                    {assignedIds.length === 0 ? (
                      <span>—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {assignedIds.map(id => (
                          <Badge
                            key={id}
                            className="bg-slate-100 text-slate-700 border-0 text-[10px] font-black uppercase tracking-wider"
                          >
                            {companyById[id]?.code || companyById[id]?.name || id}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-[#6b7280]">{created}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Pre-registered rows get a "Cancel Invite" action; the
                          approve/activate/deactivate/role/company actions all
                          require a real uid and are hidden here. When the user
                          signs in, the placeholder is claimed into a real uid
                          profile and the full action menu becomes available. */}
                      {isPreRegistered ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px] font-black uppercase text-rose-600 border-rose-200 hover:bg-rose-50"
                          onClick={async () => {
                            if (!window.confirm(`Cancel pre-registered invite for ${u.email}?`)) return;
                            try {
                              await userService.cancelInvite(u.email);
                              toast.success('Invite cancelled');
                            } catch (err) {
                              handleErr(err);
                            }
                          }}
                        >
                          Cancel invite
                        </Button>
                      ) : (
                        <>
                          {status === 'PENDING' && !self && (
                            <Button
                              size="sm"
                              className="h-7 text-[10px] font-black uppercase bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleApprove(u)}
                            >
                              <Check className="h-3 w-3 mr-1" /> Approve
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={self}>
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openRoleDialog(u)}>
                                <Shield className="h-3.5 w-3.5 mr-2" /> Change role
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openCompanyDialog(u)}>
                                <Building2 className="h-3.5 w-3.5 mr-2" /> Assign companies
                              </DropdownMenuItem>
                              {(u.role === 'STORE_MANAGER' || u.role === 'STORE_KEEPER') && (
                                <DropdownMenuItem onClick={() => setStoreTarget(u)}>
                                  <Warehouse className="h-3.5 w-3.5 mr-2" /> Assign stores
                                </DropdownMenuItem>
                              )}
                              {status !== 'ACTIVE' && (
                                <DropdownMenuItem onClick={() => handleActivate(u)}>
                                  <Clock className="h-3.5 w-3.5 mr-2" /> Activate
                                </DropdownMenuItem>
                              )}
                              {status !== 'INACTIVE' && (
                                <DropdownMenuItem onClick={() => requestDeactivate(u)}>
                                  <ShieldOff className="h-3.5 w-3.5 mr-2" /> Deactivate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Change-role dialog */}
      <Dialog open={!!roleTarget} onOpenChange={(open) => !open && setRoleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              {roleTarget && <>Set the role for <strong>{roleTarget.displayName}</strong> ({roleTarget.email}).</>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={roleSelection} onValueChange={(v) => setRoleSelection(v as UserRole)}>
              <SelectTrigger>
                <SelectValue>{roleSelection}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleTarget(null)}>Cancel</Button>
            <Button onClick={submitRoleChange}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign-companies dialog (multi-select). Each row is a checkbox
          toggle so an admin can tick SIPL, SHSPL, or both. Leaving all
          unchecked and saving clears the user's company scope. */}
      <Dialog open={!!companyTarget} onOpenChange={(open) => !open && setCompanyTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign companies</DialogTitle>
            <DialogDescription>
              {companyTarget && (
                <>Choose which companies <strong>{companyTarget.displayName}</strong> can access. Tick any combination.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Companies</Label>
            {companies.length === 0 ? (
              <p className="text-xs text-[#6b7280]">No companies configured.</p>
            ) : (
              <div className="border border-[#e5e7eb] rounded-lg divide-y divide-[#e5e7eb]">
                {companies.map(c => {
                  const checked = companySelections.has(c.id);
                  return (
                    <label
                      key={c.id}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors",
                        checked && "bg-blue-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCompanySelection(c.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827]">{c.code}</p>
                        <p className="text-[11px] text-[#6b7280] truncate">{c.name}</p>
                      </div>
                      <Badge className="bg-slate-100 text-slate-700 border-0 text-[9px] font-black uppercase">
                        {c.businessType}
                      </Badge>
                    </label>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-[#9ca3af]">
              Selected: {companySelections.size}
              {companySelections.size === 0 ? ' — saving clears all company access' : ''}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyTarget(null)}>Cancel</Button>
            <Button onClick={submitCompanyAssign}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Store-assign dialog — placeholder until stores are created in Masters (R2).
          Shows the correct UI shell so ADMIN can assign stores once they exist.
          "Assign stores" menu item is only visible for STORE_MANAGER / STORE_KEEPER. */}
      <Dialog open={!!storeTarget} onOpenChange={(open) => !open && setStoreTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign stores</DialogTitle>
            <DialogDescription>
              {storeTarget && (
                <>Choose which stores <strong>{storeTarget.displayName}</strong> can manage.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Stores</Label>
            <p className="text-xs text-[#6b7280]">
              No stores configured yet. Create stores in Masters first.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStoreTarget(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second-step confirm for sensitive role assignments (ADMIN / CEO). */}
      <Dialog
        open={!!sensitiveRoleConfirm}
        onOpenChange={(open) => !open && setSensitiveRoleConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Confirm {sensitiveRoleConfirm?.role} assignment
            </DialogTitle>
            <DialogDescription>
              {sensitiveRoleConfirm && (
                <>
                  You are about to grant <strong>{sensitiveRoleConfirm.role}</strong> privileges to{' '}
                  <strong>{sensitiveRoleConfirm.target.displayName}</strong> ({sensitiveRoleConfirm.target.email}).
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-[11px] text-amber-800 leading-relaxed">
            {sensitiveRoleConfirm?.role === 'SUPER_ADMIN' ? (
              <>SUPER ADMINs have unrestricted access to all companies, all data, and all configuration. Assign extremely sparingly.</>
            ) : sensitiveRoleConfirm?.role === 'ADMIN' ? (
              <>ADMINs can manage users, change roles, approve accounts, and override all business rules. Assign sparingly.</>
            ) : (
              <>CEOs approve bills, work orders, and payments. This role should be assigned very sparingly.</>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSensitiveRoleConfirm(null)}>Cancel</Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() =>
                sensitiveRoleConfirm &&
                commitRoleChange(sensitiveRoleConfirm.target, sensitiveRoleConfirm.role)
              }
            >
              Yes, assign {sensitiveRoleConfirm?.role}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirmation. Service layer still enforces the last-admin
          guard — this dialog just adds an explicit admin click. */}
      <Dialog
        open={!!deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Deactivate user?
            </DialogTitle>
            <DialogDescription>
              {deactivateTarget && (
                <>
                  <strong>{deactivateTarget.displayName}</strong> ({deactivateTarget.email}) will lose
                  access to the app on their next request. You can reactivate them at any time.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {deactivateTarget?.role === 'ADMIN' && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-[11px] text-rose-800 leading-relaxed">
              This user is an <strong>ADMIN</strong>. The action will be blocked if they are the last
              active admin in the system.
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={confirmDeactivate}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User — admin pre-registers a profile. When the user signs
          in later with the same email, auth sync claims this placeholder
          into a real uid-keyed profile automatically. */}
      {createOpen && (
        <CreateUserDialog
          companies={companies}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            // Jump to the tab of the newly-created user's status so the
            // admin sees the row immediately.
            setCreateOpen(false);
            setHasAutoSelectedTab(true);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Create User (pre-register) dialog
// ─────────────────────────────────────────────────────────────────────

function CreateUserDialog({
  companies,
  onClose,
  onCreated
}: {
  companies: Company[];
  onClose: () => void;
  onCreated: (status: UserStatus) => void;
}) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('PROJECT_MANAGER');
  const [companyIds, setCompanyIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [submitting, setSubmitting] = useState(false);

  const toggleCompany = (id: string) => {
    setCompanyIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) { toast.error('Name is required.'); return; }
    if (!email.trim() || !email.includes('@')) { toast.error('A valid email is required.'); return; }
    setSubmitting(true);
    try {
      await userService.createPreRegistered({
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        role,
        companyIds: Array.from(companyIds),
        status
      });
      toast.success(`Pre-registered ${email.trim().toLowerCase()} as ${role}`);
      onCreated(status);
    } catch (err) {
      if (err instanceof BusinessRuleError) toast.error(err.message);
      else toast.error(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MailPlus className="h-4 w-4 text-[#2563eb]" />
            Create User
          </DialogTitle>
          <DialogDescription>
            Pre-register a user profile. When the person signs in later with the same email, their profile will link automatically with the role and status you set here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Full name" required autoFocus />
            </div>
            <div className="grid gap-2">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" required />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue>{role}</SelectValue></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as UserStatus)}>
                <SelectTrigger><SelectValue>{status}</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label>Companies (optional)</Label>
              {companies.length === 0 ? (
                <p className="text-xs text-[#6b7280]">No companies configured.</p>
              ) : (
                <div className="border border-[#e5e7eb] rounded-lg divide-y divide-[#e5e7eb]">
                  {companies.map(c => {
                    const checked = companyIds.has(c.id);
                    return (
                      <label
                        key={c.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors",
                          checked && "bg-blue-50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCompany(c.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#111827]">{c.code}</p>
                          <p className="text-[11px] text-[#6b7280] truncate">{c.name}</p>
                        </div>
                        <Badge className="bg-slate-100 text-slate-700 border-0 text-[9px] font-black uppercase">
                          {c.businessType}
                        </Badge>
                      </label>
                    );
                  })}
                </div>
              )}
              <p className="text-[11px] text-[#9ca3af]">
                {companyIds.size === 0
                  ? 'No companies selected — user will have no company scope.'
                  : `${companyIds.size} compan${companyIds.size === 1 ? 'y' : 'ies'} selected.`}
              </p>
            </div>
          </div>
          {(role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'CEO') && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold">You are pre-registering a sensitive role.</p>
                <p className="text-amber-800 mt-0.5">
                  {role === 'SUPER_ADMIN'
                    ? 'SUPER ADMINs have unrestricted platform access across all companies. Assign extremely sparingly.'
                    : role === 'ADMIN'
                    ? 'ADMINs can manage users and override all business rules. Assign sparingly.'
                    : 'CEOs approve bills, work orders, and payments. This role should be assigned very sparingly.'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
