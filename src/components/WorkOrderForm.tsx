import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Calculator, Save, X, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Project, Contractor, WorkOrder, WorkOrderCreateData, BOQItem, TermsTemplate, Company, SubLocation, WOScopeType, WorkCategory } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { computeWorkOrderFinancials } from '../lib/financialCalculationService';
import { termsTemplateService } from '../services/termsTemplateService';
import { workCategoryService } from '../services/workCategoryService';
import { numberSeriesService, formatSeriesNumber } from '../services/numberSeriesService';
import { ensureWorkCategoriesExist } from '../lib/seedWorkCategories';
import { getLabels } from '../lib/companyLabels';
import { NumberSeries } from '../types';

const boqItemSchema = z.object({
  description: z.string().min(1, "Required"),
  unit: z.string().min(1, "Required"),
  quantity: z.number().min(0.01, "Must be > 0"),
  rate: z.number().min(0, "Must be >= 0"),
  amount: z.number(),
});

const workOrderSchema = z.object({
  companyId: z.string().optional(),
  projectId: z.string().min(1, "Required"),
  subLocationId: z.string().optional(),
  subLocationType: z.string().optional(),
  scopeType: z.enum(['SUB_LOCATION_LEVEL', 'PROJECT_LEVEL']).optional(),
  title: z.string().min(3, "Title too short"),
  contractorId: z.string().min(1, "Required"),
  location: z.string().optional(),
  contractorGST: z.string().optional(),
  workCategory: z.string().optional(),
  issueDate: z.string().min(1, "Required"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  scopeOfWork: z.string().min(10, "Detailed scope required"),
  additionalNotes: z.string().optional(),
  termsTemplateId: z.string().optional(),
  termsAndConditions: z.string().optional(),
  checkedBy: z.string().optional(),
  approvedBy: z.string().optional(),
  boqItems: z.array(boqItemSchema).min(1, "At least one item required"),
  financials: z.object({
    advance: z.number().min(0),
    gstPercentage: z.number().min(0),
    retentionPercentage: z.number().min(0),
    otherCharges: z.number().min(0),
  }),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  companies: Company[];
  projects: Project[];
  subLocations: SubLocation[];
  contractors: Contractor[];
  initialData?: Partial<WorkOrder>;
  onSubmit: (data: WorkOrderCreateData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function WorkOrderForm({
  companies,
  projects,
  subLocations,
  contractors,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}: WorkOrderFormProps) {
  const [termsTemplates, setTermsTemplates] = React.useState<TermsTemplate[]>([]);
  const [workCategories, setWorkCategories] = React.useState<WorkCategory[]>([]);
  // Live preview of the next WO# the Masters series will issue.
  // Only used in Create mode; Edit shows the existing initialData.woNumber.
  const [woSeries, setWoSeries] = React.useState<NumberSeries | null>(null);

  React.useEffect(() => {
    const unsub = termsTemplateService.getActive(setTermsTemplates);
    // Masters-driven: dropdown options live in the workCategories
    // collection. Fire the seed defensively from the form so an admin
    // who opens New Work Order without first visiting Masters still
    // sees a populated dropdown. Idempotent — re-runs are no-ops.
    ensureWorkCategoriesExist().catch(() => { /* best-effort */ });
    const unsubCats = workCategoryService.getActive(setWorkCategories);
    const unsubSeries = numberSeriesService.subscribeWorkOrderSeries(setWoSeries);
    return () => { unsub(); unsubCats(); unsubSeries(); };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      companyId: initialData?.companyId || companies[0]?.id || '',
      projectId: initialData?.projectId || '',
      subLocationId: initialData?.subLocationId || '',
      subLocationType: initialData?.subLocationType || '',
      scopeType: initialData?.scopeType || 'PROJECT_LEVEL',
      title: initialData?.title || '',
      contractorId: initialData?.contractorId || '',
      location: initialData?.location || '',
      contractorGST: initialData?.contractorGST || '',
      workCategory: initialData?.workCategory || '',
      issueDate: initialData?.issueDate || new Date().toISOString().split('T')[0],
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      scopeOfWork: initialData?.scopeOfWork || '',
      additionalNotes: initialData?.additionalNotes || '',
      termsTemplateId: initialData?.termsTemplateId || '',
      termsAndConditions: initialData?.termsAndConditions || '',
      checkedBy: initialData?.checkedBy || '',
      approvedBy: initialData?.approvedBy || '',
      boqItems: initialData?.boqItems || [{ description: '', unit: 'SFT', quantity: 0, rate: 0, amount: 0 }],
      financials: {
        advance: initialData?.financials?.advance || 0,
        gstPercentage: initialData?.financials?.gstPercentage || 18,
        retentionPercentage: initialData?.financials?.retentionPercentage || 5,
        otherCharges: initialData?.financials?.otherCharges || 0,
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "boqItems"
  });

  // Company/Project/SubLocation cascade
  const watchedCompanyId = watch("companyId");
  const watchedProjectId = watch("projectId");
  const watchedScopeType = watch("scopeType") as WOScopeType | undefined;

  const selectedCompany = useMemo(() => companies.find(c => c.id === watchedCompanyId), [companies, watchedCompanyId]);
  const labels = useMemo(() => getLabels(selectedCompany?.businessType), [selectedCompany]);

  const filteredProjects = useMemo(() => {
    if (!watchedCompanyId) return [];
    // Strict company filter — legacy projects without companyId are excluded.
    // Backfill legacy projects via Masters page to make them visible here.
    return projects.filter(p => p.companyId === watchedCompanyId);
  }, [projects, watchedCompanyId]);

  const filteredSubLocations = useMemo(() => {
    if (!watchedProjectId) return [];
    return subLocations.filter(sl => sl.projectId === watchedProjectId && sl.isActive);
  }, [subLocations, watchedProjectId]);

  const showSubLocation = watchedScopeType === 'SUB_LOCATION_LEVEL';

  // useWatch is the reliable subscription for nested / array fields.
  // Plain watch("boqItems") at the top level of a component that also
  // uses useFieldArray doesn't consistently re-render on deep changes
  // (qty / rate / amount) — clicking Add Row was the only thing that
  // forced a re-render, which is why row amounts + the Summary were
  // stale until then. useWatch rebroadcasts every edit inside the
  // named path, so both the Amount column and the Summary totals
  // update on every keystroke.
  const watchedItems = useWatch({ control, name: "boqItems" }) || [];
  const watchedFinancials = useWatch({ control, name: "financials" }) || {
    advance: 0,
    gstPercentage: 0,
    retentionPercentage: 0,
    otherCharges: 0,
  };

  // Auto-fill terms when a template is selected (and terms field is empty or matches previous template)
  const handleTemplateChange = (templateId: string) => {
    setValue("termsTemplateId", templateId);
    if (templateId) {
      const template = termsTemplates.find(t => t.id === templateId);
      if (template) {
        setValue("termsAndConditions", template.content);
      }
    }
  };

  // Auto-select default template on first load if no terms set
  React.useEffect(() => {
    if (!initialData?.termsAndConditions && !initialData?.termsTemplateId && termsTemplates.length > 0) {
      const defaultTemplate = termsTemplates.find(t => t.isDefault);
      if (defaultTemplate) {
        setValue("termsTemplateId", defaultTemplate.id);
        setValue("termsAndConditions", defaultTemplate.content);
      }
    }
  }, [termsTemplates, initialData, setValue]);

  // Auto-calculate item amounts
  useEffect(() => {
    watchedItems.forEach((item, index) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      if (amount !== item.amount) {
        setValue(`boqItems.${index}.amount`, amount);
      }
    });
  }, [watchedItems, setValue]);

  const totals = useMemo(() => computeWorkOrderFinancials({
    items: watchedItems,
    advance: watchedFinancials.advance || 0,
    otherCharges: watchedFinancials.otherCharges || 0,
    gstPercentage: watchedFinancials.gstPercentage || 0,
    retentionPercentage: watchedFinancials.retentionPercentage || 0,
  }), [watchedItems, watchedFinancials]);

  const handleFormSubmit = (data: WorkOrderFormData) => {
    const finalData: WorkOrderCreateData = {
      ...data,
      // description is a brief summary derived from title; scopeOfWork holds the detail
      description: data.title,
      amount: totals.grandTotal,
      status: 'PENDING',
      preparedBy: '',
      financials: {
        ...data.financials,
        totalAmount: totals.totalAmount,
        subtotal: totals.subtotal,
        gstAmount: totals.gstAmount,
        retentionAmount: totals.retentionAmount,
        grandTotal: totals.grandTotal
      },
      billing: {
        totalValue: totals.grandTotal
      }
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 w-full">
      {/* ── Header: title left, actions right ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black tracking-tight text-[#111827] truncate">
            {initialData?.id ? 'Edit Work Order' : 'New Work Order'}
          </h2>
          {initialData?.id ? (
            <p className="text-xs text-[#6b7280] mt-0.5">
              <span className="text-[#9ca3af]">WO #:</span>{' '}
              <span className="font-mono font-bold text-[#111827]">{initialData.woNumber || '—'}</span>
              <span className="text-[#9ca3af] ml-2">(read-only)</span>
            </p>
          ) : woSeries ? (
            <p className="text-xs text-[#6b7280] mt-0.5">
              <span className="text-[#9ca3af]">WO #:</span>{' '}
              <span className="font-mono font-bold text-[#111827]">
                {formatSeriesNumber(woSeries, woSeries.nextNumber)}
              </span>
              <span className="text-[#9ca3af] ml-2">(auto-generated on save)</span>
            </p>
          ) : (
            <p className="text-xs text-amber-700 mt-0.5">
              WO Number Series not configured. An admin must set it in Masters → WO Number Series before this work order can be saved.
            </p>
          )}
        </div>
        <div className="flex gap-3 shrink-0">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="h-9 text-xs">
            <X className="mr-1.5 h-3.5 w-3.5" /> Cancel
          </Button>
          <Button type="submit" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white h-9 text-xs" disabled={isSubmitting}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> {isSubmitting ? 'Saving...' : 'Save Work Order'}
          </Button>
        </div>
      </div>

      {/* ── Company, Project & Scope ── */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2563eb]">Company & Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.length > 0 && (
            <div className="space-y-2 lg:col-span-2">
              <Label>Company</Label>
              <Select
                value={watchedCompanyId || ''}
                onValueChange={(v) => {
                  setValue("companyId", v);
                  setValue("projectId", '');
                  setValue("subLocationId", '');
                  setValue("subLocationType", '');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Company">
                    {watchedCompanyId ? (selectedCompany ? `${selectedCompany.code} — ${selectedCompany.name}` : watchedCompanyId) : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="min-w-[340px]">
                  {companies.filter(c => c.isActive).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>{labels.projectLabel}</Label>
            <Select
              value={watchedProjectId || ''}
              onValueChange={(v) => {
                setValue("projectId", v);
                setValue("subLocationId", '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={watchedCompanyId ? `Select ${labels.projectLabel.toLowerCase()}` : 'Select company first'}>
                  {watchedProjectId ? (filteredProjects.find(p => p.id === watchedProjectId)?.name || projects.find(p => p.id === watchedProjectId)?.name || 'Unnamed Project') : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)
                ) : (
                  <div className="px-3 py-2 text-xs text-[#6b7280]">
                    {watchedCompanyId ? 'No projects for this company' : 'Select a company first'}
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Scope</Label>
            <Select
              value={watchedScopeType || 'PROJECT_LEVEL'}
              onValueChange={(v) => {
                setValue("scopeType", v);
                if (v === 'PROJECT_LEVEL') setValue("subLocationId", '');
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PROJECT_LEVEL">Project Level</SelectItem>
                <SelectItem value="SUB_LOCATION_LEVEL">{labels.subLocationLabel} Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showSubLocation && (
            <div className="space-y-2">
              <Label>{labels.subLocationLabel}</Label>
              <SubLocationPicker
                value={watch('subLocationId') || ''}
                items={filteredSubLocations}
                businessType={selectedCompany?.businessType}
                label={labels.subLocationLabel}
                onChange={(id, item) => {
                  setValue('subLocationId', id, { shouldDirty: true });
                  if (item) setValue('subLocationType', item.type);
                }}
              />
            </div>
          )}
        </div>

        {/* Read-only ownership context for SIPL (CONSTRUCTION) units. No WO
            logic is affected — this is informational only so the preparer
            can see whether the unit is owned by SIPL or by a customer. */}
        {showSubLocation && selectedCompany?.businessType === 'CONSTRUCTION' && (() => {
          const sl = filteredSubLocations.find(s => s.id === watch("subLocationId"));
          if (!sl) return null;
          const status = sl.ownershipStatus ?? 'UNSOLD';
          const isSold = status === 'SOLD';
          return (
            <div className={`mt-4 rounded-lg border p-3 text-xs flex items-start gap-3 ${
              isSold
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="font-black uppercase tracking-widest text-[10px] shrink-0 pt-0.5">
                Owner
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Status tag — makes ownership stance immediately obvious. */}
                <div>
                  <span className={`inline-block text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 ${
                    isSold
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {isSold ? 'Client-owned unit' : 'Company-owned unit'}
                  </span>
                </div>
                <div>
                  {isSold ? (
                    <>
                      <span className="font-bold">Sold</span>
                      {' — '}
                      <span className="font-bold">{sl.ownerClientName || 'Customer'}</span>
                      {sl.soldAt && (
                        <span className="text-[10px] text-amber-700 ml-2">
                          (sold {new Date(sl.soldAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="font-bold">Unsold</span>
                      {' — owned by '}
                      <span className="font-bold">{selectedCompany?.code || 'SIPL'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Basic Info ── */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2563eb]">Work Order Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 space-y-2">
            <Label>Work Order Title</Label>
            <Input {...register("title")} placeholder="e.g. Civil Work for Block A" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Contractor</Label>
            <Select onValueChange={(v) => setValue("contractorId", v)} defaultValue={watch("contractorId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Contractor">
                  {watch("contractorId") ? (contractors.find(c => c.id === watch("contractorId"))?.name || 'Unknown') : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {contractors.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.contractorId && <p className="text-xs text-red-500">{errors.contractorId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Work Category</Label>
            {/* Legacy-safe dropdown: the stored value is the category
                NAME (plain string) so old work orders keep rendering
                without migration. Uses defaultValue + onValueChange
                to match the contractor Select in this same form; a
                controlled value + empty string was rendering as a
                greyed-out trigger on Base UI 1.4. */}
            <Select
              defaultValue={initialData?.workCategory || undefined}
              onValueChange={(v) => setValue('workCategory', v ?? '', { shouldValidate: true, shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category">
                  {watch('workCategory') || undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {workCategories.length === 0 ? (
                  // Empty-state placeholder: Base UI Select can render
                  // the trigger as if it were disabled when the Content
                  // panel has zero items. A single disabled item keeps
                  // the trigger interactive and tells the admin where
                  // to go add categories.
                  <SelectItem value="__empty__" disabled>
                    No categories yet — add in Masters → Work Categories
                  </SelectItem>
                ) : (
                  workCategories.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))
                )}
                {(() => {
                  // Legacy fallback: if this WO was saved against a
                  // category that is now inactive/deleted/free-text,
                  // surface it as a disabled option so editing never
                  // silently drops the value.
                  const current = watch('workCategory') || '';
                  const active = new Set(workCategories.map(c => c.name));
                  if (current && !active.has(current)) {
                    return <SelectItem value={current} disabled>{current} (legacy)</SelectItem>;
                  }
                  return null;
                })()}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...register("location")} placeholder="Site Location" />
          </div>
          <div className="space-y-2">
            <Label>Contractor GST</Label>
            <Input {...register("contractorGST")} placeholder="GST Number" />
          </div>
        </div>
      </div>

      {/* ── Timeline & Approvers ── */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2563eb]">Timeline & Approvers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input type="date" {...register("issueDate")} />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" {...register("startDate")} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" {...register("endDate")} />
          </div>
          <div className="space-y-2">
            <Label>Checked By</Label>
            <Input {...register("checkedBy")} placeholder="Name" />
          </div>
          <div className="space-y-2">
            <Label>Approved By</Label>
            <Input {...register("approvedBy")} placeholder="Name" />
          </div>
        </div>
      </div>

      {/* ── BOQ Table ── */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#2563eb]">Bill of Quantities (BOQ)</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', unit: 'SFT', quantity: 0, rate: 0, amount: 0 })}>
            <Plus className="mr-2 h-4 w-4" /> Add Row
          </Button>
        </div>
        <div className="border rounded-lg overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-[#f9fafb]">
                <TableHead className="w-[40%] min-w-[240px]">Description</TableHead>
                <TableHead className="min-w-[70px]">Unit</TableHead>
                <TableHead className="min-w-[90px]">Qty</TableHead>
                <TableHead className="min-w-[100px]">Rate (₹)</TableHead>
                <TableHead className="min-w-[120px]">Amount (₹)</TableHead>
                <TableHead className="w-[44px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="p-2">
                    <Input {...register(`boqItems.${index}.description`)} placeholder="Item description" className="h-8 text-sm" />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input {...register(`boqItems.${index}.unit`)} placeholder="Unit" className="h-8 text-sm w-full" />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input type="number" step="0.01" {...register(`boqItems.${index}.quantity`, { valueAsNumber: true })} className="h-8 text-sm" />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input type="number" step="0.01" {...register(`boqItems.${index}.rate`, { valueAsNumber: true })} className="h-8 text-sm" />
                  </TableCell>
                  <TableCell className="p-2 font-mono text-sm whitespace-nowrap">
                    {formatCurrency(watchedItems[index]?.amount || 0)}
                  </TableCell>
                  <TableCell className="p-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Financials + Summary side by side ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#2563eb]">Financial Adjustments</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Advance Paid (₹)</Label>
              <Input type="number" {...register("financials.advance", { valueAsNumber: true })} />
              <p className="text-[11px] text-[#9ca3af]">Previous advance to deduct from this WO.</p>
            </div>
            <div className="space-y-2">
              <Label>GST Percentage (%)</Label>
              <Input type="number" {...register("financials.gstPercentage", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Retention (%)</Label>
              <Input type="number" {...register("financials.retentionPercentage", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Other Charges (₹)</Label>
              <Input type="number" {...register("financials.otherCharges", { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] text-white p-5 rounded-xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Work Order Value</span>
              <span>{formatCurrency(totals.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm gap-3">
              <span className="text-slate-400">
                Retention Amount (Payable after Work Completion with 100% Accuracy) ({watchedFinancials.retentionPercentage || 0}%)
              </span>
              <span className="text-amber-400 whitespace-nowrap">-{formatCurrency(totals.retentionAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Less: Advance Paid</span>
              <span className="text-red-400">-{formatCurrency(watchedFinancials.advance || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">GST ({watchedFinancials.gstPercentage || 0}%)</span>
              <span>+{formatCurrency(totals.gstAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Other Charges</span>
              <span>+{formatCurrency(watchedFinancials.otherCharges || 0)}</span>
            </div>
            <div className="pt-3 border-t border-slate-700 flex justify-between items-end">
              <span className="text-lg font-bold">Remaining Amount</span>
              <span className="text-2xl font-black text-blue-400">{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Work Description ── */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2563eb]">Work Description</h3>
        <div className="space-y-2">
          <Label>Scope of Work</Label>
          <Textarea {...register("scopeOfWork")} placeholder="Detailed description of work to be performed..." className="min-h-[120px]" />
          {errors.scopeOfWork && <p className="text-xs text-red-500">{errors.scopeOfWork.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea {...register("additionalNotes")} placeholder="Any specific instructions..." className="min-h-[80px]" />
        </div>
      </div>

      {/* ── Terms & Conditions (with template support) ── */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#2563eb]">
            नियम एवं शर्तें / Terms & Conditions
          </h3>
          {termsTemplates.length > 0 && (
            <div className="sm:w-64">
              <Select
                value={watch("termsTemplateId") || ''}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select template..." />
                </SelectTrigger>
                <SelectContent>
                  {termsTemplates.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} {t.isDefault ? '(Default)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Textarea
            {...register("termsAndConditions")}
            placeholder="नियम एवं शर्तें यहाँ लिखें... / Write terms and conditions here..."
            className="min-h-[180px] font-[sans-serif] text-sm leading-relaxed"
            dir="auto"
          />
          <p className="text-[10px] text-[#6b7280]">
            Select a template to auto-fill, then edit as needed. The text saved here is a snapshot — changes to the master template won't affect this work order.
          </p>
        </div>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SubLocationPicker — searchable Unit / Department combobox.
//
// Replaces the original Base UI Select for the sub-location field
// because that Select is keyboard-driven only and doesn't accept a
// type-to-search query, which is painful when a project has dozens
// of numbered units (e.g. SIPL plots / duplexes 1, 2, 24, 101, 501…).
//
// Filter rules:
//   - case + space insensitive on every field
//   - matches name, code, type, ownerClientName
//   - numeric queries also match digits-only of name/code so typing
//     "501" finds "Plot 501", "D-501", "501 (West)"
//   - results sorted by match strength: exact > startsWith > contains
//
// Filtering scope is the SAME items array the parent already filtered
// to (current company + current project + isActive), so this picker
// can never leak units from elsewhere — see filteredSubLocations
// prop above.
// ─────────────────────────────────────────────────────────────────────

interface SubLocationPickerProps {
  value: string;                 // selected subLocationId
  items: SubLocation[];          // already filtered by company+project+isActive
  onChange: (id: string, item: SubLocation | null) => void;
  label: string;                 // "Unit" / "Department"
  businessType?: string;         // 'CONSTRUCTION' | 'HOSPITALITY'
}

function SubLocationPicker({ value, items, onChange, label, businessType }: SubLocationPickerProps) {
  const isConstruction = businessType === 'CONSTRUCTION';
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const selected = items.find(s => s.id === value) || null;

  // Close on outside click. Single document listener while open;
  // attached/detached so we don't pay for it when the menu is closed.
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Auto-focus the search input when opening so the user can type
  // immediately without an extra click.
  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!q) return items.slice(0, 100);
    const qDigits = q.replace(/\D+/g, '');
    const isDigitQuery = qDigits.length > 0 && qDigits.length === q.replace(/\s/g, '').length;

    type Scored = { item: SubLocation; score: number };
    const scored: Scored[] = [];
    for (const item of items) {
      const nameLc = (item.name || '').toLowerCase();
      const codeLc = (item.code || '').toLowerCase();
      const typeLc = (item.type || '').toLowerCase();
      const ownerLc = (item.ownerClientName || '').toLowerCase();
      const nameDigits = (item.name || '').replace(/\D+/g, '');
      const codeDigits = (item.code || '').replace(/\D+/g, '');

      // Score: 100 exact name/code, 80 exact digits, 60 startsWith,
      // 40 word-boundary contains, 20 generic contains. Higher = more
      // relevant — sort descending so best matches surface first.
      let score = 0;
      if (nameLc === q || codeLc === q) score = Math.max(score, 100);
      if (isDigitQuery && (nameDigits === qDigits || codeDigits === qDigits)) score = Math.max(score, 100);
      if (nameLc.startsWith(q) || codeLc.startsWith(q)) score = Math.max(score, 60);
      if (isDigitQuery && (nameDigits.startsWith(qDigits) || codeDigits.startsWith(qDigits))) score = Math.max(score, 80);
      if (nameLc.includes(q) || codeLc.includes(q)) score = Math.max(score, 30);
      if (typeLc.includes(q)) score = Math.max(score, 25);
      if (ownerLc.includes(q)) score = Math.max(score, 25);
      if (isDigitQuery && (nameDigits.includes(qDigits) || codeDigits.includes(qDigits))) score = Math.max(score, 35);

      if (score > 0) scored.push({ item, score });
    }
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Natural-numeric tiebreak so "1, 2, 10" reads naturally.
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      return collator.compare(a.item.name || '', b.item.name || '');
    });
    return scored.slice(0, 100).map(s => s.item);
  }, [items, query]);

  const triggerLabel = selected
    ? `${selected.name} (${selected.type})`
    : `Select ${label}`;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn('truncate text-left', !selected && 'text-muted-foreground')}>
          {triggerLabel}
        </span>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b border-[#e5e7eb]">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()} by number, name, type, owner…`}
              className="w-full h-8 px-2 text-sm border border-[#e5e7eb] rounded-md outline-none focus:border-[#2563eb]"
            />
          </div>
          <div className="max-h-64 overflow-y-auto" role="listbox">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-[#6b7280]">
                No matching {label.toLowerCase()} found.
              </div>
            ) : (
              filtered.map(item => {
                const isSelected = item.id === value;
                const ownership = (item.ownershipStatus ?? 'UNSOLD') as 'SOLD' | 'UNSOLD';
                const isSold = isConstruction && ownership === 'SOLD';
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      onChange(item.id, item);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-[#f9fafb] flex items-start justify-between gap-2 border-b border-[#f1f5f9] last:border-0',
                      isSelected && 'bg-[#eff6ff]'
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#111827] truncate">
                        {item.name}
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
                          {item.type}
                        </span>
                      </div>
                      {/* SIPL: owner status one-liner. SHSPL: type only. */}
                      {isConstruction ? (
                        <div className="text-[11px] text-[#6b7280] mt-0.5 truncate">
                          {isSold
                            ? <span className="text-amber-700 font-bold">Sold</span>
                            : <span className="text-emerald-700 font-bold">Unsold</span>}
                          {isSold && item.ownerClientName && (
                            <span className="text-[#374151]"> — {item.ownerClientName}</span>
                          )}
                        </div>
                      ) : (
                        item.code && (
                          <div className="text-[11px] text-[#6b7280] mt-0.5 truncate">Code: {item.code}</div>
                        )
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
