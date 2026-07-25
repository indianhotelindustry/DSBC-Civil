import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  CheckCircle2,
  Briefcase,
  Users,
  FileText,
  Zap,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Download,
  AlertTriangle,
  CreditCard,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Project,
  WorkOrder,
  Bill,
  Contractor,
  Payment,
  VariationOrder,
  DailySummary
} from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { formatCurrency, cn } from '../../lib/utils';
import { KPICard } from '../KPICard';
import { PaymentRequest } from '../../types';
import { paymentRequestService } from '../../services/paymentRequestService';
import { Wallet } from 'lucide-react';
import { SafeChart } from '../SafeChart';
import { PaymentCalendar } from '../PaymentCalendar';
import {
  calculateDashboardKPIs,
  calculateProjectFinancials,
  calculateContractorFinancials,
  dailyForecast,
  woGrossValue,
} from '../../lib/financialCalcs';

interface CEODashboardProps {
  projects: Project[];
  workOrders: WorkOrder[];
  bills: Bill[];
  contractors: Contractor[];
  payments: Payment[];
  variationOrders: VariationOrder[];
  latestSummary: DailySummary | null;
}

export const CEODashboard: React.FC<CEODashboardProps> = ({
  projects,
  workOrders,
  bills,
  contractors,
  payments,
  variationOrders,
  latestSummary
}) => {
  // --- KPIs from centralized calculations ---
  const kpis = useMemo(
    () => calculateDashboardKPIs(workOrders, bills, payments),
    [workOrders, bills, payments]
  );

  // Payment Requests — CEO approval surface. Live-subscribed so the
  // count and pending amount refresh the moment a PM raises a request.
  // No scope filter here: CEO is unrestricted.
  const [paymentRequests, setPaymentRequests] = React.useState<PaymentRequest[]>([]);
  React.useEffect(() => {
    const unsub = paymentRequestService.getAll(setPaymentRequests);
    return () => unsub();
  }, []);
  const pendingPaymentReqs = paymentRequests.filter(r => r.status === 'PENDING_APPROVAL');
  const pendingPaymentReqAmount = pendingPaymentReqs.reduce((s, r) => s + (r.requestedAmount || 0), 0);

  // --- Cash Outflow Intelligence ---
  const forecastData = useMemo(() => dailyForecast(bills, 30), [bills]);

  const highestPaymentDay = useMemo(() => {
    if (forecastData.length === 0) return { name: 'N/A', amount: 0 };
    return [...forecastData].sort((a, b) => b.amount - a.amount)[0];
  }, [forecastData]);

  const avgWeeklyOutflow = kpis.payable30Days / 4;
  const pressureIndex = (kpis.overduePayments / (kpis.payable30Days || 1)) * 100;

  // --- Project Risk & Budget Control ---
  const projectStats = useMemo(
    () => projects.map(p => calculateProjectFinancials(p, workOrders, bills, payments)),
    [projects, workOrders, bills, payments]
  );

  const topRiskProjects = useMemo(
    () => [...projectStats].filter(s => s.percentageUsed > 90).sort((a, b) => b.percentageUsed - a.percentageUsed).slice(0, 5),
    [projectStats]
  );

  // --- Contractor Liability ---
  const contractorLiability = useMemo(
    () => contractors
      .map(c => calculateContractorFinancials(c, workOrders, bills, payments))
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 5),
    [contractors, workOrders, bills, payments]
  );

  // --- Approvals & Red Flags ---
  const pendingWOs = workOrders.filter(wo => wo.status === 'PENDING');
  const pendingPayments = payments.filter(p => p.status === 'PENDING');
  const pendingVOs = (variationOrders || []).filter(vo => vo.status === 'DRAFT');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Section 1: Top KPI cards.
          "Total WO Value" = all non-rejected WOs (PENDING + APPROVED + COMPLETED).
          "Approved Liability" = APPROVED + COMPLETED only (excludes PENDING).
          Overdue (red) / Due Today (amber) / Next 7-30 Days (blue) classification. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <KPICard title="Total WO Value" value={kpis.totalWorkOrderValue} icon={Briefcase} color="bg-violet-50 text-violet-700" href="/work-orders" />
        <KPICard title="Approved Liability" value={kpis.totalApprovedLiability} icon={ShieldAlert} color="bg-indigo-50 text-indigo-700" href="/work-orders?status=APPROVED" />
        <KPICard title="Overdue" value={kpis.overduePayments} icon={AlertTriangle} color="bg-red-50 text-red-700" href="/bills" />
        <KPICard title="Due Today" value={kpis.dueToday} icon={Clock} color="bg-amber-50 text-amber-700" href="/bills" />
        <KPICard title="Next 7 Days" value={kpis.payable7Days} icon={Clock} color="bg-rose-50 text-rose-700" href="/bills" />
        <KPICard title="Next 15 Days" value={kpis.payable15Days} icon={Clock} color="bg-orange-50 text-orange-700" href="/bills" />
        <KPICard title="Next 30 Days" value={kpis.payable30Days} icon={Clock} color="bg-blue-50 text-blue-700" href="/bills" />
        <KPICard title="Outstanding" value={kpis.outstandingPayable} icon={AlertCircle} color="bg-slate-100 text-slate-800" href="/bills" />
      </div>

      {/* Payment Requests awaiting CEO approval — value + count.
          Tone goes red when the queue is non-empty so the card is
          visually prioritized for CEO attention. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <KPICard
          title="Payment Requests — Pending Approval"
          value={pendingPaymentReqAmount}
          icon={Wallet}
          color={pendingPaymentReqs.length > 0 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'}
          href="/payment-requests?status=PENDING_APPROVAL"
        />
        <KPICard
          title="Payment Requests — Count"
          value={pendingPaymentReqs.length}
          icon={Wallet}
          color={pendingPaymentReqs.length > 0 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'}
          isCurrency={false}
          href="/payment-requests?status=PENDING_APPROVAL"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Section 3: Project Risk and Budget Control */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">
              Project Risk & Budget Control
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#f9fafb]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3">Project</TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3">Budget</TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3">WO Issued</TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3">Paid</TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3">Variance</TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectStats.slice(0, 6).map((s) => (
                  <TableRow key={s.projectId} className="border-b border-slate-50 last:border-0">
                    <TableCell className="px-6 py-4 font-bold text-xs truncate max-w-[140px]">{s.name}</TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs">{formatCurrency(s.budget)}</TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs italic">{formatCurrency(s.committed)}</TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs text-emerald-600 font-bold">{formatCurrency(s.paid)}</TableCell>
                    <TableCell className={cn(
                      "px-6 py-4 font-mono text-xs font-black",
                      s.variance < 0 ? "text-red-500" : "text-emerald-500"
                    )}>
                      {formatCurrency(s.variance)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                        s.riskStatus === 'CRITICAL' ? "bg-red-500 text-white" :
                        s.riskStatus === 'HIGH' ? "bg-amber-500 text-white" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {s.riskStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top 5 Risk Projects Panel */}
        <Card className="border-none shadow-sm bg-[#fff7ed]">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#9a3412] flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Budget Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topRiskProjects.map(s => (
              <div key={s.projectId} className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-black truncate max-w-[120px] uppercase">{s.name}</span>
                  <span className="text-[10px] font-black text-red-600">{s.percentageUsed.toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(s.percentageUsed, 100)} className="h-1 bg-amber-50" />
              </div>
            ))}
            {topRiskProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <ShieldAlert className="h-10 w-10 mb-2" />
                <p className="text-[10px] font-bold">ALL PROJECTS IN BUDGET</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Section 4: Contractor Liability and Exposure */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">
              Top Contractor Exposure
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#f9fafb]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3">Contractor</TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3 text-right">Outstanding</TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 py-3 text-right">Exposure Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractorLiability.map((c) => (
                  <TableRow key={c.contractorId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <TableCell className="px-6 py-4 font-bold text-xs">{c.name}</TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs text-right font-black text-[#111827]">
                      {formatCurrency(c.outstanding)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="bg-[#2563eb] h-full" style={{ width: `${Math.min((c.outstanding / (c.totalBilled || 1)) * 100, 100)}%` }} />
                         </div>
                         <span className="text-[9px] font-bold">
                           {((c.outstanding / (c.totalBilled || 1)) * 100).toFixed(0)}%
                         </span>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Contractor Risk Flags */}
        <Card className="border-none shadow-sm bg-[#fef2f2]">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#991b1b] flex items-center">
              <ShieldAlert className="h-4 w-4 mr-2" />
              Contractor Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             {contractorLiability.filter(c => c.outstanding > 1000000).map(c => (
               <div key={c.contractorId} className="p-3 bg-white rounded-xl border border-red-100 flex items-center gap-3">
                 <div className="p-2 bg-red-50 rounded-lg">
                   <AlertCircle className="h-4 w-4 text-red-600" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-[11px] font-black truncate">{c.name}</p>
                   <p className="text-[9px] text-red-600 font-bold uppercase">Exposure {">"} 1M</p>
                 </div>
                 <ArrowRight className="h-4 w-4 text-slate-300" />
               </div>
             ))}
             {contractorLiability.filter(c => c.outstanding > 1000000).length === 0 && (
               <div className="text-center py-10 opacity-30">
                 <CheckCircle2 className="h-10 w-10 mx-auto mb-2" />
                 <p className="text-[10px] font-bold tracking-widest">NO CRITICAL EXPOSURES</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Section 5: Pending Approvals Queue */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827] flex items-center">
              <Zap className="h-4 w-4 mr-2 text-[#2563eb]" />
              Approval Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {pendingPayments.map(p => (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-blue-50 rounded-lg">
                       <CreditCard className="h-5 w-5 text-blue-600" />
                     </div>
                     <div>
                       <p className="text-sm font-black text-[#111827]">Payment: {formatCurrency(p.amount)}</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bill #{(bills.find(b => b.id === p.billId)?.billNumber) || 'Unknown'}</p>
                     </div>
                  </div>
                  <Button size="sm" className="bg-[#111827] text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest">
                    Review Approval
                  </Button>
                </div>
              ))}
              {pendingWOs.map(wo => (
                <div key={wo.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-amber-50 rounded-lg">
                       <FileText className="h-5 w-5 text-amber-600" />
                     </div>
                     <div>
                       <p className="text-sm font-black text-[#111827]">Work Order: {wo.woNumber}</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{formatCurrency(woGrossValue(wo))} • {wo.title}</p>
                     </div>
                  </div>
                  <Button size="sm" className="bg-[#111827] text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest">
                    Review Approval
                  </Button>
                </div>
              ))}
              {pendingVOs.map(vo => (
                <div key={vo.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-purple-50 rounded-lg">
                       <Zap className="h-5 w-5 text-purple-600" />
                     </div>
                     <div>
                       <p className="text-sm font-black text-[#111827]">Variation Order: {vo.voNumber}</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">+{formatCurrency(vo.amount)} • {vo.description}</p>
                     </div>
                  </div>
                  <Button size="sm" className="bg-[#111827] text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest">
                    Review Approval
                  </Button>
                </div>
              ))}
              {pendingPayments.length === 0 && pendingWOs.length === 0 && pendingVOs.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                   <p className="text-[11px] font-black uppercase tracking-widest">All Approval Queues Empty</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CEO Quick Actions */}
        <Card className="border-none shadow-sm bg-[#1e293b] text-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Executive Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
             <Button className="w-full justify-between bg-white/5 hover:bg-white/10 text-white border-white/5 text-xs font-bold px-4 h-12">
               <span className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Bulk Approve Payments</span>
               <ChevronRight className="h-4 w-4 opacity-50" />
             </Button>
             <Button className="w-full justify-between bg-white/5 hover:bg-white/10 text-white border-white/5 text-xs font-bold px-4 h-12">
               <span className="flex items-center"><TrendingDown className="mr-2 h-4 w-4 text-amber-400" /> View Risk Projects</span>
               <ChevronRight className="h-4 w-4 opacity-50" />
             </Button>
             <Button className="w-full justify-between bg-white/5 hover:bg-white/10 text-white border-white/5 text-xs font-bold px-4 h-12">
               <span className="flex items-center"><Users className="mr-2 h-4 w-4 text-blue-400" /> Open Contractor Ledgers</span>
               <ChevronRight className="h-4 w-4 opacity-50" />
             </Button>
             <Button className="w-full justify-between bg-white/5 hover:bg-white/10 text-white border-white/5 text-xs font-bold px-4 h-12">
               <span className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-purple-400" /> Review Budget Variance</span>
               <ChevronRight className="h-4 w-4 opacity-50" />
             </Button>
             <Button className="w-full justify-between bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest mt-6 h-14">
               <span className="flex items-center"><Download className="mr-2 h-4 w-4" /> Download CEO Report</span>
               <Badge className="bg-white/20 text-white border-none">PDF</Badge>
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Schedule (full width) — moved to bottom of dashboard */}
      <PaymentCalendar bills={bills} workOrders={workOrders} />

      <div className="grid gap-6">
        {/* Cash Outflow Intelligence — moved to bottom of dashboard */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-[#111827] text-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-[#2563eb]" />
                  Cash Outflow Intelligence
                </CardTitle>
                <CardDescription className="text-slate-400 text-[10px]">30-day forecasted liabilities and snapshots.</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-slate-500">Highest Exposure</p>
                  <p className="text-xs font-black">{highestPaymentDay.name}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Highest Payment Day</p>
                <p className="text-lg font-black text-[#111827]">{formatCurrency(highestPaymentDay.amount)}</p>
                <p className="text-[10px] text-slate-400 mt-1">{highestPaymentDay.name}</p>
              </div>
              <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Avg Weekly Outflow</p>
                <p className="text-lg font-black text-[#111827]">{formatCurrency(avgWeeklyOutflow)}</p>
                <p className="text-[10px] text-slate-400 mt-1">Based on next 30 days</p>
              </div>
              <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Pressure Index</p>
                <div className="flex items-end gap-2">
                  <p className="text-lg font-black text-[#111827]">{pressureIndex.toFixed(1)}%</p>
                  <Badge variant={pressureIndex > 50 ? "destructive" : "secondary"} className="text-[9px] mb-1">
                    {pressureIndex > 50 ? 'HIGH' : 'STABLE'}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Overdue vs Current Liabilities</p>
              </div>
            </div>

            <div className="h-[300px]">
              <SafeChart minHeight={250}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="ceoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    interval={2}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(val: number) => [formatCurrency(val), 'Obligation']}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#ceoGradient)"
                  />
                </AreaChart>
              </SafeChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
