import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Briefcase, Users, MapPin, ScrollText, AlertTriangle, User, Wrench, Hash, Layers, Ruler, Package, Building2, Warehouse, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import Projects from './Projects';
import Contractors from './Contractors';
import SubLocations from './SubLocations';
import TermsTemplates from './TermsTemplates';
import Customers from './Customers';
import WorkCategories from './WorkCategories';
import WorkOrderNumberSeries from './WorkOrderNumberSeries';
import MaterialCategories from './MaterialCategories';
import UOMs from './UOMs';
import Materials from './Materials';
import Vendors from './Vendors';
import Stores from './Stores';
import Vehicles from './Vehicles';
import { ensureCompaniesExist } from '../lib/seedCompanies';
import { ensureWorkCategoriesExist } from '../lib/seedWorkCategories';
import { findLegacyProjects, backfillProjectCompanyId, LegacyProjectInfo } from '../lib/legacyDataCleanup';
import { companyService } from '../services/companyService';
import { Company } from '../types';

export default function Masters() {
  const { isAdmin, isSuperAdmin, isPM, isCEO, isPurchaseManager, isStoreManager } = useAuth();
  const canSeeProcurement = isAdmin || isSuperAdmin || isPurchaseManager;
  const canSeeFleet = isAdmin || isSuperAdmin;
  const [legacyProjects, setLegacyProjects] = useState<LegacyProjectInfo[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [backfillTarget, setBackfillTarget] = useState('');
  const [backfilling, setBackfilling] = useState(false);
  const [legacyChecked, setLegacyChecked] = useState(false);

  // Seed companies and check for legacy projects on load
  useEffect(() => {
    ensureCompaniesExist();
    // Best-effort seed of the default work-category list. Idempotent
    // via stable doc ids — re-runs are no-ops, admin-added custom
    // categories are never touched.
    ensureWorkCategoriesExist();
    const unsub = companyService.getAll(setCompanies);

    if (isAdmin) {
      findLegacyProjects().then(legacy => {
        setLegacyProjects(legacy);
        setLegacyChecked(true);
      });
    }

    return () => unsub();
  }, [isAdmin]);

  const handleBackfill = async () => {
    if (!backfillTarget) {
      toast.error('Select a company to assign');
      return;
    }
    setBackfilling(true);
    try {
      const count = await backfillProjectCompanyId(backfillTarget);
      toast.success(`Updated ${count} project(s) with company assignment`);
      // Re-check
      const remaining = await findLegacyProjects();
      setLegacyProjects(remaining);
    } catch (error) {
      toast.error('Backfill failed. Check permissions.');
    } finally {
      setBackfilling(false);
    }
  };

  // Customers tab is SIPL-only (CONSTRUCTION). Hide it entirely when the
  // workspace has no construction companies.
  const hasConstructionCompany = companies.some(c => c.businessType === 'CONSTRUCTION');

  // Default tab: land on procurement masters for roles without project access
  const defaultTab = (isAdmin || isSuperAdmin || isPM || isCEO)
    ? 'projects'
    : canSeeProcurement
      ? 'material-categories'
      : 'stores';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">Masters</h1>
        <p className="text-sm text-[#6b7280]">Manage all master data — projects, contractors, procurement items, and templates.</p>
      </div>

      {/* Legacy data warning — admin only */}
      {isAdmin && legacyChecked && legacyProjects.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800">
                {legacyProjects.length} project(s) missing company assignment
              </p>
              <p className="text-xs text-amber-600 mt-1">
                These projects were created before multi-company support. They currently appear under all companies in filters.
                Assign them to a company to enable accurate filtering and reporting.
              </p>
              <div className="mt-2 text-[10px] text-amber-700 space-y-0.5">
                {legacyProjects.slice(0, 5).map(p => (
                  <p key={p.id}>- {p.name}</p>
                ))}
                {legacyProjects.length > 5 && <p>...and {legacyProjects.length - 5} more</p>}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <Select value={backfillTarget} onValueChange={setBackfillTarget}>
                  <SelectTrigger className="w-56 h-8 text-xs">
                    <SelectValue placeholder="Assign all to company...">
                      {backfillTarget ? (() => { const c = companies.find(co => co.id === backfillTarget); return c ? `${c.code} — ${c.name}` : undefined; })() : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleBackfill}
                  disabled={backfilling || !backfillTarget}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase h-8"
                >
                  {backfilling ? 'Updating...' : `Assign ${legacyProjects.length} Project(s)`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-white border border-[#e5e7eb] p-1 h-11 rounded-xl flex-wrap gap-1">
          {(isAdmin || isPM || isCEO) && (
            <TabsTrigger value="projects" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              Projects
              {legacyProjects.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black">{legacyProjects.length}</span>
              )}
            </TabsTrigger>
          )}
          {(isAdmin || isPM || isCEO) && (
            <TabsTrigger value="contractors" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Contractors
            </TabsTrigger>
          )}
          {(isAdmin || isPM) && (
            <TabsTrigger value="sub-locations" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Units / Depts
            </TabsTrigger>
          )}
          {(isAdmin || isPM) && hasConstructionCompany && (
            <TabsTrigger value="customers" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <User className="h-3.5 w-3.5" />
              Customers
            </TabsTrigger>
          )}
          {(isAdmin || isPM) && (
            <TabsTrigger value="work-categories" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Work Categories
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="terms" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <ScrollText className="h-3.5 w-3.5" />
              Terms Templates
            </TabsTrigger>
          )}
          {(isAdmin || isSuperAdmin) && (
            <TabsTrigger value="wo-number-series" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              WO Number Series
            </TabsTrigger>
          )}
          {canSeeProcurement && (
            <TabsTrigger value="material-categories" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Mat. Categories
            </TabsTrigger>
          )}
          {canSeeProcurement && (
            <TabsTrigger value="uoms" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Ruler className="h-3.5 w-3.5" />
              UOM
            </TabsTrigger>
          )}
          {canSeeProcurement && (
            <TabsTrigger value="materials" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Materials
            </TabsTrigger>
          )}
          {canSeeProcurement && (
            <TabsTrigger value="vendors" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Vendors
            </TabsTrigger>
          )}
          {(canSeeFleet || isStoreManager) && (
            <TabsTrigger value="stores" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Warehouse className="h-3.5 w-3.5" />
              Stores
            </TabsTrigger>
          )}
          {canSeeFleet && (
            <TabsTrigger value="vehicles" className="text-xs font-bold uppercase tracking-wider px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#2563eb] gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Vehicles
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <Projects />
        </TabsContent>
        <TabsContent value="contractors" className="mt-6">
          <Contractors />
        </TabsContent>
        <TabsContent value="sub-locations" className="mt-6">
          <SubLocations />
        </TabsContent>
        {hasConstructionCompany && (
          <TabsContent value="customers" className="mt-6">
            <Customers />
          </TabsContent>
        )}
        <TabsContent value="work-categories" className="mt-6">
          <WorkCategories />
        </TabsContent>
        <TabsContent value="terms" className="mt-6">
          <TermsTemplates />
        </TabsContent>
        <TabsContent value="wo-number-series" className="mt-6">
          <WorkOrderNumberSeries />
        </TabsContent>
        <TabsContent value="material-categories" className="mt-6">
          <MaterialCategories />
        </TabsContent>
        <TabsContent value="uoms" className="mt-6">
          <UOMs />
        </TabsContent>
        <TabsContent value="materials" className="mt-6">
          <Materials />
        </TabsContent>
        <TabsContent value="vendors" className="mt-6">
          <Vendors />
        </TabsContent>
        <TabsContent value="stores" className="mt-6">
          <Stores />
        </TabsContent>
        <TabsContent value="vehicles" className="mt-6">
          <Vehicles />
        </TabsContent>
      </Tabs>
    </div>
  );
}
