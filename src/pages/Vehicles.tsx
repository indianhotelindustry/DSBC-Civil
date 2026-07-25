import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { companyService } from '../services/companyService';
import { Vehicle, VehicleType, Company, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
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

const VEHICLE_TYPES: VehicleType[] = ['TRUCK', 'PICKUP', 'CRANE', 'EXCAVATOR', 'OTHER'];

type FormData = {
  registrationNumber: string; type: VehicleType; make: string; model: string;
  capacityTons: string; companyId: string; isActive: boolean;
};
const EMPTY_FORM: FormData = {
  registrationNumber: '', type: 'TRUCK', make: '', model: '',
  capacityTons: '', companyId: '', isActive: true,
};

export default function Vehicles() {
  const { isAdmin, isSuperAdmin } = useAuth();
  const canEdit = isAdmin || isSuperAdmin;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    const unsubV = vehicleService.getAll(data => { setVehicles(data); setLoading(false); });
    const unsubCo = companyService.getAll(setCompanies);
    return () => { unsubV(); unsubCo(); };
  }, []);

  const companyName = (id: string) => companies.find(c => c.id === id)?.name ?? id;

  const openDialog = (v?: Vehicle) => {
    if (v) {
      setEditing(v);
      setFormData({
        registrationNumber: v.registrationNumber,
        type: v.type,
        make: v.make ?? '',
        model: v.model ?? '',
        capacityTons: v.capacityTons != null ? String(v.capacityTons) : '',
        companyId: v.companyId,
        isActive: v.isActive !== false,
      });
    } else {
      setEditing(null);
      setFormData(EMPTY_FORM);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        registrationNumber: formData.registrationNumber,
        type: formData.type,
        make: formData.make || undefined,
        model: formData.model || undefined,
        capacityTons: formData.capacityTons ? Number(formData.capacityTons) : undefined,
        companyId: formData.companyId,
        isActive: formData.isActive,
      };
      if (editing) {
        await vehicleService.update(editing.id, payload);
        toast.success('Vehicle updated');
      } else {
        await vehicleService.create(payload);
        toast.success('Vehicle created');
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to save');
    }
  };

  const handleToggleActive = async (v: Vehicle) => {
    try {
      await vehicleService.update(v.id, { isActive: !v.isActive });
      toast.success(`"${v.registrationNumber}" marked ${!v.isActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (v: Vehicle) => {
    if (!window.confirm(`Delete "${v.registrationNumber}"? This cannot be undone.`)) return;
    try {
      await vehicleService.delete(v.id);
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
          <h2 className="text-xl font-bold tracking-tight">Vehicles</h2>
          <p className="text-sm text-[#6b7280]">Company fleet master used in material delivery and transport tracking.</p>
        </div>
        {canEdit && (
          <Button onClick={() => openDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Reg. Number</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Type</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Make / Model</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Company</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} columns={6} />)
            ) : vehicles.length > 0 ? (
              vehicles.map(v => (
                <TableRow key={v.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-sm font-black tracking-wider">{v.registrationNumber}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border-none">{v.type}</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280]">
                    {[v.make, v.model].filter(Boolean).join(' ') || '—'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280]">{companyName(v.companyId)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleDelete(v)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No vehicles yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} Vehicle</DialogTitle>
            <DialogDescription>
              Registration numbers are stored without spaces (e.g. MH12AB1234).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="v-reg">Registration Number *</Label>
                <Input id="v-reg" value={formData.registrationNumber} onChange={e => set('registrationNumber', e.target.value)} placeholder="e.g. MH 12 AB 1234" required className="uppercase" />
              </div>
              <div className="grid gap-2">
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={v => set('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="v-cap">Capacity (tons)</Label>
                <Input id="v-cap" type="number" min={0} step={0.5} value={formData.capacityTons} onChange={e => set('capacityTons', e.target.value)} placeholder="e.g. 10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="v-make">Make</Label>
                <Input id="v-make" value={formData.make} onChange={e => set('make', e.target.value)} placeholder="e.g. Tata" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="v-model">Model</Label>
                <Input id="v-model" value={formData.model} onChange={e => set('model', e.target.value)} placeholder="e.g. LPT 1613" />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label>Company *</Label>
                <Select value={formData.companyId} onValueChange={v => set('companyId', v)}>
                  <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.isActive} onChange={e => set('isActive', e.target.checked)} />
              Active
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!formData.companyId} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                {editing ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
