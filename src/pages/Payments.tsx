import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEffectiveCompanyScope } from '../lib/userAccess';
import { billService } from '../services/billService';
import { workOrderService } from '../services/workOrderService';
import { paymentService } from '../services/paymentService';
import { Bill, WorkOrder, Payment, BusinessRuleError } from '../types';
import { PaymentCalendar } from '../components/PaymentCalendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { formatCurrency, cn } from '../lib/utils';
import { Receipt, Search, Filter, CheckCircle2, Send, CreditCard, Clock, History } from 'lucide-react';
import { Input } from '../components/ui/input';
import { SkeletonRow } from '../components/Skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Payments() {
  const { user, profile, isAdmin, isCEO, isAccounts } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubBills = billService.getAll((data) => {
      setBills(data);
    });
    const unsubWO = workOrderService.getAll((data) => {
      setWorkOrders(data);
    });
    const unsubPayments = paymentService.getAll((data) => {
      setPayments(data);
      setLoading(false);
    });

    return () => {
      unsubBills();
      unsubWO();
      unsubPayments();
    };
  }, []);

  const getWorkOrderTitle = (id: string) => workOrders.find(wo => wo.id === id)?.title || 'Unknown';
  const getWorkOrderNumber = (id: string) => workOrders.find(wo => wo.id === id)?.woNumber || 'N/A';
  const getBillByPaymentId = (billId: string) => bills.find(b => b.id === billId);

  const handleInitiatePayment = async (bill: Bill) => {
    try {
      if (!user) return;
      
      const paymentData: Omit<Payment, 'id' | 'createdAt' | 'createdBy'> = {
        billId: bill.id,
        amount: bill.netPayable,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        status: 'PENDING',
        type: 'PAYMENT'
      };

      await paymentService.create(paymentData);
      toast.success('Payment request initiated');
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to initiate payment');
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      if (!user) return;
      await paymentService.approve(paymentId, user.uid);
      toast.success('Payment request approved');
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to approve payment');
    }
  };

  const handleReleasePayment = async (payment: Payment) => {
    try {
      if (!user) return;
      await paymentService.release(payment.id, user.uid, payment.billId);
      toast.success('Payment released successfully');
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to release payment');
    }
  };

  // Multi-company scoping. ADMIN/CEO unrestricted; ACCOUNTS (and other
  // scoped roles) see only bills/payments tied to work orders in the
  // user's assignedCompanyIds. Applied before the status splits so every
  // downstream section (pending/approved/released/billsToInitiate) stays
  // consistent.
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);
  const scopedBills = useMemo(() => {
    if (scope.unrestricted) return bills;
    const companyIds = new Set(scope.ids);
    const woIds = new Set(
      workOrders.filter(wo => wo.companyId && companyIds.has(wo.companyId)).map(wo => wo.id)
    );
    return bills.filter(b => woIds.has(b.workOrderId));
  }, [bills, workOrders, scope]);
  const scopedPayments = useMemo(() => {
    if (scope.unrestricted) return payments;
    const scopedBillIds = new Set(scopedBills.map(b => b.id));
    return payments.filter(p => scopedBillIds.has(p.billId));
  }, [payments, scopedBills, scope]);

  const pendingPayments = scopedPayments.filter(p => p.status === 'PENDING');
  const approvedPayments = scopedPayments.filter(p => p.status === 'APPROVED');
  const releasedPayments = scopedPayments.filter(p => p.status === 'RELEASED');

  const billsToInitiate = scopedBills.filter(b =>
    (b.status === 'APPROVED' || b.status === 'PARTIALLY_PAID') &&
    !scopedPayments.some(p => p.billId === b.id && (p.status === 'PENDING' || p.status === 'APPROVED'))
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">Payment Management</h1>
          <p className="text-sm text-[#6b7280]">Manage payment requests and approval workflows.</p>
        </div>
      </div>

      <PaymentCalendar bills={bills} workOrders={workOrders} />

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-6">
          <TabsTrigger value="queue" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Clock className="h-4 w-4 mr-2" />
            Approval Queue
          </TabsTrigger>
          <TabsTrigger value="initiate" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Send className="h-4 w-4 mr-2" />
            Initiate Payment
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pending CEO Approval */}
            <Card className="bg-white border-[#e5e7eb] shadow-sm overflow-hidden">
              <CardHeader className="border-b border-[#e5e7eb] py-4 px-6">
                <CardTitle className="text-sm font-bold flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  Pending CEO Approval ({pendingPayments.length})
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-tight">Vouchers needing signature</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                      <TableHead className="px-4 py-2 text-[9px] font-black uppercase text-[#6b7280]">Bill</TableHead>
                      <TableHead className="px-4 py-2 text-[9px] font-black uppercase text-[#6b7280]">Amount</TableHead>
                      <TableHead className="px-4 py-2 text-[9px] font-black uppercase text-[#6b7280] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="h-24 text-center text-xs font-medium text-[#6b7280]">No pending approvals</TableCell></TableRow>
                    ) : (
                      pendingPayments.map(p => {
                        const bill = getBillByPaymentId(p.billId);
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="px-4 py-3">
                              <p className="text-xs font-bold text-[#1e293b]">{bill?.billNumber || 'Unk'}</p>
                              <p className="text-[8px] text-[#6b7280]">{getWorkOrderTitle(bill?.workOrderId || '')}</p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs font-black">{formatCurrency(p.amount)}</TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              {(isAdmin || isCEO) && (
                                <button 
                                  onClick={() => handleApprovePayment(p.id)}
                                  className="text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-700"
                                >
                                  Approve
                                </button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Approved - Ready to Release */}
            <Card className="bg-white border-[#e5e7eb] shadow-sm overflow-hidden">
              <CardHeader className="border-b border-[#e5e7eb] py-4 px-6">
                <CardTitle className="text-sm font-bold flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                  Ready to Release ({approvedPayments.length})
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-tight">Approved by CEO, needing Bank transfer</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                      <TableHead className="px-4 py-2 text-[9px] font-black uppercase text-[#6b7280]">Bill</TableHead>
                      <TableHead className="px-4 py-2 text-[9px] font-black uppercase text-[#6b7280]">Amount</TableHead>
                      <TableHead className="px-4 py-2 text-[9px] font-black uppercase text-[#6b7280] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedPayments.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="h-24 text-center text-xs font-medium text-[#6b7280]">Nothing to release</TableCell></TableRow>
                    ) : (
                      approvedPayments.map(p => {
                        const bill = getBillByPaymentId(p.billId);
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="px-4 py-3">
                              <p className="text-xs font-bold text-[#1e293b]">{bill?.billNumber || 'Unk'}</p>
                              <p className="text-[8px] text-[#6b7280]">{getWorkOrderTitle(bill?.workOrderId || '')}</p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs font-black">{formatCurrency(p.amount)}</TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              {(isAdmin || isAccounts) && (
                                <button 
                                  onClick={() => handleReleasePayment(p)}
                                  className="text-[9px] font-black uppercase text-blue-600 hover:text-blue-700"
                                >
                                  Release
                                </button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="initiate" className="space-y-6">
          <Card className="bg-white border-[#e5e7eb] shadow-sm overflow-hidden">
            <CardHeader className="border-b border-[#e5e7eb] py-4 px-6">
              <CardTitle className="text-sm font-bold">Approved Bills (Ready for Payment Request)</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-tight">Select a bill to start the payment approval cycle</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Bill Number</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Work Order</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Net Payable</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billsToInitiate.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center text-xs font-medium text-[#6b7280]">No bills available for payment request</TableCell></TableRow>
                  ) : (
                    billsToInitiate.map(bill => (
                      <TableRow key={bill.id}>
                        <TableCell className="px-6 py-4 text-xs font-bold">{bill.billNumber}</TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="text-xs font-bold">{getWorkOrderTitle(bill.workOrderId)}</p>
                          <p className="text-[9px] text-[#6b7280]">{getWorkOrderNumber(bill.workOrderId)}</p>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs font-black">{formatCurrency(bill.netPayable)}</TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          {(isAdmin || isAccounts) && (
                            <button 
                              onClick={() => handleInitiatePayment(bill)}
                              className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] hover:text-[#1d4ed8]"
                            >
                              Request Payment
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white border-[#e5e7eb] shadow-sm overflow-hidden">
            <CardHeader className="border-b border-[#e5e7eb] py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Payment History</CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-tight">Completed bank transfers and released payments</CardDescription>
              </div>
              <div className="flex items-center gap-2 max-w-xs bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
                <Search className="h-4 w-4 text-[#6b7280]" />
                <Input 
                  placeholder="Search payments..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 bg-transparent h-7 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Date</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Bill</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Work Order</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Amount</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Method</TableHead>
                    <TableHead className="px-6 py-3 text-[10px] font-black uppercase text-[#6b7280]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} columns={6} />
                    ))
                  ) : releasedPayments.length > 0 ? (
                    releasedPayments
                      .filter(p => 
                        getWorkOrderTitle(getBillByPaymentId(p.billId)?.workOrderId || '').toLowerCase().includes(search.toLowerCase()) ||
                        getBillByPaymentId(p.billId)?.billNumber.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((p) => {
                        const bill = getBillByPaymentId(p.billId);
                        return (
                          <TableRow key={p.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                            <TableCell className="px-6 py-4 text-xs font-medium text-[#6b7280]">
                              {new Date(p.paymentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-xs font-bold text-[#1e293b]">
                              {bill?.billNumber || 'Deleted'}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <p className="text-xs font-bold text-[#1e293b]">{getWorkOrderTitle(bill?.workOrderId || '')}</p>
                              <p className="text-[9px] text-[#6b7280] font-bold uppercase tracking-tighter">{getWorkOrderNumber(bill?.workOrderId || '')}</p>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-xs font-black text-[#1e293b]">
                              {formatCurrency(p.amount)}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                              {p.paymentMethod}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border-none bg-green-600 text-white">
                                RELEASED
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-[#6b7280] text-xs font-medium">
                        No released payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
