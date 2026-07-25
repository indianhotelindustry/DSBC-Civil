import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Receipt, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/projectService';
import { workOrderService } from '../services/workOrderService';
import { billService } from '../services/billService';
import { contractorService } from '../services/contractorService';
import { paymentService } from '../services/paymentService';
import { variationOrderService } from '../services/variationOrderService';
import { companyService } from '../services/companyService';
import { summaryService } from '../services/summaryService';
import {
  Project,
  WorkOrder,
  Bill,
  Contractor,
  Payment,
  VariationOrder,
  Company,
  DailySummary
} from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { cn, formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { CEODashboard } from '../components/dashboards/CEODashboard';
import { AccountsDashboard } from '../components/dashboards/AccountsDashboard';
import { ProjectManagerDashboard } from '../components/dashboards/ProjectManagerDashboard';

export default function Dashboard() {
  const { profile, isAdmin, isSuperAdmin, isCEO, isAccounts, isPM } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [variationOrders, setVariationOrders] = useState<VariationOrder[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [latestSummary, setLatestSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = 6;
    const checkLoading = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad) {
        setLoading(false);
      }
    };

    const unsubProjects = projectService.getAll((data) => {
      setProjects(data);
      checkLoading();
    });
    const unsubWorkOrders = workOrderService.getAll((data) => {
      setWorkOrders(data);
      checkLoading();
    });
    const unsubBills = billService.getAll((data) => {
      setBills(data);
      checkLoading();
    });
    const unsubContractors = contractorService.getAll((data) => {
      setContractors(data);
      checkLoading();
    });
    const unsubPayments = paymentService.getAll((data) => {
      setPayments(data);
      checkLoading();
    });
    const unsubVO = variationOrderService.getAll((data) => {
      setVariationOrders(data);
      checkLoading();
    });
    const unsubCompanies = companyService.getAll(setCompanies);
    // dailySummaries Firestore rule allows ADMIN / CEO / ACCOUNTS only.
    // PMs subscribing here triggered repeated permission-denied errors
    // in the console (and a never-ending listener retry storm) without
    // contributing any UI value — PM dashboard never reads
    // latestSummary. Gate the subscription so only roles that actually
    // have read access (and use the data) run it.
    const canReadSummary = isAdmin || isSuperAdmin || isCEO || isAccounts;
    const unsubSummary = canReadSummary
      ? summaryService.getLatest(setLatestSummary)
      : () => {};

    return () => {
      unsubProjects();
      unsubWorkOrders();
      unsubBills();
      unsubContractors();
      unsubPayments();
      unsubVO();
      unsubCompanies();
      unsubSummary();
    };
  }, [isAdmin, isSuperAdmin, isCEO, isAccounts]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Activity className="h-10 w-10 text-blue-600 animate-pulse" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Synchronizing Financial Data...</p>
      </div>
    );
  }

  // Dashboard selection by role.
  //   ADMIN, CEO       → CEO / executive dashboard (company-wide numbers)
  //   ACCOUNTS         → Accounts finance dashboard (and not ADMIN, so admins
  //                      with implicit accounts access don't see it by default)
  //   PROJECT_MANAGER  → project-scoped dashboard (new in this pass;
  //                      replaces the old "restricted" fallback)
  //   Anything else    → safe fallback ("restricted") retained so unknown
  //                      roles never accidentally see the CEO dashboard
  const showCEODashboard = isAdmin || isSuperAdmin || isCEO;
  const showAccountsDashboard = isAccounts && !isAdmin;
  const showPMDashboard = isPM && !isAdmin;

  const headerTitle =
    showCEODashboard ? 'Executive Performance Command' :
    showAccountsDashboard ? 'Financial Operations Hub' :
    showPMDashboard ? 'Project Manager Dashboard' :
    'System Dashboard';
  const headerSubtitle =
    showCEODashboard ? 'Mission-critical portfolio oversight and budget control.' :
    showAccountsDashboard ? 'Billing cycle management and payment reconciliation.' :
    showPMDashboard ? 'Your projects, work orders, bills, and attention items.' :
    'Use the navigation menu to manage site tasks.';

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">{headerTitle}</h1>
          <p className="text-sm text-[#6b7280]">{headerSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-white px-3 py-1.5 rounded-lg border border-[#e5e7eb] shadow-sm flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#111827]">Live Sync Active</span>
          </Badge>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase text-slate-400">Current Role</p>
            <p className="text-xs font-black text-blue-600">{profile?.role}</p>
          </div>
        </div>
      </div>

      {showCEODashboard ? (
        <>
          {latestSummary && (
            <Card className="bg-[#111827] text-white border-none shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
              <CardHeader className="border-b border-white/10 py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-[#2563eb]" />
                  Executive Daily Intelligence
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#2563eb] text-white border-none text-[9px] font-black uppercase">
                    Ref: {new Date(latestSummary.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5">
                      {latestSummary.formattedText}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
                      onClick={() => {
                        navigator.clipboard.writeText(latestSummary.formattedText);
                        toast.success("Summary copied to clipboard!");
                      }}
                    >
                      Copy for Sharing
                    </Button>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Immediate Risk Exposure</h4>
                    <div className="space-y-3">
                      {latestSummary.topRiskItems.map((item, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/[0.08] transition-colors cursor-default">
                          <div>
                            <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-wider">DEADLINE: {item.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-[#2563eb]">{formatCurrency(item.amount)}</p>
                            <Badge className={cn(
                              "text-[8px] font-black uppercase mt-1",
                              item.type === 'OVERDUE' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                            )}>
                              {item.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <CEODashboard 
            projects={projects}
            workOrders={workOrders}
            bills={bills}
            contractors={contractors}
            payments={payments}
            variationOrders={variationOrders}
            latestSummary={latestSummary}
          />
        </>
      ) : showAccountsDashboard ? (
        <AccountsDashboard
          projects={projects}
          workOrders={workOrders}
          bills={bills}
          contractors={contractors}
          payments={payments}
        />
      ) : showPMDashboard && profile ? (
        <ProjectManagerDashboard
          profile={profile}
          companies={companies}
          projects={projects}
          workOrders={workOrders}
          bills={bills}
          contractors={contractors}
          payments={payments}
          variationOrders={variationOrders}
        />
      ) : (
        <div className="py-20 text-center space-y-4">
           <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto" />
           <div>
              <h3 className="text-lg font-black uppercase">General Dashboard</h3>
              <p className="text-sm text-slate-400">Your role ({profile?.role}) has restricted dashboard access. Please use the navigation menu to manage site tasks.</p>
           </div>
        </div>
      )}
    </div>
  );
}
