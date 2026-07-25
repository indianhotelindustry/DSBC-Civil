import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, CheckCircle, XCircle, Printer, AlertTriangle, Info, Wallet, Eye } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workOrderService } from '../services/workOrderService';
import { projectService } from '../services/projectService';
import { contractorService } from '../services/contractorService';
import { companyService } from '../services/companyService';
import { subLocationService } from '../services/subLocationService';
import { WorkOrder, WorkOrderCreateData, Project, Contractor, Company, SubLocation, PaymentRequest, BusinessRuleError } from '../types';
import { paymentRequestService } from '../services/paymentRequestService';
import { getWOPaidAdvance } from '../lib/paymentRequestCalcs';
import { woRemainingAmount } from '../lib/financialCalcs';
import { format, parseISO } from 'date-fns';
import { getEffectiveCompanyScope, isInScope } from '../lib/userAccess';
import { woGrossValue } from '../lib/financialCalcs';
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
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { cn, formatCurrency } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';
import { WorkOrderForm } from '../components/WorkOrderForm';
import { WorkOrderPrint } from '../components/WorkOrderPrint';

export default function WorkOrders() {
  const { isAdmin, isPM, isCEO, profile } = useAuth();
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subLocations, setSubLocations] = useState<SubLocation[]>([]);
  // Drives the "Advance Paid" column — counts only PaymentRequests
  // in PAID status (real money out), never the WO's planned advance.
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  // Optional ?status= deep-link from dashboard KPI cards. The status
  // is treated as a one-shot prefilter — once set, the user can clear
  // it manually by clicking "All".
  const [searchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') || 'all').toUpperCase();
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>(
    ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].includes(initialStatus) ? initialStatus : 'all'
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [editingWO, setEditingWO] = useState<WorkOrder | null>(null);
  const [printingWO, setPrintingWO] = useState<WorkOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubWO = workOrderService.getAll(setWorkOrders);
    const unsubProjects = projectService.getAll(setProjects);
    const unsubContractors = contractorService.getAll(setContractors);
    const unsubCompanies = companyService.getAll(setCompanies);
    const unsubSL = subLocationService.getAll((data) => { setSubLocations(data); setLoading(false); });
    const unsubPR = paymentRequestService.getAll(setPaymentRequests);

    return () => {
      unsubWO(); unsubProjects(); unsubContractors(); unsubCompanies(); unsubSL(); unsubPR();
    };
  }, []);

  // Multi-company scoping: ADMIN/CEO are unrestricted; ACCOUNTS and PM
  // see only work orders in their assignedCompanyIds. This closes the
  // visibility gap where a just-created PENDING work order was invisible
  // to ACCOUNTS everywhere (they can't reach Masters, and the Bills
  // page's new-bill dropdown only lists APPROVED work orders). Mutation
  // UI elsewhere in this page is already gated to admin/PM/CEO, so
  // ACCOUNTS gets a read-only view of the pipeline.
  const scope = React.useMemo(() => getEffectiveCompanyScope(profile), [profile]);

  // Build a per-WO search haystack from every linked entity field a user
  // might type. Pure derivation; recomputed only when underlying lists
  // change. Keeps the filter snappy while supporting fuzzy partial /
  // numeric matches across title, numbers, project, contractor,
  // company, sub-location (great for "Plot 24" / numeric searches),
  // work category, status, BOQ items, scope, remarks, and the
  // prepared/checked/approved by names.
  const searchHaystackById = React.useMemo(() => {
    const projectById: Record<string, Project> = {};
    for (const p of projects) projectById[p.id] = p;
    const contractorById: Record<string, Contractor> = {};
    for (const c of contractors) contractorById[c.id] = c;
    const companyById: Record<string, Company> = {};
    for (const co of companies) companyById[co.id] = co;
    const subById: Record<string, SubLocation> = {};
    for (const sl of subLocations) subById[sl.id] = sl;

    const norm = (s: unknown) => String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();

    const out: Record<string, string> = {};
    for (const wo of workOrders) {
      const project = projectById[wo.projectId];
      const contractor = contractorById[wo.contractorId];
      const company = wo.companyId ? companyById[wo.companyId] : undefined;
      const sub = wo.subLocationId ? subById[wo.subLocationId] : undefined;
      const parts: string[] = [
        wo.title, wo.woNumber, wo.workCategory, wo.status,
        wo.location, wo.contractorGST,
        wo.scopeOfWork, wo.additionalNotes, wo.description, wo.subLocationType,
        wo.preparedBy, wo.checkedBy, wo.approvedBy,
        wo.issueDate, wo.startDate, wo.endDate,
        project?.name, project?.description, project?.clientName,
        contractor?.name, contractor?.email, contractor?.phone, contractor?.address, contractor?.trade,
        company?.code, company?.name,
        sub?.name, sub?.code, sub?.type, sub?.ownerClientName,
      ];
      for (const item of wo.boqItems || []) {
        parts.push(item.description, item.unit);
      }
      out[wo.id] = parts.map(norm).filter(Boolean).join(' · ');
    }
    return out;
  }, [workOrders, projects, contractors, companies, subLocations]);

  const filteredWO = workOrders.filter(wo => {
    if (!isInScope(scope, wo.companyId)) return false;
    if (filterCompany !== 'all' && wo.companyId !== filterCompany) return false;
    if (filterStatus !== 'all' && wo.status !== filterStatus) return false;
    if (!search) return true;
    const needle = search.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!needle) return true;
    const hay = searchHaystackById[wo.id] || '';
    return hay.includes(needle);
  });

  // Admin-only drift count — WOs that fell out of the visibility model
  // because they have no companyId. Scoped users silently skip these;
  // flagging them here gives admins a nudge to backfill. Uses the full
  // (pre-scope) list since unrestricted admins see everything anyway.
  const woMissingCompanyId = React.useMemo(
    () => workOrders.filter(wo => !wo.companyId).length,
    [workOrders]
  );

  // Diagnostic reason when the list is empty, so ACCOUNTS / PM don't
  // mistake scope-hidden data for "no data at all". Runs only when
  // filteredWO is empty AND there's no search/filter active (so we
  // don't claim "no company assigned" while the user is actively
  // filtering). Admin/CEO see nothing here — they're unrestricted.
  const emptyReason: string | null = React.useMemo(() => {
    if (loading) return null;
    if (filteredWO.length > 0) return null;
    if (scope.unrestricted) return null;
    if (scope.ids.length === 0) {
      return 'No company is assigned to your profile. Ask an admin to assign one in User Management.';
    }
    const anyInScope = workOrders.some(wo => isInScope(scope, wo.companyId));
    if (!anyInScope) {
      return 'No work orders have been created in your assigned companies yet.';
    }
    return null; // there are in-scope WOs, list is empty only due to active search/filter
  }, [loading, filteredWO.length, scope, workOrders]);

  const handleOpenDialog = (wo?: WorkOrder) => {
    setEditingWO(wo || null);
    setIsDialogOpen(true);
  };

  const handlePrint = (wo: WorkOrder) => {
    setPrintingWO(wo);
    setIsPrintOpen(true);
  };

  const handleFormSubmit = async (data: WorkOrderCreateData) => {
    // Snapshot the edit target at the START of the submit so any
    // re-render mid-flow can't flip us from update to create. This is
    // the load-bearing guard against the "duplicate WO on edit" report
    // — if editingWO ever gets cleared while a save is in flight, the
    // captured `editing` here keeps the update path locked.
    const editing = editingWO;
    setIsSubmitting(true);
    try {
      if (editing) {
        // Strip fields the form hardcodes for create-shape compliance
        // but that must NOT change on edit:
        //   - status: hardcoded 'PENDING' would downgrade APPROVED WOs
        //     and trip Firestore rules (permission denied) for non-
        //     admin editors. The status is owned by approve / reject.
        //   - preparedBy: hardcoded '' would overwrite the historical
        //     creator on every save.
        //   - woNumber: must never be re-issued on edit.
        const { status, preparedBy, woNumber, ...editable } = data as WorkOrderCreateData & { woNumber?: string };
        void status; void preparedBy; void woNumber;
        await workOrderService.update(editing.id, editable as Partial<WorkOrder>);
        toast.success('Work order updated');
      } else {
        const result = await workOrderService.create({
          ...data,
          preparedBy: profile?.displayName || profile?.email || 'Unknown',
          status: 'PENDING' as const
        });
        toast.success(`Work order created · ${result.woNumber}`);
        if (result.collisionDetected) {
          // Surface the auto-correction explicitly. The number was
          // adjusted because another WO already had the issued number
          // (legacy duplicate) — admins should know it happened.
          toast.warning(
            `WO number collision auto-corrected to ${result.woNumber}. Check Masters → WO Number Series for the next sequence.`,
            { duration: 8000 }
          );
        }
      }
      setIsDialogOpen(false);
      // Reset editing target so the next dialog open starts from a
      // clean state regardless of how it's triggered.
      setEditingWO(null);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to save work order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (wo: WorkOrder, newStatus: WorkOrder['status']) => {
    try {
      if (newStatus === 'APPROVED') {
        await workOrderService.approve(wo.id, profile?.uid || '');
      } else if (newStatus === 'REJECTED') {
        await workOrderService.reject(wo.id);
      }
      toast.success(`Work order ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Status update failed');
    }
  };

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || 'Unknown Project';
  const getContractorName = (id: string) => contractors.find(c => c.id === id)?.name || 'Unknown Contractor';
  const getCompanyCode = (id?: string) => companies.find(c => c.id === id)?.code || '—';
  const getSubLocationName = (id?: string) => id ? (subLocations.find(sl => sl.id === id)?.name || '') : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Work Orders</h2>
          <p className="text-sm text-[#6b7280]">Track and approve work assignments.</p>
        </div>
        {(isAdmin || isPM) && (
          <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Work Order
          </Button>
        )}
      </div>

      {/* Admin-only nudge — WOs with no companyId fall out of every
          scoped view until an admin backfills them. Hidden for every
          other role since they can't fix it anyway. */}
      {isAdmin && woMissingCompanyId > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">{woMissingCompanyId} work order{woMissingCompanyId === 1 ? '' : 's'} have no company assigned.</p>
            <p className="text-amber-700 mt-0.5">
              Scoped users (PM, ACCOUNTS) cannot see these. Open each one and set the company, or backfill via the legacy project cleanup in Masters.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {companies.length > 0 && (
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Company" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 max-w-xs bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
          <Search className="h-4 w-4 text-[#6b7280]" />
          <Input
            placeholder="Search title, WO#, project, contractor, unit, BOQ, scope…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-7 text-xs"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm w-full max-w-full">
        {/* table-fixed lets columns honour explicit widths instead of
            stretching to fit content — tables now compress predictably
            on smaller laptops. Column priority (visibility breakpoints):
              ALWAYS:    SR / Title / Project / Contractor / WO Value /
                         Status / Actions
              md:+       Created by / Created on
              lg:+       Advance Paid / Remaining Payable
            Truncation handles the long-text columns; numeric columns
            keep fixed widths so the layout never jitters across rows. */}
        <Table className="w-full table-fixed text-sm">
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] w-[60px]">SR No</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">Work Order Title</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] hidden md:table-cell w-[120px]">Created by</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] hidden md:table-cell w-[100px]">Created on</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">Project</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">Contractor</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] text-right w-[120px]">WO Value</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] text-right hidden lg:table-cell w-[120px]">Advance Paid</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] text-right hidden lg:table-cell w-[130px]">Remaining</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] w-[110px]">Status</TableHead>
              <TableHead className="px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280] text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={11} />
              ))
            ) : filteredWO.length > 0 ? (
              filteredWO.map((wo, index) => {
                const advancePaid = getWOPaidAdvance(paymentRequests, wo.id);
                return (
                <TableRow key={wo.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-2 py-3 text-xs text-[#6b7280] font-mono">{index + 1}</TableCell>
                  <TableCell className="px-2 py-3">
                    {/* Title + WO# stacked. Truncates to whatever width
                        table-fixed gives the column at the current
                        breakpoint. Full title in the title tooltip. */}
                    <div className="font-semibold text-xs truncate" title={wo.title}>{wo.title}</div>
                    {wo.woNumber && <div className="text-[10px] text-[#9ca3af] font-mono truncate" title={wo.woNumber}>{wo.woNumber}</div>}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-xs text-[#374151] truncate hidden md:table-cell" title={wo.preparedBy || ''}>
                    {wo.preparedBy || <span className="text-[#9ca3af]">—</span>}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-xs text-[#6b7280] whitespace-nowrap hidden md:table-cell">
                    {wo.createdAt ? format(parseISO(wo.createdAt), 'dd MMM yyyy') : '—'}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-xs text-[#374151] truncate" title={getProjectName(wo.projectId)}>
                    {getProjectName(wo.projectId)}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-xs text-[#374151] truncate" title={getContractorName(wo.contractorId)}>
                    {getContractorName(wo.contractorId)}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-right font-mono text-xs font-semibold text-[#111827] truncate">
                    {formatCurrency(woGrossValue(wo))}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-right font-mono text-xs hidden lg:table-cell truncate">
                    <span className={advancePaid > 0 ? 'text-emerald-700 font-semibold' : 'text-[#9ca3af]'}>
                      {formatCurrency(advancePaid)}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-3 text-right font-mono text-xs text-[#374151] hidden lg:table-cell truncate">
                    {formatCurrency(woRemainingAmount(wo))}
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    <Badge className={cn(
                      "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border-none",
                      wo.status === 'APPROVED' ? 'bg-[#d1fae5] text-[#065f46]' :
                      wo.status === 'PENDING' ? 'bg-[#fef3c7] text-[#92400e]' :
                      wo.status === 'REJECTED' ? 'bg-[#fee2e2] text-[#991b1b]' :
                      wo.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {wo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-2 py-3 text-right whitespace-nowrap">
                    {/* Three fixed primary actions per row, no matter the
                        status: View / Export PDF, Print, and the 3-dot
                        menu. Approve / Reject moved INTO the 3-dot menu
                        so the row width never expands and the menu never
                        gets clipped behind a contextual button. */}
                    <div className="inline-flex items-center justify-end gap-1">
                      <Button
                        size="icon" variant="ghost"
                        className="h-7 w-7 shrink-0 text-slate-600"
                        onClick={() => handlePrint(wo)}
                        title="View / Export PDF"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon" variant="ghost"
                        className="h-7 w-7 shrink-0 text-slate-600"
                        onClick={() => handlePrint(wo)}
                        title="Print"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          {(isAdmin || (isPM && wo.status === 'PENDING')) && (
                            <DropdownMenuItem onClick={() => handleOpenDialog(wo)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          )}
                          {(isAdmin || isCEO) && wo.status === 'PENDING' && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(wo, 'APPROVED')} className="text-emerald-700">
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(wo, 'REJECTED')} className="text-rose-700">
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {(isAdmin || isPM) && (
                            <DropdownMenuItem onClick={() => navigate('/payment-requests')}>
                              <Wallet className="mr-2 h-4 w-4" /> Payment Requests
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => workOrderService.delete(wo.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })
            ) : (
              <TableRow>
                {/* colSpan covers every column at the widest breakpoint;
                    hidden cells still occupy a slot in the grid so the
                    spanned cell fills the row regardless of viewport. */}
                <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                  {emptyReason ? (
                    <div className="flex items-start gap-2 justify-center text-left max-w-xl mx-auto py-2">
                      <Info className="h-4 w-4 text-[#6b7280] mt-0.5 shrink-0" />
                      <span className="text-xs text-[#6b7280]">{emptyReason}</span>
                    </div>
                  ) : (
                    'No work orders found.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingWO(null); }}>
        <DialogContent className="w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-hidden p-0" showCloseButton={false}>
          <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8">
            {/* Mount the form only while the dialog is open AND key it
                to the WO id (or 'new' for create). Either guard alone
                is enough for Base UI's default unmount-on-close, but
                both together make the duplicate-on-edit report
                impossible to recreate from a stale form instance. */}
            {isDialogOpen && (
              <WorkOrderForm
                key={editingWO?.id ?? 'new'}
                companies={companies}
                projects={projects}
                subLocations={subLocations}
                contractors={contractors}
                initialData={editingWO || undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => { setIsDialogOpen(false); setEditingWO(null); }}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[230mm] max-h-[95vh] overflow-y-auto bg-slate-100 p-8" showCloseButton={false}>
          <div className="flex justify-end mb-4 print:hidden">
            <Button onClick={() => window.print()} className="bg-[#1f2937] text-white">
              <Printer className="mr-2 h-4 w-4" /> Print PDF
            </Button>
          </div>
          {printingWO && (
            <div data-print-root="work-order">
              <WorkOrderPrint
                workOrder={printingWO}
                project={projects.find(p => p.id === printingWO.projectId)}
                contractor={contractors.find(c => c.id === printingWO.contractorId)}
                company={companies.find(c => c.id === printingWO.companyId)}
                subLocation={subLocations.find(sl => sl.id === printingWO.subLocationId)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
