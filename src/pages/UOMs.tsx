import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uomService } from '../services/uomService';
import { UOM, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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

export default function UOMs() {
  const { isAdmin, isSuperAdmin, isPurchaseManager } = useAuth();
  const canEdit = isAdmin || isSuperAdmin || isPurchaseManager;

  const [uoms, setUoms] = useState<UOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UOM | null>(null);
  const [formData, setFormData] = useState({ name: '', symbol: '', isActive: true });

  useEffect(() => {
    const unsub = uomService.getAll(data => {
      setUoms(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openDialog = (uom?: UOM) => {
    if (uom) {
      setEditing(uom);
      setFormData({ name: uom.name, symbol: uom.symbol, isActive: uom.isActive !== false });
    } else {
      setEditing(null);
      setFormData({ name: '', symbol: '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await uomService.update(editing.id, formData);
        toast.success('UOM updated');
      } else {
        await uomService.create(formData);
        toast.success('UOM created');
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to save');
    }
  };

  const handleToggleActive = async (uom: UOM) => {
    try {
      await uomService.update(uom.id, { isActive: !uom.isActive });
      toast.success(`"${uom.symbol}" marked ${!uom.isActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (uom: UOM) => {
    if (!window.confirm(`Delete "${uom.symbol} – ${uom.name}"? This cannot be undone.`)) return;
    try {
      await uomService.delete(uom.id);
      toast.success('Deleted');
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Units of Measure</h2>
          <p className="text-sm text-[#6b7280]">Define measurement units used across materials, requisitions, and purchase orders.</p>
        </div>
        {canEdit && (
          <Button onClick={() => openDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add UOM
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] w-28">Symbol</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Name</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} columns={4} />)
            ) : uoms.length > 0 ? (
              uoms.map(uom => (
                <TableRow key={uom.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-sm font-black tracking-wider text-[#2563eb]">{uom.symbol}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold">{uom.name}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none',
                      uom.isActive !== false ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-slate-100 text-slate-500',
                    )}>
                      {uom.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(uom)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(uom)}>
                            {uom.isActive !== false
                              ? <><ToggleLeft className="mr-2 h-4 w-4" /> Mark Inactive</>
                              : <><ToggleRight className="mr-2 h-4 w-4" /> Mark Active</>}
                          </DropdownMenuItem>
                          {(isAdmin || isSuperAdmin) && (
                            <DropdownMenuItem onClick={() => handleDelete(uom)} className="text-destructive">
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
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No units of measure yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} Unit of Measure</DialogTitle>
            <DialogDescription>
              Symbols are stored in uppercase (e.g. KG, MT, NOS, LTR).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="uom-symbol">Symbol</Label>
              <Input
                id="uom-symbol"
                value={formData.symbol}
                onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="e.g. KG"
                required
                className="uppercase"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="uom-name">Full Name</Label>
              <Input
                id="uom-name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kilogram"
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
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
