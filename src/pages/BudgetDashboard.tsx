import React, { useEffect, useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ChevronRight,
  Target,
  FileCheck,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { workOrderService } from '../services/workOrderService';
import { billService } from '../services/billService';
import { paymentService } from '../services/paymentService';
import { Project, WorkOrder, Bill, Payment } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { calculateProjectFinancials, ProjectFinancials } from '../lib/financialCalcs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';

// Using ProjectFinancials from financialCalcs instead of a local interface

export default function BudgetDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubProjects = projectService.getAll(setProjects);
    const unsubWO = workOrderService.getAll(setWorkOrders);
    const unsubBills = billService.getAll(setBills);
    const unsubPayments = paymentService.getAll(setPayments);

    setLoading(false);

    return () => {
      unsubProjects();
      unsubWO();
      unsubBills();
      unsubPayments();
    };
  }, []);

  const projectStats = useMemo(
    () => projects.map(p => calculateProjectFinancials(p, workOrders, bills, payments)),
    [projects, workOrders, bills, payments]
  );

  const totalBudget = projectStats.reduce((sum, s) => sum + s.budget, 0);
  const totalCommitted = projectStats.reduce((sum, s) => sum + s.committed, 0);
  const totalBilled = projectStats.reduce((sum, s) => sum + s.billed, 0);
  const totalPaid = projectStats.reduce((sum, s) => sum + s.paid, 0);

  const chartData = projectStats.map(s => ({
    name: s.name.length > 15 ? s.name.slice(0, 15) + '...' : s.name,
    budget: s.budget,
    committed: s.committed,
    billed: s.billed,
    paid: s.paid
  }));

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) return <div className="p-8 text-center">Loading Budget Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Budget vs Actual Analytics</h2>
          <p className="text-sm text-[#6b7280]">Real-time financial tracking across all construction projects.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-[#6b7280]">Total Portfolio Budget</CardTitle>
            <Target className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-[10px] text-slate-500 mt-1">Total allocated across {projects.length} projects</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-[#6b7280]">Total Committed (WO)</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommitted)}</div>
            <p className="text-[10px] text-amber-600 font-bold mt-1">
              {totalBudget > 0 ? ((totalCommitted / totalBudget) * 100).toFixed(1) : '0.0'}% of total budget used
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-[#6b7280]">Total Billed</CardTitle>
            <FileCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBilled)}</div>
            <p className="text-[10px] text-slate-500 mt-1">Liability recorded so far</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-[#6b7280]">Total Paid (Actual)</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">Cash outflow completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Project Financial Comparison</CardTitle>
            <CardDescription className="text-xs">Budget vs Commitment vs Cash Flow per Project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value / 100000}L`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="committed" name="Committed (WO)" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="paid" name="Paid (Actual)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Risk Projects</CardTitle>
            <CardDescription className="text-xs">Projects exceeding 90% of budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectStats
              .filter(s => s.percentageUsed > 90)
              .sort((a, b) => b.percentageUsed - a.percentageUsed)
              .map(s => (
                <div key={s.projectId} className="p-3 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold truncate max-w-[150px]">{s.name}</span>
                    <Badge variant={s.percentageUsed > 100 ? "destructive" : "secondary"}>
                      {s.percentageUsed.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={s.percentageUsed} className={cn(
                    "h-1.5",
                    s.percentageUsed > 100 ? "bg-red-100" : "bg-amber-100"
                  )} />
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Commit: {formatCurrency(s.committed)}</span>
                    <span className={cn(
                      "font-bold",
                      s.variance < 0 ? "text-red-600" : "text-amber-600"
                    )}>
                      {s.variance < 0 ? `Over: ${formatCurrency(Math.abs(s.variance))}` : `Avail: ${formatCurrency(s.variance)}`}
                    </span>
                  </div>
                </div>
              ))}
            {projectStats.filter(s => s.percentageUsed > 90).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-10 opacity-50">
                <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-xs">No budget risks identified</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Detailed Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#f9fafb] transition-colors border-b border-slate-100">
                <TableHead className="text-[10px] uppercase font-bold">Project</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Budget</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Committed (WO)</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Billed</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Paid</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Variance</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">% Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectStats.map((s) => (
                <TableRow key={s.projectId} className="border-b border-slate-50">
                  <TableCell className="font-semibold text-xs">{s.name}</TableCell>
                  <TableCell className="font-mono text-xs">{formatCurrency(s.budget)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatCurrency(s.committed)}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{formatCurrency(s.billed)}</TableCell>
                  <TableCell className="font-mono text-xs text-emerald-600 font-bold">{formatCurrency(s.paid)}</TableCell>
                  <TableCell className={cn(
                    "font-mono text-xs font-bold",
                    s.variance < 0 ? "text-red-600" : "text-emerald-600"
                  )}>
                    {formatCurrency(s.variance)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            s.percentageUsed > 100 ? "bg-red-500" : s.percentageUsed > 80 ? "bg-amber-500" : "bg-emerald-500"
                          )} 
                          style={{ width: `${Math.min(s.percentageUsed, 100)}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-bold min-w-[30px]">{s.percentageUsed.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
