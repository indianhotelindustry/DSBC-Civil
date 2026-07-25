import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { materialService } from '../services/materialService';
import { materialCategoryService } from '../services/materialCategoryService';
import { uomService } from '../services/uomService';
import { Material, MaterialCategory, UOM, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
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

type FormData = {
  code: string;
  name: string;
  materialCategoryId: string;
  uomId: string;
  description: string;
  specifications: string;
  isActive: boolean;
};

const EMPTY_FORM: FormData = {
  code: '', name: '', materialCategoryId: '', uomId: '',
  description: '', specifications: '', isActive: true,
};

export default function Materials() {
  const { isAdmin, isSuperAdmin, isPurchaseManager } = useAuth();
  const canEdit = isAdmin || isSuperAdmin || isPurchaseManager;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    const unsubMat = materialService.getAll(data => { setMaterials(data); setLoading(false); });
    const unsubCat = materialCategoryService.getActive(setCategories);
    const unsubUom = uomService.getActive(setUoms);
    return () => { unsubMat(); unsubCat(); unsubUom(); };
  }, []);

  const openDialog = (mat?: Material) => {
    if (mat) {
      setEditing(mat);
      setFormData({
        code: mat.code,
        name: mat.name,
        materialCategoryId: mat.materialCategoryId,
        uomId: mat.uomId,
        description: mat.description ?? '',
        specifications: mat.specifications ?? '',
        isActive: mat.isActive !== false,
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
      if (editing) {
        await materialService.update(editing.id, formData);
        toast.success('Material updated');
      } else {
        await materialService.create(formData);
        toast.success('Material created');
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to save');
    }
  };

  const handleToggleActive = async (mat: Material) => {
    try {
      await materialService.update(mat.id, { isActive: !mat.isActive });
      toast.success(`"${mat.name}" marked ${!mat.isActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (mat: Material) => {
    if (!window.confirm(`Delete "${mat.code} – ${mat.name}"? This cannot be undone.`)) return;
    try {
      await materialService.delete(mat.id);
      toast.success('Deleted');
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Materials</h2>
          <p className="text-sm text-[#6b7280]">Master item list used in material requisitions and purchase orders.</p>
        </div>
        {canEdit && (
          <Button onClick={() => openDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] w-28">Code</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Name</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Category</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] w-20">UOM</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={6} />)
            ) : materials.length > 0 ? (
              materials.map(mat => (
                <TableRow key={mat.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-xs font-black text-[#2563eb] tracking-wider">{mat.code}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold">{mat.name}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280]">{mat.categoryName || '—'}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold">{mat.uomSymbol || '—'}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none',
                      mat.isActive !== false ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-slate-100 text-slate-500',
                    )}>
                      {mat.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(mat)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(mat)}>
                            {mat.isActive !== false
                              ? <><ToggleLeft className="mr-2 h-4 w-4" /> Mark Inactive</>
                              : <><ToggleRight className="mr-2 h-4 w-4" /> Mark Active</>}
                          </DropdownMenuItem>
                          {(isAdmin || isSuperAdmin) && (
                            <DropdownMenuItem onClick={() => handleDelete(mat)} className="text-destructive">
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
                  No materials yet. Add material categories and UOMs first.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} Material</DialogTitle>
            <DialogDescription>
              Material codes are stored in uppercase and must be unique across all materials.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mat-code">Code *</Label>
                <Input
                  id="mat-code"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. CEM-OPC-001"
                  required
                  className="uppercase"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mat-name">Name *</Label>
                <Input
                  id="mat-name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. OPC 43 Grade Cement"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category *</Label>
                <Select
                  value={formData.materialCategoryId}
                  onValueChange={v => setFormData({ ...formData, materialCategoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Unit of Measure *</Label>
                <Select
                  value={formData.uomId}
                  onValueChange={v => setFormData({ ...formData, uomId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                  <SelectContent>
                    {uoms.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.symbol} – {u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mat-desc">Description</Label>
              <Textarea
                id="mat-desc"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mat-spec">Specifications</Label>
              <Textarea
                id="mat-spec"
                value={formData.specifications}
                onChange={e => setFormData({ ...formData, specifications: e.target.value })}
                placeholder="Technical specifications, grade, standards, etc."
                rows={2}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active (visible in material requisitions)
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                disabled={!formData.materialCategoryId || !formData.uomId}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              >
                {editing ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
