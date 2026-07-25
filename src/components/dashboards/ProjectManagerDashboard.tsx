import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, FileText, Clock, AlertTriangle, AlertCircle,
  TrendingUp, ShieldAlert, ArrowRight, HandCoins
} from 'lucide-react';
import {
  Project, WorkOrder, Bill, Payment, VariationOrder, Company, Contractor, UserProfile
} from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table';
import { KPICard } from '../KPICard';
import { formatCurrency, cn } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import {
  pmScopedProjectIds,
  pmScopeSource,
  filterProjects,
  filterWorkOrders,
  filterBills,
  filterPayments,
  filterVariationOrders,
  buildPMSummary,
  buildPerProjectRows,
  buildDueAttentionRows
} from '../../lib/pmDashboardCalcs';
import { getAssignedCompanyIds } from '../../lib/userAccess';

interface Props {
  profile: UserProfile;
  companies: Company[];
  projects: Project[];
  workOrders: WorkOrder[];
  bills: Bill[];
  contractors: Contractor[];
  payments: Payment[];
  variationOrders: VariationOrder[];
}

export const ProjectManagerDashboard: React.FC<Props> = ({
  profile, companies, projects, workOrders, bills, contractors, payments, variationOrders
}) => {
  // ── Scope the dataset once, then pass filtered slices to aggregators.
  const scopeSource = pmScopeSource(profile);
  const myProjectIds = useMemo(() => pmScopedProjectIds(profile, projects), [profile, projects]);
  const myProjects = useMemo(() => filterProjects(projects, myProjectIds), [projects, myProjectIds]);
  const myWOs = useMemo(() => filterWorkOrders(workOrders, myProjectIds), [workOrders, myProjectIds]);
  const myBills = useMemo(() => filterBills(bills, myWOs), [bills, myWOs]);
  const myPayments = useMemo(() => filterPayments(payments, myBills), [payments, myBills]);
  const myVOs = useMemo(() => filterVariationOrders(variationOrders, myWOs), [variationOrders, myWOs]);
  const myContractors = useMemo(() => {
    const ids = new Set(myWOs.map(wo => wo.contractorId));
    return contractors.filter(c => ids.has(c.id));
  }, [myWOs, contractors]);

  const summary = useMemo(
    () => buildPMSummary(myProjects, myWOs, myBills, myVOs),
    [myProjects, myWOs, myBills, myVOs]
  );

  const projectRows = useMemo(
    () => buildPerProjectRows(myProjects, myWOs, myBills, myPayments),
    [myProjects, myWOs, myBills, myPayments]
  );

  const workOrderById = useMemo(() => {
    const m: Record<string, WorkOrder> = {};
    for (const wo of myWOs) m[wo.id] = wo;
    return m;
  }, [myWOs]);
  const projectById = useMemo(() => {
    const m: Record<string, Project> = {};
    for (const p of myProjects) m[p.id] = p;
    return m;
  }, [myProjects]);

  const attentionRows = useMemo(
    () => buildDueAttentionRows(myBills, workOrderById, projectById, new Date(), 10),
    [myBills, workOrderById, projectById]
  );

  // Multi-company: resolve every assigned company to its full doc so the
  // scope banner can list them ("SIPL + SHSPL").
  const myCompanies = useMemo(() => {
    const ids = new Set(getAssignedCompanyIds(profile));
    return companies.filter(c => ids.has(c.id));
  }, [companies, profile]);
  const myCompaniesLabel = myCompanies.length === 0
    ? ''
    : myCompanies.map(c => c.code).join(' + ');

  // ── No-scope empty state: tell the PM exactly why the dashboard is
  // blank so they can self-diagnose (or ask an admin to assign a company).
  if (scopeSource === 'NONE' || myProjectIds.length === 0) {
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 shadow-sm">
        <div className="flex items-start gap-3 max-w-2xl">
          <ShieldAlert className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-lg font-black">No projects assigned yet</h3>
            <p className="text-sm text-[#6b7280] mt-1">
              {scopeSource === 'COMPANY'
                ? <>Your account is linked to a company, but that company has no projects yet. Ask an admin to create a project, or to re-scope your account.</>
                : <>Your account has no company assignment. Ask an admin to open <strong>Admin → User Management</strong> and assign you a company so your dashboard can populate.</>
              }
            </p>
            <p className="text-[11px] text-[#9ca3af] mt-3 uppercase tracking-widest font-bold">
              Current scope: {scopeSource === 'COMPANY' ? `Company (${myCompaniesLabel || 'unknown'})` : 'None'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scope banner — makes it obvious how the filter is derived today. */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white rounded-xl border border-[#e5e7eb] shadow-sm px-5 py-3">
        <div className="flex items-center gap-3">
          <Briefcase className="h-4 w-4 text-[#2563eb]" />
          <div>
            <p className="text-sm font-black text-[#111827]">
              My Projects {myCompaniesLabel ? `· ${myCompaniesLabel}` : ''}
            </p>
            <p className="text-[11px] text-[#6b7280]">
              Showing data for {myProjectIds.length} project(s).
              {scopeSource === 'ASSIGNED'
                ? ' Scope: directly assigned.'
                : ' Scope: inferred from your company assignment.'}
            </p>
          </div>
        </div>
        {scopeSource === 'COMPANY' && (
          <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px] font-black uppercase tracking-wider">
            Company-wide scope
          </Badge>
        )}
      </div>

      {/* KPI strip — 6 PM-focused indicators, no company-wide CEO numbers. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard title="My Projects" value={summary.projectCount} icon={Briefcase} color="bg-indigo-50 text-indigo-700" isCurrency={false} />
        <KPICard title="Active WOs" value={summary.activeWOCount} icon={FileText} color="bg-blue-50 text-blue-700" isCurrency={false} href="/work-orders?status=APPROVED" />
        <KPICard title="Pending Approval" value={summary.pendingWOCount} icon={Clock} color="bg-amber-50 text-amber-700" isCurrency={false} href="/work-orders?status=PENDING" />
        <KPICard title="Overdue" value={summary.overduePayments} icon={AlertTriangle} color="bg-red-50 text-red-700" href="/bills" />
        <KPICard title="Due Today" value={summary.dueTodayAmount} icon={Clock} color="bg-amber-50 text-amber-700" href="/bills" />
        <KPICard title="Next 7 Days" value={summary.payable7Days} icon={TrendingUp} color="bg-rose-50 text-rose-700" href="/bills" />
      </div>

      {/* Project-wise rollup */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-[#2563eb]" />
            Per-Project Rollup ({projectRows.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f9fafb]">
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Active WOs</TableHead>
                <TableHead className="text-right">WO Value</TableHead>
                <TableHead className="text-right">Billed</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectRows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-20 text-center text-muted-foreground text-sm">
                  No projects in your scope yet.
                </TableCell></TableRow>
              ) : projectRows.map(row => (
                <TableRow key={row.projectId}>
                  <TableCell className="text-sm font-semibold">{row.name}</TableCell>
                  <TableCell>
                    <Badge className={cn('border-0 text-[10px] font-black uppercase',
                      row.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                      row.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    )}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-right">{row.activeWOCount}</TableCell>
                  <TableCell className="text-sm text-right">{formatCurrency(row.totalWOValue)}</TableCell>
                  <TableCell className="text-sm text-right text-emerald-700 font-semibold">
                    {formatCurrency(row.totalBilled)}
                  </TableCell>
                  <TableCell className={cn(
                    "text-sm text-right font-semibold",
                    row.outstandingPayable > 0 ? "text-rose-700" : "text-emerald-700"
                  )}>
                    {formatCurrency(row.outstandingPayable)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Two-column: upcoming payments + open work items */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#e5e7eb] bg-[#f9fafb]">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-rose-600" />
              Attention Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead>Bill</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attentionRows.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-20 text-center text-muted-foreground text-sm">
                    No pending bills in your scope.
                  </TableCell></TableRow>
                ) : attentionRows.map(({ bill, project, isOverdue, isDueToday }) => (
                  <TableRow key={bill.id}>
                    <TableCell className="text-xs">{bill.billNumber}</TableCell>
                    <TableCell className="text-xs text-[#6b7280]">{project?.name || '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[#6b7280]">
                          {bill.billDate ? format(parseISO(bill.billDate), 'dd MMM') : '—'}
                        </span>
                        {isOverdue && <Badge className="bg-red-100 text-red-800 border-0 text-[9px] font-black uppercase">Overdue</Badge>}
                        {isDueToday && <Badge className="bg-amber-100 text-amber-800 border-0 text-[9px] font-black uppercase">Today</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-right font-semibold">{formatCurrency(bill.netPayable)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#e5e7eb] bg-[#f9fafb]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                <HandCoins className="h-4 w-4 mr-2 text-indigo-600" />
                Open Work
              </CardTitle>
              <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px] font-black uppercase">
                {summary.openVOCount} draft VO(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Contractors on my WOs" value={String(summary.contractorCount)} />
              <StatTile label="Active contractors" value={String(myContractors.length)} />
              <StatTile label="Total WO Value" value={formatCurrency(summary.totalWOValue)} />
              <StatTile label="Total Billed" value={formatCurrency(summary.totalBilled)} accent="text-emerald-700" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/work-orders">
                <Button variant="outline" className="w-full justify-between">
                  Open Work Orders <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/variation-orders">
                <Button variant="outline" className="w-full justify-between">
                  Variation Orders <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/masters">
                <Button variant="outline" className="w-full justify-between">
                  Masters <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function StatTile({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="p-3 rounded-lg border border-[#e5e7eb] bg-[#f8fafc]">
      <p className="text-[9px] font-black uppercase tracking-widest text-[#6b7280]">{label}</p>
      <p className={cn('text-sm font-black mt-1', accent || 'text-[#111827]')}>{value}</p>
    </div>
  );
}
