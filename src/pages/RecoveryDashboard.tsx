import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HandCoins, Briefcase, Users, TrendingUp, AlertCircle, CheckCircle2, Calendar, Info, ExternalLink
} from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { saleService } from '../services/saleService';
import { saleScheduleService } from '../services/saleScheduleService';
import { projectService } from '../services/projectService';
import { subLocationService } from '../services/subLocationService';
import { customerService } from '../services/customerService';
import { companyService } from '../services/companyService';
import { getEffectiveCompanyScope, isInScope } from '../lib/userAccess';
import { Sale, SaleReceipt, SaleSchedule, Project, SubLocation, Customer, Company } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { KPICard } from '../components/KPICard';
import { SafeChart } from '../components/SafeChart';
import { formatCurrency, cn } from '../lib/utils';
import {
  buildRecoverySummary,
  buildReceiptTrend,
  buildTrendStats,
  buildCustomerOutstanding,
  buildProjectRecovery,
} from '../lib/recoveryCalcs';
import {
  buildWindowTotals,
  buildAgingBuckets,
  buildCollectionEfficiency,
} from '../lib/scheduleCalcs';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

/** Live all-receipts subscription. Receipts are small docs and we filter
 *  to the active-sales set client-side, matching how CustomerLedger
 *  handles the same relationship. Avoids Firestore's 10-item `in` limit. */
function subscribeAllReceipts(callback: (r: SaleReceipt[]) => void) {
  const q = query(collection(db, 'saleReceipts'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SaleReceipt, 'id'>) })));
  });
}

export default function RecoveryDashboard() {
  const { profile } = useAuth();

  const [sales, setSales] = useState<Sale[]>([]);
  const [receipts, setReceipts] = useState<SaleReceipt[]>([]);
  const [schedules, setSchedules] = useState<SaleSchedule[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subLocations, setSubLocations] = useState<SubLocation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterCustomer, setFilterCustomer] = useState<string>('all');

  useEffect(() => {
    let done = 0;
    const check = () => { if (++done >= 4) setLoading(false); };
    const u1 = saleService.getAll((s) => { setSales(s); check(); });
    const u2 = projectService.getAll((p) => { setProjects(p); check(); });
    const u3 = subLocationService.getAll((sl) => { setSubLocations(sl); check(); });
    const u4 = customerService.getAll((c) => { setCustomers(c); check(); });
    const u5 = companyService.getAll(setCompanies);
    const u6 = subscribeAllReceipts(setReceipts);
    const u7 = saleScheduleService.getAll(setSchedules);
    return () => { u1(); u2(); u3(); u4(); u5(); u6(); u7(); };
  }, []);

  // ── Scope + SIPL-only filtering ─────────────────────────────────
  // Recovery is SIPL-only: only sales on CONSTRUCTION companies are
  // considered. On top of that, ACCOUNTS / PM users are further scoped
  // to assignedCompanyIds via getEffectiveCompanyScope — ADMIN and CEO
  // remain unrestricted.
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);
  const constructionIds = useMemo(
    () => new Set(companies.filter(c => c.businessType === 'CONSTRUCTION').map(c => c.id)),
    [companies]
  );

  const siplSales = useMemo(() => sales.filter(s => {
    if (!s.companyId || !constructionIds.has(s.companyId)) return false;
    if (!isInScope(scope, s.companyId)) return false;
    return true;
  }), [sales, constructionIds, scope]);

  // Apply project + customer filters.
  const filteredSales = useMemo(() => {
    return siplSales.filter(s => {
      if (filterProject !== 'all' && s.projectId !== filterProject) return false;
      if (filterCustomer !== 'all' && s.customerId !== filterCustomer) return false;
      return true;
    });
  }, [siplSales, filterProject, filterCustomer]);

  const summary = useMemo(() => buildRecoverySummary(filteredSales), [filteredSales]);
  const trend = useMemo(() => buildReceiptTrend(receipts, filteredSales, 30), [receipts, filteredSales]);
  const trendStats = useMemo(() => buildTrendStats(trend), [trend]);
  const customerRows = useMemo(
    () => buildCustomerOutstanding(filteredSales, projects, subLocations, 10),
    [filteredSales, projects, subLocations]
  );
  const projectRows = useMemo(
    () => buildProjectRecovery(filteredSales, projects),
    [filteredSales, projects]
  );

  // Phase 2A — schedule-driven recovery engine.
  // Schedules are filtered to the same active-sale set the summary uses.
  // Schedules on CANCELLED sales or on sales outside the scope/filter
  // never contribute to overdue / aging / efficiency.
  const filteredScheduleSet = useMemo(() => {
    const saleIds = new Set(filteredSales.filter(s => s.saleStatus !== 'CANCELLED').map(s => s.id));
    return schedules.filter(sch => saleIds.has(sch.saleId));
  }, [schedules, filteredSales]);
  const windowTotals = useMemo(() => buildWindowTotals(filteredScheduleSet), [filteredScheduleSet]);
  const agingBuckets = useMemo(() => buildAgingBuckets(filteredScheduleSet), [filteredScheduleSet]);
  const collectionEfficiency = useMemo(
    () => buildCollectionEfficiency(filteredScheduleSet),
    [filteredScheduleSet]
  );
  const hasAnySchedule = schedules.length > 0;

  // Dropdown option pools — projects and customers that actually have
  // at least one in-scope sale (so the filters can only land on a
  // state that produces rows).
  const scopedProjectOptions = useMemo(() => {
    const ids = new Set(siplSales.map(s => s.projectId));
    return projects.filter(p => ids.has(p.id)).sort((a, b) => a.name.localeCompare(b.name));
  }, [siplSales, projects]);
  const scopedCustomerOptions = useMemo(() => {
    const ids = new Set(siplSales.map(s => s.customerId));
    return customers.filter(c => ids.has(c.id)).sort((a, b) => a.name.localeCompare(b.name));
  }, [siplSales, customers]);

  // Empty-state hints
  const hasAnyConstructionCompany = constructionIds.size > 0;
  const noScope = !scope.unrestricted && scope.ids.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827] flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-[#2563eb]" />
            Recovery Dashboard
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            SIPL unit sale collections and outstanding receivables.
          </p>
        </div>
      </div>

      {/* Early empty states */}
      {!hasAnyConstructionCompany && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">No SIPL (CONSTRUCTION) company configured.</p>
            <p className="text-amber-700 mt-0.5 text-xs">This dashboard only tracks SIPL sales. Add a CONSTRUCTION company in Masters to get started.</p>
          </div>
        </div>
      )}
      {noScope && hasAnyConstructionCompany && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">No companies assigned to your account.</p>
            <p className="text-amber-700 mt-0.5 text-xs">Ask an admin to assign SIPL in Admin → User Management.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {hasAnyConstructionCompany && !noScope && (
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-52 h-8 text-xs"><SelectValue placeholder="Project" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {scopedProjectOptions.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCustomer} onValueChange={setFilterCustomer}>
            <SelectTrigger className="w-52 h-8 text-xs"><SelectValue placeholder="Customer" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {scopedCustomerOptions.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge className="bg-slate-100 text-slate-700 border-0 text-[10px] font-black uppercase tracking-wider">
            {filteredSales.filter(s => s.saleStatus !== 'CANCELLED').length} active sale(s)
          </Badge>
        </div>
      )}

      {/* KPI strip — 7 cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <KPICard title="Total Sale Value" value={summary.totalSaleValue} icon={HandCoins} color="bg-indigo-50 text-indigo-700" />
        <KPICard title="Total Received" value={summary.totalReceived} icon={CheckCircle2} color="bg-emerald-50 text-emerald-700" />
        <KPICard title="Net Receivable" value={summary.netReceivable} icon={AlertCircle} color="bg-rose-50 text-rose-700" />
        <KPICard title="Overpaid" value={summary.overpaid} icon={TrendingUp} color="bg-amber-50 text-amber-700" />
        <KPICard title="Units Booked" value={summary.unitsBooked} icon={Briefcase} color="bg-blue-50 text-blue-700" isCurrency={false} />
        <KPICard title="Units Sold" value={summary.unitsSold} icon={CheckCircle2} color="bg-emerald-50 text-emerald-700" isCurrency={false} />
        <KPICard title="Units Possession" value={summary.unitsPossession} icon={Calendar} color="bg-violet-50 text-violet-700" isCurrency={false} />
      </div>

      {/* Phase 2A — Schedule-driven recovery engine. Only renders when at
          least one schedule exists; otherwise we defer to the Phase 1
          outstanding-only view. */}
      {hasAnySchedule ? (
        <>
          {/* Schedule-driven window KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard title="Overdue" value={windowTotals.overdue} icon={AlertCircle} color="bg-rose-50 text-rose-700" />
            <KPICard title="Due Today" value={windowTotals.dueToday} icon={Calendar} color="bg-amber-50 text-amber-700" />
            <KPICard title="Next 7 Days" value={windowTotals.dueNext7Days} icon={TrendingUp} color="bg-blue-50 text-blue-700" />
            <KPICard title="Next 30 Days" value={windowTotals.dueNext30Days} icon={TrendingUp} color="bg-indigo-50 text-indigo-700" />
          </div>

          {/* Aging buckets + collection efficiency */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-none shadow-sm bg-white overflow-hidden lg:col-span-2">
              <CardHeader className="border-b border-[#e5e7eb] bg-[#f9fafb] py-3 px-5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-rose-600" />
                  Aging — open installments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="h-[220px]">
                  <SafeChart minHeight={200}>
                    <BarChart data={agingBuckets}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        tickFormatter={(v: number) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(v: number, _name: string, entry) => [
                          `${formatCurrency(v)} · ${(entry.payload as { count: number }).count} installment(s)`,
                          'Balance'
                        ]}
                      />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {agingBuckets.map((b, i) => (
                          <Cell
                            key={i}
                            fill={
                              b.label === 'Upcoming' ? '#94a3b8' :
                              b.label === 'Due Today' ? '#f59e0b' :
                              b.label === '1–30 days' ? '#fb923c' :
                              b.label === '31–60 days' ? '#f97316' :
                              b.label === '61–90 days' ? '#ef4444' :
                              /* 90+ days */ '#b91c1c'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </SafeChart>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-[#e5e7eb] bg-[#f9fafb] py-3 px-5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                  Collection Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6b7280]">Received to date</p>
                  <p className="text-2xl font-black mt-1 text-emerald-700">{collectionEfficiency.percent.toFixed(0)}%</p>
                  <p className="text-[11px] text-[#6b7280] mt-1">
                    {formatCurrency(collectionEfficiency.receivedToDate)} of {formatCurrency(collectionEfficiency.dueToDate)} due so far
                  </p>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${Math.max(0, Math.min(100, collectionEfficiency.percent))}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#9ca3af]">
                  Based on {collectionEfficiency.scheduleCount} installment(s) due on or before today.
                  WAIVED and CANCELLED rows are excluded. Overpayment on a single
                  schedule does not inflate the percentage.
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}

      {/* Receipt Trend + headline stats */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#e5e7eb] bg-[#f9fafb] py-3 px-5">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-[#2563eb]" />
            Receipt Trend (last 30 days)
          </CardTitle>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af]">Total collected</p>
              <p className="text-sm font-black text-emerald-700">{formatCurrency(trendStats.total)}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af]">Avg / active day</p>
              <p className="text-sm font-black text-[#111827]">{formatCurrency(trendStats.avgPerDay)}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af]">Days w/ receipts</p>
              <p className="text-sm font-black text-[#111827]">{trendStats.daysWithReceipts}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="h-[260px]">
            <SafeChart minHeight={220}>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  interval={Math.max(0, Math.floor(trend.length / 10))}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(v: number) => [formatCurrency(v), 'Received']}
                />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </SafeChart>
          </div>
        </CardContent>
      </Card>

      {/* Two-column: Customer Outstanding + Project Recovery */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#e5e7eb] bg-[#f9fafb] py-3 px-5">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
              <Users className="h-4 w-4 mr-2 text-[#2563eb]" />
              Customer Outstanding · Top {Math.min(10, customerRows.length) || 10}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead>Customer</TableHead>
                  <TableHead>Unit(s)</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-right">Rec %</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerRows.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-20 text-center text-muted-foreground text-sm">
                    No active sales in scope.
                  </TableCell></TableRow>
                ) : customerRows.map((r) => (
                  <TableRow key={r.customerId}>
                    <TableCell className="text-sm font-semibold">
                      <div>{r.customerName}</div>
                      <div className="text-[10px] text-[#9ca3af]">{r.projectName}</div>
                    </TableCell>
                    <TableCell className="text-xs text-[#6b7280]">{r.unitLabel}</TableCell>
                    <TableCell className="text-sm text-right">{formatCurrency(r.totalSaleValue)}</TableCell>
                    <TableCell className="text-sm text-right text-emerald-700 font-semibold">{formatCurrency(r.totalReceived)}</TableCell>
                    <TableCell className={cn(
                      "text-sm text-right font-semibold",
                      r.outstanding > 0 ? "text-rose-700" : "text-emerald-700"
                    )}>
                      {formatCurrency(r.outstanding)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-[#6b7280]">{r.recoveryPct.toFixed(0)}%</TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/customers/${r.customerId}/ledger`}
                        className="inline-flex items-center text-xs font-bold text-blue-700 hover:text-blue-900"
                        title="Open customer ledger"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#e5e7eb] bg-[#f9fafb] py-3 px-5">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-[#2563eb]" />
              Project Recovery Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-right">Rec %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectRows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="h-20 text-center text-muted-foreground text-sm">
                    No projects with active sales.
                  </TableCell></TableRow>
                ) : projectRows.map((r) => (
                  <TableRow key={r.projectId}>
                    <TableCell className="text-sm font-semibold">{r.projectName}</TableCell>
                    <TableCell className="text-sm text-right">{r.unitsSold}</TableCell>
                    <TableCell className="text-sm text-right">{formatCurrency(r.totalSaleValue)}</TableCell>
                    <TableCell className="text-sm text-right text-emerald-700 font-semibold">{formatCurrency(r.totalReceived)}</TableCell>
                    <TableCell className={cn(
                      "text-sm text-right font-semibold",
                      r.outstanding > 0 ? "text-rose-700" : "text-emerald-700"
                    )}>
                      {formatCurrency(r.outstanding)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-[#6b7280]">{r.recoveryPct.toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Phase marker — adapts to whether schedules are active in the workspace. */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-start gap-2">
        <Info className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {hasAnySchedule ? (
            <>
              <span className="font-semibold">Phase 2A active.</span> Overdue, Due Today, and
              aging buckets are driven by installment schedules. Penalties / write-offs /
              auto-split across multiple schedules (Phase 2B) will arrive once
              {' '}<code className="text-[10px] bg-slate-200 px-1 rounded">saleAdjustments</code> writes are active.
            </>
          ) : (
            <>
              <span className="font-semibold">Phase 1 view.</span> No installment schedules exist
              yet; outstanding is computed against final sale value only. Add schedules on
              each Sale&apos;s detail page to activate Phase 2A overdue / aging / efficiency KPIs.
            </>
          )}
        </p>
      </div>

      {loading && (
        <div className="text-xs text-[#9ca3af] text-center py-4">Loading live data…</div>
      )}
    </div>
  );
}
