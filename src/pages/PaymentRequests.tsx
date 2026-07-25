import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wallet, CheckCircle, XCircle, Clock, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentRequestService } from '../services/paymentRequestService';
import { workOrderService } from '../services/workOrderService';
import { contractorService } from '../services/contractorService';
import { projectService } from '../services/projectService';
import { companyService } from '../services/companyService';
import {
  PaymentRequest, WorkOrder, Contractor, Project, Company,
  PaymentRequestType, PaymentRequestStatus, PaymentRequestMode,
  BusinessRuleError,
} from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { cn, formatCurrency } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';
import { getEffectiveCompanyScope, isInScope } from '../lib/userAccess';
import { getWOPaymentSummary } from '../lib/paymentRequestCalcs';

const STATUS_FILTERS: Array<PaymentRequestStatus | 'ALL'> = [
  'ALL', 'PENDING_APPROVAL', 'APPROVED', 'PAID', 'REJECTED',
];
const TYPE_FILTERS: Array<PaymentRequestType | 'ALL'> = ['ALL', 'ADVANCE', 'PART', 'FINAL'];
const PAYMENT_MODES: PaymentRequestMode[] = ['BANK_TRANSFER', 'UPI', 'QR', 'CASH', 'CHEQUE'];

function statusBadge(s: PaymentRequestStatus) {
  const cls =
    s === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
    s === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
    s === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800' :
    /* REJECTED */ 'bg-rose-100 text-rose-800';
  const label = s === 'PENDING_APPROVAL' ? 'Pending' : s === 'APPROVED' ? 'Approved' : s;
  return <Badge className={cn('border-0 text-[10px] font-black uppercase tracking-wider', cls)}>{label}</Badge>;
}

function typeBadge(t: PaymentRequestType) {
  const cls =
    t === 'ADVANCE' ? 'bg-violet-100 text-violet-800' :
    t === 'PART' ? 'bg-sky-100 text-sky-800' :
    /* FINAL */ 'bg-slate-200 text-slate-800';
  return <Badge className={cn('border-0 text-[10px] font-black uppercase tracking-wider', cls)}>{t}</Badge>;
}

export default function PaymentRequests() {
  const { profile, isAdmin, isPM, isCEO, isAccounts } = useAuth();

  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Optional ?status= deep-link from dashboard KPI cards.
  const [searchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') || 'ALL').toUpperCase() as PaymentRequestStatus | 'ALL';
  const [statusFilter, setStatusFilter] = useState<PaymentRequestStatus | 'ALL'>(
    (['PENDING_APPROVAL', 'APPROVED', 'PAID', 'REJECTED', 'ALL'] as const).includes(
      initialStatus as PaymentRequestStatus | 'ALL'
    ) ? initialStatus : 'ALL'
  );
  const [typeFilter, setTypeFilter] = useState<PaymentRequestType | 'ALL'>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payingRequest, setPayingRequest] = useState<PaymentRequest | null>(null);

  useEffect(() => {
    const u1 = paymentRequestService.getAll(r => { setRequests(r); setLoading(false); });
    const u2 = workOrderService.getAll(setWorkOrders);
    const u3 = contractorService.getAll(setContractors);
    const u4 = projectService.getAll(setProjects);
    const u5 = companyService.getAll(setCompanies);
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, []);

  // Multi-company scoping. Payment requests carry companyId directly
  // (stamped from the parent WO at create time), so scope is applied
  // here the same way WorkOrders.tsx does it.
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);

  const scoped = useMemo(() => {
    return requests.filter(r => isInScope(scope, r.companyId));
  }, [requests, scope]);

  const woById = useMemo(() => {
    const m: Record<string, WorkOrder> = {};
    for (const wo of workOrders) m[wo.id] = wo;
    return m;
  }, [workOrders]);
  const contractorById = useMemo(() => {
    const m: Record<string, Contractor> = {};
    for (const c of contractors) m[c.id] = c;
    return m;
  }, [contractors]);
  const projectById = useMemo(() => {
    const m: Record<string, Project> = {};
    for (const p of projects) m[p.id] = p;
    return m;
  }, [projects]);
  const companyCode = (id: string) => companies.find(c => c.id === id)?.code || '—';

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const list = scoped.filter(r => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
      if (companyFilter !== 'all' && r.companyId !== companyFilter) return false;
      if (projectFilter !== 'all' && r.projectId !== projectFilter) return false;
      if (!needle) return true;
      const wo = woById[r.workOrderId];
      const contractor = contractorById[r.contractorId];
      return (
        (wo?.woNumber || '').toLowerCase().includes(needle) ||
        (wo?.title || '').toLowerCase().includes(needle) ||
        (contractor?.name || '').toLowerCase().includes(needle) ||
        (r.reason || '').toLowerCase().includes(needle) ||
        (r.remarks || '').toLowerCase().includes(needle)
      );
    });
    // Phase 1.2 sort: APPROVED rows first (Accounts queue) ordered
    // oldest → newest by requestedAt, so the stalest awaiting-payment
    // item surfaces at the top. Everything else stays in the
    // service's default newest-first order.
    return [...list].sort((a, b) => {
      if (a.status === 'APPROVED' && b.status !== 'APPROVED') return -1;
      if (b.status === 'APPROVED' && a.status !== 'APPROVED') return 1;
      if (a.status === 'APPROVED' && b.status === 'APPROVED') {
        return (a.requestedAt || '').localeCompare(b.requestedAt || '');
      }
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [scoped, statusFilter, typeFilter, companyFilter, projectFilter, search, woById, contractorById]);

  const pendingCount = scoped.filter(r => r.status === 'PENDING_APPROVAL').length;
  const pendingAmount = scoped.filter(r => r.status === 'PENDING_APPROVAL').reduce((s, r) => s + r.requestedAmount, 0);
  const approvedAwaitingCount = scoped.filter(r => r.status === 'APPROVED').length;
  const approvedAwaitingAmount = scoped.filter(r => r.status === 'APPROVED').reduce((s, r) => s + r.requestedAmount, 0);

  const canCreate = isAdmin || isPM;
  const canApprove = isAdmin || isCEO;
  const canMarkPaid = isAdmin || isAccounts;

  const handleApprove = async (r: PaymentRequest) => {
    try {
      await paymentRequestService.approve(r.id);
      toast.success('Payment request approved');
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to approve');
    }
  };

  const handleReject = async (r: PaymentRequest) => {
    const reason = window.prompt('Reason for rejection?');
    if (!reason || !reason.trim()) return;
    try {
      await paymentRequestService.reject(r.id, reason);
      toast.success('Payment request rejected');
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to reject');
    }
  };

  const openPay = (r: PaymentRequest) => {
    setPayingRequest(r);
    setPayOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Payment Requests</h2>
          <p className="text-sm text-[#6b7280]">
            Work Order advance / part / final payment requests — PM raises, CEO approves, Accounts pays.
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> New Payment Request
          </Button>
        )}
      </div>

      {/* Quick counts — dashboard-lite strip. */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <StatBlock label="Pending Approval" value={pendingCount.toString()} sub={formatCurrency(pendingAmount)} tone="amber" icon={Clock} />
        <StatBlock label="Approved Awaiting Payment" value={approvedAwaitingCount.toString()} sub={formatCurrency(approvedAwaitingAmount)} tone="blue" icon={ShieldCheck} />
        <StatBlock label="Paid" value={scoped.filter(r => r.status === 'PAID').length.toString()} sub={formatCurrency(scoped.filter(r => r.status === 'PAID').reduce((s, r) => s + r.requestedAmount, 0))} tone="emerald" icon={CheckCircle} />
        <StatBlock label="Rejected" value={scoped.filter(r => r.status === 'REJECTED').length.toString()} sub="" tone="rose" icon={XCircle} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PaymentRequestStatus | 'ALL')}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>{STATUS_FILTERS.map(s => <SelectItem key={s} value={s}>{s === 'ALL' ? 'All statuses' : s === 'PENDING_APPROVAL' ? 'Pending Approval' : s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as PaymentRequestType | 'ALL')}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>{TYPE_FILTERS.map(t => <SelectItem key={t} value={t}>{t === 'ALL' ? 'All types' : t}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Company" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-48 h-8 text-xs"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {(companyFilter !== 'all' ? projects.filter(p => p.companyId === companyFilter) : projects).map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 max-w-xs bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
          <Input placeholder="Search WO, contractor, reason..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-none shadow-none focus-visible:ring-0 bg-transparent h-7 text-xs" />
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb]">
              <TableHead>Work Order</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Contractor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={7} />)
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-sm">No payment requests match these filters.</TableCell></TableRow>
            ) : filtered.map(r => {
              const wo = woById[r.workOrderId];
              const contractor = contractorById[r.contractorId];
              const project = projectById[r.projectId];
              return (
                <TableRow key={r.id} className="hover:bg-[#f9fafb] transition-colors">
                  <TableCell className="text-xs max-w-[300px]">
                    <div className="font-bold text-[#111827] truncate" title={wo?.woNumber || ''}>
                      {wo?.woNumber || '—'}
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#6b7280] ml-1">{companyCode(r.companyId)}</span>
                    </div>
                    <div className="text-[11px] text-[#6b7280] truncate" title={`${wo?.title || ''} · ${project?.name || ''}`}>
                      {wo?.title || '—'} · {project?.name || '—'}
                    </div>
                  </TableCell>
                  <TableCell>{typeBadge(r.type)}</TableCell>
                  <TableCell className="text-sm text-right font-mono font-bold">{formatCurrency(r.requestedAmount)}</TableCell>
                  <TableCell className="text-xs">{contractor?.name || '—'}</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell className="text-[11px] text-[#6b7280]">{r.requestedAt?.slice(0, 10) || '—'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.status === 'PENDING_APPROVAL' && canApprove && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(r)} className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white uppercase font-bold">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(r)} className="h-7 text-[10px] text-rose-600 border-rose-200 hover:bg-rose-50 uppercase font-bold">
                          Reject
                        </Button>
                      </>
                    )}
                    {r.status === 'APPROVED' && canMarkPaid && (
                      <Button size="sm" onClick={() => openPay(r)} className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white uppercase font-bold">
                        Mark as Paid
                      </Button>
                    )}
                    {r.status === 'REJECTED' && r.rejectionReason && (
                      <span className="text-[10px] text-[#6b7280]" title={r.rejectionReason}>
                        Reason recorded
                      </span>
                    )}
                    {r.status === 'PAID' && (
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">
                        {r.paymentMode || 'Paid'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {canCreate && createOpen && (
        <CreatePaymentRequestDialog
          onClose={() => setCreateOpen(false)}
          workOrders={workOrders.filter(wo => isInScope(scope, wo.companyId) && wo.status !== 'REJECTED')}
          requests={scoped}
          companyCode={companyCode}
          onCreated={() => setCreateOpen(false)}
        />
      )}

      {payOpen && payingRequest && canMarkPaid && (
        <PayDialog
          request={payingRequest}
          onClose={() => { setPayOpen(false); setPayingRequest(null); }}
          onPaid={() => { setPayOpen(false); setPayingRequest(null); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Create dialog — picks a scoped WO, type (ADVANCE disabled when one
// is already active for that WO), and amount (fixed for ADVANCE, free
// for PART/FINAL bounded by the available request balance).
// ─────────────────────────────────────────────────────────────────────

function CreatePaymentRequestDialog({
  workOrders, requests, companyCode, onClose, onCreated,
}: {
  workOrders: WorkOrder[];
  requests: PaymentRequest[];
  companyCode: (id: string) => string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [workOrderId, setWorkOrderId] = useState('');
  const [type, setType] = useState<PaymentRequestType>('ADVANCE');
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const wo = workOrders.find(w => w.id === workOrderId) || null;
  const summary = wo ? getWOPaymentSummary(wo, requests) : null;
  const plannedAdvance = summary?.advancePlanned ?? 0;
  // Remaining request balance = gross − what's already non-rejected
  // requested. Used as the conservative "can I still request X?" hint
  // in the UI. The service's actual ceiling also factors in the
  // legacy Bills/Payments outflow — so the UI hint is a best-effort
  // client-side preview, not the authoritative ceiling.
  const uiAvailable = summary ? Math.max(0, summary.grossValue - summary.totalRequested) : 0;
  // Active advance = PENDING_APPROVAL or APPROVED only (Phase 1.2).
  // A PAID advance no longer blocks a follow-up request.
  const advanceAlreadyRequested = wo
    ? requests.some(
        r => r.workOrderId === wo.id
          && r.type === 'ADVANCE'
          && (r.status === 'PENDING_APPROVAL' || r.status === 'APPROVED')
      )
    : false;

  // When type switches to ADVANCE, lock amount to the planned advance.
  React.useEffect(() => {
    if (type === 'ADVANCE') setAmount(plannedAdvance);
  }, [type, plannedAdvance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workOrderId) {
      toast.error('Select a work order.');
      return;
    }
    if (type !== 'ADVANCE' && amount <= 0) {
      toast.error('Amount must be greater than zero.');
      return;
    }
    setSubmitting(true);
    try {
      await paymentRequestService.create({
        workOrderId,
        type,
        requestedAmount: type === 'ADVANCE' ? plannedAdvance : amount,
        reason: reason.trim() || undefined,
        remarks: remarks.trim() || undefined,
      });
      toast.success('Payment request submitted');
      onCreated();
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Payment Request</DialogTitle>
          <DialogDescription>
            Advance uses the WO's planned advance amount. Part / Final take a custom amount.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label>Work Order</Label>
            <Select value={workOrderId} onValueChange={setWorkOrderId}>
              <SelectTrigger><SelectValue placeholder="Select Work Order" /></SelectTrigger>
              <SelectContent>
                {workOrders.map(w => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.woNumber || w.id.slice(0, 8)} — {w.title} · {companyCode(w.companyId || '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {wo && summary && (
            <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3 text-xs grid grid-cols-2 gap-x-4 gap-y-1">
              <div><span className="text-[#6b7280]">Gross WO Value:</span> <strong>{formatCurrency(summary.grossValue)}</strong></div>
              <div><span className="text-[#6b7280]">Remaining Payable:</span> <strong>{formatCurrency(summary.remainingPayable)}</strong></div>
              <div><span className="text-[#6b7280]">Planned Advance:</span> <strong>{formatCurrency(summary.advancePlanned)}</strong></div>
              <div><span className="text-[#6b7280]">Advance Paid:</span> <strong className="text-emerald-700">{formatCurrency(summary.advancePaid)}</strong></div>
              <div><span className="text-[#6b7280]">Total Requested:</span> <strong>{formatCurrency(summary.totalRequested)}</strong></div>
              <div><span className="text-[#6b7280]">Total Paid:</span> <strong className="text-emerald-700">{formatCurrency(summary.totalPaid)}</strong></div>
              <div className="col-span-2 pt-1 mt-1 border-t border-[#e5e7eb]">
                <span className="text-[#6b7280]">Client-side remaining request room:</span> <strong>{formatCurrency(uiAvailable)}</strong>
                <span className="text-[10px] text-[#9ca3af] ml-1">(server may block sooner if linked bills are already paid)</span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as PaymentRequestType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ADVANCE" disabled={advanceAlreadyRequested || plannedAdvance <= 0}>
                  ADVANCE {advanceAlreadyRequested ? '(already requested)' : plannedAdvance <= 0 ? '(no planned advance)' : ''}
                </SelectItem>
                <SelectItem value="PART">PART</SelectItem>
                <SelectItem value="FINAL">FINAL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              disabled={type === 'ADVANCE'}
              required
            />
            {type === 'ADVANCE' && (
              <p className="text-[10px] text-[#9ca3af]">Fixed to the WO's planned advance. Edit the WO itself to change the amount.</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional — short reason for the request" />
          </div>

          <div className="grid gap-2">
            <Label>Remarks</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} placeholder="Optional — longer context" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting || !wo} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
              {submitting ? 'Submitting…' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Pay dialog — Accounts records the real money-movement details.
// ─────────────────────────────────────────────────────────────────────

function PayDialog({ request, onClose, onPaid }: {
  request: PaymentRequest;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [mode, setMode] = useState<PaymentRequestMode>('BANK_TRANSFER');
  const [reference, setReference] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await paymentRequestService.markPaid(request.id, {
        paymentMode: mode,
        paymentReference: reference.trim() || undefined,
        paymentRemarks: remarks.trim() || undefined,
      });
      toast.success('Marked as paid');
      onPaid();
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to mark paid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Paid — {formatCurrency(request.requestedAmount)}</DialogTitle>
          <DialogDescription>
            {request.type} request. Record the payment details; this confirms actual money movement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label>Payment Mode</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as PaymentRequestMode)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map(m => <SelectItem key={m} value={m}>{m.replace('_', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Reference</Label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR, cheque no, txn id (optional)" />
          </div>
          <div className="grid gap-2">
            <Label>Remarks</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} placeholder="Optional" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {submitting ? 'Saving…' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Tiny stat block used at the top of the page ────────────────────

function StatBlock({ label, value, sub, tone, icon: Icon }: {
  label: string; value: string; sub: string;
  tone: 'amber' | 'blue' | 'emerald' | 'rose';
  icon: React.ComponentType<{ className?: string }>;
}) {
  const cls = {
    amber:   { card: 'bg-amber-50 border-amber-100',   iconWrap: 'bg-amber-100',   icon: 'text-amber-700' },
    blue:    { card: 'bg-blue-50 border-blue-100',     iconWrap: 'bg-blue-100',    icon: 'text-blue-700' },
    emerald: { card: 'bg-emerald-50 border-emerald-100', iconWrap: 'bg-emerald-100', icon: 'text-emerald-700' },
    rose:    { card: 'bg-rose-50 border-rose-100',     iconWrap: 'bg-rose-100',    icon: 'text-rose-700' },
  }[tone];
  return (
    <div className={cn('rounded-xl border p-3 flex items-center gap-3', cls.card)}>
      <div className={cn('p-2 rounded-lg', cls.iconWrap)}>
        <Wallet className={cn('h-4 w-4', cls.icon)} />
        <Icon className="hidden" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">{label}</p>
        <p className="text-base font-black text-[#111827] leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-[#6b7280] leading-tight">{sub}</p>}
      </div>
    </div>
  );
}
