import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contractorService } from '../services/contractorService';
import { workOrderService } from '../services/workOrderService';
import { billService } from '../services/billService';
import { paymentService } from '../services/paymentService';
import { adjustmentService } from '../services/adjustmentService';
import { projectService } from '../services/projectService';
import { Contractor, WorkOrder, Bill, Payment, Adjustment, Project, LedgerEntry } from '../types';
import { calculateLedger, calculateContractorKPIs } from '../lib/ledgerUtils';
import { woGrossValue, totalNetPayableForWO, totalPaidForWO, activeWorkOrders } from '../lib/financialCalcs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { formatCurrency, cn } from '../lib/utils';
import { 
  User, 
  Briefcase, 
  Receipt, 
  CreditCard, 
  TrendingDown, 
  TrendingUp, 
  Filter, 
  Download, 
  Plus,
  ArrowLeft,
  Calendar,
  FileText,
  History,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { SkeletonRow } from '../components/Skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function ContractorLedger() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isAccounts } = useAuth();
  
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // Fetch contractor (one-time)
    contractorService.getById(id).then(c => {
      setContractor(c);
    }).catch(error => {
      console.error("Error fetching contractor:", error);
    });

    // Real-time subscriptions
    const unsubWO = workOrderService.getAll(setWorkOrders);
    const unsubBills = billService.getAll(setBills);
    const unsubPayments = paymentService.getAll(setPayments);
    const unsubAdjustments = adjustmentService.getAll(setAdjustments);
    const unsubProjects = projectService.getAll(setProjects);

    setLoading(false);

    return () => {
      unsubWO();
      unsubBills();
      unsubPayments();
      unsubAdjustments();
      unsubProjects();
    };
  }, [id]);

  const kpis = useMemo(() => {
    if (!id) return null;
    return calculateContractorKPIs(id, workOrders, bills, payments, adjustments);
  }, [id, workOrders, bills, payments, adjustments]);

  const ledgerEntries = useMemo(() => {
    if (!id) return [];
    let entries = calculateLedger(id, workOrders, bills, payments, adjustments, projects);

    // Apply Filters
    if (dateRange.start) {
      entries = entries.filter(e => e.date >= dateRange.start);
    }
    if (dateRange.end) {
      entries = entries.filter(e => e.date <= dateRange.end);
    }
    if (selectedProject !== 'all') {
      const project = projects.find(p => p.id === selectedProject);
      entries = entries.filter(e => e.projectName === project?.name);
    }
    if (selectedType !== 'all') {
      entries = entries.filter(e => e.type === selectedType);
    }

    return entries;
  }, [id, workOrders, bills, payments, adjustments, projects, dateRange, selectedProject, selectedType]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-100 animate-pulse rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="text-center py-20">
        <User className="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Contractor not found</h2>
        <Button onClick={() => navigate('/contractors')} className="mt-4">Back to Contractors</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/contractors')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black tracking-tight text-[#111827]">{contractor.name}</h1>
              <Badge className="bg-[#dbeafe] text-[#1e40af] border-none text-[10px] font-black uppercase">
                {contractor.trade}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6b7280] font-medium">
              <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {contractor.phone}</span>
              <span className="flex items-center gap-1"><History className="h-3 w-3" /> Joined {new Date(contractor.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest border-[#e5e7eb]">
            <Download className="h-3 w-3 mr-2" /> Export Ledger
          </Button>
          {(isAdmin || isAccounts) && (
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-[10px] font-black uppercase tracking-widest">
              <Plus className="h-3 w-3 mr-2" /> Add Adjustment
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Total WO Value" value={kpis.totalWOValue} icon={Briefcase} color="bg-blue-50 text-blue-600" />
          <KPICard title="Outstanding Payable" value={kpis.outstandingPayable} icon={TrendingDown} color="bg-rose-50 text-rose-600" />
          <KPICard title="Total Paid" value={kpis.totalPaymentsReleased} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
          <KPICard title="Retention Held" value={kpis.retentionHeld} icon={ShieldCheck} color="bg-amber-50 text-amber-600" />
        </div>
      )}

      {/* Secondary KPIs */}
      {kpis && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 bg-white border border-[#e5e7eb] rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Approved Bills</p>
              <p className="text-lg font-black text-[#111827]">{formatCurrency(kpis.totalApprovedBills)}</p>
            </div>
            <Receipt className="h-6 w-6 text-slate-200" />
          </div>
          <div className="p-4 bg-white border border-[#e5e7eb] rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Advance Paid</p>
              <p className="text-lg font-black text-[#111827]">{formatCurrency(kpis.totalAdvancePaid)}</p>
            </div>
            <CreditCard className="h-6 w-6 text-slate-200" />
          </div>
          <div className="p-4 bg-white border border-[#e5e7eb] rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Advance Outstanding</p>
              <p className={cn("text-lg font-black", kpis.advanceOutstanding > 0 ? "text-rose-600" : "text-emerald-600")}>
                {formatCurrency(kpis.advanceOutstanding)}
              </p>
            </div>
            <TrendingDown className="h-6 w-6 text-slate-200" />
          </div>
        </div>
      )}

      <Tabs defaultValue="ledger" className="space-y-6">
        <TabsList className="bg-white border border-[#e5e7eb] p-1 h-12 rounded-xl">
          <TabsTrigger value="ledger" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb]">
            Financial Ledger
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb]">
            Project Summary
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb]">
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white border-[#e5e7eb] shadow-sm">
            <CardContent className="p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#6b7280]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Filters:</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#6b7280]" />
                <Input 
                  type="date" 
                  value={dateRange.start} 
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="h-8 text-xs w-32"
                />
                <span className="text-xs text-[#6b7280]">to</span>
                <Input 
                  type="date" 
                  value={dateRange.end} 
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="h-8 text-xs w-32"
                />
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="h-8 text-xs w-48">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="BILL">Bills</SelectItem>
                  <SelectItem value="PAYMENT">Payments</SelectItem>
                  <SelectItem value="ADVANCE">Advances</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustments</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-[10px] font-black uppercase tracking-widest text-rose-600"
                onClick={() => {
                  setDateRange({ start: '', end: '' });
                  setSelectedProject('all');
                  setSelectedType('all');
                }}
              >
                Reset
              </Button>
            </CardContent>
          </Card>

          {/* Ledger Table */}
          <Card className="bg-white border-[#e5e7eb] shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                    <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Date</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Description</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Reference</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280] text-right">Debit (₹)</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280] text-right">Credit (₹)</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280] text-right">Balance (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.length > 0 ? (
                    ledgerEntries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                        <TableCell className="px-6 py-4 text-xs font-medium text-[#6b7280]">
                          {new Date(entry.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="text-xs font-bold text-[#1e293b]">{entry.description}</p>
                          <p className="text-[9px] text-[#6b7280] font-bold uppercase tracking-tighter">
                            {entry.projectName} • {entry.workOrderNumber}
                          </p>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="outline" className="text-[9px] font-black uppercase border-[#e5e7eb]">
                            {entry.referenceNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right text-xs font-bold text-rose-600">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right text-xs font-bold text-emerald-600">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right text-xs font-black text-[#1e293b]">
                          {formatCurrency(entry.balance)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-xs font-medium text-[#6b7280]">
                        No ledger entries found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map(project => {
              // Only active (non-rejected) WOs count toward project totals.
              const projectWOs = activeWorkOrders(workOrders).filter(wo => wo.projectId === project.id && wo.contractorId === id);
              if (projectWOs.length === 0) return null;

              // Derive all three numbers from live bills/payments — NEVER read wo.billing.*
              const totalValue = projectWOs.reduce((sum, wo) => sum + woGrossValue(wo), 0);
              const totalBilled = projectWOs.reduce((sum, wo) => sum + totalNetPayableForWO(wo.id, bills), 0);
              const totalPaid = projectWOs.reduce((sum, wo) => sum + totalPaidForWO(wo.id, bills, payments), 0);

              return (
                <Card key={project.id} className="bg-white border-[#e5e7eb] shadow-sm overflow-hidden">
                  <CardHeader className="bg-slate-50 border-b border-[#e5e7eb] py-4 px-6">
                    <CardTitle className="text-sm font-black uppercase tracking-tight flex items-center justify-between">
                      {project.name}
                      <Badge className="bg-white text-[#2563eb] border-[#e5e7eb] text-[9px]">
                        {projectWOs.length} Work Orders
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Total Value</p>
                        <p className="text-sm font-black text-[#111827]">{formatCurrency(totalValue)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Billed</p>
                        <p className="text-sm font-black text-[#111827]">{formatCurrency(totalBilled)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Paid</p>
                        <p className="text-sm font-black text-emerald-600">{formatCurrency(totalPaid)}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#e5e7eb]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Billing Progress</span>
                        <span className="text-[10px] font-black text-[#2563eb]">{totalValue > 0 ? Math.round((totalBilled / totalValue) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2563eb] h-full transition-all duration-500"
                          style={{ width: `${totalValue > 0 ? (totalBilled / totalValue) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="bg-white border-[#e5e7eb] shadow-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-900">No documents uploaded</p>
              <p className="text-xs text-slate-500 mt-1">Upload agreements, GST certificates, or bank details.</p>
              <Button variant="outline" className="mt-6 text-[10px] font-black uppercase tracking-widest">
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
