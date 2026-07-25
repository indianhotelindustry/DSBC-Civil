import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit, Trash2, ExternalLink, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/companyService';
import { projectService } from '../services/projectService';
import { subLocationService } from '../services/subLocationService';
import { customerService } from '../services/customerService';
import { saleService, SaleCreateInput } from '../services/saleService';
import { Company, Project, SubLocation, Customer, Sale, FundingModel, UnitOwnershipStatus, BusinessRuleError } from '../types';
import { getLabels, getSubLocationTypes } from '../lib/companyLabels';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';

export default function SubLocations() {
  const { isAdmin, isPM } = useAuth();
  // PM has full create/edit rights per Firestore rules (firestore.rules
  // `subLocations/{id}` block) and matches Projects/Contractors/Customers.
  // Delete stays admin-only to match the rest of Masters.
  const canEdit = isAdmin || isPM;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subLocations, setSubLocations] = useState<SubLocation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  /** Opens the migration dialog to create a Sale record for a unit
   *  that was manually marked SOLD in Masters without a Sale. */
  const [migrationUnit, setMigrationUnit] = useState<SubLocation | null>(null);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  /** Ownership filter — SIPL only; 'all' | 'UNSOLD' | 'SOLD'. */
  const [filterOwnership, setFilterOwnership] = useState<'all' | UnitOwnershipStatus>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SubLocation | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const [formData, setFormData] = useState({
    companyId: '',
    projectId: '',
    type: '',
    name: '',
    code: '',
    isActive: true,
    ownershipStatus: 'UNSOLD' as UnitOwnershipStatus,
    ownerClientId: '',
  });

  useEffect(() => {
    const unsub1 = companyService.getAll(setCompanies);
    const unsub2 = projectService.getAll(setProjects);
    const unsub3 = subLocationService.getAll((data) => { setSubLocations(data); setLoading(false); });
    const unsub4 = customerService.getAll(setCustomers);
    // Sales live-subscription — needed to detect "manual SOLD without
    // Sale record" drift and to clear the banner the moment a migration
    // completes (saleService.createFromManualSoldUnit writes a Sale).
    const unsub5 = saleService.getAll(setSales);
    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); };
  }, []);

  const selectedCompany = useMemo(() => companies.find(c => c.id === formData.companyId), [companies, formData.companyId]);
  const labels = useMemo(() => getLabels(selectedCompany?.businessType), [selectedCompany]);
  const subTypes = useMemo(() => getSubLocationTypes(selectedCompany?.businessType), [selectedCompany]);
  const filteredProjects = useMemo(() => {
    if (!formData.companyId) return [];
    // Strict company filter — legacy projects excluded.
    // Backfill legacy projects via Masters page to make them visible here.
    return projects.filter(p => p.companyId === formData.companyId);
  }, [projects, formData.companyId]);

  /** Whether the form's selected company is CONSTRUCTION (SIPL) — controls
   *  whether the ownership section is shown in the dialog. */
  const formIsConstruction = selectedCompany?.businessType === 'CONSTRUCTION';

  /** Customers belonging to the form's selected company. */
  const customersForForm = useMemo(
    () => customers.filter(c => c.companyId === formData.companyId),
    [customers, formData.companyId]
  );
  const customerById = useMemo(() => {
    const m: Record<string, Customer> = {};
    for (const c of customers) m[c.id] = c;
    return m;
  }, [customers]);

  /** Whether the page-level filter is on a CONSTRUCTION company (or 'all'). */
  const filterCo = companies.find(c => c.id === filterCompany);
  const filterIsConstruction = filterCompany === 'all' || filterCo?.businessType === 'CONSTRUCTION';

  const filtered = useMemo(() => {
    let list = subLocations;
    if (filterCompany !== 'all') list = list.filter(sl => sl.companyId === filterCompany);
    if (filterProject !== 'all') list = list.filter(sl => sl.projectId === filterProject);
    if (filterOwnership !== 'all') {
      list = list.filter(sl => (sl.ownershipStatus ?? 'UNSOLD') === filterOwnership);
    }
    if (search) {
      const s = search.toLowerCase();
      // Match against unit number (stored in `name`), owner name, and
      // the parent project name. Type is kept so admins can still narrow
      // by unit/dept type without losing previous behaviour.
      const projectNameById: Record<string, string> = {};
      for (const p of projects) projectNameById[p.id] = p.name || '';
      list = list.filter(sl =>
        sl.name.toLowerCase().includes(s) ||
        (sl.ownerClientName || '').toLowerCase().includes(s) ||
        (projectNameById[sl.projectId] || '').toLowerCase().includes(s) ||
        sl.type.toLowerCase().includes(s)
      );
    }
    // Stable sort by unit number ascending (1, 2, 3, 10, A-101, …) using
    // the platform's natural-number compare so '2' lands before '10'.
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return [...list].sort((a, b) => collator.compare(a.name || '', b.name || ''));
  }, [subLocations, projects, filterCompany, filterProject, filterOwnership, search]);

  const handleOpenDialog = (sl?: SubLocation) => {
    if (sl) {
      setEditing(sl);
      setFormData({
        companyId: sl.companyId,
        projectId: sl.projectId,
        type: sl.type,
        name: sl.name,
        code: sl.code || '',
        isActive: sl.isActive,
        ownershipStatus: sl.ownershipStatus ?? 'UNSOLD',
        ownerClientId: sl.ownerClientId || '',
      });
    } else {
      setEditing(null);
      setFormData({
        companyId: companies[0]?.id || '',
        projectId: '',
        type: '',
        name: '',
        code: '',
        isActive: true,
        ownershipStatus: 'UNSOLD',
        ownerClientId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Only send ownership fields for SIPL (CONSTRUCTION) companies.
      // HOSPITALITY sub-locations ignore these at the service layer.
      const { ownershipStatus, ownerClientId, ...rest } = formData;
      const payload = formIsConstruction
        ? {
            ...rest,
            ownershipStatus,
            ownerClientId: ownershipStatus === 'SOLD' ? ownerClientId : undefined,
          }
        : rest;
      if (editing) {
        await subLocationService.update(editing.id, payload);
        toast.success('Updated successfully');
      } else {
        await subLocationService.create(payload);
        toast.success('Created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this sub-location?')) {
      try {
        await subLocationService.delete(id);
        toast.success('Deleted');
      } catch (error) {
        toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to delete');
      }
    }
  };

  const getCompanyName = (id: string) => companies.find(c => c.id === id)?.code || '—';
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || '—';

  // Dynamic page label based on filter. filterCo is computed above.
  const pageLabels = getLabels(filterCo?.businessType);

  // ── Admin backfill for legacy ownership/saleStatus mismatches ────
  // A SIPL unit edited in the SubLocations dialog before commit cee8973
  // could end up with ownershipStatus=SOLD but saleStatus still
  // AVAILABLE (or vice-versa) because the manual-edit path did not sync
  // saleStatus. The new service logic keeps future writes in sync; this
  // banner gives admins a one-click cleanup for existing rows.
  //
  // Units with an activeSaleId are excluded — Sales module is
  // authoritative for those; saleStatus transitions come from
  // saleService and must not be touched here.
  const mismatchedCount = useMemo(() => {
    if (!isAdmin) return 0;
    const constructionCompanyIds = new Set(
      companies.filter(c => c.businessType === 'CONSTRUCTION').map(c => c.id)
    );
    let n = 0;
    for (const sl of subLocations) {
      if (!sl.companyId || !constructionCompanyIds.has(sl.companyId)) continue;
      if (sl.activeSaleId) continue;
      const ownership = sl.ownershipStatus ?? 'UNSOLD';
      const expected = ownership === 'SOLD' ? 'SOLD' : 'AVAILABLE';
      const current = sl.saleStatus ?? 'AVAILABLE';
      if (current !== expected) n++;
    }
    return n;
  }, [isAdmin, subLocations, companies]);

  // ── Detect SIPL units that are SOLD in Masters but have no Sale ──
  // These are the units missing from the Unit Sales page. The list is
  // live: it updates automatically the moment a migration writes a
  // Sale (clearing the row from the list) or an admin adds a new
  // manual-SOLD unit (shouldn't happen post-fix — the service blocks it
  // — but kept live in case a write slips through a Firestore rule).
  const manualSoldDrift = useMemo(() => {
    if (!isAdmin) return [] as SubLocation[];
    const constructionCompanyIds = new Set(
      companies.filter(c => c.businessType === 'CONSTRUCTION').map(c => c.id)
    );
    const unitsWithActiveSale = new Set<string>();
    for (const s of sales) {
      if (s.saleStatus !== 'CANCELLED') unitsWithActiveSale.add(s.subLocationId);
    }
    return subLocations.filter(sl =>
      sl.companyId &&
      constructionCompanyIds.has(sl.companyId) &&
      (sl.ownershipStatus ?? 'UNSOLD') === 'SOLD' &&
      !sl.activeSaleId &&
      !unitsWithActiveSale.has(sl.id)
    );
  }, [isAdmin, subLocations, companies, sales]);

  const [normalizing, setNormalizing] = useState(false);
  const handleNormalize = async () => {
    setNormalizing(true);
    try {
      const fixed = await subLocationService.normalizeMismatchedSaleStatus();
      if (fixed === 0) toast.success('No mismatches to fix.');
      else toast.success(`Synced ${fixed} SIPL unit${fixed === 1 ? '' : 's'} — ownership and sale status now consistent.`);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to normalize');
    } finally {
      setNormalizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ownership / saleStatus mismatch backfill — admin only, hidden when
          nothing to fix. Triggered by legacy rows edited before the auto-
          sync fix landed in service layer. One click normalizes all. */}
      {isAdmin && mismatchedCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3 flex-wrap">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900">
                {mismatchedCount} SIPL unit{mismatchedCount === 1 ? '' : 's'} have ownership / sale-status drift
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                These units were edited before the auto-sync fix. Click Normalize to
                set each unit's sale status to match its ownership (SOLD → Sold,
                UNSOLD → Available). Units with an active sale are excluded — the
                Sales module stays authoritative for those.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold uppercase h-8"
              onClick={handleNormalize}
              disabled={normalizing}
            >
              {normalizing ? 'Normalizing…' : `Normalize ${mismatchedCount}`}
            </Button>
          </div>
        </div>
      )}

      {/* Manual-SOLD without Sale record — admin-only. Each row has a
          Create Sale Record action that opens the migration dialog
          pre-filled with the unit's company, project, customer, and
          soldAt date. Admin supplies the missing commercial fields. */}
      {isAdmin && manualSoldDrift.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-3 flex-wrap">
            <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-rose-900">
                {manualSoldDrift.length} SIPL unit{manualSoldDrift.length === 1 ? '' : 's'} marked SOLD in Masters but missing from Unit Sales
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Unit Sales reads from the sales collection — these units won't
                appear there until a Sale record is created. Click Create Sale
                Record on each row to migrate: the unit's company, project, and
                owner are pre-filled, you just supply the commercial fields.
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {manualSoldDrift.map(sl => {
              const project = projects.find(p => p.id === sl.projectId);
              const company = companies.find(c => c.id === sl.companyId);
              return (
                <div
                  key={sl.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-rose-200 bg-white px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#111827]">
                      {sl.name} <span className="text-[#6b7280] font-normal">· {project?.name || '—'} · {company?.code || '—'}</span>
                    </p>
                    <p className="text-[11px] text-[#6b7280]">
                      Owner: <strong>{sl.ownerClientName || '— (no customer recorded)'}</strong>
                      {sl.soldAt && <> · Sold {sl.soldAt.slice(0, 10)}</>}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold uppercase h-7"
                    onClick={() => setMigrationUnit(sl)}
                    disabled={!sl.ownerClientId}
                    title={!sl.ownerClientId ? 'This unit has no recorded customer — edit ownership first.' : undefined}
                  >
                    Create Sale Record
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {migrationUnit && (
        <MigrationSaleDialog
          unit={migrationUnit}
          customer={customers.find(c => c.id === migrationUnit.ownerClientId) || null}
          projectName={projects.find(p => p.id === migrationUnit.projectId)?.name || '—'}
          onClose={() => setMigrationUnit(null)}
          onDone={() => setMigrationUnit(null)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Units & Departments</h2>
          <p className="text-sm text-[#6b7280]">Manage sub-locations for projects across companies.</p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsBulkOpen(true)}>
              <Layers className="mr-2 h-4 w-4" /> Bulk Add
            </Button>
            <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Sub-Location
            </Button>
          </div>
        )}
      </div>

      {/* Company tabs — mirror the Projects page so any future company
          added via companyService shows up as a tab automatically. */}
      <div className="flex items-center gap-1 bg-white border border-[#e5e7eb] rounded-lg p-1 w-fit">
        <button
          onClick={() => { setFilterCompany('all'); setFilterProject('all'); }}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filterCompany === 'all' ? 'bg-[#f1f5f9] text-[#2563eb]' : 'text-[#6b7280] hover:text-[#111827]'
          )}
        >
          All ({subLocations.length})
        </button>
        {companies.map(c => {
          const count = subLocations.filter(sl => sl.companyId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => { setFilterCompany(c.id); setFilterProject('all'); }}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
                filterCompany === c.id ? 'bg-[#f1f5f9] text-[#2563eb]' : 'text-[#6b7280] hover:text-[#111827]'
              )}
            >
              {c.code} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-48 h-8 text-xs"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {(filterCompany !== 'all' ? projects.filter(p => p.companyId === filterCompany) : projects).map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filterIsConstruction && (
          <Select value={filterOwnership} onValueChange={(v) => setFilterOwnership(v as 'all' | UnitOwnershipStatus)}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Ownership" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              <SelectItem value="UNSOLD">Unsold</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-2 max-w-xs bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
          <Search className="h-4 w-4 text-[#6b7280]" />
          <Input placeholder="Search by number, owner, or project..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-none shadow-none focus-visible:ring-0 bg-transparent h-7 text-xs" />
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Company</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Project</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Type</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Number</TableHead>
              {filterIsConstruction && (
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Owner</TableHead>
              )}
              {filterIsConstruction && (
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Sale</TableHead>
              )}
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={filterIsConstruction ? 8 : 6} />)
            ) : filtered.length > 0 ? (
              filtered.map(sl => (
                <TableRow key={sl.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-xs font-bold">{getCompanyName(sl.companyId)}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{getProjectName(sl.projectId)}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{sl.type}</TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-sm">{sl.name}</TableCell>
                  {filterIsConstruction && (
                    <TableCell className="px-6 py-4">
                      {(() => {
                        // Only SIPL rows get an owner treatment; SHSPL rows in an "all"
                        // view show a dash so they don't look mis-owned.
                        const co = companies.find(c => c.id === sl.companyId);
                        if (co?.businessType !== 'CONSTRUCTION') {
                          return <span className="text-xs text-[#9ca3af]">—</span>;
                        }
                        const status = sl.ownershipStatus ?? 'UNSOLD';
                        // One-liner: "Unsold — SIPL" or "Sold — <customer name>"
                        if (status === 'SOLD') {
                          return (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px] font-black uppercase">Sold</Badge>
                              <span className="text-xs text-[#111827] font-semibold">— {sl.ownerClientName || 'Customer'}</span>
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] font-black uppercase">Unsold</Badge>
                            <span className="text-xs text-[#6b7280] font-semibold">— {co.code}</span>
                          </div>
                        );
                      })()}
                    </TableCell>
                  )}
                  {filterIsConstruction && (
                    <TableCell className="px-6 py-4">
                      {(() => {
                        const co = companies.find(c => c.id === sl.companyId);
                        if (co?.businessType !== 'CONSTRUCTION') {
                          return <span className="text-xs text-[#9ca3af]">—</span>;
                        }
                        const s = sl.saleStatus ?? 'AVAILABLE';
                        const cls =
                          s === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                          s === 'SOLD' ? 'bg-emerald-100 text-emerald-800' :
                          s === 'POSSESSION_GIVEN' ? 'bg-violet-100 text-violet-800' :
                          s === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-600';
                        const label = s === 'POSSESSION_GIVEN' ? 'Possession' : s === 'AVAILABLE' ? 'Available' : s;
                        return (
                          <Badge className={cn('border-0 text-[10px] font-black uppercase tracking-wider', cls)}>
                            {label}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                  )}
                  <TableCell className="px-6 py-4">
                    <Badge className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none", sl.isActive ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-slate-100 text-slate-500')}>
                      {sl.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(sl)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => handleDelete(sl.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={filterIsConstruction ? 8 : 6} className="h-24 text-center text-muted-foreground">No sub-locations found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} {labels.subLocationLabel}</DialogTitle>
            <DialogDescription>Add a unit, department, or area within a project.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {companies.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-center">
                <p className="text-sm font-bold text-amber-800">No companies available</p>
                <p className="text-xs text-amber-600 mt-1">Companies are being initialized. Please close and reopen this dialog.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 grid gap-2">
                <Label>Company</Label>
                <Select value={formData.companyId} onValueChange={(v) => setFormData({ ...formData, companyId: v, projectId: '', type: '' })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select company">
                      {formData.companyId ? (() => { const c = companies.find(co => co.id === formData.companyId); return c ? `${c.code} — ${c.name}` : undefined; })() : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-[340px]">
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 grid gap-2">
                <Label>{labels.projectLabel}</Label>
                <Select value={formData.projectId} onValueChange={(v) => setFormData({ ...formData, projectId: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={formData.companyId ? `Select ${labels.projectLabel.toLowerCase()}` : 'Select company first'}>
                      {formData.projectId ? (projects.find(p => p.id === formData.projectId)?.name || 'Unnamed Project') : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-[340px]">
                    {filteredProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name || 'Unnamed Project'}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{labels.subLocationTypeLabel}</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder={`Select ${labels.subLocationTypeLabel.toLowerCase()}`} /></SelectTrigger>
                  <SelectContent>
                    {subTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{labels.subLocationLabel} Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={`e.g. ${labels.subLocationLabel} A`} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Code (optional)</Label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="Short code" />
            </div>

            {formIsConstruction && (
              <div className="rounded-lg border border-[#e5e7eb] p-4 bg-[#f9fafb] space-y-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#111827]">Ownership</p>
                  <p className="text-[11px] text-[#6b7280] mt-0.5">
                    {editing?.activeSaleId
                      ? 'Managed via the Sale record. Cancel the sale to edit ownership manually.'
                      : <>Units owned by {selectedCompany?.code || 'SIPL'} are Unsold. Switch to Sold and pick a customer when the unit is sold.</>
                    }
                  </p>
                </div>

                {editing?.activeSaleId && (
                  <div className="flex items-center justify-between rounded-md border border-blue-100 bg-blue-50 px-3 py-2">
                    <span className="text-[11px] text-blue-900">
                      Active sale <strong>#{editing.activeSaleId.slice(0, 8)}</strong> drives this unit's ownership.
                    </span>
                    <Link
                      to={`/sales/${editing.activeSaleId}`}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      Open sale <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.ownershipStatus}
                      onValueChange={(v) => setFormData({ ...formData, ownershipStatus: v as UnitOwnershipStatus, ownerClientId: v === 'UNSOLD' ? '' : formData.ownerClientId })}
                      disabled={!!editing?.activeSaleId}
                    >
                      <SelectTrigger className="w-full" disabled={!!editing?.activeSaleId}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNSOLD">Unsold — owned by {selectedCompany?.code || 'SIPL'}</SelectItem>
                        <SelectItem value="SOLD">Sold — owned by customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.ownershipStatus === 'SOLD' && (
                    <div className="grid gap-2">
                      <Label>Customer <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.ownerClientId}
                        onValueChange={(v) => setFormData({ ...formData, ownerClientId: v })}
                        disabled={!!editing?.activeSaleId}
                      >
                        <SelectTrigger className="w-full" disabled={!!editing?.activeSaleId}>
                          <SelectValue placeholder={customersForForm.length ? 'Select customer' : 'No customers yet — add one in the Customers tab'}>
                            {formData.ownerClientId ? (customerById[formData.ownerClientId]?.name || formData.ownerClientId) : undefined}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="min-w-[280px]">
                          {customersForForm.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} {c.phone ? <span className="text-[#6b7280]">· {c.phone}</span> : null}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {customersForForm.length === 0 && !editing?.activeSaleId && (
                        <p className="text-[11px] text-amber-700">
                          No customers configured for this company. Add one in Masters → Customers first.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {editing?.ownershipStatus === 'SOLD' && editing.soldAt && (
                  <p className="text-[11px] text-[#6b7280]">
                    Sold on {new Date(editing.soldAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {editing.ownerClientName ? ` to ${editing.ownerClientName}` : ''}.
                  </p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" className="w-full">{editing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isBulkOpen && (
        <BulkAddSubLocationsDialog
          companies={companies}
          projects={projects}
          subLocations={subLocations}
          onClose={() => setIsBulkOpen(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Bulk Add dialog
// Creates multiple sub-locations under one project in three input modes:
//   RANGE  — prefix + [start..end] (e.g. D-1..D-10)
//   LIST   — comma-separated names (e.g. "D-1, D-2, D-3")
//   PASTE  — one name per line (multi-line textarea)
//
// Duplicate handling:
//   - Names trimmed; blank entries skipped
//   - Case-insensitive dedup within the input itself
//   - Cross-checked against existing sub-locations in the same project;
//     duplicates are shown in a "skipped" section and excluded from the
//     create batch — create proceeds for the rest instead of failing.
//
// Ownership: subLocationService.create already handles SIPL (sets
// ownershipStatus=UNSOLD via buildOwnershipForCreate) and strips
// ownership fields for SHSPL. No special casing needed here.
// ─────────────────────────────────────────────────────────────────────

type BulkMode = 'RANGE' | 'LIST' | 'PASTE';
type BulkResult = {
  created: number;
  skippedDuplicates: string[];
  failed: Array<{ name: string; error: string }>;
} | null;

function BulkAddSubLocationsDialog({
  companies,
  projects,
  subLocations,
  onClose,
}: {
  companies: Company[];
  projects: Project[];
  subLocations: SubLocation[];
  onClose: () => void;
}) {
  const [companyId, setCompanyId] = useState<string>(companies[0]?.id || '');
  const [projectId, setProjectId] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [mode, setMode] = useState<BulkMode>('RANGE');

  // Range inputs
  const [rangePrefix, setRangePrefix] = useState<string>('');
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(10);

  // List / paste inputs
  const [listNames, setListNames] = useState<string>('');
  const [pasteNames, setPasteNames] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BulkResult>(null);

  const selectedCompany = useMemo(
    () => companies.find(c => c.id === companyId),
    [companies, companyId]
  );
  const labels = useMemo(() => getLabels(selectedCompany?.businessType), [selectedCompany]);
  const subTypes = useMemo(() => getSubLocationTypes(selectedCompany?.businessType), [selectedCompany]);
  const companyProjects = useMemo(
    () => projects.filter(p => p.companyId === companyId),
    [projects, companyId]
  );

  // Parse raw inputs into an ordered list of non-empty, internally-deduped
  // (case-insensitive) names.
  const parsedNames = useMemo<string[]>(() => {
    let raw: string[] = [];
    if (mode === 'RANGE') {
      if (!Number.isFinite(rangeStart) || !Number.isFinite(rangeEnd)) return [];
      if (rangeEnd < rangeStart) return [];
      for (let i = rangeStart; i <= rangeEnd; i++) {
        raw.push(rangePrefix.trim() ? `${rangePrefix.trim()}-${i}` : String(i));
      }
    } else if (mode === 'LIST') {
      raw = listNames.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      // PASTE
      raw = pasteNames.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const name of raw) {
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(name);
    }
    return deduped;
  }, [mode, rangePrefix, rangeStart, rangeEnd, listNames, pasteNames]);

  // Split into toCreate vs skipped (duplicate of an existing unit in the
  // same project — case-insensitive).
  const { toCreate, skipped } = useMemo(() => {
    const existing = new Set(
      subLocations
        .filter(sl => sl.projectId === projectId)
        .map(sl => (sl.name || '').trim().toLowerCase())
    );
    const create: string[] = [];
    const dup: string[] = [];
    for (const name of parsedNames) {
      if (existing.has(name.toLowerCase())) dup.push(name);
      else create.push(name);
    }
    return { toCreate: create, skipped: dup };
  }, [parsedNames, subLocations, projectId]);

  const canSubmit = !!companyId && !!projectId && !!type && toCreate.length > 0 && !submitting;

  const handleCreate = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const failed: BulkResult extends infer _ ? Array<{ name: string; error: string }> : never = [];
    let created = 0;
    for (const name of toCreate) {
      try {
        await subLocationService.create({
          companyId,
          projectId,
          type,
          name,
          code: '',
          isActive: true,
        });
        created++;
      } catch (err) {
        const message = err instanceof BusinessRuleError
          ? err.message
          : err instanceof Error ? err.message : 'Unknown error';
        failed.push({ name, error: message });
      }
    }
    setResult({ created, skippedDuplicates: skipped, failed });
    setSubmitting(false);
    if (created > 0) toast.success(`Created ${created} ${labels.subLocationPlural.toLowerCase()}`);
    if (failed.length > 0) toast.error(`${failed.length} failed to create`);
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#2563eb]" />
            Bulk Add {labels.subLocationPlural}
          </DialogTitle>
          <DialogDescription>
            Create multiple {labels.subLocationPlural.toLowerCase()} under one project in a single step.
          </DialogDescription>
        </DialogHeader>

        {/* ── Result screen (after create) ─────────────────────────── */}
        {result ? (
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-black text-emerald-900">
                  {result.created} {labels.subLocationPlural.toLowerCase()} created
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {result.skippedDuplicates.length} skipped as duplicates
                  {result.failed.length > 0 && `, ${result.failed.length} failed`}
                </p>
              </div>
            </div>

            {result.skippedDuplicates.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-900 mb-2">
                  Duplicates skipped
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.skippedDuplicates.map((n) => (
                    <Badge key={n} className="bg-amber-100 text-amber-900 border-0 text-[10px] font-bold">{n}</Badge>
                  ))}
                </div>
              </div>
            )}

            {result.failed.length > 0 && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-rose-900 mb-2">
                  Failed
                </p>
                <ul className="space-y-1 text-[11px] text-rose-900">
                  {result.failed.map((f) => (
                    <li key={f.name}><strong>{f.name}</strong> — {f.error}</li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button onClick={onClose}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          // ── Input screen ──────────────────────────────────────────
          <div className="space-y-4 py-2">
            {/* Company / Project / Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label>Company</Label>
                <Select value={companyId} onValueChange={(v) => { setCompanyId(v); setProjectId(''); setType(''); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select company">
                      {companyId ? (() => { const c = companies.find(co => co.id === companyId); return c ? `${c.code} — ${c.name}` : undefined; })() : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-[280px]">
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{labels.projectLabel}</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={companyId ? `Select ${labels.projectLabel.toLowerCase()}` : 'Select company first'}>
                      {projectId ? (projects.find(p => p.id === projectId)?.name || 'Unnamed') : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-[280px]">
                    {companyProjects.length > 0
                      ? companyProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)
                      : <div className="px-3 py-2 text-xs text-[#9ca3af]">No projects in this company.</div>}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{labels.subLocationTypeLabel}</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${labels.subLocationTypeLabel.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {subTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mode selector */}
            <div className="grid gap-2">
              <Label>Input Method</Label>
              <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 gap-1 self-start">
                {(['RANGE', 'LIST', 'PASTE'] as BulkMode[]).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors',
                      mode === m
                        ? 'bg-white text-[#111827] shadow-sm'
                        : 'text-[#6b7280] hover:text-[#111827]'
                    )}
                  >
                    {m === 'RANGE' ? 'Range' : m === 'LIST' ? 'List' : 'Paste'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode-specific inputs */}
            {mode === 'RANGE' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label>Prefix (optional)</Label>
                  <Input value={rangePrefix} onChange={(e) => setRangePrefix(e.target.value)} placeholder="e.g. D" />
                </div>
                <div className="grid gap-2">
                  <Label>Start</Label>
                  <Input type="number" value={rangeStart} onChange={(e) => setRangeStart(Number(e.target.value))} />
                </div>
                <div className="grid gap-2">
                  <Label>End</Label>
                  <Input type="number" value={rangeEnd} onChange={(e) => setRangeEnd(Number(e.target.value))} />
                </div>
                <p className="md:col-span-3 text-[11px] text-[#6b7280]">
                  Generates {rangePrefix.trim() ? `${rangePrefix.trim()}-${rangeStart}` : String(rangeStart)} through{' '}
                  {rangePrefix.trim() ? `${rangePrefix.trim()}-${rangeEnd}` : String(rangeEnd)}.
                </p>
              </div>
            )}
            {mode === 'LIST' && (
              <div className="grid gap-2">
                <Label>Names (comma-separated)</Label>
                <Textarea
                  rows={3}
                  value={listNames}
                  onChange={(e) => setListNames(e.target.value)}
                  placeholder="e.g. D-1, D-2, D-3"
                />
              </div>
            )}
            {mode === 'PASTE' && (
              <div className="grid gap-2">
                <Label>Names (one per line)</Label>
                <Textarea
                  rows={6}
                  value={pasteNames}
                  onChange={(e) => setPasteNames(e.target.value)}
                  placeholder={"Kitchen\nBanquet\nLawn\nPool"}
                />
              </div>
            )}

            {/* Preview */}
            <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#111827]">
                  Preview
                </p>
                <div className="text-[11px] text-[#6b7280]">
                  <span className="text-emerald-700 font-bold">{toCreate.length}</span> to create
                  {skipped.length > 0 && (
                    <> · <span className="text-amber-700 font-bold">{skipped.length}</span> skipped</>
                  )}
                </div>
              </div>

              {!projectId && (
                <p className="text-[11px] text-[#9ca3af]">Select a project to check duplicates.</p>
              )}

              {projectId && toCreate.length === 0 && parsedNames.length === 0 && (
                <p className="text-[11px] text-[#9ca3af]">No names yet — fill the input above.</p>
              )}

              {projectId && toCreate.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {toCreate.slice(0, 50).map((n) => (
                    <Badge key={n} className="bg-emerald-100 text-emerald-900 border-0 text-[10px] font-bold">{n}</Badge>
                  ))}
                  {toCreate.length > 50 && (
                    <Badge className="bg-slate-100 text-slate-700 border-0 text-[10px] font-bold">
                      +{toCreate.length - 50} more
                    </Badge>
                  )}
                </div>
              )}

              {projectId && skipped.length > 0 && (
                <div className="pt-2 border-t border-[#e5e7eb] flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-amber-800">
                      {skipped.length} already exist in this project — will be skipped:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {skipped.slice(0, 30).map((n) => (
                        <Badge key={n} className="bg-amber-100 text-amber-900 border-0 text-[10px] font-bold">{n}</Badge>
                      ))}
                      {skipped.length > 30 && (
                        <Badge className="bg-slate-100 text-slate-700 border-0 text-[10px] font-bold">
                          +{skipped.length - 30} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="button" onClick={handleCreate} disabled={!canSubmit}>
                {submitting ? 'Creating…' : `Create ${toCreate.length}`}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Migration dialog — admin supplies the missing commercial fields for a
// unit already marked SOLD in Masters. Identity fields (company /
// project / unit / customer / soldAt) are pre-filled and locked so the
// migration cannot accidentally rewrite ownership to a different buyer.
// Submits via saleService.createFromManualSoldUnit which writes the
// Sale as SOLD (not BOOKED) and atomically attaches activeSaleId.
// ─────────────────────────────────────────────────────────────────────
const FUNDING_OPTIONS: FundingModel[] = ['CASH', 'LOAN', 'MIXED', 'INSTALLMENT'];

function MigrationSaleDialog({
  unit, customer, projectName, onClose, onDone,
}: {
  unit: SubLocation;
  customer: Customer | null;
  projectName: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [fundingModel, setFundingModel] = useState<FundingModel>('CASH');
  const [agreementValue, setAgreementValue] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [bookingAmount, setBookingAmount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [selfFundingAmount, setSelfFundingAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sale date defaults to the unit's soldAt (trimmed to yyyy-mm-dd) so
  // the record reflects when the unit was actually sold, not when the
  // admin ran the migration. Falls back to today if soldAt is missing.
  const defaultDate = (unit.soldAt || new Date().toISOString()).slice(0, 10);
  const [saleDate, setSaleDate] = useState(defaultDate);

  const finalSaleValue = +(agreementValue - discountAmount).toFixed(2);
  const fundingTotal = +(bookingAmount + advanceAmount + loanAmount + selfFundingAmount).toFixed(2);
  const fundingMismatch = finalSaleValue > 0 && Math.abs(fundingTotal - finalSaleValue) > 0.01;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      toast.error('No customer attached to this unit — edit ownership first.');
      return;
    }
    if (agreementValue <= 0) {
      toast.error('Agreement value must be positive.');
      return;
    }
    if (finalSaleValue <= 0) {
      toast.error('Final sale value (after discount) must be positive.');
      return;
    }
    setSubmitting(true);
    try {
      const input: SaleCreateInput = {
        companyId: unit.companyId,
        projectId: unit.projectId,
        subLocationId: unit.id,
        customerId: customer.id,
        saleDate: new Date(saleDate).toISOString(),
        fundingModel,
        agreementValue,
        discountAmount,
        finalSaleValue,
        bookingAmount,
        advanceAmount,
        loanAmount,
        selfFundingAmount,
        remarks: remarks.trim() || undefined,
      };
      await saleService.createFromManualSoldUnit(input);
      toast.success(`Sale record created for ${unit.name}. It now appears in Unit Sales.`);
      onDone();
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to create sale record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Sale Record — {unit.name}</DialogTitle>
          <DialogDescription>
            This unit is already marked SOLD in Masters. Fill in the missing
            commercial fields to create the matching Sale record so it appears
            in Unit Sales and can carry receipts / recovery.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3 text-xs space-y-1">
            <div><span className="text-[#6b7280]">Unit:</span> <strong>{unit.name}</strong> · {projectName}</div>
            <div><span className="text-[#6b7280]">Owner:</span> <strong>{customer?.name || '— (missing)'}</strong></div>
            {unit.soldAt && <div><span className="text-[#6b7280]">Sold on:</span> <strong>{unit.soldAt.slice(0, 10)}</strong></div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Sale Date</Label>
              <Input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Funding Model</Label>
              <Select value={fundingModel} onValueChange={(v) => setFundingModel(v as FundingModel)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FUNDING_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Agreement Value</Label>
              <Input type="number" min="0" step="0.01" value={agreementValue} onChange={(e) => setAgreementValue(+e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Discount Amount</Label>
              <Input type="number" min="0" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(+e.target.value)} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label>Final Sale Value (auto)</Label>
              <Input type="number" value={finalSaleValue} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Booking Amount</Label>
              <Input type="number" min="0" step="0.01" value={bookingAmount} onChange={(e) => setBookingAmount(+e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Advance Amount</Label>
              <Input type="number" min="0" step="0.01" value={advanceAmount} onChange={(e) => setAdvanceAmount(+e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Loan Amount</Label>
              <Input type="number" min="0" step="0.01" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Self Funding</Label>
              <Input type="number" min="0" step="0.01" value={selfFundingAmount} onChange={(e) => setSelfFundingAmount(+e.target.value)} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label>Remarks</Label>
              <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} placeholder="Optional — context for this migrated sale" />
            </div>
          </div>

          {fundingMismatch && (
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
              Funding total ({fundingTotal}) does not match final sale value ({finalSaleValue}). Not blocking — mirrors Unit Sales behaviour — but double-check before submitting.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-rose-600 hover:bg-rose-700 text-white">
              {submitting ? 'Creating…' : 'Create Sale Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
