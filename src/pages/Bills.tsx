import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit, Trash2, Receipt, CheckCircle, ShieldCheck, CreditCard, XCircle, Eye, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { billService } from '../services/billService';
import { workOrderService } from '../services/workOrderService';
import { projectService } from '../services/projectService';
import { contractorService } from '../services/contractorService';
import { companyService } from '../services/companyService';
import { subLocationService } from '../services/subLocationService';
import { Bill, WorkOrder, Project, Contractor, Company, SubLocation, BusinessRuleError } from '../types';
import { recalculateBillTotals } from '../lib/financialCalculationService';
import { BillPrint } from '../components/BillPrint';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { cn, formatCurrency } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';
import { getEffectiveCompanyScope } from '../lib/userAccess';

export default function Bills() {
  const { user, profile, isAdmin, isAccounts, isPM, isCEO } = useAuth();
  // Optional ?status= deep-link from dashboard KPI cards.
  const [searchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') || 'all').toUpperCase();
  const [filterStatus, setFilterStatus] = useState<string>(
    ['DRAFT', 'VERIFIED', 'APPROVED', 'PARTIALLY_PAID', 'PAID', 'REJECTED'].includes(initialStatus) ? initialStatus : 'all'
  );
  const [bills, setBills] = useState<Bill[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subLocations, setSubLocations] = useState<SubLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [viewingBill, setViewingBill] = useState<Bill | null>(null);
  const [printingBill, setPrintingBill] = useState<Bill | null>(null);
  
  const [formData, setFormData] = useState({
    billNumber: '',
    workOrderId: '',
    billDate: new Date().toISOString().split('T')[0],
    workDoneAmount: 0,
    previousBillAmount: 0,
    tdsPercentage: 2,
    retentionPercentage: 5,
    advanceAdjustment: 0,
    status: 'DRAFT' as Bill['status']
  });

  useEffect(() => {
    const unsubBills = billService.getAll((data) => {
      setBills(data);
      checkLoading();
    });
    const unsubWO = workOrderService.getAll((data) => {
      setWorkOrders(data);
      checkLoading();
    });
    // Additional master subscriptions so the print dialog can resolve
    // project / contractor / company / sub-location off a WO reference
    // without re-fetching on every print click.
    const unsubProjects = projectService.getAll(setProjects);
    const unsubContractors = contractorService.getAll(setContractors);
    const unsubCompanies = companyService.getAll(setCompanies);
    const unsubSL = subLocationService.getAll(setSubLocations);

    const checkLoading = () => {
      setLoading(false);
    };

    return () => {
      unsubBills();
      unsubWO();
      unsubProjects();
      unsubContractors();
      unsubCompanies();
      unsubSL();
    };
  }, []);

  const handlePrint = (bill: Bill) => {
    setPrintingBill(bill);
    setIsPrintOpen(true);
  };

  const selectedWO = useMemo(() => 
    workOrders.find(wo => wo.id === formData.workOrderId),
  [formData.workOrderId, workOrders]);

  const previousBilledForWO = useMemo(() => {
    if (!formData.workOrderId) return 0;
    return bills
      .filter(b => b.workOrderId === formData.workOrderId && b.id !== editingBill?.id && b.status !== 'REJECTED')
      .reduce((sum, b) => sum + b.workDoneAmount, 0);
  }, [formData.workOrderId, bills, editingBill]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, previousBillAmount: previousBilledForWO }));
  }, [previousBilledForWO]);

  const calculations = useMemo(() => recalculateBillTotals({
    workDoneAmount: formData.workDoneAmount,
    previousBillAmount: formData.previousBillAmount,
    tdsPercentage: formData.tdsPercentage,
    retentionPercentage: formData.retentionPercentage,
    advanceAdjustment: formData.advanceAdjustment,
  }), [formData]);

  // Multi-company scoping: ADMIN/CEO are unrestricted; ACCOUNTS (and any
  // other scoped role) only sees bills linked to work orders in their
  // assignedCompanyIds. Company filtering runs BEFORE the text search so
  // the search scope is intuitive to a scoped user.
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);
  const scopedWOIds = useMemo(() => {
    if (scope.unrestricted) return null; // null = "no filter"
    const ids = new Set(scope.ids);
    return new Set(workOrders.filter(wo => wo.companyId && ids.has(wo.companyId)).map(wo => wo.id));
  }, [workOrders, scope]);

  const filteredBills = bills.filter(b => {
    if (scopedWOIds !== null && !scopedWOIds.has(b.workOrderId)) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    const needle = search.toLowerCase();
    if (!needle) return true;
    return b.billNumber.toLowerCase().includes(needle) ||
      workOrders.find(wo => wo.id === b.workOrderId)?.title.toLowerCase().includes(needle);
  });

  const handleOpenDialog = (bill?: Bill) => {
    if (bill) {
      setEditingBill(bill);
      setFormData({
        billNumber: bill.billNumber,
        workOrderId: bill.workOrderId,
        billDate: bill.billDate,
        workDoneAmount: bill.workDoneAmount,
        previousBillAmount: bill.previousBillAmount,
        tdsPercentage: bill.tdsPercentage,
        retentionPercentage: bill.retentionPercentage,
        advanceAdjustment: bill.advanceAdjustment,
        status: bill.status
      });
    } else {
      setEditingBill(null);
      setFormData({
        billNumber: `BILL-${Date.now().toString().slice(-6)}`,
        workOrderId: '',
        billDate: new Date().toISOString().split('T')[0],
        workDoneAmount: 0,
        previousBillAmount: 0,
        tdsPercentage: 2,
        retentionPercentage: 5,
        advanceAdjustment: 0,
        status: 'DRAFT'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      ...calculations,
      currentBillAmount: formData.previousBillAmount + formData.workDoneAmount
    };

    try {
      if (editingBill) {
        await billService.update(editingBill.id, finalData);
        toast.success('Bill updated successfully');
      } else {
        await billService.create(finalData);
        toast.success('Bill created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to save bill');
    }
  };

  const handleStatusUpdate = async (bill: Bill, action: 'verify' | 'approve' | 'reject') => {
    if (!user) return;
    try {
      switch (action) {
        case 'verify':
          await billService.verify(bill.id, user.uid);
          toast.success('Bill verified by PM');
          break;
        case 'approve':
          await billService.approve(bill.id, user.uid);
          toast.success('Bill approved by CEO');
          break;
        case 'reject':
          await billService.update(bill.id, { status: 'REJECTED' });
          toast.success('Bill rejected');
          break;
      }
      setIsViewOpen(false);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Action failed');
    }
  };

  const getWOTitle = (id: string) => workOrders.find(wo => wo.id === id)?.title || 'Unknown Work Order';

  const getStatusBadge = (status: Bill['status']) => {
    switch (status) {
      case 'DRAFT': return <Badge className="bg-slate-100 text-slate-600 border-none">Draft</Badge>;
      case 'VERIFIED': return <Badge className="bg-blue-100 text-blue-600 border-none">Verified</Badge>;
      case 'APPROVED': return <Badge className="bg-emerald-100 text-emerald-600 border-none">Approved</Badge>;
      case 'PARTIALLY_PAID': return <Badge className="bg-amber-100 text-amber-700 border-none">Partial</Badge>;
      case 'PAID': return <Badge className="bg-green-600 text-white border-none">Paid</Badge>;
      case 'REJECTED': return <Badge className="bg-rose-100 text-rose-600 border-none">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight">Contractor Bills</h2>
          <p className="text-sm text-[#6b7280]">Manage multi-stage approval flow for contractor invoices.</p>
        </div>
        {(isAdmin || isAccounts) && (
          <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black uppercase tracking-widest">
            <Plus className="mr-2 h-4 w-4" /> New Bill
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 max-w-sm bg-white rounded-xl border border-[#e5e7eb] px-3 py-1.5 shadow-sm">
          <Search className="h-4 w-4 text-[#6b7280]" />
          <Input
            placeholder="Search by bill number or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-8 text-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44 h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Bill No.</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Work Order</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Date</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280] text-right">Net Payable</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={6} />
              ))
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <TableRow key={bill.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 font-black text-xs text-[#1e293b]">{bill.billNumber}</TableCell>
                  <TableCell className="px-6 py-4 max-w-[260px]">
                    <p className="text-xs font-bold text-[#1e293b] truncate" title={getWOTitle(bill.workOrderId)}>
                      {getWOTitle(bill.workOrderId)}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs font-medium text-[#6b7280]">{bill.billDate}</TableCell>
                  <TableCell className="px-6 py-4 text-right font-black text-xs text-[#2563eb]">
                    {formatCurrency(bill.netPayable)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(bill.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#6b7280]"
                        onClick={() => {
                          setViewingBill(bill);
                          setIsViewOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#6b7280]"
                        onClick={() => handlePrint(bill)}
                        title="Print / Save as PDF"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          {(isAdmin || (isAccounts && bill.status === 'DRAFT')) && (
                            <DropdownMenuItem onClick={() => handleOpenDialog(bill)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => billService.delete(bill.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-xs font-medium text-[#6b7280]">
                  No bills found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bill Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">
              {editingBill ? 'Edit Bill' : 'Create New Bill'}
            </DialogTitle>
            <DialogDescription>
              Fill in the work done and deductions. Totals are auto-calculated.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="billNumber" className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Bill Number</Label>
                  <Input 
                    id="billNumber" 
                    value={formData.billNumber} 
                    onChange={(e) => setFormData({...formData, billNumber: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workOrder" className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Work Order</Label>
                  <Select 
                    value={formData.workOrderId} 
                    onValueChange={(v) => setFormData({...formData, workOrderId: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select work order">
                        {formData.workOrderId ? (() => { const wo = workOrders.find(w => w.id === formData.workOrderId); return wo ? `${wo.woNumber} - ${wo.title}` : undefined; })() : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {workOrders
                        .filter(wo => wo.status === 'APPROVED')
                        // Scope leak guard: ACCOUNTS must only see WOs
                        // in their assignedCompanyIds. The filteredBills
                        // list above already scopes — this dropdown did
                        // not, so a scoped user could attach a bill to
                        // a WO outside their companies.
                        .filter(wo => scopedWOIds === null || scopedWOIds.has(wo.id))
                        .map(wo => (
                          <SelectItem key={wo.id} value={wo.id}>{wo.woNumber} - {wo.title}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billDate" className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Bill Date</Label>
                  <Input 
                    id="billDate" 
                    type="date"
                    value={formData.billDate} 
                    onChange={(e) => setFormData({...formData, billDate: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Work Details</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="prevAmount" className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Previous Billed (₹)</Label>
                    <Input 
                      id="prevAmount" 
                      type="number"
                      value={formData.previousBillAmount} 
                      readOnly
                      className="bg-slate-100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="workDone" className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Current Work Done (₹)</Label>
                    <Input 
                      id="workDone" 
                      type="number"
                      value={formData.workDoneAmount} 
                      onChange={(e) => setFormData({...formData, workDoneAmount: Number(e.target.value)})} 
                      required 
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Cumulative:</span>
                      <span>{formatCurrency(calculations.currentBillAmount)}</span>
                    </div>
                    {selectedWO && (
                      <div className="flex justify-between text-[10px] text-[#6b7280] mt-1">
                        <span>WO Limit:</span>
                        <span>{formatCurrency(selectedWO.amount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb]">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">TDS (%)</Label>
                <Input 
                  type="number" 
                  value={formData.tdsPercentage} 
                  onChange={(e) => setFormData({...formData, tdsPercentage: Number(e.target.value)})} 
                />
                <p className="text-[10px] text-[#6b7280] font-bold">Amt: {formatCurrency(calculations.tdsAmount)}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Retention (%)</Label>
                <Input 
                  type="number" 
                  value={formData.retentionPercentage} 
                  onChange={(e) => setFormData({...formData, retentionPercentage: Number(e.target.value)})} 
                />
                <p className="text-[10px] text-[#6b7280] font-bold">Amt: {formatCurrency(calculations.retentionAmount)}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Adv. Adj (₹)</Label>
                <Input 
                  type="number" 
                  value={formData.advanceAdjustment} 
                  onChange={(e) => setFormData({...formData, advanceAdjustment: Number(e.target.value)})} 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-[#2563eb] text-white rounded-xl shadow-lg">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Net Payable Amount</p>
                <p className="text-3xl font-black">{formatCurrency(calculations.netPayable)}</p>
              </div>
              <Receipt className="h-10 w-10 opacity-20" />
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-black uppercase tracking-widest h-12">
                {editingBill ? 'Update Bill' : 'Generate Bill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Print / PDF dialog — mirrors Work Orders. The BillPrint
          component carries the `print-document` class; the global
          @media print rules in index.css hide everything else on the
          page when window.print() is invoked. */}
      <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[230mm] max-h-[95vh] overflow-y-auto bg-slate-100 p-8" showCloseButton={false}>
          <div className="flex justify-end mb-4 print:hidden">
            <Button onClick={() => window.print()} className="bg-[#1f2937] text-white">
              <Printer className="mr-2 h-4 w-4" /> Print PDF
            </Button>
          </div>
          {printingBill && (() => {
            const wo = workOrders.find(w => w.id === printingBill.workOrderId);
            return (
              <div data-print-root="bill">
                <BillPrint
                  bill={printingBill}
                  workOrder={wo}
                  project={wo ? projects.find(p => p.id === wo.projectId) : undefined}
                  contractor={wo ? contractors.find(c => c.id === wo.contractorId) : undefined}
                  company={wo ? companies.find(c => c.id === wo.companyId) : undefined}
                  subLocation={wo ? subLocations.find(sl => sl.id === wo.subLocationId) : undefined}
                />
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Bill View/Approval Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {viewingBill && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
                    {viewingBill.billNumber}
                  </Badge>
                  {getStatusBadge(viewingBill.status)}
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight">
                  {getWOTitle(viewingBill.workOrderId)}
                </DialogTitle>
                <DialogDescription>
                  Review bill details and approval status.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Work Done (Current)</p>
                      <p className="text-lg font-black text-[#111827]">{formatCurrency(viewingBill.workDoneAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Previous Billed</p>
                      <p className="text-sm font-bold text-[#6b7280]">{formatCurrency(viewingBill.previousBillAmount)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Net Payable</p>
                      <p className="text-lg font-black text-[#2563eb]">{formatCurrency(viewingBill.netPayable)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-1">Deductions Total</p>
                      <p className="text-sm font-bold text-rose-600">
                        -{formatCurrency(viewingBill.tdsAmount + viewingBill.retentionAmount + viewingBill.advanceAdjustment)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-4">Approval Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        viewingBill.verifiedAt ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                      )}>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e293b]">Verification (PM)</p>
                        <p className="text-[10px] text-[#6b7280]">
                          {viewingBill.verifiedAt ? `Verified on ${new Date(viewingBill.verifiedAt).toLocaleDateString()}` : 'Pending verification'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        viewingBill.approvedAt ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e293b]">Approval (CEO)</p>
                        <p className="text-[10px] text-[#6b7280]">
                          {viewingBill.approvedAt ? `Approved on ${new Date(viewingBill.approvedAt).toLocaleDateString()}` : 'Pending CEO approval'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        viewingBill.paidAt ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e293b]">Payment Release (Accounts)</p>
                        <p className="text-[10px] text-[#6b7280]">
                          {viewingBill.paidAt ? `Paid on ${new Date(viewingBill.paidAt).toLocaleDateString()}` : 'Pending payment'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {isPM && viewingBill.status === 'DRAFT' && (
                    <Button onClick={() => handleStatusUpdate(viewingBill, 'verify')} className="bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-widest">
                      Verify Bill
                    </Button>
                  )}
                  {isCEO && viewingBill.status === 'VERIFIED' && (
                    <Button onClick={() => handleStatusUpdate(viewingBill, 'approve')} className="bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest">
                      Approve Payment
                    </Button>
                  )}
                  {isAccounts && viewingBill.status === 'APPROVED' && (
                    <div className="text-[10px] font-medium text-[#6b7280] italic">
                      To release payment, go to the Payments page (amount is verified there).
                    </div>
                  )}
                  {(isPM || isCEO) && ['DRAFT', 'VERIFIED'].includes(viewingBill.status) && (
                    <Button variant="outline" onClick={() => handleStatusUpdate(viewingBill, 'reject')} className="text-rose-600 border-rose-100 hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest">
                      Reject Bill
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
