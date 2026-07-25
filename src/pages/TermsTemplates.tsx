import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { termsTemplateService } from '../services/termsTemplateService';
import { TermsTemplate, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
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
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { SkeletonRow } from '../components/Skeleton';

export default function TermsTemplates() {
  const { isAdmin } = useAuth();
  const [templates, setTemplates] = useState<TermsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TermsTemplate | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    language: 'hi' as TermsTemplate['language'],
    content: '',
    isDefault: false,
    isActive: true,
  });

  useEffect(() => {
    const unsub = termsTemplateService.getAll((data) => {
      setTemplates(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (template?: TermsTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        language: template.language,
        content: template.content,
        isDefault: template.isDefault,
        isActive: template.isActive,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        language: 'hi',
        content: '',
        isDefault: false,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await termsTemplateService.update(editingTemplate.id, formData);
        toast.success('Template updated');
      } else {
        await termsTemplateService.create(formData);
        toast.success('Template created');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to save template');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this terms template?')) {
      try {
        await termsTemplateService.delete(id);
        toast.success('Template deleted');
      } catch (error) {
        toast.error('Failed to delete template');
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await termsTemplateService.update(id, { isDefault: true });
      toast.success('Set as default template');
    } catch (error) {
      toast.error('Failed to set default');
    }
  };

  const handleToggleActive = async (template: TermsTemplate) => {
    try {
      await termsTemplateService.update(template.id, { isActive: !template.isActive });
      toast.success(template.isActive ? 'Template deactivated' : 'Template activated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const langLabel = (lang: string) => {
    switch (lang) {
      case 'hi': return 'Hindi';
      case 'en': return 'English';
      case 'both': return 'Bilingual';
      default: return lang;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Terms & Conditions Templates</h2>
          <p className="text-sm text-[#6b7280]">Manage reusable terms templates for work orders. Supports Hindi content.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 max-w-sm bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
        <Search className="h-4 w-4 text-[#6b7280]" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 bg-transparent h-8 text-sm"
        />
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Name</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Language</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Preview</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} columns={5} />)
            ) : filtered.length > 0 ? (
              filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{t.name}</span>
                      {t.isDefault && (
                        <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] font-bold uppercase">Default</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">{langLabel(t.language)}</TableCell>
                  <TableCell className="px-6 py-4 text-xs text-[#6b7280] max-w-[300px]">
                    <p className="truncate">{t.content.slice(0, 100)}{t.content.length > 100 ? '...' : ''}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none",
                      t.isActive ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-slate-100 text-slate-500'
                    )}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(t)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {!t.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault(t.id)}>
                              <Star className="mr-2 h-4 w-4" /> Set as Default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleActive(t)}>
                            {t.isActive ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                            {t.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(t.id)} className="text-destructive">
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
                <TableCell colSpan={5} className="h-24 text-center text-xs font-medium text-[#6b7280]">
                  No templates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Template' : 'New Terms Template'}</DialogTitle>
            <DialogDescription>
              Create or edit a terms & conditions template. Hindi content is fully supported.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Standard Hindi Terms"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(v: string) => setFormData({ ...formData, language: v as TermsTemplate['language'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="both">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Terms Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="नियम एवं शर्तें यहाँ लिखें..."
                className="min-h-[180px] sm:min-h-[250px] font-[sans-serif] text-sm leading-relaxed"
                dir="auto"
                required
              />
              <p className="text-[10px] text-[#6b7280]">
                Supports Hindi (Devanagari) and English. Use line breaks for numbered clauses.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded border-[#e5e7eb]"
                />
                Set as default template
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-[#e5e7eb]"
                />
                Active
              </label>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
