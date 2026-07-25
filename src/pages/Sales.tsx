import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, AlertTriangle, Eye, HandCoins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saleService, SaleCreateInput } from '../services/saleService';
import { companyService } from '../services/companyService';
import { projectService } from '../services/projectService';
import { subLocationService } from '../services/subLocationService';
import { customerService } from '../services/customerService';
import { getEffectiveCompanyScope } from '../lib/userAccess';
import {
  Company, Project, SubLocation, Customer, Sale, SaleStatus, FundingModel, BusinessRuleError
} from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { formatCurrency, cn } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';

type StatusFilter = SaleStatus | 'ALL';
const FUNDING_OPTIONS: FundingModel[] = ['CASH', 'LOAN', 'MIXED', 'INSTALLMENT'];

function statusBadge(s: SaleStatus) {
  const cls =
    s === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
    s === 'SOLD' ? 'bg-emerald-100 text-emerald-800' :
    s === 'POSSESSION_GIVEN' ? 'bg-violet-100 text-violet-800' :
    /* CANCELLED */ 'bg-rose-100 text-rose-800';
  const label = s === 'POSSESSION_GIVEN' ? 'Possession' : s;
  return <Badge className={cn('border-0 text-[10px] font-black uppercase tracking-wider', cls)}>{label}</Badge>;
}

export default function Sales() {
  const navigate = useNavigate();
  const { profile, isAdmin, isPM } = useAuth();
  const canCreate = isAdmin || isPM;

  const [sales, setSales] = useState<Sale[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subLocations, setSubLocations] = useState<SubLocation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('ALL');
  const [filterProject, setFilterProject] = useState('all');
  const [filterFunding, setFilterFunding] = useState<'all' | FundingModel>('all');

  const [isNewOpen, setIsNewOpen] = useState(false);

  useEffect(() => {
    const u1 = saleService.getAll((s) => { setSales(s); setLoading(false); });
    const u2 = companyService.getAll(setCompanies);
    const u3 = projectService.getAll(setProjects);
    const u4 = subLocationService.getAll(setSubLocations);
    const u5 = customerService.getAll(setCustomers);
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, []);

  const companyById = useMemo(() => {
    const m: Record<string, Company> = {};
    for (const c of companies) m[c.id] = c;
    return m;
  }, [companies]);
  const projectById = useMemo(() => {
    const m: Record<string, Project> = {};
    for (const p of projects) m[p.id] = p;
    return m;
  }, [projects]);

  // Multi-company scoping. Sales carry `companyId` directly, so filtering
  // is a single pass. ADMIN/CEO unrestricted; ACCOUNTS / PM limited to
  // their assignedCompanyIds. Applied first so the search and filters
  // below operate only on in-scope sales.
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);

  const filtered = useMemo(() => {
    let list = sales;
    if (!scope.unrestricted) {
      const ids = new Set(scope.ids);
      list = list.filter(s => s.companyId && ids.has(s.companyId));
    }
    if (filterStatus !== 'ALL') list = list.filter(s => s.saleStatus === filterStatus);
    if (filterProject !== 'all') list = list.filter(s => s.projectId === filterProject);
    if (filterFunding !== 'all') list = list.filter(s => s.fundingModel === filterFunding);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(x =>
        (x.customerNameSnapshot || '').toLowerCase().includes(s) ||
        (x.unitNameSnapshot || '').toLowerCase().includes(s) ||
        (projectById[x.projectId]?.name || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [sales, scope, filterStatus, filterProject, filterFunding, search, projectById]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827] flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-[#2563eb]" />
            Unit Sales & Recovery
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            SIPL-only. Track unit sales from booking through possession, with receipts and outstanding recovery.
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsNewOpen(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> New Sale
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as StatusFilter)}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="BOOKED">Booked</SelectItem>
            <SelectItem value="SOLD">Sold</SelectItem>
            <SelectItem value="POSSESSION_GIVEN">Possession Given</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-52 h-8 text-xs"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.filter(p => companyById[p.companyId || '']?.businessType === 'CONSTRUCTION').map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterFunding} onValueChange={(v) => setFilterFunding(v as typeof filterFunding)}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Funding" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Funding</SelectItem>
            {FUNDING_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 max-w-xs bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
          <Search className="h-4 w-4 text-[#6b7280]" />
          <Input
            placeholder="Search unit / customer / project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-7 text-xs w-72"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead>Sale Date</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Final Value</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead>Funding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={10} />)
            ) : filtered.length > 0 ? (
              filtered.map(s => {
                const outstanding = (s.finalSaleValue || 0) - (s.totalReceived || 0);
                const overpaid = outstanding < 0;
                return (
                  <TableRow key={s.id} className="hover:bg-[#f9fafb] border-b border-[#e5e7eb] last:border-0">
                    <TableCell className="text-xs">
                      {s.saleDate ? format(parseISO(s.saleDate), 'dd MMM yyyy') : '—'}
                    </TableCell>
                    <TableCell className="text-sm font-semibold max-w-[160px] truncate" title={s.unitNameSnapshot}>{s.unitNameSnapshot}</TableCell>
                    <TableCell className="text-sm text-[#6b7280] max-w-[180px] truncate" title={projectById[s.projectId]?.name || ''}>{projectById[s.projectId]?.name || '—'}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={s.customerNameSnapshot}>{s.customerNameSnapshot}</TableCell>
                    <TableCell className="text-sm text-right">{formatCurrency(s.finalSaleValue || 0)}</TableCell>
                    <TableCell className="text-sm text-right text-emerald-700 font-semibold">
                      {formatCurrency(s.totalReceived || 0)}
                    </TableCell>
                    <TableCell className={cn(
                      "text-sm text-right font-semibold",
                      overpaid ? "text-amber-700" : outstanding > 0 ? "text-rose-700" : "text-emerald-700"
                    )}>
                      {overpaid ? `+${formatCurrency(Math.abs(outstanding))}` : formatCurrency(outstanding)}
                    </TableCell>
                    <TableCell className="text-[10px] font-bold uppercase text-[#6b7280]">{s.fundingModel}</TableCell>
                    <TableCell>{statusBadge(s.saleStatus)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/sales/${s.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow><TableCell colSpan={10} className="h-24 text-center text-muted-foreground">No sales found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isNewOpen && (
        <NewSaleDialog
          open={isNewOpen}
          onClose={() => setIsNewOpen(false)}
          companies={companies}
          projects={projects}
          subLocations={subLocations}
          customers={customers}
          onCreated={(id) => {
            setIsNewOpen(false);
            navigate(`/sales/${id}`);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// New Sale dialog — single tall form. Funding-total mismatch is shown
// as a warning (Phase 1 policy: do NOT block).
// ─────────────────────────────────────────────────────────────────────

function NewSaleDialog({
  open, onClose, companies, projects, subLocations, customers, onCreated
}: {
  open: boolean;
  onClose: () => void;
  companies: Company[];
  projects: Project[];
  subLocations: SubLocation[];
  customers: Customer[];
  onCreated: (saleId: string) => void;
}) {
  const sipl = companies.filter(c => c.businessType === 'CONSTRUCTION' && c.isActive);

  const [companyId, setCompanyId] = useState(sipl[0]?.id || '');
  const [projectId, setProjectId] = useState('');
  const [subLocationId, setSubLocationId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [fundingModel, setFundingModel] = useState<FundingModel>('CASH');
  const [agreementValue, setAgreementValue] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [bookingAmount, setBookingAmount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [selfFundingAmount, setSelfFundingAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const siplProjects = useMemo(
    () => projects.filter(p => p.companyId === companyId),
    [projects, companyId]
  );
  /** Units eligible for a new sale:
   *    - Belong to the selected SIPL company AND the selected project
   *    - Not explicitly deactivated  (legacy docs may have `isActive`
   *      missing; those are treated as active — the master UI only sets
   *      isActive=false when an admin deactivates a unit)
   *    - No active sale already attached
   *    - Sale status is AVAILABLE (or missing → treated as AVAILABLE)
   *  If no project is selected, return [] so the dropdown placeholder
   *  correctly prompts the admin to pick a project first. */
  const availableUnits = useMemo(() => {
    if (!projectId) return [];
    return subLocations.filter(sl =>
      sl.projectId === projectId &&
      (sl.companyId ? sl.companyId === companyId : true) &&
      sl.isActive !== false &&
      !sl.activeSaleId &&
      (sl.saleStatus ?? 'AVAILABLE') === 'AVAILABLE'
    );
  }, [subLocations, companyId, projectId]);
  const companyCustomers = useMemo(
    () => customers.filter(c => c.companyId === companyId),
    [customers, companyId]
  );

  const finalSaleValue = +(agreementValue - discountAmount).toFixed(2);
  const fundingTotal = +(bookingAmount + advanceAmount + loanAmount + selfFundingAmount).toFixed(2);
  const fundingMismatch = Math.abs(fundingTotal - finalSaleValue) > 0.01;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !projectId || !subLocationId || !customerId) {
      toast.error('Please select company, project, unit and customer.');
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
        companyId, projectId, subLocationId, customerId,
        saleDate, fundingModel,
        agreementValue, discountAmount, finalSaleValue,
        bookingAmount, advanceAmount, loanAmount, selfFundingAmount,
        remarks: remarks.trim() || undefined
      };
      const id = await saleService.create(input);
      toast.success('Sale created as BOOKED');
      onCreated(id);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to create sale');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
          <DialogDescription>
            Links a customer to a SIPL unit. The sale starts as <strong>BOOKED</strong>;
            mark it SOLD once the agreement is signed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {sipl.length === 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
              No SIPL (CONSTRUCTION) companies configured. Add one first.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Company</Label>
                  <Select value={companyId} onValueChange={(v) => { setCompanyId(v); setProjectId(''); setSubLocationId(''); setCustomerId(''); }}>
                    <SelectTrigger><SelectValue>{sipl.find(c => c.id === companyId)?.name}</SelectValue></SelectTrigger>
                    <SelectContent>
                      {sipl.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Project</Label>
                  <Select value={projectId} onValueChange={(v) => { setProjectId(v); setSubLocationId(''); }}>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {siplProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Unit</Label>
                  <Select value={subLocationId} onValueChange={setSubLocationId}>
                    <SelectTrigger>
                      <SelectValue placeholder={projectId ? 'Select available unit' : 'Select project first'}>
                        {subLocationId ? availableUnits.find(u => u.id === subLocationId)?.name : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {!projectId ? (
                        <div className="px-3 py-2 text-xs text-[#9ca3af]">Select a project first.</div>
                      ) : availableUnits.length > 0 ? availableUnits.map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.type})
                          <span className="text-[#6b7280]"> · Unsold</span>
                        </SelectItem>
                      )) : (
                        <div className="px-3 py-2 text-xs text-[#9ca3af]">
                          No available units in this project.
                          <div className="mt-1 text-[10px] text-[#9ca3af]">
                            A unit must exist in Masters → Units, be active, and not have an active sale.
                          </div>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Customer</Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer">
                        {customerId ? companyCustomers.find(c => c.id === customerId)?.name : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {companyCustomers.length > 0 ? companyCustomers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name} {c.phone && <span className="text-[#9ca3af]">· {c.phone}</span>}</SelectItem>
                      )) : (
                        <div className="px-3 py-2 text-xs text-[#9ca3af]">No customers for this company. Add one in Masters → Customers.</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Sale Date</Label>
                  <Input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label>Funding Model</Label>
                  <Select value={fundingModel} onValueChange={(v) => setFundingModel(v as FundingModel)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FUNDING_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border border-[#e5e7eb] p-4 bg-[#f9fafb] space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-[#111827]">Pricing</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="grid gap-2">
                    <Label>Agreement Value</Label>
                    <Input type="number" min="0" step="0.01" value={agreementValue} onChange={(e) => setAgreementValue(+e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Discount</Label>
                    <Input type="number" min="0" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(+e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Final Sale Value</Label>
                    <Input type="number" value={finalSaleValue} readOnly className="bg-slate-100" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#e5e7eb] p-4 bg-[#f9fafb] space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-[#111827]">Expected Funding Breakdown</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="grid gap-2">
                    <Label>Booking</Label>
                    <Input type="number" min="0" step="0.01" value={bookingAmount} onChange={(e) => setBookingAmount(+e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Advance</Label>
                    <Input type="number" min="0" step="0.01" value={advanceAmount} onChange={(e) => setAdvanceAmount(+e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Loan</Label>
                    <Input type="number" min="0" step="0.01" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Self</Label>
                    <Input type="number" min="0" step="0.01" value={selfFundingAmount} onChange={(e) => setSelfFundingAmount(+e.target.value)} />
                  </div>
                </div>
                {fundingMismatch && finalSaleValue > 0 && (
                  <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      Funding breakdown totals {formatCurrency(fundingTotal)}, but final sale value is {formatCurrency(finalSaleValue)}.
                      This is allowed — saved as-is.
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Remarks (optional)</Label>
                <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. token received via cheque #4512" />
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting || sipl.length === 0}>
              {submitting ? 'Creating…' : 'Create Sale'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
