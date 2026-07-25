import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Phone, Mail, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contractorService } from '../services/contractorService';
import { Contractor, BusinessRuleError } from '../types';
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
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { SkeletonRow } from '../components/Skeleton';

export default function Contractors() {
  const { isAdmin, isPM } = useAuth();
  const navigate = useNavigate();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    trade: ''
  });

  useEffect(() => {
    const unsub = contractorService.getAll((data) => {
      setContractors(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredContractors = contractors.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.trade.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (contractor?: Contractor) => {
    if (contractor) {
      setEditingContractor(contractor);
      setFormData({
        name: contractor.name,
        email: contractor.email,
        phone: contractor.phone,
        address: contractor.address,
        trade: contractor.trade
      });
    } else {
      setEditingContractor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        trade: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContractor) {
        await contractorService.update(editingContractor.id, formData);
        toast.success('Contractor updated successfully');
      } else {
        await contractorService.create(formData);
        toast.success('Contractor created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save contractor');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contractor?')) {
      try {
        await contractorService.delete(id);
        toast.success('Contractor deleted successfully');
      } catch (error) {
        toast.error(error instanceof BusinessRuleError ? error.message : 'Failed to delete contractor');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Contractors</h2>
          <p className="text-sm text-[#6b7280]">Manage your network of skilled contractors.</p>
        </div>
        {(isAdmin || isPM) && (
          <Button onClick={() => handleOpenDialog()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Contractor
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 max-w-sm bg-white rounded-md border border-[#e5e7eb] px-3 py-1">
        <Search className="h-4 w-4 text-[#6b7280]" />
        <Input 
          placeholder="Search by name or trade..." 
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
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Trade</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Contact</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Address</TableHead>
              <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={5} />
              ))
            ) : filteredContractors.length > 0 ? (
              filteredContractors.map((contractor) => (
                <TableRow key={contractor.id} className="hover:bg-[#f9fafb] transition-colors border-b border-[#e5e7eb] last:border-0">
                  <TableCell className="px-6 py-4 font-semibold text-sm">{contractor.name}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{contractor.trade}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col space-y-0.5 text-[13px]">
                      <div className="flex items-center text-[#6b7280]">
                        <Mail className="mr-1.5 h-3 w-3" /> {contractor.email}
                      </div>
                      <div className="flex items-center text-[#6b7280]">
                        <Phone className="mr-1.5 h-3 w-3" /> {contractor.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#6b7280] max-w-[200px] truncate">{contractor.address}</TableCell>
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
                        <DropdownMenuItem onClick={() => navigate(`/contractors/${contractor.id}/ledger`)}>
                          <FileText className="mr-2 h-4 w-4" /> View Ledger
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(contractor)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => handleDelete(contractor.id)} className="text-destructive">
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
                <TableCell colSpan={5} className="h-24 text-center text-xs font-medium text-[#6b7280]">
                  No contractors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>{editingContractor ? 'Edit Contractor' : 'Add New Contractor'}</DialogTitle>
            <DialogDescription>
              Enter the contractor's contact and trade information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  required 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trade">Trade / Specialization</Label>
              <Input 
                id="trade" 
                placeholder="e.g. Electrical, Plumbing, HVAC"
                value={formData.trade} 
                onChange={(e) => setFormData({...formData, trade: e.target.value})} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingContractor ? 'Update Contractor' : 'Create Contractor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
