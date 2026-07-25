import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, HandCoins, AlertTriangle, Trash2, CheckCircle2, Home, XCircle, Plus, BookOpen, ShieldAlert,
  CalendarClock, MoreVertical, Edit, Ban, Ban as BanIcon, RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saleService } from '../services/saleService';
import { saleReceiptService } from '../services/saleReceiptService';
import { saleScheduleService } from '../services/saleScheduleService';
import { getEffectiveCompanyScope, isInScope } from '../lib/userAccess';
import {
  Sale, SaleReceipt, SaleSchedule, ScheduleType, ReceiptMode, BusinessRuleError
} from '../types';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { buildSaleScheduleSummary, scheduleBalance, computeAutoDistribution } from '../lib/scheduleCalcs';
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

const RECEIPT_MODES: ReceiptMode[] = ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'LOAN_DISBURSEMENT'];
const SCHEDULE_TYPES: ScheduleType[] = [
  'BOOKING', 'ADVANCE', 'INSTALLMENT', 'LOAN_DISBURSEMENT', 'POSSESSION', 'REGISTRY', 'OTHER'
];

function scheduleStatusBadge(s: SaleSchedule['status']) {
  const cls =
    s === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
    s === 'PARTIALLY_PAID' ? 'bg-amber-100 text-amber-800' :
    s === 'PENDING' ? 'bg-slate-100 text-slate-700' :
    s === 'WAIVED' ? 'bg-violet-100 text-violet-800' :
    /* CANCELLED */ 'bg-rose-100 text-rose-800';
  const label = s === 'PARTIALLY_PAID' ? 'Partial' : s === 'CANCELLED' ? 'Cancelled' : s;
  return <Badge className={cn('border-0 text-[10px] font-black uppercase tracking-wider', cls)}>{label}</Badge>;
}

function statusBadge(s: Sale['saleStatus']) {
  const cls =
    s === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
    s === 'SOLD' ? 'bg-emerald-100 text-emerald-800' :
    s === 'POSSESSION_GIVEN' ? 'bg-violet-100 text-violet-800' :
    'bg-rose-100 text-rose-800';
  const label = s === 'POSSESSION_GIVEN' ? 'Possession Given' : s;
  return <Badge className={cn('border-0 text-[11px] font-black uppercase tracking-wider', cls)}>{label}</Badge>;
}

export default function SaleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isAdmin, isPM, isAccounts } = useAuth();
  // Effective scope for this user. ADMIN/CEO get unrestricted=true and
  // bypass the check below; every other role is filtered by their
  // assignedCompanyIds so deep-linked sale urls outside their scope
  // cannot be read.
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);

  const [sale, setSale] = useState<Sale | null>(null);
  const [receipts, setReceipts] = useState<SaleReceipt[]>([]);
  const [schedules, setSchedules] = useState<SaleSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [markSoldOpen, setMarkSoldOpen] = useState(false);
  const [markPossessionOpen, setMarkPossessionOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // Schedule dialog targets. `scheduleEditor` is the create-or-edit dialog.
  const [scheduleEditor, setScheduleEditor] = useState<{ mode: 'create' | 'edit'; existing?: SaleSchedule } | null>(null);

  useEffect(() => {
    if (!id) return;
    const u1 = saleService.subscribeById(id, (s) => { setSale(s); setLoading(false); });
    const u2 = saleReceiptService.subscribeBySale(id, setReceipts);
    const u3 = saleScheduleService.subscribeBySale(id, setSchedules);
    return () => { u1(); u2(); u3(); };
  }, [id]);

  const scheduleSummary = useMemo(
    () => buildSaleScheduleSummary(schedules),
    [schedules]
  );

  const outstanding = useMemo(() => {
    if (!sale) return 0;
    return (sale.finalSaleValue || 0) - (sale.totalReceived || 0);
  }, [sale]);
  const overpaid = outstanding < 0;

  const fundingTotal = useMemo(() => {
    if (!sale) return 0;
    return +(sale.bookingAmount + sale.advanceAmount + sale.loanAmount + sale.selfFundingAmount).toFixed(2);
  }, [sale]);
  const fundingMismatch = sale ? Math.abs(fundingTotal - sale.finalSaleValue) > 0.01 : false;

  if (loading) {
    return <div className="p-8 text-sm text-[#6b7280]">Loading sale…</div>;
  }
  if (!sale) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#6b7280]">Sale not found.</p>
        <Button variant="outline" onClick={() => navigate('/sales')} className="mt-4">
          <ArrowLeft className="h-3 w-3 mr-1.5" /> Back to Sales
        </Button>
      </div>
    );
  }

  // Scope gate — runs after the sale is loaded, before any detail is
  // rendered. ADMIN/CEO are unrestricted; other roles are denied if the
  // sale's companyId is not in their assignedCompanyIds. Sales created
  // before `companyId` existed on the schema would also land here under
  // a scoped user — intentional (safest default for deep-linked urls).
  if (!isInScope(scope, sale.companyId)) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-rose-50 rounded-full">
            <ShieldAlert className="h-10 w-10 text-rose-600" />
          </div>
          <h2 className="text-lg font-black text-[#111827]">Access Denied</h2>
          <p className="text-sm text-[#6b7280]">
            This sale belongs to a company outside your assigned scope.
            Ask an admin to assign the company to your account if you need access.
          </p>
          <Button variant="outline" onClick={() => navigate('/sales')} className="mt-2">
            <ArrowLeft className="h-3 w-3 mr-1.5" /> Back to Sales
          </Button>
        </div>
      </div>
    );
  }

  const isCancelled = sale.saleStatus === 'CANCELLED';
  const canMarkSold = (isAdmin || isPM) && sale.saleStatus === 'BOOKED';
  const canMarkPossession = (isAdmin || isPM) && sale.saleStatus === 'SOLD';
  const canCancel = (isAdmin || isPM) && !isCancelled;
  const canRecordReceipt = (isAdmin || isAccounts) && !isCancelled;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/sales')} className="-ml-2">
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Sales
        </Button>
      </div>

      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <HandCoins className="h-5 w-5 text-[#2563eb]" />
              <h1 className="text-xl font-black tracking-tight">{sale.unitNameSnapshot}</h1>
              {statusBadge(sale.saleStatus)}
            </div>
            <p className="text-sm text-[#6b7280] mt-1">
              Sold to <strong>{sale.customerNameSnapshot}</strong>{' '}
              <Link
                to={`/customers/${sale.customerId}/ledger`}
                className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-xs font-bold"
                title="View customer ledger"
              >
                <BookOpen className="h-3 w-3" /> Ledger
              </Link>
              {' '}on{' '}
              {sale.saleDate ? format(parseISO(sale.saleDate), 'dd MMM yyyy') : '—'}
              {' · '}Funding: <strong>{sale.fundingModel}</strong>
            </p>
            {sale.remarks && <p className="text-xs text-[#6b7280] mt-2">Remarks: {sale.remarks}</p>}
            {isCancelled && (
              <div className="mt-3 p-2 rounded-md bg-rose-50 border border-rose-100 text-[11px] text-rose-900">
                <strong>Cancelled</strong>
                {sale.cancelledAt && <> on {format(parseISO(sale.cancelledAt), 'dd MMM yyyy')}</>}
                {sale.cancelReason && <> — {sale.cancelReason}</>}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {canRecordReceipt && (
              <Button onClick={() => setReceiptOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Record Receipt
              </Button>
            )}
            {canMarkSold && (
              <Button onClick={() => setMarkSoldOpen(true)} variant="outline">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark SOLD
              </Button>
            )}
            {canMarkPossession && (
              <Button onClick={() => setMarkPossessionOpen(true)} variant="outline">
                <Home className="h-3.5 w-3.5 mr-1.5" /> Mark Possession
              </Button>
            )}
            {canCancel && (
              <Button onClick={() => setCancelOpen(true)} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">
                <XCircle className="h-3.5 w-3.5 mr-1.5" /> Cancel Sale
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Financial strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <SummaryCard label="Agreement" value={formatCurrency(sale.agreementValue)} />
        <SummaryCard label="Discount" value={formatCurrency(sale.discountAmount)} />
        <SummaryCard label="Final" value={formatCurrency(sale.finalSaleValue)} accent="text-[#111827]" />
        <SummaryCard label="Received" value={formatCurrency(sale.totalReceived || 0)} accent="text-emerald-700" />
        <SummaryCard
          label={overpaid ? 'Overpaid By' : 'Outstanding'}
          value={formatCurrency(Math.abs(outstanding))}
          accent={overpaid ? 'text-amber-700' : outstanding > 0 ? 'text-rose-700' : 'text-emerald-700'}
        />
      </div>

      {/* Funding-total mismatch banner (warn, don't block) */}
      {fundingMismatch && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold">Funding breakdown mismatch</p>
            <p className="text-amber-800 mt-0.5">
              Booking + Advance + Loan + Self ({formatCurrency(fundingTotal)}) does not equal Final Sale Value ({formatCurrency(sale.finalSaleValue)}).
              Allowed by policy — reconcile later via adjustments.
            </p>
          </div>
        </div>
      )}

      {/* Overpayment banner */}
      {overpaid && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold">Received amount exceeds final sale value</p>
            <p className="text-amber-800 mt-0.5">
              Total received ({formatCurrency(sale.totalReceived || 0)}) is higher than the final sale value ({formatCurrency(sale.finalSaleValue)}).
              Allowed by policy — reconcile via a refund or post-sale adjustment later.
            </p>
          </div>
        </div>
      )}

      {/* Funding breakdown */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#111827] mb-3">Expected Funding</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <BreakdownCell label="Booking" value={sale.bookingAmount} />
          <BreakdownCell label="Advance" value={sale.advanceAmount} />
          <BreakdownCell label="Loan" value={sale.loanAmount} />
          <BreakdownCell label="Self" value={sale.selfFundingAmount} />
        </div>
      </div>

      {/* Installment schedule (Phase 2A) */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <div className="px-5 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-[#2563eb]" />
            <p className="text-xs font-black uppercase tracking-widest">Installment Schedule ({schedules.length})</p>
          </div>
          {(isAdmin || isPM || isAccounts) && !isCancelled && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-black uppercase"
              onClick={() => setScheduleEditor({ mode: 'create' })}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Schedule
            </Button>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb]">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-20 text-center text-muted-foreground text-sm">
                  No schedule entries yet.
                  {!isCancelled && (isAdmin || isPM || isAccounts) && ' Click Add Schedule to plan the installments.'}
                </TableCell>
              </TableRow>
            ) : schedules.map(sch => {
              const bal = scheduleBalance(sch);
              const d = parseISO(sch.dueDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isOverdueRow = (sch.status === 'PENDING' || sch.status === 'PARTIALLY_PAID') && d < today;
              return (
                <TableRow key={sch.id} className={cn(isOverdueRow && 'bg-rose-50/40')}>
                  <TableCell className="text-xs font-bold">{sch.installmentNo}</TableCell>
                  <TableCell className="text-[10px] font-bold uppercase text-[#6b7280]">{sch.scheduleType}</TableCell>
                  <TableCell className="text-xs">
                    {sch.dueDate ? format(parseISO(sch.dueDate), 'dd MMM yyyy') : '—'}
                    {isOverdueRow && (
                      <Badge className="ml-2 bg-rose-100 text-rose-800 border-0 text-[9px] font-black uppercase">Overdue</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-right">{formatCurrency(sch.amount)}</TableCell>
                  <TableCell className="text-sm text-right text-emerald-700 font-semibold">{formatCurrency(sch.paidAmount || 0)}</TableCell>
                  <TableCell className={cn(
                    "text-sm text-right font-semibold",
                    bal > 0 ? "text-rose-700" : "text-emerald-700"
                  )}>{formatCurrency(bal)}</TableCell>
                  <TableCell>{scheduleStatusBadge(sch.status)}</TableCell>
                  <TableCell className="text-[11px] text-[#6b7280] max-w-[12rem] truncate">{sch.remarks || '—'}</TableCell>
                  <TableCell className="text-right">
                    {(isAdmin || isPM || isAccounts) && !isCancelled && (
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4" /></Button>} />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setScheduleEditor({ mode: 'edit', existing: sch })}>
                            <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          {sch.status !== 'WAIVED' && sch.status !== 'CANCELLED' && (
                            <DropdownMenuItem
                              onClick={async () => {
                                if (!window.confirm(`Waive installment #${sch.installmentNo}? The remaining balance of ${formatCurrency(bal)} will be written off.`)) return;
                                try { await saleScheduleService.waive(sch.id); toast.success('Schedule waived'); }
                                catch (err) { toast.error(err instanceof BusinessRuleError ? err.message : 'Failed'); }
                              }}
                            >
                              <BanIcon className="mr-2 h-3.5 w-3.5" /> Waive
                            </DropdownMenuItem>
                          )}
                          {sch.status !== 'CANCELLED' && sch.status !== 'WAIVED' && (
                            <DropdownMenuItem
                              onClick={async () => {
                                if (!window.confirm(`Cancel installment #${sch.installmentNo}?`)) return;
                                try { await saleScheduleService.cancelRow(sch.id); toast.success('Schedule cancelled'); }
                                catch (err) { toast.error(err instanceof BusinessRuleError ? err.message : 'Failed'); }
                              }}
                            >
                              <Ban className="mr-2 h-3.5 w-3.5" /> Cancel
                            </DropdownMenuItem>
                          )}
                          {(sch.status === 'WAIVED' || sch.status === 'CANCELLED') && (
                            <DropdownMenuItem
                              onClick={async () => {
                                try { await saleScheduleService.reactivate(sch.id); toast.success('Schedule reactivated'); }
                                catch (err) { toast.error(err instanceof BusinessRuleError ? err.message : 'Failed'); }
                              }}
                            >
                              <RotateCcw className="mr-2 h-3.5 w-3.5" /> Reactivate
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (sch.paidAmount || 0) === 0 && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={async () => {
                                if (!window.confirm(`Delete installment #${sch.installmentNo}? This cannot be undone.`)) return;
                                try { await saleScheduleService.delete(sch.id); toast.success('Schedule deleted'); }
                                catch (err) { toast.error(err instanceof BusinessRuleError ? err.message : 'Failed'); }
                              }}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {schedules.length > 0 && (
          <div className="px-5 py-3 border-t border-[#e5e7eb] bg-[#f9fafb] flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-4">
              <span><strong>Scheduled:</strong> {formatCurrency(scheduleSummary.totalScheduled)}</span>
              <span><strong>Paid:</strong> <span className="text-emerald-700">{formatCurrency(scheduleSummary.scheduledPaid)}</span></span>
              <span><strong>Balance:</strong> <span className="text-rose-700">{formatCurrency(scheduleSummary.scheduledBalance)}</span></span>
              {scheduleSummary.overdueAmount > 0 && (
                <span><strong>Overdue:</strong> <span className="text-rose-700">{formatCurrency(scheduleSummary.overdueAmount)}</span></span>
              )}
            </div>
            {(() => {
              const delta = scheduleSummary.deltaVsSaleValue(sale.finalSaleValue);
              if (delta === 0) return null;
              return (
                <div className="flex items-center gap-1 text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Schedules {delta > 0 ? 'exceed' : 'fall short of'} final sale value by {formatCurrency(Math.abs(delta))}.
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Receipts */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <div className="px-5 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest">Receipts ({receipts.length})</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb]">
              <TableHead>Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-20 text-center text-muted-foreground text-sm">
                No receipts yet.
              </TableCell></TableRow>
            ) : receipts.map(r => (
              <TableRow key={r.id}>
                <TableCell className="text-xs">{r.receivedAt ? format(parseISO(r.receivedAt), 'dd MMM yyyy') : '—'}</TableCell>
                <TableCell className="text-[10px] font-bold uppercase text-[#6b7280]">{r.mode}</TableCell>
                <TableCell className="text-xs text-[#6b7280]">{r.reference || '—'}</TableCell>
                <TableCell className="text-xs text-[#6b7280]">{r.remarks || '—'}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-emerald-700">{formatCurrency(r.amount)}</TableCell>
                <TableCell className="text-right">
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        if (!window.confirm(`Delete this receipt of ${formatCurrency(r.amount)}?`)) return;
                        try {
                          await saleReceiptService.delete(r.id);
                          toast.success('Receipt deleted');
                        } catch (err) {
                          toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to delete');
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {receiptOpen && (
        <ReceiptDialog
          sale={sale}
          schedules={schedules}
          onClose={() => setReceiptOpen(false)}
        />
      )}

      {scheduleEditor && (
        <ScheduleEditorDialog
          sale={sale}
          existing={scheduleEditor.existing}
          existingInstallmentNos={schedules.map(s => s.installmentNo)}
          onClose={() => setScheduleEditor(null)}
        />
      )}

      {/* Mark SOLD confirmation */}
      <Dialog open={markSoldOpen} onOpenChange={setMarkSoldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark sale as SOLD?</DialogTitle>
            <DialogDescription>
              This signs the agreement and transfers ownership of <strong>{sale.unitNameSnapshot}</strong> to{' '}
              <strong>{sale.customerNameSnapshot}</strong>. The unit's ownership will flip from UNSOLD to SOLD.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkSoldOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={async () => {
                try {
                  await saleService.markSold(sale.id);
                  toast.success('Sale marked SOLD · Ownership transferred');
                  setMarkSoldOpen(false);
                } catch (err) {
                  toast.error(err instanceof BusinessRuleError ? err.message : 'Failed');
                }
              }}
            >
              Confirm SOLD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark POSSESSION confirmation */}
      <Dialog open={markPossessionOpen} onOpenChange={setMarkPossessionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark possession as given?</DialogTitle>
            <DialogDescription>
              This records the handover of <strong>{sale.unitNameSnapshot}</strong>. Ownership is unchanged (remains SOLD).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkPossessionOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  await saleService.markPossessionGiven(sale.id);
                  toast.success('Possession given');
                  setMarkPossessionOpen(false);
                } catch (err) {
                  toast.error(err instanceof BusinessRuleError ? err.message : 'Failed');
                }
              }}
            >
              Confirm Possession
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      {cancelOpen && (
        <CancelDialog
          sale={sale}
          onClose={() => setCancelOpen(false)}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">{label}</p>
      <p className={cn('text-lg font-black mt-1', accent || 'text-[#111827]')}>{value}</p>
    </div>
  );
}

function BreakdownCell({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{formatCurrency(value)}</p>
    </div>
  );
}

const UNALLOCATED = '__unallocated__';
const AUTO_DISTRIBUTE = '__auto__';

function ReceiptDialog({ sale, schedules, onClose }: { sale: Sale; schedules: SaleSchedule[]; onClose: () => void }) {
  const [amount, setAmount] = useState<number>(0);
  const [receivedAt, setReceivedAt] = useState<string>(new Date().toISOString().slice(0, 10));
  const [mode, setMode] = useState<ReceiptMode>('BANK_TRANSFER');
  const [reference, setReference] = useState('');
  const [remarks, setRemarks] = useState('');
  // Phase 2A/2B — allocation picker. Three modes:
  //   UNALLOCATED       - receipt counts in sale.totalReceived only
  //   <scheduleId>      - single-schedule allocation (Phase 2A behavior)
  //   AUTO_DISTRIBUTE   - greedy split across open schedules by dueDate
  const [scheduleId, setScheduleId] = useState<string>(UNALLOCATED);
  const [submitting, setSubmitting] = useState(false);

  const openSchedulesForSale = useMemo(
    () => schedules
      .filter(s => s.status === 'PENDING' || s.status === 'PARTIALLY_PAID')
      .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '')),
    [schedules]
  );
  const selectedSchedule = useMemo(
    () => (scheduleId === UNALLOCATED || scheduleId === AUTO_DISTRIBUTE)
      ? null
      : openSchedulesForSale.find(s => s.id === scheduleId) || null,
    [openSchedulesForSale, scheduleId]
  );

  // Live preview for auto-distribute mode. Recomputed on every amount
  // change so the admin sees exactly how the lump sum will land before
  // submit. Uses the same algorithm the service uses.
  const autoPreview = useMemo(() => {
    if (scheduleId !== AUTO_DISTRIBUTE) return null;
    return computeAutoDistribution(amount, openSchedulesForSale);
  }, [scheduleId, amount, openSchedulesForSale]);

  const projectedTotal = +(Number(sale.totalReceived || 0) + (amount || 0)).toFixed(2);
  const willOverpay = amount > 0 && projectedTotal > sale.finalSaleValue;
  const willOverpaySchedule = selectedSchedule != null && amount > 0
    && amount > scheduleBalance(selectedSchedule);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Amount must be positive.');
      return;
    }
    setSubmitting(true);
    try {
      // Translate the chosen mode into the service's input shape.
      // Single-schedule still uses `linkedScheduleId` (back-compat path);
      // auto-distribute sends an explicit `allocations` array built by
      // `computeAutoDistribution` so the service applies the exact split
      // the user previewed.
      let linkedScheduleId: string | undefined;
      let allocations: { scheduleId: string; amount: number }[] | undefined;
      let allocationMode: 'UNALLOCATED' | 'SPECIFIC' | 'AUTO';
      if (scheduleId === AUTO_DISTRIBUTE) {
        allocations = autoPreview?.allocations || [];
        // Even when auto-distribute lands on a single schedule, the
        // user's intent was AUTO — persist that so the receipt history
        // reflects how the receipt was entered.
        allocationMode = 'AUTO';
      } else if (scheduleId !== UNALLOCATED) {
        linkedScheduleId = scheduleId;
        allocationMode = 'SPECIFIC';
      } else {
        allocationMode = 'UNALLOCATED';
      }

      await saleReceiptService.create({
        saleId: sale.id,
        amount,
        receivedAt: new Date(receivedAt).toISOString(),
        mode,
        reference: reference.trim() || undefined,
        remarks: remarks.trim() || undefined,
        linkedScheduleId,
        allocations,
        allocationMode,
      });

      const successMsg =
        scheduleId === AUTO_DISTRIBUTE
          ? `Receipt of ${formatCurrency(amount)} recorded` +
            (autoPreview?.allocations.length
              ? ` · split across ${autoPreview.allocations.length} schedules`
              : '')
          : `Receipt of ${formatCurrency(amount)} recorded` +
            (selectedSchedule ? ` · linked to installment #${selectedSchedule.installmentNo}` : '');
      toast.success(successMsg);
      onClose();
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to record receipt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Receipt</DialogTitle>
          <DialogDescription>
            Register money received against this sale. Running total: {formatCurrency(sale.totalReceived || 0)} of {formatCurrency(sale.finalSaleValue)}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(+e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Received Date</Label>
              <Input type="date" value={receivedAt} onChange={(e) => setReceivedAt(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as ReceiptMode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RECEIPT_MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Reference (optional)</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR / cheque no" />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label>Remarks (optional)</Label>
              <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label>
                Apply to schedule (optional)
                <span className="text-[10px] text-[#9ca3af] font-normal ml-2">
                  — Unallocated leaves it general; Auto-distribute splits across open installments by due date
                </span>
              </Label>
              <Select value={scheduleId} onValueChange={setScheduleId}>
                <SelectTrigger>
                  <SelectValue>
                    {scheduleId === UNALLOCATED
                      ? 'Unallocated'
                      : scheduleId === AUTO_DISTRIBUTE
                        ? 'Auto-distribute across open schedules'
                        : selectedSchedule
                          ? `#${selectedSchedule.installmentNo} · ${selectedSchedule.scheduleType} · Bal ${formatCurrency(scheduleBalance(selectedSchedule))}`
                          : 'Unallocated'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="min-w-[360px]">
                  <SelectItem value={UNALLOCATED}>Unallocated</SelectItem>
                  {openSchedulesForSale.length > 0 && (
                    <SelectItem value={AUTO_DISTRIBUTE}>
                      Auto-distribute across open schedules
                    </SelectItem>
                  )}
                  {openSchedulesForSale.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      #{s.installmentNo} · {s.scheduleType} · due {format(parseISO(s.dueDate), 'dd MMM yyyy')} · Bal {formatCurrency(scheduleBalance(s))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {openSchedulesForSale.length === 0 && (
                <p className="text-[11px] text-[#9ca3af]">No open schedules on this sale — add one above to enable allocation.</p>
              )}
            </div>

            {/* Auto-distribute preview — recomputed live from `amount`. */}
            {scheduleId === AUTO_DISTRIBUTE && autoPreview && amount > 0 && (
              <div className="md:col-span-2 rounded-lg border border-blue-100 bg-blue-50 p-3 space-y-2">
                <p className="text-[11px] font-black uppercase tracking-widest text-blue-900">
                  Auto-distribute preview
                </p>
                {autoPreview.allocations.length === 0 ? (
                  <p className="text-[11px] text-blue-900">
                    No open schedules have any balance — the full {formatCurrency(amount)} will land unallocated.
                  </p>
                ) : (
                  <>
                    <ul className="text-[11px] text-blue-900 space-y-1">
                      {autoPreview.allocations.map(a => {
                        const sch = openSchedulesForSale.find(s => s.id === a.scheduleId);
                        return (
                          <li key={a.scheduleId} className="flex items-center justify-between gap-2">
                            <span>
                              <strong>#{sch?.installmentNo}</strong> · {sch?.scheduleType}
                              {sch?.dueDate && <> · due {format(parseISO(sch.dueDate), 'dd MMM yyyy')}</>}
                            </span>
                            <span className="font-bold">{formatCurrency(a.amount)}</span>
                          </li>
                        );
                      })}
                    </ul>
                    {autoPreview.remainder > 0 && (
                      <p className="text-[11px] text-blue-900 border-t border-blue-100 pt-2">
                        Remainder of <strong>{formatCurrency(autoPreview.remainder)}</strong> will stay
                        unallocated (all open schedules are full). Counts in sale.totalReceived.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {willOverpay && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                This receipt will push total received to {formatCurrency(projectedTotal)} — {formatCurrency(projectedTotal - sale.finalSaleValue)} above the final sale value.
                Allowed by policy.
              </div>
            </div>
          )}

          {willOverpaySchedule && selectedSchedule && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                This receipt exceeds installment #{selectedSchedule.installmentNo} by {formatCurrency(amount - scheduleBalance(selectedSchedule))}.
                The excess stays on this schedule as overpayment — Phase 2A does not auto-split across schedules.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Record Receipt'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CancelDialog({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const wasOwnershipTransferred = sale.saleStatus === 'SOLD' || sale.saleStatus === 'POSSESSION_GIVEN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Cancel reason is required.');
      return;
    }
    setSubmitting(true);
    try {
      await saleService.cancel(sale.id, reason.trim());
      toast.success('Sale cancelled');
      onClose();
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to cancel');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            Cancel Sale
          </DialogTitle>
          <DialogDescription>
            The unit <strong>{sale.unitNameSnapshot}</strong> will return to AVAILABLE.
            {wasOwnershipTransferred && ' Ownership will be reverted from the buyer back to the company.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid gap-2">
            <Label>Reason <span className="text-red-500">*</span></Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Buyer withdrew, loan denied"
              required
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Keep Sale</Button>
            <Button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {submitting ? 'Cancelling…' : 'Confirm Cancel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Schedule editor (create or edit an installment plan row)
// ─────────────────────────────────────────────────────────────────────

function ScheduleEditorDialog({
  sale,
  existing,
  existingInstallmentNos,
  onClose,
}: {
  sale: Sale;
  existing?: SaleSchedule;
  existingInstallmentNos: number[];
  onClose: () => void;
}) {
  const isEdit = !!existing;
  const suggestedNo = useMemo(() => {
    if (existing) return existing.installmentNo;
    const max = existingInstallmentNos.length > 0 ? Math.max(...existingInstallmentNos) : 0;
    return max + 1;
  }, [existing, existingInstallmentNos]);

  const [installmentNo, setInstallmentNo] = useState<number>(suggestedNo);
  const [scheduleType, setScheduleType] = useState<ScheduleType>(existing?.scheduleType || 'INSTALLMENT');
  const [dueDate, setDueDate] = useState<string>(existing ? existing.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState<number>(existing?.amount ?? 0);
  const [remarks, setRemarks] = useState<string>(existing?.remarks || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) { toast.error('Amount must be positive.'); return; }
    if (!dueDate) { toast.error('Due date is required.'); return; }
    setSubmitting(true);
    try {
      if (isEdit && existing) {
        await saleScheduleService.update(existing.id, {
          installmentNo,
          scheduleType,
          dueDate: new Date(dueDate).toISOString(),
          amount,
          remarks: remarks.trim() || undefined,
        });
        toast.success('Schedule updated');
      } else {
        await saleScheduleService.create({
          saleId: sale.id,
          installmentNo,
          scheduleType,
          dueDate: new Date(dueDate).toISOString(),
          amount,
          remarks: remarks.trim() || undefined,
        });
        toast.success('Schedule added');
      }
      onClose();
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
          <DialogDescription>
            Installment plan row for {sale.unitNameSnapshot} · {sale.customerNameSnapshot}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="grid gap-2">
              <Label>Installment #</Label>
              <Input type="number" min="1" value={installmentNo} onChange={(e) => setInstallmentNo(+e.target.value)} required />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label>Type</Label>
              <Select value={scheduleType} onValueChange={(v) => setScheduleType(v as ScheduleType)}>
                <SelectTrigger><SelectValue>{scheduleType}</SelectValue></SelectTrigger>
                <SelectContent>
                  {SCHEDULE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(+e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Remarks (optional)</Label>
              <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
          </div>
          {isEdit && existing && (existing.paidAmount || 0) > 0 && amount < (existing.paidAmount || 0) && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                New amount is below paid ({formatCurrency(existing.paidAmount || 0)}). Status will flip to <strong>PAID</strong> and the schedule will carry overpayment.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
