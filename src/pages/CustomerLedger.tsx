import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, Mail, AlertTriangle, ArrowDownCircle, ArrowUpCircle,
  XCircle, ExternalLink, CalendarClock, ChevronRight, ChevronDown, CheckCircle2
} from 'lucide-react';
import { customerService } from '../services/customerService';
import { saleService } from '../services/saleService';
import { saleReceiptService } from '../services/saleReceiptService';
import { saleScheduleService } from '../services/saleScheduleService';
import { projectService } from '../services/projectService';
import { subLocationService } from '../services/subLocationService';
import { Customer, Sale, SaleReceipt, SaleSchedule, Project, SubLocation } from '../types';
import { Button } from '../components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { format, parseISO } from 'date-fns';
import { formatCurrency, cn } from '../lib/utils';
import {
  buildCustomerSummary,
  buildUnitBreakdown,
  buildTransactionStream,
  buildCustomerSchedules,
  LedgerTx
} from '../lib/customerLedgerCalcs';

/** Live-subscribe to all saleReceipts once; aggregate client-side.
 *  Same pattern as the rest of the app — receipts are small docs and
 *  the list stays small in practice. Avoids Firestore's 10-item `in`
 *  limit if a customer has many sales. */

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

function saleStatusBadge(s: Sale['saleStatus']) {
  const cls =
    s === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
    s === 'SOLD' ? 'bg-emerald-100 text-emerald-800' :
    s === 'POSSESSION_GIVEN' ? 'bg-violet-100 text-violet-800' :
    'bg-rose-100 text-rose-800';
  const label = s === 'POSSESSION_GIVEN' ? 'Possession' : s;
  return <Badge className={cn('border-0 text-[10px] font-black uppercase tracking-wider', cls)}>{label}</Badge>;
}

export default function CustomerLedger() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [receipts, setReceipts] = useState<SaleReceipt[]>([]);
  const [schedules, setSchedules] = useState<SaleSchedule[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subLocations, setSubLocations] = useState<SubLocation[]>([]);
  const [loading, setLoading] = useState(true);
  // Per-group toggle: whether the collapsed "N paid installments" row is
  // expanded to reveal the individual paid schedules. Collapsed by default
  // so the eye jumps straight to what's still pending or overdue.
  const [paidExpanded, setPaidExpanded] = useState<Record<string, boolean>>({});
  const togglePaid = (saleId: string) =>
    setPaidExpanded(p => ({ ...p, [saleId]: !p[saleId] }));

  useEffect(() => {
    if (!id) return;
    let done = 0;
    const check = () => { if (++done >= 5) setLoading(false); };

    customerService.getAll((cs) => { setCustomer(cs.find(c => c.id === id) || null); check(); });
    const u2 = saleService.getAll((s) => { setSales(s); check(); });
    const u3 = projectService.getAll((p) => { setProjects(p); check(); });
    const u4 = subLocationService.getAll((sl) => { setSubLocations(sl); check(); });
    // Simple receipts subscription — one listener for everything.
    // The page filters to this customer's sales in the aggregation fn.
    const u5 = subscribeAllReceipts((r) => { setReceipts(r); check(); });
    const u6 = saleScheduleService.getAll(setSchedules);

    return () => { u2(); u3(); u4(); u5(); u6(); };
  }, [id]);

  const summary = useMemo(
    () => buildCustomerSummary(id || '', sales),
    [id, sales]
  );
  const unitRows = useMemo(
    () => buildUnitBreakdown(id || '', sales, projects, subLocations),
    [id, sales, projects, subLocations]
  );
  const transactions = useMemo(
    () => buildTransactionStream(id || '', sales, receipts),
    [id, sales, receipts]
  );
  const scheduleGroups = useMemo(
    () => buildCustomerSchedules(id || '', sales, schedules, projects, subLocations),
    [id, sales, schedules, projects, subLocations]
  );

  if (loading) {
    return <div className="p-8 text-sm text-[#6b7280]">Loading ledger…</div>;
  }
  if (!customer) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#6b7280]">Customer not found.</p>
        <Button variant="outline" onClick={() => navigate('/masters')} className="mt-4">
          <ArrowLeft className="h-3 w-3 mr-1.5" /> Back to Masters
        </Button>
      </div>
    );
  }

  // Outstanding card label switches dynamically:
  //   > 0 → Outstanding (rose)
  //   = 0 → Fully Paid (emerald)
  //   < 0 → Overpaid (amber)
  const balanceCard = (() => {
    if (summary.netOutstanding > 0) {
      return { label: 'Outstanding', value: formatCurrency(summary.outstanding), accent: 'text-rose-700' };
    }
    if (summary.netOutstanding < 0) {
      return { label: 'Overpaid', value: formatCurrency(summary.overpaidAmount), accent: 'text-amber-700' };
    }
    return { label: 'Fully Paid', value: formatCurrency(0), accent: 'text-emerald-700' };
  })();

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/masters')} className="-ml-2">
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Masters
        </Button>
      </div>

      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#2563eb]" />
              <h1 className="text-xl font-black tracking-tight">{customer.name}</h1>
            </div>
            <div className="text-xs text-[#6b7280] mt-1 flex flex-wrap gap-3">
              {customer.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</span>}
              {customer.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span>}
              {customer.panNumber && <span>PAN: <strong>{customer.panNumber}</strong></span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryCard label="Units Booked" value={String(summary.unitsBooked)} hint="BOOKED + SOLD + Possession" />
        <SummaryCard label="Units Sold" value={String(summary.unitsSold)} hint="SOLD + Possession" />
        <SummaryCard label="Total Sale Value" value={formatCurrency(summary.totalSaleValue)} accent="text-[#111827]" />
        <SummaryCard label="Total Received" value={formatCurrency(summary.totalReceived)} accent="text-emerald-700" />
        <SummaryCard label={balanceCard.label} value={balanceCard.value} accent={balanceCard.accent} />
      </div>

      {/* Cancelled-sales callout */}
      {summary.cancelledCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold">
              {summary.cancelledCount} cancelled sale{summary.cancelledCount > 1 ? 's' : ''}{' '}
              {summary.receivedOnCancelled > 0 && (
                <>· {formatCurrency(summary.receivedOnCancelled)} received before cancellation</>
              )}
            </p>
            <p className="text-amber-800 mt-0.5">
              Cancelled sales are excluded from the totals above but kept in the unit list and transactions below.
              Any unrefunded amount will be handled by post-sale adjustments in a future phase.
            </p>
          </div>
        </div>
      )}

      {/* Unit-wise breakdown */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <div className="px-5 py-3 border-b border-[#e5e7eb]">
          <p className="text-xs font-black uppercase tracking-widest">Units ({unitRows.length})</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb]">
              <TableHead>Unit</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sale Date</TableHead>
              <TableHead className="text-right">Final</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitRows.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="h-20 text-center text-muted-foreground text-sm">
                No sales for this customer yet.
              </TableCell></TableRow>
            ) : unitRows.map(row => {
              const overpaid = row.outstanding < 0;
              const isCancelled = row.saleStatus === 'CANCELLED';
              return (
                <TableRow key={row.saleId} className={cn(isCancelled && 'opacity-60')}>
                  <TableCell className="text-sm font-semibold">{row.unitName}</TableCell>
                  <TableCell className="text-sm text-[#6b7280]">{row.projectName}</TableCell>
                  <TableCell>{saleStatusBadge(row.saleStatus)}</TableCell>
                  <TableCell className="text-xs text-[#6b7280]">
                    {row.saleDate ? format(parseISO(row.saleDate), 'dd MMM yyyy') : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-right">{formatCurrency(row.finalSaleValue)}</TableCell>
                  <TableCell className="text-sm text-right text-emerald-700 font-semibold">
                    {formatCurrency(row.totalReceived)}
                  </TableCell>
                  <TableCell className={cn(
                    "text-sm text-right font-semibold",
                    isCancelled ? "text-[#9ca3af]" :
                    overpaid ? "text-amber-700" : row.outstanding > 0 ? "text-rose-700" : "text-emerald-700"
                  )}>
                    {isCancelled
                      ? '—'
                      : overpaid ? `+${formatCurrency(Math.abs(row.outstanding))}` : formatCurrency(row.outstanding)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to={`/sales/${row.saleId}`}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Installments (per-sale schedules) */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <div className="px-5 py-3 border-b border-[#e5e7eb] flex items-center gap-2">
          <CalendarClock className="h-3.5 w-3.5 text-[#2563eb]" />
          <p className="text-xs font-black uppercase tracking-widest">
            Installments ({scheduleGroups.length})
          </p>
        </div>
        {scheduleGroups.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No installment schedules on any active sale.
          </div>
        ) : (
          <div className="divide-y divide-[#e5e7eb]">
            {scheduleGroups.map(g => {
              // Partition: PAID rows get collapsed behind a summary row so
              // the active work (PENDING / PARTIALLY_PAID / overdue) is
              // what the eye lands on. WAIVED / CANCELLED stay in the
              // active list — they carry audit context an admin may want
              // to see at a glance.
              const activeRows = g.schedules.filter(s => s.status !== 'PAID');
              const paidRows = g.schedules.filter(s => s.status === 'PAID');
              const paidTotal = paidRows.reduce((s, r) => s + (r.amount || 0), 0);
              const expanded = !!paidExpanded[g.saleId];
              return (
                <div key={g.saleId}>
                  <div className="px-5 py-3 bg-[#f9fafb] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/sales/${g.saleId}`}
                        className="text-sm font-bold text-[#111827] hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        {g.unitName} <ExternalLink className="h-3 w-3" />
                      </Link>
                      <span className="text-xs text-[#6b7280]">· {g.projectName}</span>
                      {saleStatusBadge(g.saleStatus)}
                      {g.totalBalance === 0 && g.totalScheduled > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Fully Paid
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-[#6b7280]">
                        Scheduled <strong className="text-[#111827]">{formatCurrency(g.totalScheduled)}</strong>
                      </span>
                      <span className="text-[#6b7280]">
                        Paid <strong className="text-emerald-700">{formatCurrency(g.totalPaid)}</strong>
                      </span>
                      <span className="text-[#6b7280]">
                        Balance <strong className={cn(g.totalBalance > 0 ? 'text-rose-700' : 'text-emerald-700')}>
                          {formatCurrency(g.totalBalance)}
                        </strong>
                      </span>
                      {g.totalOverdue > 0 && (
                        <span className="text-[#6b7280]">
                          Overdue <strong className="text-rose-700">{formatCurrency(g.totalOverdue)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeRows.length === 0 && paidRows.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-xs text-center text-emerald-800 bg-emerald-50/40 py-3">
                            All installments paid.
                          </TableCell>
                        </TableRow>
                      )}
                      {activeRows.map(sch => {
                        const meta = g.rowMeta[sch.id];
                        return (
                          <TableRow
                            key={sch.id}
                            className={cn(meta?.isOverdue && 'bg-rose-50/50')}
                          >
                            <TableCell className="text-xs font-bold">{sch.installmentNo}</TableCell>
                            <TableCell className="text-xs text-[#6b7280]">{sch.scheduleType}</TableCell>
                            <TableCell className="text-xs">
                              {sch.dueDate ? format(parseISO(sch.dueDate), 'dd MMM yyyy') : '—'}
                              {meta?.isOverdue && (
                                <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-rose-700">
                                  Overdue
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-right">{formatCurrency(sch.amount)}</TableCell>
                            <TableCell className="text-sm text-right text-emerald-700 font-semibold">
                              {formatCurrency(sch.paidAmount || 0)}
                            </TableCell>
                            <TableCell className={cn(
                              'text-sm text-right font-semibold',
                              (meta?.balance ?? 0) > 0 ? 'text-rose-700' : 'text-emerald-700'
                            )}>
                              {formatCurrency(meta?.balance ?? 0)}
                            </TableCell>
                            <TableCell>{scheduleStatusBadge(sch.status)}</TableCell>
                          </TableRow>
                        );
                      })}
                      {paidRows.length > 0 && (
                        <TableRow
                          className="bg-emerald-50/40 hover:bg-emerald-100/60 cursor-pointer"
                          onClick={() => togglePaid(g.saleId)}
                        >
                          <TableCell colSpan={7} className="py-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800"
                            >
                              {expanded
                                ? <ChevronDown className="h-3.5 w-3.5" />
                                : <ChevronRight className="h-3.5 w-3.5" />}
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {paidRows.length} paid installment{paidRows.length > 1 ? 's' : ''}
                              <span className="text-emerald-700 font-semibold ml-1">
                                · {formatCurrency(paidTotal)}
                              </span>
                              <span className="text-[10px] font-normal text-emerald-700/80 ml-1">
                                ({expanded ? 'hide' : 'show'})
                              </span>
                            </button>
                          </TableCell>
                        </TableRow>
                      )}
                      {expanded && paidRows.map(sch => (
                        <TableRow key={sch.id} className="bg-emerald-50/30">
                          <TableCell className="text-xs font-bold text-emerald-900">{sch.installmentNo}</TableCell>
                          <TableCell className="text-xs text-emerald-800/80">{sch.scheduleType}</TableCell>
                          <TableCell className="text-xs text-emerald-800/80">
                            {sch.dueDate ? format(parseISO(sch.dueDate), 'dd MMM yyyy') : '—'}
                          </TableCell>
                          <TableCell className="text-sm text-right text-emerald-900">{formatCurrency(sch.amount)}</TableCell>
                          <TableCell className="text-sm text-right text-emerald-700 font-semibold">
                            {formatCurrency(sch.paidAmount || 0)}
                          </TableCell>
                          <TableCell className="text-sm text-right text-emerald-700 font-semibold">
                            {formatCurrency(0)}
                          </TableCell>
                          <TableCell>{scheduleStatusBadge(sch.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction stream */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <div className="px-5 py-3 border-b border-[#e5e7eb]">
          <p className="text-xs font-black uppercase tracking-widest">Transactions ({transactions.length})</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb]">
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-20 text-center text-muted-foreground text-sm">
                No transactions yet.
              </TableCell></TableRow>
            ) : transactions.map((t, i) => <TxRow key={`${t.saleId}-${t.receiptId || t.kind}-${i}`} tx={t} />)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function TxRow({ tx }: { tx: LedgerTx }) {
  const icon =
    tx.kind === 'SALE' ? <ArrowUpCircle className="h-3.5 w-3.5 text-blue-600" /> :
    tx.kind === 'RECEIPT' ? <ArrowDownCircle className="h-3.5 w-3.5 text-emerald-600" /> :
    <XCircle className="h-3.5 w-3.5 text-rose-600" />;
  const typeLabel =
    tx.kind === 'SALE' ? 'Sale' :
    tx.kind === 'RECEIPT' ? 'Receipt' :
    'Cancelled';
  return (
    <TableRow>
      <TableCell className="text-xs text-[#6b7280]">
        {tx.date ? format(parseISO(tx.date), 'dd MMM yyyy') : '—'}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
          {icon}{typeLabel}
        </span>
      </TableCell>
      <TableCell className="text-sm">
        <Link to={`/sales/${tx.saleId}`} className="hover:text-blue-700">{tx.unitName}</Link>
      </TableCell>
      <TableCell className="text-xs text-[#6b7280]">{tx.description}</TableCell>
      <TableCell className="text-right text-sm font-semibold text-rose-700">
        {tx.debit > 0 ? formatCurrency(tx.debit) : ''}
      </TableCell>
      <TableCell className="text-right text-sm font-semibold text-emerald-700">
        {tx.credit > 0 ? formatCurrency(tx.credit) : ''}
      </TableCell>
    </TableRow>
  );
}

function SummaryCard({ label, value, accent, hint }: { label: string; value: string; accent?: string; hint?: string }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">{label}</p>
      <p className={cn('text-lg font-black mt-1', accent || 'text-[#111827]')}>{value}</p>
      {hint && <p className="text-[9px] text-[#9ca3af] mt-0.5 uppercase font-bold tracking-widest">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Receipts subscription helper. Reads ALL saleReceipts live — the
// ledger page filters to this customer's sales in the aggregator.
// The collection is small in practice; one listener is simpler than
// chunking `in` queries across sale ids.
// ─────────────────────────────────────────────────────────────────────
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

function subscribeAllReceipts(callback: (receipts: SaleReceipt[]) => void) {
  const q = query(collection(db, 'saleReceipts'));
  return onSnapshot(q, (snap) => {
    const receipts = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SaleReceipt, 'id'>) }));
    callback(receipts);
  });
}
