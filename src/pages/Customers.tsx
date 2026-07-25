import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, User, Phone, Mail, MapPin, IdCard, AlertTriangle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/companyService';
import { customerService } from '../services/customerService';
import { subLocationService } from '../services/subLocationService';
import { Company, Customer, SubLocation, BusinessRuleError } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { SkeletonRow } from '../components/Skeleton';

/**
 * Customer master page. Currently used for SIPL unit ownership, but the
 * collection name and schema are deliberately broad to support other
 * SIPL customer records in the future. HOSPITALITY companies do not
 * appear in this page (the company filter excludes them).
 */
export default function Customers() {
  const navigate = useNavigate();
  const { isAdmin, isPM } = useAuth();
  const canEdit = isAdmin || isPM;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subLocations, setSubLocations] = useState<SubLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const emptyForm = {
    companyId: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    panNumber: '',
    notes: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const u1 = companyService.getAll(setCompanies);
    const u2 = customerService.getAll((data) => { setCustomers(data); setLoading(false); });
    const u3 = subLocationService.getAll(setSubLocations);
    return () => { u1(); u2(); u3(); };
  }, []);

  /** Count of sub-locations currently marked SOLD to each customer,
   *  keyed by customer id. Built from the live subLocations subscription. */
  const unitsOwnedByCustomer = useMemo(() => {
    const m: Record<string, number> = {};
    for (const sl of subLocations) {
      if (sl.ownershipStatus === 'SOLD' && sl.ownerClientId) {
        m[sl.ownerClientId] = (m[sl.ownerClientId] || 0) + 1;
      }
    }
    return m;
  }, [subLocations]);

  /** Normalization helpers mirror the service-layer dedup rule so the
   *  live warning in the form matches what the backend will accept. */
  const normName = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  const normPhone = (s: string) => (s || '').replace(/\D+/g, '');

  /** Only CONSTRUCTION companies may have customer records. */
  const constructionCompanies = useMemo(
    () => companies.filter(c => c.businessType === 'CONSTRUCTION' && c.isActive),
    [companies]
  );
  const companyById = useMemo(() => {
    const m: Record<string, Company> = {};
    for (const c of companies) m[c.id] = c;
    return m;
  }, [companies]);

  const filtered = useMemo(() => {
    let list = customers;
    if (filterCompany !== 'all') list = list.filter(c => c.companyId === filterCompany);
    if (search) {
      const s = search.toLowerCase();
      // Digit-only variant so typing "9876543210" matches a stored
      // "+91 98765-43210" etc. Runs alongside the normal substring match
      // so typing "rahul" still finds a name hit.
      const digits = s.replace(/\D+/g, '');
      list = list.filter(c =>
        c.name.toLowerCase().includes(s) ||
        (c.phone || '').toLowerCase().includes(s) ||
        (c.email || '').toLowerCase().includes(s) ||
        (c.panNumber || '').toLowerCase().includes(s) ||
        (digits.length >= 4 && normPhone(c.phone).includes(digits))
      );
    }
    return list;
  }, [customers, filterCompany, search]);

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditing(customer);
      setFormData({
        companyId: customer.companyId,
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address || '',
        panNumber: customer.panNumber || '',
        notes: customer.notes || ''
      });
    } else {
      setEditing(null);
      setFormData({
        ...emptyForm,
        companyId: constructionCompanies[0]?.id || ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyId) {
      toast.error('Select a company.');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone is required.');
      return;
    }
    try {
      // Trim and drop empty optional fields so we don't store blank strings.
      const payload = {
        companyId: formData.companyId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        ...(formData.email.trim() ? { email: formData.email.trim() } : {}),
        ...(formData.address.trim() ? { address: formData.address.trim() } : {}),
        ...(formData.panNumber.trim() ? { panNumber: formData.panNumber.trim().toUpperCase() } : {}),
        ...(formData.notes.trim() ? { notes: formData.notes.trim() } : {})
      };
      if (editing) {
        await customerService.update(editing.id, payload);
        toast.success('Customer updated');
      } else {
        await customerService.create(payload);
        toast.success('Customer created');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to save');
    }
  };

  /** Live duplicate detection — mirrors the service-layer rule so the
   *  warning appears before submit rather than after. Triggers only when
   *  the form has enough input to compare and there's an actual match in
   *  the same company (excluding the row being edited). */
  const duplicateMatch = useMemo(() => {
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    if (!formData.companyId || !trimmedName || !trimmedPhone) return null;
    const nName = normName(trimmedName);
    const nPhone = normPhone(trimmedPhone);
    if (nPhone.length < 4) return null;
    return customers.find(c =>
      c.id !== editing?.id &&
      c.companyId === formData.companyId &&
      normName(c.name) === nName &&
      normPhone(c.phone) === nPhone
    ) || null;
  }, [customers, editing, formData.companyId, formData.name, formData.phone]);

  const handleDelete = async (c: Customer) => {
    if (!window.confirm(`Delete customer "${c.name}"?`)) return;
    try {
      await customerService.delete(c.id);
      toast.success('Deleted');
    } catch (error) {
      toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-5 w-5 text-[#2563eb]" />
            Customers
          </h2>
          <p className="text-sm text-[#6b7280]">
            Buyer/customer master. Used for unit ownership on SIPL projects.
          </p>
        </div>
        {canEdit && constructionCompanies.length > 0 && (
          <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        )}
      </div>

      {constructionCompanies.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
          <p className="text-sm font-bold text-amber-800">No construction companies configured.</p>
          <p className="text-xs text-amber-600 mt-1">
            Customer records are only used on SIPL (Construction) companies. Add or activate a construction company first.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Company" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {constructionCompanies.map(c => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 max-w-xs bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
          <Search className="h-4 w-4 text-[#6b7280]" />
          <Input
            placeholder="Search name, phone, email, PAN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-7 text-xs w-72"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Company</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Name</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Phone</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Email</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">PAN</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-center">Units Owned</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={7} />)
            ) : filtered.length > 0 ? (
              filtered.map(c => (
                <TableRow key={c.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 text-xs font-bold">{companyById[c.companyId]?.code || '—'}</TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-sm max-w-[220px] truncate" title={c.name}>{c.name}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280] whitespace-nowrap">{c.phone || '—'}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280] max-w-[200px] truncate" title={c.email || ''}>{c.email || '—'}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280]">{c.panNumber || '—'}</TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    {(() => {
                      const count = unitsOwnedByCustomer[c.id] || 0;
                      if (count === 0) {
                        return <span className="text-xs text-[#9ca3af]">0</span>;
                      }
                      return (
                        <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                          {count}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>} />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/customers/${c.id}/ledger`)}>
                          <BookOpen className="mr-2 h-4 w-4" /> View Ledger
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => handleOpenDialog(c)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        )}
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => handleDelete(c)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No customers found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Customer' : 'New Customer'}</DialogTitle>
            <DialogDescription>
              Customer/buyer record. Used for unit ownership on SIPL projects.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label>Company</Label>
              <Select value={formData.companyId} onValueChange={(v) => setFormData({ ...formData, companyId: v })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company">
                    {formData.companyId ? (companyById[formData.companyId]
                      ? `${companyById[formData.companyId].code} — ${companyById[formData.companyId].name}`
                      : formData.companyId) : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="min-w-[340px]">
                  {constructionCompanies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label><Phone className="inline h-3 w-3 mr-1" /> Phone <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 ..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label><Mail className="inline h-3 w-3 mr-1" /> Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="optional"
                />
              </div>
              <div className="grid gap-2">
                <Label><IdCard className="inline h-3 w-3 mr-1" /> PAN</Label>
                <Input
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                  placeholder="optional"
                />
              </div>
              <div className="md:col-span-2 grid gap-2">
                <Label><MapPin className="inline h-3 w-3 mr-1" /> Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="optional"
                />
              </div>
              <div className="md:col-span-2 grid gap-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="optional"
                />
              </div>
            </div>

            {/* Live duplicate warning — same normalization rule as the
                service-layer guard. Prevents a wasted submit round-trip. */}
            {duplicateMatch && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold">
                    Possible duplicate: {duplicateMatch.name}
                    {duplicateMatch.phone ? ` · ${duplicateMatch.phone}` : ''}
                  </p>
                  <p className="text-amber-800 mt-0.5">
                    A customer with this name and phone already exists for this company. Saving will be blocked unless you change one.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!!duplicateMatch}>{editing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
