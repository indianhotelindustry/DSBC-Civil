import React, { useEffect, useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { variationOrderService as voService } from '../services/variationOrderService';
import { workOrderService } from '../services/workOrderService';
import { VariationOrder, WorkOrder, BusinessRuleError } from '../types';
import { getEffectiveCompanyScope } from '../lib/userAccess';
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
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../components/ui/dialog";
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { cn, formatCurrency } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';

export default function VariationOrders() {
  const { isAdmin, isPM, isCEO, user, profile } = useAuth();
  const [variationOrders, setVariationOrders] = useState<VariationOrder[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWO, setSelectedWO] = useState<string>('');
  
  const [formData, setFormData] = useState({
    description: '',
    reason: '',
    amount: 0,
    voNumber: ''
  });

  useEffect(() => {
    const unsubVO = voService.getAll((data) => {
      setVariationOrders(data);
      checkLoading();
    });
    const unsubWO = workOrderService.getAll((data) => {
      setWorkOrders(data.filter(wo => wo.status === 'APPROVED' || wo.status === 'COMPLETED'));
      checkLoading();
    });
    
    const checkLoading = () => {
      setLoading(false);
    };

    return () => {
      unsubVO();
      unsubWO();
    };
  }, []);

  // Multi-company scoping. Variation orders don't carry companyId
  // directly — they reference a workOrderId, so scope is enforced via
  // the parent WO's companyId. ADMIN/CEO are unrestricted; ACCOUNTS
  // and PM see only VOs whose parent WO is in their assignedCompanyIds.
  const scope = useMemo(() => getEffectiveCompanyScope(profile), [profile]);
  const scopedWOIds = useMemo(() => {
    if (scope.unrestricted) return null; // null sentinel → no filter
    const allowed = new Set(scope.ids);
    return new Set(
      workOrders.filter(wo => wo.companyId && allowed.has(wo.companyId)).map(wo => wo.id)
    );
  }, [workOrders, scope]);

  const filteredVO = variationOrders.filter(vo => {
    if (scopedWOIds !== null && !scopedWOIds.has(vo.workOrderId)) return false;
    const wo = workOrders.find(w => w.id === vo.workOrderId);
    return vo.voNumber.toLowerCase().includes(search.toLowerCase()) ||
           vo.description.toLowerCase().includes(search.toLowerCase()) ||
           wo?.woNumber.toLowerCase().includes(search.toLowerCase()) ||
           wo?.title.toLowerCase().includes(search.toLowerCase());
  });

  const handleOpenDialog = () => {
    setFormData({
      description: '',
      reason: '',
      amount: 0,
      voNumber: `VO-${Date.now().toString().slice(-6)}`
    });
    setSelectedWO('');
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWO) {
      toast.error('Please select a Work Order');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await voService.create({
        ...formData,
        workOrderId: selectedWO,
        status: 'DRAFT'
      });
      toast.success('Variation Order created for approval');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to create variation order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      if (!user) return;
      await voService.approve(id, user.uid);
      toast.success('Variation Order approved and Work Order updated');
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      if (!user) return;
      await voService.reject(id, user.uid);
      toast.success('Variation Order rejected');
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Rejection failed');
    }
  };

  const getWO = (id: string) => workOrders.find(wo => wo.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Variation Orders</h2>
          <p className="text-sm text-[#6b7280]">Manage scope changes and financial variances.</p>
        </div>
        {(isAdmin || isPM) && (
          <Button onClick={handleOpenDialog} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Variation Order
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 max-w-sm bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
        <Search className="h-4 w-4 text-[#6b7280]" />
        <Input 
          placeholder="Search Variation Orders..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 bg-transparent h-8 text-sm"
        />
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">VO Number</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Work Order</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Description</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Amount</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={6} />
              ))
            ) : filteredVO.length > 0 ? (
              filteredVO.map((vo) => {
                const wo = getWO(vo.workOrderId);
                return (
                  <TableRow key={vo.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                    <TableCell className="px-6 py-4 font-bold text-sm">{vo.voNumber}</TableCell>
                    <TableCell className="px-6 py-4 max-w-[220px]">
                      <p className="text-xs font-semibold truncate" title={wo?.title || ''}>{wo?.title || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{wo?.woNumber}</p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs max-w-[260px] truncate" title={vo.description}>
                      {vo.description}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-mono text-sm text-[#2563eb]">
                      +{formatCurrency(vo.amount)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none",
                        vo.status === 'APPROVED' ? 'bg-[#d1fae5] text-[#065f46]' : 
                        vo.status === 'DRAFT' ? 'bg-[#fef3c7] text-[#92400e]' : 
                        'bg-[#fee2e2] text-[#991b1b]'
                      )}>
                        {vo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      {vo.status === 'DRAFT' && (isAdmin || isCEO) && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="text-emerald-600 h-8 px-2" onClick={() => handleApprove(vo.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="text-rose-600 h-8 px-2" onClick={() => handleReject(vo.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-xs font-medium text-[#6b7280]">
                  No variation orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Variation Order</DialogTitle>
            <DialogDescription>Submit a change request for an existing Work Order.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="wo">Select Work Order</Label>
              <Select value={selectedWO} onValueChange={setSelectedWO}>
                <SelectTrigger id="wo">
                  <SelectValue placeholder="Select Work Order">
                    {selectedWO ? (() => { const wo = workOrders.find(w => w.id === selectedWO); return wo ? `${wo.woNumber} - ${wo.title}` : undefined; })() : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {workOrders.map((wo) => (
                    <SelectItem key={wo.id} value={wo.id}>
                      {wo.woNumber} - {wo.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="voNumber">VO Number</Label>
              <Input 
                id="voNumber" 
                value={formData.voNumber} 
                onChange={(e) => setFormData({...formData, voNumber: e.target.value})}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description of Change</Label>
              <Textarea
                id="desc"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="What exactly is changing in the scope?"
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Additional Amount (Liability Increase)</Label>
              <Input 
                id="amount" 
                type="number"
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                required
                min={1}
              />
              <p className="text-[10px] text-amber-600 font-bold flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> This will increase the Work Order value after approval.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Variation</Label>
              <Select 
                value={formData.reason} 
                onValueChange={(val) => setFormData({...formData, reason: val})}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select Reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design Change">Design Change</SelectItem>
                  <SelectItem value="Site Condition">Site Condition</SelectItem>
                  <SelectItem value="Client Request">Client Request</SelectItem>
                  <SelectItem value="Scope Addition">Scope Addition</SelectItem>
                  <SelectItem value="Error in Initial Estimate">Error in Initial Estimate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#2563eb]" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
