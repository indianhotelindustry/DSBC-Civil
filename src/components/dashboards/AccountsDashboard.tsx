import React, { useMemo, useState } from 'react';
import { 
  Receipt, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CreditCard, 
  CheckCircle2, 
  Search, 
  MoreVertical,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  History,
  FileText,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { 
  Project, 
  WorkOrder, 
  Bill, 
  Contractor, 
  Payment 
} from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { formatCurrency, cn } from '../../lib/utils';
import { KPICard } from '../KPICard';
import { SafeChart } from '../SafeChart';
import { isAfter, isBefore, startOfDay, endOfDay, addDays, parseISO, isSameDay } from 'date-fns';
import { PaymentCalendar } from '../PaymentCalendar';
import {
  pendingBills as getPendingBills,
  releasedPayments as getReleasedPayments,
  payableInWindow,
  overdueAmount as calcOverdueAmount,
  overdueBillsList,
  dueTodayBillsList,
  dueTodayAmount,
  dailyForecast,
  agingAnalysis as calcAgingAnalysis,
  calculateContractorFinancials,
  woGrossValue,
  activeWorkOrders,
} from '../../lib/financialCalcs';
import { getEffectiveCompanyScope, isInScope } from '../../lib/userAccess';
import { useAuth } from '../../context/AuthContext';
import { PaymentRequest } from '../../types';
import { paymentRequestService } from '../../services/paymentRequestService';
import { Wallet } from 'lucide-react';

interface AccountsDashboardProps {
  projects: Project[];
  workOrders: WorkOrder[];
  bills: Bill[];
  contractors: Contractor[];
  payments: Payment[];
}

export const AccountsDashboard: React.FC<AccountsDashboardProps> = ({
  projects,
  workOrders: rawWorkOrders,
  bills: rawBills,
  contractors,
  payments: rawPayments
}) => {
  const now = new Date();
  const today = startOfDay(now);
  const next7Days = endOfDay(addDays(today, 7));

  // ── Multi-company scoping ─────────────────────────────────────────
  // ADMIN/CEO see everything; ACCOUNTS and other scoped roles see only
  // data tied to their assignedCompanyIds. Legacy single `companyId`
  // is folded in via getAssignedCompanyIds. Filter chain:
  //   WorkOrders → directly scoped by wo.companyId
  //   Bills      → scoped via bill.workOrderId ∈ scoped WO ids
  //   Payments   → scoped via payment.billId ∈ scoped bill ids
  // Result: every downstream aggregate reads only in-scope data.
  const { profile } = useAuth();
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);

  const workOrders = useMemo(() => {
    if (scope.unrestricted) return rawWorkOrders;
    const ids = new Set(scope.ids);
    return rawWorkOrders.filter(wo => wo.companyId && ids.has(wo.companyId));
  }, [rawWorkOrders, scope]);

  const bills = useMemo(() => {
    if (scope.unrestricted) return rawBills;
    const woIds = new Set(workOrders.map(wo => wo.id));
    return rawBills.filter(b => woIds.has(b.workOrderId));
  }, [rawBills, workOrders, scope]);

  const payments = useMemo(() => {
    if (scope.unrestricted) return rawPayments;
    const billIds = new Set(bills.map(b => b.id));
    return rawPayments.filter(p => billIds.has(p.billId));
  }, [rawPayments, bills, scope]);

  // --- Pipeline KPIs (PM → Accounts → Finance visibility) ---
  // Reads from the already-scoped lists above so every count reflects
  // the user's assignedCompanyIds — no extra filtering.
  const woCreated = workOrders.length;
  const woApproved = workOrders.filter(wo => wo.status === 'APPROVED').length;
  const billsCreated = bills.length;
  const billsApproved = bills.filter(b => b.status === 'APPROVED' || b.status === 'PARTIALLY_PAID' || b.status === 'PAID').length;
  const paymentsPending = payments.filter(p => p.status !== 'RELEASED').length;
  const paymentsReleased = payments.filter(p => p.status === 'RELEASED').length;

  // --- Pipeline gaps (action-driven) ---
  // "WOs pending billing"   = approved WOs that have no bill attached.
  // "Bills pending payment" = bills past approval that are not fully paid.
  // These are more precise than raw count-minus-count because a single WO
  // can carry multiple bills and some bills are only partially paid.
  const woIdsWithBills = useMemo(() => new Set(bills.map(b => b.workOrderId)), [bills]);
  const approvedWOsPendingBilling = useMemo(
    () => workOrders.filter(wo => wo.status === 'APPROVED' && !woIdsWithBills.has(wo.id)).length,
    [workOrders, woIdsWithBills]
  );
  const billsPendingPayment = useMemo(
    () => bills.filter(b => b.status === 'APPROVED' || b.status === 'PARTIALLY_PAID').length,
    [bills]
  );

  // --- Work Order value metrics (GROSS BOQ values) ---
  // These cards answer "how much work is on our books?" — they must
  // read the GROSS BOQ total (financials.totalAmount), NOT the net
  // grandTotal which is the remaining-payable after advance, GST,
  // retention and other-charges are applied. Using grandTotal here
  // caused the Dashboard to surface ₹6,800 on a ₹21,000 BOQ.
  //
  // totalWOValue       = Σ woGrossValue over active scoped WOs (≠ REJECTED)
  // approvedWOValue    = Σ woGrossValue over scoped WOs in {APPROVED, COMPLETED}
  // pendingBillingValue= Σ woGrossValue over approved scoped WOs with no bill yet
  const totalWOValue = useMemo(
    () => activeWorkOrders(workOrders).reduce((sum, wo) => sum + woGrossValue(wo), 0),
    [workOrders]
  );
  const approvedWOValue = useMemo(
    () => workOrders
      .filter(wo => wo.status === 'APPROVED' || wo.status === 'COMPLETED')
      .reduce((sum, wo) => sum + woGrossValue(wo), 0),
    [workOrders]
  );
  const pendingBillingValue = useMemo(
    () => workOrders
      .filter(wo => wo.status === 'APPROVED' && !woIdsWithBills.has(wo.id))
      .reduce((sum, wo) => sum + woGrossValue(wo), 0),
    [workOrders, woIdsWithBills]
  );

  // --- Payment Requests — Accounts execution surface ---
  // Live-subscribed with the same company scope the rest of this
  // dashboard uses, so an Accounts user only sees requests on their
  // assigned companies.
  const [rawPaymentRequests, setRawPaymentRequests] = React.useState<PaymentRequest[]>([]);
  React.useEffect(() => {
    const unsub = paymentRequestService.getAll(setRawPaymentRequests);
    return () => unsub();
  }, []);
  const scopedPaymentRequests = useMemo(
    () => rawPaymentRequests.filter(r => isInScope(scope, r.companyId)),
    [rawPaymentRequests, scope]
  );
  const approvedAwaitingReqs = scopedPaymentRequests.filter(r => r.status === 'APPROVED');
  const approvedAwaitingAmount = approvedAwaitingReqs.reduce((s, r) => s + (r.requestedAmount || 0), 0);

  // "Paid Today" = requests whose paidAt falls on today's calendar
  // date. Uses the same `today` anchor the rest of this dashboard
  // already computed (startOfDay(now)).
  const paidTodayReqs = scopedPaymentRequests.filter(r => {
    if (r.status !== 'PAID' || !r.paidAt) return false;
    return r.paidAt.slice(0, 10) === today.toISOString().slice(0, 10);
  });
  const paidTodayAmount = paidTodayReqs.reduce((s, r) => s + (r.requestedAmount || 0), 0);

  // --- KPI Calculations (using centralized functions) ---
  const billsPendingVerification = bills.filter(b => b.status === 'DRAFT').length;
  const billsApprovedUnpaid = bills.filter(b => b.status === 'APPROVED').length;

  // Due Today and Overdue are mutually exclusive (classification):
  //   billDate < today → overdueBills / overdueAmt
  //   billDate == today → dueTodayBills / paymentsDueToday
  // Next 7 Days is a wider window and may overlap with both — intended.
  const dueTodayBills = dueTodayBillsList(bills, now);
  const paymentsDueToday = dueTodayAmount(bills, now);
  const paymentsDue7Days = payableInWindow(bills, today, next7Days);

  const overdueBills = overdueBillsList(bills, now);
  const overdueAmt = calcOverdueAmount(bills, now);

  const totalPaid = getReleasedPayments(payments).reduce((sum, p) => sum + p.amount, 0);
  const totalBilled = bills.reduce((sum, b) => sum + b.netPayable, 0);
  const outstandingPayable = totalBilled - totalPaid;

  // --- Payment Planning Data ---
  const weeklyForecast = useMemo(() => dailyForecast(bills, 7, 'EEE'), [bills]);

  // --- Aging Analysis ---
  const agingAnalysis = useMemo(() => calcAgingAnalysis(bills), [bills]);

  // --- Action Required — single highest-priority next step ---
  // Resolved in a fixed priority order so the top card is always the
  // one piece of advice that moves the pipeline forward the most.
  // Pure derivation from data already on this component; changes as
  // underlying counts update live.
  const actionItem = useMemo(() => {
    // Scope-empty guard first — no amount of advice matters if the
    // user has no companies assigned.
    if (!scope.unrestricted && scope.ids.length === 0) {
      return {
        tone: 'amber' as const,
        title: 'No company assigned to your profile',
        body: 'Ask an admin to assign one in User Management. The dashboard will populate automatically once access is granted.',
      };
    }
    if (woCreated === 0) {
      return {
        tone: 'slate' as const,
        title: 'No work orders in your assigned companies yet',
        body: 'Once a PM or Admin creates the first work order, it will appear here along with bills and payments that follow.',
      };
    }
    if (overdueBills.length > 0) {
      return {
        tone: 'red' as const,
        title: `${overdueBills.length} overdue bill${overdueBills.length > 1 ? 's' : ''} need action`,
        body: 'These are past their bill date. Escalate with the contractor or release payment to clear them.',
      };
    }
    if (billsApprovedUnpaid > 0) {
      return {
        tone: 'blue' as const,
        title: `${billsApprovedUnpaid} approved bill${billsApprovedUnpaid > 1 ? 's' : ''} ready to release`,
        body: 'Open the Payments page to record the release against each approved bill.',
      };
    }
    if (approvedWOsPendingBilling > 0) {
      return {
        tone: 'amber' as const,
        title: `${approvedWOsPendingBilling} approved work order${approvedWOsPendingBilling > 1 ? 's' : ''} pending billing · ${formatCurrency(pendingBillingValue)} pending bill value`,
        body: 'Create the first bill for each so the payment pipeline can flow.',
      };
    }
    if (billsPendingVerification > 0) {
      return {
        tone: 'sky' as const,
        title: `${billsPendingVerification} bill${billsPendingVerification > 1 ? 's' : ''} awaiting verification`,
        body: 'The assigned Project Manager needs to verify these before CEO/Admin can approve.',
      };
    }
    if (billsCreated === 0 && woApproved > 0) {
      return {
        tone: 'amber' as const,
        title: 'No bills created yet',
        body: `${woApproved} work order${woApproved > 1 ? 's are' : ' is'} approved. Raise the first bill on the Bills page.`,
      };
    }
    return {
      tone: 'emerald' as const,
      title: 'All clear — no pending action',
      body: 'Every approved work order has a bill, every approved bill has been released, and nothing is overdue.',
    };
  }, [scope, woCreated, woApproved, overdueBills.length, billsApprovedUnpaid, approvedWOsPendingBilling, pendingBillingValue, billsPendingVerification, billsCreated]);

  const actionTones: Record<string, { card: string; iconWrap: string; icon: string; title: string }> = {
    red:     { card: 'border-red-200 bg-red-50',         iconWrap: 'bg-red-100',     icon: 'text-red-600',     title: 'text-red-900' },
    amber:   { card: 'border-amber-200 bg-amber-50',     iconWrap: 'bg-amber-100',   icon: 'text-amber-600',   title: 'text-amber-900' },
    blue:    { card: 'border-blue-200 bg-blue-50',       iconWrap: 'bg-blue-100',    icon: 'text-blue-600',    title: 'text-blue-900' },
    sky:     { card: 'border-sky-200 bg-sky-50',         iconWrap: 'bg-sky-100',     icon: 'text-sky-600',     title: 'text-sky-900' },
    slate:   { card: 'border-slate-200 bg-slate-50',     iconWrap: 'bg-slate-100',   icon: 'text-slate-600',   title: 'text-slate-900' },
    emerald: { card: 'border-emerald-200 bg-emerald-50', iconWrap: 'bg-emerald-100', icon: 'text-emerald-600', title: 'text-emerald-900' },
  };
  const tone = actionTones[actionItem.tone];

  // --- Reconciliation Alerts (Simulated/Calculated) ---
  const duplicateAlerts = useMemo(() => {
    const seenNumbers = new Set();
    const duplicates = [];
    bills.forEach(b => {
        if (seenNumbers.has(b.billNumber)) {
            duplicates.push(b);
        }
        seenNumbers.add(b.billNumber);
    });
    return duplicates;
  }, [bills]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Action Required — single highest-priority next step. Always
          present; content + tone change with state. */}
      <div className={cn('rounded-xl border p-4 flex items-start gap-4', tone.card)}>
        <div className={cn('p-2 rounded-lg shrink-0', tone.iconWrap)}>
          <AlertCircle className={cn('h-5 w-5', tone.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-[10px] font-black uppercase tracking-widest mb-1', tone.title)}>Action Required</p>
          <p className={cn('text-sm font-black', tone.title)}>{actionItem.title}</p>
          <p className="text-xs text-[#4b5563] mt-0.5">{actionItem.body}</p>
        </div>
      </div>

      {/* Pipeline Overview — PM → Accounts → Finance visibility.
          Every count reads from the already-scoped lists above so an
          ACCOUNTS user sees only their assignedCompanyIds. */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Pipeline Overview</h3>
          {/* Gap chips — tell the user exactly where the pipeline is
              stuck. Only render chips whose count is > 0 so a healthy
              pipeline shows a clean header. */}
          <div className="flex flex-wrap gap-2">
            {approvedWOsPendingBilling > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {approvedWOsPendingBilling} WO{approvedWOsPendingBilling > 1 ? 's' : ''} pending billing
              </span>
            )}
            {billsPendingPayment > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {billsPendingPayment} bill{billsPendingPayment > 1 ? 's' : ''} pending payment
              </span>
            )}
            {approvedWOsPendingBilling === 0 && billsPendingPayment === 0 && woCreated > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Pipeline flowing
              </span>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KPICard title="Work Orders Created" value={woCreated} icon={FileText} color="bg-slate-100 text-slate-700" isCurrency={false} href="/work-orders" />
          <KPICard title="Approved Work Orders" value={woApproved} icon={ShieldCheck} color="bg-emerald-50 text-emerald-700" isCurrency={false} href="/work-orders?status=APPROVED" />
          <KPICard title="Bills Created" value={billsCreated} icon={Receipt} color="bg-sky-50 text-sky-700" isCurrency={false} href="/bills" />
          <KPICard title="Bills Approved" value={billsApproved} icon={CheckCircle2} color="bg-blue-50 text-blue-700" isCurrency={false} href="/bills?status=APPROVED" />
          <KPICard title="Payments Pending" value={paymentsPending} icon={Clock} color="bg-amber-50 text-amber-700" isCurrency={false} href="/payments" />
          <KPICard title="Payments Released" value={paymentsReleased} icon={CreditCard} color="bg-emerald-50 text-emerald-700" isCurrency={false} href="/payments" />
          {/* Value row — same scoped WO list, just the money side. Kept
              as separate cards rather than subtext so the currency reads
              at the same visual weight as the counts above. */}
          <KPICard title="Total Work Order Value" value={totalWOValue} icon={FileText} color="bg-slate-100 text-slate-700" href="/work-orders" />
          <KPICard title="Approved Work Order Value" value={approvedWOValue} icon={ShieldCheck} color="bg-emerald-50 text-emerald-700" href="/work-orders?status=APPROVED" />
          <KPICard title="WOs Pending Billing Value" value={pendingBillingValue} icon={AlertCircle} color="bg-amber-50 text-amber-700" href="/work-orders?status=APPROVED" />
        </div>
      </div>

      {/* Payment Requests — Accounts execution surface. Approved awaiting
          payment is the queue (amber when non-empty to draw attention);
          Paid Today is the day's receipts. Both scoped to this user's
          assigned companies. */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-[#6b7280] mb-3">Payment Requests</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Approved — Awaiting Payment"
            value={approvedAwaitingAmount}
            icon={Wallet}
            color={approvedAwaitingReqs.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'}
            href="/payment-requests?status=APPROVED"
          />
          <KPICard
            title="Approved — Count"
            value={approvedAwaitingReqs.length}
            icon={Wallet}
            color={approvedAwaitingReqs.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'}
            isCurrency={false}
            href="/payment-requests?status=APPROVED"
          />
          <KPICard title="Paid Today" value={paidTodayAmount} icon={CheckCircle2} color="bg-emerald-50 text-emerald-700" href="/payment-requests?status=PAID" />
          <KPICard title="Paid Today — Count" value={paidTodayReqs.length} icon={CheckCircle2} color="bg-emerald-50 text-emerald-700" isCurrency={false} href="/payment-requests?status=PAID" />
        </div>
      </div>

      {/* Section 1: Top KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard title="Pending Verification" value={billsPendingVerification} icon={Receipt} color="bg-sky-50 text-sky-700" isCurrency={false} />
        <KPICard title="Approved Unpaid" value={billsApprovedUnpaid} icon={CheckCircle2} color="bg-blue-50 text-blue-700" isCurrency={false} />
        <KPICard title="Overdue Payments" value={overdueAmt} icon={AlertTriangle} color="bg-red-50 text-red-700" />
        <KPICard title="Due Today" value={paymentsDueToday} icon={Calendar} color="bg-amber-50 text-amber-700" />
        <KPICard title="Next 7 Days" value={paymentsDue7Days} icon={Clock} color="bg-indigo-50 text-indigo-700" />
        <KPICard title="Total Outstanding" value={outstandingPayable} icon={CreditCard} color="bg-slate-100 text-slate-800" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Section 2: Due and Overdue Payments Table */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50 py-4">
             <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827] flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#2563eb]" />
                  Priority Payment Schedule
                </CardTitle>
                <Badge variant="outline" className="text-[9px] font-black uppercase">Real-time sync</Badge>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="overdue" className="w-full">
               <TabsList className="w-full justify-start h-12 bg-slate-50 rounded-none border-b border-slate-100 px-6 gap-6">
                 <TabsTrigger value="overdue" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full text-[10px] font-black uppercase tracking-widest px-0 text-red-600">
                   Overdue ({overdueBills.length})
                 </TabsTrigger>
                 <TabsTrigger value="today" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full text-[10px] font-black uppercase tracking-widest px-0 text-amber-600">
                   Due Today ({dueTodayBills.length})
                 </TabsTrigger>
                 <TabsTrigger value="7days" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full text-[10px] font-black uppercase tracking-widest px-0">
                   Next 7 Days ({bills.filter(b => b.status !== 'PAID' && b.status !== 'REJECTED' && isAfter(parseISO(b.billDate), today) && isBefore(parseISO(b.billDate), next7Days)).length})
                 </TabsTrigger>
               </TabsList>

               <TabsContent value="overdue" className="m-0 p-0 animate-in fade-in duration-300">
                  <PaymentList bills={overdueBills} projects={projects} workOrders={workOrders} isOverdue />
               </TabsContent>
               <TabsContent value="today" className="m-0 p-0 animate-in fade-in duration-300">
                  <PaymentList bills={dueTodayBills} projects={projects} workOrders={workOrders} isDueToday />
               </TabsContent>
               <TabsContent value="7days" className="m-0 p-0 animate-in fade-in duration-300">
                  <PaymentList bills={bills.filter(b => b.status !== 'PAID' && b.status !== 'REJECTED' && isAfter(parseISO(b.billDate), today) && isBefore(parseISO(b.billDate), next7Days))} projects={projects} workOrders={workOrders} />
               </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Section 5: Payment Planning Quick Stats */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827] flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-[#2563eb]" />
              7-Day Outflow Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="h-[200px]">
                <SafeChart minHeight={180}>
                  <AreaChart data={weeklyForecast}>
                    <defs>
                      <linearGradient id="accountsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} hide />
                    <Tooltip contentStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fill="url(#accountsGradient)" />
                  </AreaChart>
                </SafeChart>
             </div>
             
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <span className="text-[10px] font-black uppercase text-slate-500">Weekly Total</span>
                 <span className="text-sm font-black">{formatCurrency(paymentsDue7Days)}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                 <span className="text-[10px] font-black uppercase text-red-600">Critical Overdue</span>
                 <span className="text-sm font-black text-red-600">{formatCurrency(overdueAmt)}</span>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Section 3: Bill Verification Queue */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827] flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2 text-[#2563eb]" />
              Bill Verification Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
               <TableHeader className="bg-[#f9fafb]">
                 <TableRow className="hover:bg-transparent">
                   <TableHead className="text-[10px] font-black uppercase px-6 py-3">Bill Ref</TableHead>
                   <TableHead className="text-[10px] font-black uppercase px-6 py-3">Contractor</TableHead>
                   <TableHead className="text-[10px] font-black uppercase px-6 py-3">Project</TableHead>
                   <TableHead className="text-[10px] font-black uppercase px-6 py-3 text-right">Net Payable</TableHead>
                   <TableHead className="text-[10px] font-black uppercase px-6 py-3 text-center">Status</TableHead>
                   <TableHead className="text-[10px] font-black uppercase px-6 py-3 text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {bills.filter(b => b.status === 'DRAFT' || b.status === 'VERIFIED').slice(0, 5).map(b => {
                   const project = projects.find(p => p.id === workOrders.find(wo => wo.id === b.workOrderId)?.projectId);
                   const contractor = contractors.find(c => c.id === workOrders.find(wo => wo.id === b.workOrderId)?.contractorId);
                   return (
                     <TableRow key={b.id} className="border-b border-slate-50 last:border-0">
                        <TableCell className="px-6 py-4">
                           <p className="text-xs font-black">{b.billNumber}</p>
                           <p className="text-[9px] text-slate-400">{b.billDate}</p>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs font-bold">{contractor?.name || 'Unknown'}</TableCell>
                        <TableCell className="px-6 py-4 text-xs truncate max-w-[120px]">{project?.name || 'Unknown'}</TableCell>
                        <TableCell className="px-6 py-4 font-mono text-xs text-right font-black">{formatCurrency(b.netPayable)}</TableCell>
                        <TableCell className="px-6 py-4 text-center">
                           <Badge variant="outline" className={cn(
                             "text-[8px] font-black uppercase",
                             b.status === 'VERIFIED' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-500 border-slate-200"
                           )}>
                             {b.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          {/* Verification is a Project Manager action — Accounts
                              cannot verify bills (rules line 210 blocks it).
                              Showing a subtle note keeps the column informative
                              without a dead button that would toast an error. */}
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#9ca3af]">
                            Awaits PM
                          </span>
                        </TableCell>
                     </TableRow>
                   )
                 })}
                 {bills.filter(b => b.status === 'DRAFT' || b.status === 'VERIFIED').length === 0 && (
                   <TableRow>
                     <TableCell colSpan={6} className="text-center py-8 text-sm">
                       {billsCreated === 0
                         ? (woApproved > 0
                           ? <span className="text-[#6b7280]">No bills created yet. Open the Bills page to raise the first bill against an approved work order.</span>
                           : <span className="text-[#6b7280]">No bills yet — waiting for approved work orders.</span>)
                         : <span className="text-[#6b7280]">All bills verified and approved. No pending verification action.</span>}
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
          </CardContent>
        </Card>

        {/* Section 4: Aging analysis & Contractor outstanding */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
           <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827] flex items-center">
                <History className="h-4 w-4 mr-2 text-[#2563eb]" />
                Outstanding Aging
              </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
              {(() => {
                // Resolve contractor outstandings once so both the
                // zero-check AND the rendered list read the same values.
                const contractorOutstandings = contractors.slice(0, 4).map(c => ({
                  c,
                  cf: calculateContractorFinancials(c, workOrders, bills, payments),
                }));
                const agingAllZero = agingAnalysis.every(a => !a.amount);
                const noContractorOutstanding = contractorOutstandings.every(({ cf }) => !cf.outstanding);
                if (agingAllZero && noContractorOutstanding) {
                  // Fully clean — replace chart + list with a reassuring
                  // message so the card doesn't render as a dead stub.
                  return (
                    <div className="py-16 text-center px-6">
                      <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-emerald-500" />
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-800">No Outstanding Payables</p>
                      <p className="text-[11px] text-[#6b7280] mt-1">
                        Every bill in your scope is either unbilled work, fully paid, or not yet past its bill date.
                      </p>
                    </div>
                  );
                }
                return (
                  <>
                    <div className="p-6 pt-0">
                      <div className="h-[150px] mb-6">
                        <SafeChart minHeight={150}>
                          <BarChart data={agingAnalysis}>
                            <XAxis dataKey="range" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </SafeChart>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-50 border-t border-slate-50">
                      {contractorOutstandings.map(({ c, cf }) => (
                        <div key={c.id} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="text-xs font-bold text-[#111827]">{c.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black">Contractor Ref: {c.id.slice(0, 6)}</p>
                          </div>
                          <p className="text-xs font-black text-[#111827]">{formatCurrency(cf.outstanding)}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         {/* Section 6: Reconciliation and Alerts */}
         <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827] flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-[#2563eb]" />
                Compliance & Reconciliation Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {duplicateAlerts.length > 0 && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
                   <div className="p-2 bg-red-100 rounded-lg shrink-0">
                     <AlertCircle className="h-5 w-5 text-red-600" />
                   </div>
                   <div>
                     <p className="text-xs font-black text-red-800 uppercase tracking-widest">Duplicate Bill Numbers Detected</p>
                     <p className="text-[10px] text-red-600 mt-1">Found {duplicateAlerts.length} potential duplicate bill entries in the system.</p>
                     <div className="mt-3 flex gap-2">
                        <Button size="xs" variant="outline" className="text-[8px] font-black uppercase border-red-200 hover:bg-red-100">Review Items</Button>
                        <Button size="xs" variant="ghost" className="text-[8px] font-black uppercase text-red-700">Dismiss</Button>
                     </div>
                   </div>
                 </div>
               )}
               
               {duplicateAlerts.length === 0 && (
                 <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
                   <div className="p-2 bg-emerald-100 rounded-lg shrink-0">
                     <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                   </div>
                   <div>
                     <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">No Issues Detected</p>
                     <p className="text-[10px] text-emerald-600 mt-1">All bill numbers and payment amounts are consistent.</p>
                   </div>
                 </div>
               )}
            </CardContent>
         </Card>

         {/* Recent Payment Activity Snapshot */}
         <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827] flex items-center">
                <Clock className="h-4 w-4 mr-2 text-[#2563eb]" />
                Recent Cash Activity
              </CardTitle>
              <Badge variant="secondary" className="text-[9px] font-black">Last 10 Actions</Badge>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                   {(() => {
                     const releasedList = payments.filter(p => p.status === 'RELEASED').slice(0, 5);
                     if (releasedList.length === 0) {
                       // Contextual empty state — tells the user WHY it's
                       // empty and what needs to happen next, rather than
                       // a generic "No entries".
                       const msg = billsApprovedUnpaid > 0
                         ? `${billsApprovedUnpaid} approved bill${billsApprovedUnpaid > 1 ? 's are' : ' is'} ready for release. None have been processed yet.`
                         : billsCreated === 0
                           ? 'No bills have been created in your scope yet — nothing to release.'
                           : 'No payments released yet. Releases will appear here once approved bills are processed.';
                       return (
                         <div className="py-12 text-center px-6">
                           <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                           <p className="text-[11px] text-[#6b7280]">{msg}</p>
                         </div>
                       );
                     }
                     return releasedList.map(p => {
                       const contractor = contractors.find(c => c.id === workOrders.find(wo => wo.id === bills.find(b => b.id === p.billId)?.workOrderId)?.contractorId);
                       return (
                         <div key={p.id} className="p-4 px-6 flex justify-between items-center bg-slate-50/20">
                           <div className="flex items-center gap-3">
                             <div className="p-1.5 bg-emerald-50 rounded-md">
                               <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                             </div>
                             <div>
                               <p className="text-[11px] font-bold text-[#111827]">{contractor?.name || 'Contractor'}</p>
                               <p className="text-[9px] text-slate-400 uppercase font-black">{p.createdAt.slice(0, 10)}</p>
                             </div>
                           </div>
                           <p className="text-xs font-black text-emerald-600">+{formatCurrency(p.amount)}</p>
                         </div>
                       );
                     });
                   })()}
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

const PaymentList = ({ bills, projects, workOrders, isOverdue = false, isDueToday = false }: { bills: Bill[], projects: Project[], workOrders: WorkOrder[], isOverdue?: boolean, isDueToday?: boolean }) => {
    // Visual theme by classification (mutually exclusive): Overdue (red) > Due Today (amber) > Upcoming (blue).
    const iconWrapClass = isOverdue ? "bg-red-50" : isDueToday ? "bg-amber-50" : "bg-blue-50";
    const iconClass = isOverdue ? "text-red-600" : isDueToday ? "text-amber-600" : "text-blue-600";
    const dueLabelClass = isOverdue ? "text-red-500" : isDueToday ? "text-amber-600" : "text-amber-500";
    const dueLabelText = isOverdue ? "Overdue" : isDueToday ? "Due Today" : "Due";
    return (
        <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
            {bills.map((bill) => (
                <div key={bill.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-lg", iconWrapClass)}>
                            <Clock className={cn("h-4 w-4", iconClass)} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-[#111827]">{bill.billNumber}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                  {(projects.find(p => p.id === workOrders.find(wo => wo.id === bill.workOrderId)?.projectId)?.name) || 'Project'}
                                </span>
                                <span className="text-slate-200">|</span>
                                <span className={cn("text-[8px] font-black uppercase", dueLabelClass)}>
                                    {dueLabelText}: {bill.billDate}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-[#111827]">{formatCurrency(bill.netPayable)}</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-black uppercase text-blue-600">Release Payment</Button>
                    </div>
                </div>
            ))}
            {bills.length === 0 && (
                <div className="py-16 text-center px-6">
                    <History className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">
                      {isOverdue
                        ? 'No overdue bills — you are current.'
                        : isDueToday
                          ? 'Nothing due today.'
                          : 'No bills due in the next 7 days.'}
                    </p>
                </div>
            )}
        </div>
    )
}
