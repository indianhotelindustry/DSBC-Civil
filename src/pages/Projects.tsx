import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/projectService';
import { companyService } from '../services/companyService';
import { Project, Company, BusinessRuleError } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
  DialogTrigger,
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

export default function Projects() {
  const { isAdmin, isPM } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    description: '',
    clientName: '',
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'ACTIVE' as Project['status']
  });

  useEffect(() => {
    const unsub = projectService.getAll((data) => {
      setProjects(data);
      setLoading(false);
    });
    const unsub2 = companyService.getAll(setCompanies);
    return () => { unsub(); unsub2(); };
  }, []);

  const [companyTab, setCompanyTab] = useState('all');

  const legacyCount = useMemo(() => projects.filter(p => !p.companyId).length, [projects]);

  const filteredProjects = useMemo(() => {
    let list = projects;
    // Company tab filter
    if (companyTab === 'unassigned') {
      list = list.filter(p => !p.companyId);
    } else if (companyTab !== 'all') {
      list = list.filter(p => p.companyId === companyTab);
    }
    // Search filter
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.clientName.toLowerCase().includes(s));
    }
    return list;
  }, [projects, companyTab, search]);

  const getCompanyCode = (id?: string) => companies.find(c => c.id === id)?.code || '';

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        companyId: project.companyId || '',
        name: project.name,
        description: project.description,
        clientName: project.clientName,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: project.budget || 0,
        status: project.status
      });
    } else {
      setEditingProject(null);
      setFormData({
        companyId: companies[0]?.id || '',
        name: '',
        description: '',
        clientName: '',
        startDate: '',
        endDate: '',
        budget: 0,
        status: 'ACTIVE'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
        toast.success('Project updated successfully');
      } else {
        await projectService.create(formData);
        toast.success('Project created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(id);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Projects</h2>
          <p className="text-sm text-[#6b7280]">Manage projects across companies.</p>
        </div>
        {(isAdmin || isPM) && (
          <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        )}
      </div>

      {/* Company tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-[#e5e7eb] rounded-lg p-1">
          <button
            onClick={() => setCompanyTab('all')}
            className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-colors",
              companyTab === 'all' ? "bg-[#f1f5f9] text-[#2563eb]" : "text-[#6b7280] hover:text-[#111827]"
            )}
          >
            All ({projects.length})
          </button>
          {companies.map(c => {
            const count = projects.filter(p => p.companyId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setCompanyTab(c.id)}
                className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-colors",
                  companyTab === c.id ? "bg-[#f1f5f9] text-[#2563eb]" : "text-[#6b7280] hover:text-[#111827]"
                )}
              >
                {c.code} ({count})
              </button>
            );
          })}
          {legacyCount > 0 && (
            <button
              onClick={() => setCompanyTab('unassigned')}
              className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1",
                companyTab === 'unassigned' ? "bg-amber-50 text-amber-700" : "text-amber-600 hover:text-amber-800"
              )}
            >
              <AlertTriangle className="h-3 w-3" />
              Unassigned ({legacyCount})
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 max-w-xs bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
          <Search className="h-4 w-4 text-[#6b7280]" />
          <Input
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-7 text-xs"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Company</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Project Name</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Client</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Budget</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Timeline</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Status</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={5} />
              ))
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-xs font-bold">
                    {project.companyId ? (
                      <Badge variant="outline" className="text-[9px] font-black uppercase">{getCompanyCode(project.companyId)}</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] font-bold">Unassigned</Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-sm">{project.name}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{project.clientName}</TableCell>
                  <TableCell className="px-6 py-4 font-mono text-sm">{formatCurrency(project.budget || 0)}</TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#6b7280]">
                    {project.startDate} to {project.endDate}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-none",
                      project.status === 'ACTIVE' ? 'bg-[#d1fae5] text-[#065f46]' : 
                      project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-[#fef3c7] text-[#92400e]'
                    )}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(project)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            <DialogDescription>
              Enter the project details below. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {companies.length > 0 && (
              <div className="grid gap-2">
                <Label>Company</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(v: string) => setFormData({...formData, companyId: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company">
                      {formData.companyId ? (() => { const c = companies.find(co => co.id === formData.companyId); return c ? `${c.code} — ${c.name}` : undefined; })() : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input 
                id="clientName" 
                value={formData.clientName} 
                onChange={(e) => setFormData({...formData, clientName: e.target.value})} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Project Budget</Label>
              <Input 
                id="budget" 
                type="number"
                value={formData.budget} 
                onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})} 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  value={formData.startDate} 
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  value={formData.endDate} 
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                  required 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: string) => setFormData({...formData, status: value as Project['status']})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
