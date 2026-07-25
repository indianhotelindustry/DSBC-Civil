import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { versionService } from '../services/versionService';
import { AppVersion, BusinessRuleError } from '../types';
import { APP_VERSION, APP_BUILD_LABEL, APP_ENVIRONMENT } from '../lib/appVersion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import { Tag, Clock, User, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function VersionHistory() {
  const { isAdmin } = useAuth();
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    gitTag: '',
    gitCommit: ''
  });

  useEffect(() => {
    const unsub = versionService.getAll((data) => {
      setVersions(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await versionService.logDeployment(
        formData.notes,
        formData.gitTag || undefined,
        formData.gitCommit || undefined
      );
      toast.success('Deployment logged successfully');
      setIsDialogOpen(false);
      setFormData({ notes: '', gitTag: '', gitCommit: '' });
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to log deployment');
    } finally {
      setSubmitting(false);
    }
  };

  const envColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-red-100 text-red-700';
      case 'staging': return 'bg-amber-100 text-amber-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Version History</h2>
          <p className="text-sm text-[#6b7280]">Deployment log and release tracking.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsDialogOpen(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Log Deployment
          </Button>
        )}
      </div>

      {/* Current version card */}
      <Card className="bg-[#111827] text-white border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Tag className="h-6 w-6 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Running Version</p>
                <p className="text-2xl font-black">{APP_VERSION}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Build</p>
                <p className="text-sm font-bold">{APP_BUILD_LABEL}</p>
              </div>
              <Badge className={cn("text-[10px] font-black uppercase", envColor(APP_ENVIRONMENT))}>
                {APP_ENVIRONMENT}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version log table */}
      <Card className="border-[#e5e7eb] shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Deployment Log</CardTitle>
          <CardDescription className="text-xs">Append-only record of all deployments.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Version</TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Build</TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Deployed</TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">By</TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Env</TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-[#6b7280]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs font-medium text-[#6b7280]">Loading...</TableCell>
                </TableRow>
              ) : versions.length > 0 ? (
                versions.map((v) => (
                  <TableRow key={v.id} className="border-b border-[#e5e7eb] last:border-0">
                    <TableCell className="px-6 py-4">
                      <span className="text-sm font-black text-[#111827]">{v.version}</span>
                      {v.gitTag && (
                        <span className="ml-2 text-[9px] font-bold text-[#6b7280]">{v.gitTag}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs font-mono text-[#6b7280]">{v.buildLabel}</TableCell>
                    <TableCell className="px-6 py-4 text-xs text-[#6b7280]">
                      {new Date(v.deployedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs font-medium">{v.deployedBy}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={cn("text-[9px] font-black uppercase border-none", envColor(v.environment))}>
                        {v.environment}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs text-[#6b7280] max-w-[250px]" title={v.notes}>
                      {v.notes}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs font-medium text-[#6b7280]">
                    No deployments logged yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log deployment dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Current Deployment</DialogTitle>
            <DialogDescription>
              Record this deployment in the version history. Version {APP_VERSION} ({APP_BUILD_LABEL}).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogDeployment} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Deployment Notes</Label>
              <Textarea
                id="notes"
                placeholder="What changed in this deployment?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                required
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gitTag">Git Tag (optional)</Label>
                <Input
                  id="gitTag"
                  placeholder="v1.0.0-beta.1"
                  value={formData.gitTag}
                  onChange={(e) => setFormData({ ...formData, gitTag: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gitCommit">Git Commit (optional)</Label>
                <Input
                  id="gitCommit"
                  placeholder="abc1234"
                  value={formData.gitCommit}
                  onChange={(e) => setFormData({ ...formData, gitCommit: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Logging...' : 'Log Deployment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
