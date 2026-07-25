import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { workCategoryService } from '../services/workCategoryService';
import { WorkCategory, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';

export default function WorkCategories() {
  const { isAdmin, isPM } = useAuth();
  const canEdit = isAdmin || isPM;
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkCategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    const unsub = workCategoryService.getAll((data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenDialog = (cat?: WorkCategory) => {
    if (cat) {
      setEditing(cat);
      setFormData({
        name: cat.name,
        displayOrder: cat.displayOrder ?? 0,
        isActive: cat.isActive !== false,
      });
    } else {
      setEditing(null);
      // Default displayOrder = max + 10 so new entries sort to the bottom.
      const maxOrder = categories.reduce((m, c) => Math.max(m, c.displayOrder || 0), 0);
      setFormData({ name: '', displayOrder: maxOrder + 10, isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await workCategoryService.update(editing.id, formData);
        toast.success('Work category updated');
      } else {
        await workCategoryService.create(formData);
        toast.success('Work category created');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to save');
    }
  };

  const handleToggleActive = async (cat: WorkCategory) => {
    try {
      await workCategoryService.update(cat.id, { isActive: !cat.isActive });
      toast.success(`"${cat.name}" is now ${!cat.isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to update');
    }
  };

  const handleDelete = async (cat: WorkCategory) => {
    if (!window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    try {
      await workCategoryService.delete(cat.id);
      toast.success('Deleted');
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Work Categories</h2>
          <p className="text-sm text-[#6b7280]">
            Central list used by the New Work Order dropdown. Inactive categories
            stay visible on historical work orders but are hidden from new entries.
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] w-20">Order</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Name</TableHead>
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
                  <TableCell className="px-6 py-4 text-xs font-bold text-[#6b7280]">{cat.displayOrder ?? 0}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold">{cat.name}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none',
                      cat.isActive !== false ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-slate-100 text-slate-500'
                    )}>
                      {cat.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(cat)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(cat)}>
                            {cat.isActive !== false ? (
                              <><ToggleLeft className="mr-2 h-4 w-4" /> Mark Inactive</>
                            ) : (
                              <><ToggleRight className="mr-2 h-4 w-4" /> Mark Active</>
                            )}
                          </DropdownMenuItem>
                          {isAdmin && (
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
                  No work categories yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} Work Category</DialogTitle>
            <DialogDescription>
              These options power the New Work Order dropdown. Keep names concise
              so they render well on mobile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="wc-name">Name</Label>
              <Input
                id="wc-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Plumbing Work"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wc-order">Display Order</Label>
              <Input
                id="wc-order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: +e.target.value })}
                placeholder="Lower numbers appear first"
              />
              <p className="text-[11px] text-[#6b7280]">
                Defaults use 10, 20, 30… leave gaps to insert custom entries later.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active (visible in New Work Order dropdown)
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
