import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vendorService } from '../services/vendorService';
import { Vendor, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';
import { validateGSTIN, validateIFSC, validatePAN } from '../lib/masterValidations';

type FormData = {
  name: string; code: string; phone: string; email: string; address: string;
  gstin: string; pan: string; bankName: string; bankAccount: string; bankIfsc: string;
  contactPerson: string; paymentTermsDays: string; isActive: boolean;
};

const EMPTY_FORM: FormData = {
  name: '', code: '', phone: '', email: '', address: '',
  gstin: '', pan: '', bankName: '', bankAccount: '', bankIfsc: '',
  contactPerson: '', paymentTermsDays: '', isActive: true,
};

export default function Vendors() {
  const { isAdmin, isSuperAdmin, isPurchaseManager } = useAuth();
  const canEdit = isAdmin || isSuperAdmin || isPurchaseManager;

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [showBankFields, setShowBankFields] = useState(false);

  useEffect(() => {
    const unsub = vendorService.getAll(data => { setVendors(data); setLoading(false); });
    return () => unsub();
  }, []);

  const openDialog = (vendor?: Vendor) => {
    if (vendor) {
      setEditing(vendor);
      setFormData({
        name: vendor.name,
        code: vendor.code ?? '',
        phone: vendor.phone,
        email: vendor.email ?? '',
        address: vendor.address ?? '',
        gstin: vendor.gstin ?? '',
        pan: vendor.pan ?? '',
        bankName: vendor.bankName ?? '',
        bankAccount: vendor.bankAccount ?? '',
        bankIfsc: vendor.bankIfsc ?? '',
        contactPerson: vendor.contactPerson ?? '',
        paymentTermsDays: vendor.paymentTermsDays != null ? String(vendor.paymentTermsDays) : '',
        isActive: vendor.isActive !== false,
      });
      setShowBankFields(!!(vendor.bankName || vendor.bankAccount || vendor.bankIfsc));
    } else {
      setEditing(null);
      setFormData(EMPTY_FORM);
      setShowBankFields(false);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.gstin && !validateGSTIN(formData.gstin)) {
      toast.error('GSTIN format is invalid (15 characters, e.g. 27AAPFU0939F1ZV)');
      return;
    }
    if (formData.pan && !validatePAN(formData.pan)) {
      toast.error('PAN format is invalid (10 characters, e.g. ABCDE1234F)');
      return;
    }
    if (formData.bankIfsc && !validateIFSC(formData.bankIfsc)) {
      toast.error('IFSC format is invalid (11 characters, e.g. HDFC0001234)');
      return;
    }
    try {
      const payload = {
        name: formData.name,
        code: formData.code || undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address || undefined,
        gstin: formData.gstin || undefined,
        pan: formData.pan || undefined,
        bankName: formData.bankName || undefined,
        bankAccount: formData.bankAccount || undefined,
        bankIfsc: formData.bankIfsc || undefined,
        contactPerson: formData.contactPerson || undefined,
        paymentTermsDays: formData.paymentTermsDays ? Number(formData.paymentTermsDays) : undefined,
        isActive: formData.isActive,
      };
      if (editing) {
        await vendorService.update(editing.id, payload);
        toast.success('Vendor updated');
      } else {
        await vendorService.create(payload);
        toast.success('Vendor created');
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to save');
    }
  };

  const handleToggleActive = async (vendor: Vendor) => {
    try {
      await vendorService.update(vendor.id, { isActive: !vendor.isActive });
      toast.success(`"${vendor.name}" marked ${!vendor.isActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (vendor: Vendor) => {
    if (!window.confirm(`Delete "${vendor.name}"? This cannot be undone.`)) return;
    try {
      await vendorService.delete(vendor.id);
      toast.success('Deleted');
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to delete');
    }
  };

  const set = (field: keyof FormData, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Vendors</h2>
          <p className="text-sm text-[#6b7280]">Supplier master data used in purchase orders and GRN.</p>
        </div>
        {canEdit && (
          <Button onClick={() => openDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Name</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] w-28">Code</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Phone</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">GSTIN</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} columns={6} />)
            ) : vendors.length > 0 ? (
              vendors.map(v => (
                <TableRow key={v.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-sm font-semibold">{v.name}</TableCell>
                  <TableCell className="px-6 py-4 text-xs font-bold text-[#6b7280]">{v.code || '—'}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{v.phone}</TableCell>
                  <TableCell className="px-6 py-4 text-xs font-mono">{v.gstin || '—'}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none',
                      v.isActive !== false ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-slate-100 text-slate-500',
                    )}>
                      {v.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(v)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(v)}>
                            {v.isActive !== false
                              ? <><ToggleLeft className="mr-2 h-4 w-4" /> Mark Inactive</>
                              : <><ToggleRight className="mr-2 h-4 w-4" /> Mark Active</>}
                          </DropdownMenuItem>
                          {(isAdmin || isSuperAdmin) && (
                            <DropdownMenuItem onClick={() => handleDelete(v)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No vendors yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} Vendor</DialogTitle>
            <DialogDescription>
              GSTIN, PAN, and IFSC are auto-uppercased on save.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="vnd-name">Vendor Name *</Label>
                <Input id="vnd-name" value={formData.name} onChange={e => set('name', e.target.value)} placeholder="e.g. ABC Suppliers Pvt Ltd" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnd-code">Vendor Code</Label>
                <Input id="vnd-code" value={formData.code} onChange={e => set('code', e.target.value)} placeholder="e.g. VND-001" className="uppercase" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnd-phone">Phone *</Label>
                <Input id="vnd-phone" value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnd-email">Email</Label>
                <Input id="vnd-email" type="email" value={formData.email} onChange={e => set('email', e.target.value)} placeholder="vendor@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnd-contact">Contact Person</Label>
                <Input id="vnd-contact" value={formData.contactPerson} onChange={e => set('contactPerson', e.target.value)} placeholder="Name" />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="vnd-address">Address</Label>
                <Textarea id="vnd-address" value={formData.address} onChange={e => set('address', e.target.value)} placeholder="Full address" rows={2} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnd-gstin">GSTIN</Label>
                <Input id="vnd-gstin" value={formData.gstin} onChange={e => set('gstin', e.target.value)} placeholder="27AAPFU0939F1ZV" className="uppercase font-mono" maxLength={15} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnd-pan">PAN</Label>
                <Input id="vnd-pan" value={formData.pan} onChange={e => set('pan', e.target.value)} placeholder="ABCDE1234F" className="uppercase font-mono" maxLength={10} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnd-terms">Payment Terms (days)</Label>
                <Input id="vnd-terms" type="number" min={0} value={formData.paymentTermsDays} onChange={e => set('paymentTermsDays', e.target.value)} placeholder="e.g. 30" />
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-xs text-[#2563eb] font-bold"
              onClick={() => setShowBankFields(p => !p)}
            >
              <ChevronDown className={cn('h-3 w-3 transition-transform', showBankFields && 'rotate-180')} />
              {showBankFields ? 'Hide' : 'Add'} Bank Details
            </button>

            {showBankFields && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="vnd-bank">Bank Name</Label>
                  <Input id="vnd-bank" value={formData.bankName} onChange={e => set('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vnd-acc">Account Number</Label>
                  <Input id="vnd-acc" value={formData.bankAccount} onChange={e => set('bankAccount', e.target.value)} placeholder="Account number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vnd-ifsc">IFSC</Label>
                  <Input id="vnd-ifsc" value={formData.bankIfsc} onChange={e => set('bankIfsc', e.target.value)} placeholder="HDFC0001234" className="uppercase font-mono" maxLength={11} />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.isActive} onChange={e => set('isActive', e.target.checked)} />
              Active
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                {editing ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
