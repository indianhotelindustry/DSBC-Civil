import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { materialCategoryService } from '../services/materialCategoryService';
import { MaterialCategory, BusinessRuleError } from '../types';
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

export default function MaterialCategories() {
  const { isAdmin, isSuperAdmin, isPurchaseManager } = useAuth();
  const canEdit = isAdmin || isSuperAdmin || isPurchaseManager;

  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MaterialCategory | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  useEffect(() => {
    const unsub = materialCategoryService.getAll(data => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openDialog = (cat?: MaterialCategory) => {
    if (cat) {
      setEditing(cat);
      setFormData({ name: cat.name, description: cat.description ?? '', isActive: cat.isActive !== false });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await materialCategoryService.update(editing.id, formData);
        toast.success('Category updated');
      } else {
        await materialCategoryService.create(formData);
        toast.success('Category created');
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to save');
    }
  };

  const handleToggleActive = async (cat: MaterialCategory) => {
    try {
      await materialCategoryService.update(cat.id, { isActive: !cat.isActive });
      toast.success(`"${cat.name}" marked ${!cat.isActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (cat: MaterialCategory) => {
    if (!window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    try {
      await materialCategoryService.delete(cat.id);
      toast.success('Deleted');
    } catch (err) {
      toast.error(err instanceof BusinessRuleError ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Material Categories</h2>
          <p className="text-sm text-[#6b7280]">Group materials into categories for procurement and inventory filtering.</p>
        </div>
        {canEdit && (
          <Button onClick={() => openDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Name</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Description</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} columns={4} />)
            ) : categories.length > 0 ? (
              categories.map(cat => (
                <TableRow key={cat.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-sm font-semibold">{cat.name}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280]">{cat.description || '—'}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none',
                      cat.isActive !== false ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-slate-100 text-slate-500',
                    )}>
                      {cat.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(cat)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(cat)}>
                            {cat.isActive !== false
                              ? <><ToggleLeft className="mr-2 h-4 w-4" /> Mark Inactive</>
                              : <><ToggleRight className="mr-2 h-4 w-4" /> Mark Active</>}
                          </DropdownMenuItem>
                          {(isAdmin || isSuperAdmin) && (
                            <DropdownMenuItem onClick={() => handleDelete(cat)} className="text-destructive">
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
                  No material categories yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} Material Category</DialogTitle>
            <DialogDescription>
              Categories group related materials together in procurement and inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="mc-name">Name</Label>
              <Input
                id="mc-name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cement & Concrete"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mc-desc">Description</Label>
              <Textarea
                id="mc-desc"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
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
