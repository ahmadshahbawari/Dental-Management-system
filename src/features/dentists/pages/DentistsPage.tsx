<<<<<<< HEAD
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, usePagination } from '@/components/ui/pagination';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, Edit, Trash2, Eye, Phone, Mail, Stethoscope, Filter, CheckCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Dentist } from '@/types/core';
import { formatDate } from '@/lib/utils';

const INIT_DENTISTS: Dentist[] = [
  { id: '1', dentistNumber: 'DNT-2024-00001', firstName: 'Ahmad',  lastName: 'Karimi',
    phone: '+93 700 123 456', email: 'a.karimi@clinic.af',
    licenseNumber: 'DENT-12345', specialties: ['Orthodontics', 'Cosmetic Dentistry'],
    isActive: true, version: 1, createdAt: '2024-01-10T09:15:00Z', updatedAt: '2024-01-10T09:15:00Z' },
  { id: '2', dentistNumber: 'DNT-2024-00002', firstName: 'Sara',   lastName: 'Rahimi',
    phone: '+93 701 234 567', email: 's.rahimi@clinic.af',
    licenseNumber: 'DENT-67890', specialties: ['Periodontics', 'Oral Surgery'],
    isActive: true, version: 1, createdAt: '2024-01-15T11:30:00Z', updatedAt: '2024-01-15T11:30:00Z' },
  { id: '3', dentistNumber: 'DNT-2024-00003', firstName: 'Khalid', lastName: 'Noori',
    phone: '+93 702 345 678', email: 'k.noori@clinic.af',
    licenseNumber: 'DENT-54321', specialties: ['Pediatric Dentistry'],
    isActive: false, version: 1, createdAt: '2024-02-01T14:20:00Z', updatedAt: '2024-02-01T14:20:00Z' },
];

const blank = { firstName: '', lastName: '', phone: '+93 ', email: '', licenseNumber: '', specialties: '', isActive: 'active' };

export default function DentistsPage() {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('dentist', 'create');
  const canUpdate = hasPermission('dentist', 'update');
  const canDelete = hasPermission('dentist', 'delete');

  const [dentists, setDentists] = useState<Dentist[]>(INIT_DENTISTS);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<'ALL'|'ACTIVE'|'INACTIVE'>('ALL');

  const [selected, setSelected] = useState<Dentist | null>(null);
  const [addOpen,  setAddOpen]  = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen,  setDelOpen]  = useState(false);

  const [form, setForm]         = useState(blank);
  const [editForm, setEditForm] = useState(blank);
  const [saved, setSaved]       = useState(false);
  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  const stats = [
    { label: 'Total',    value: dentists.length },
    { label: 'Active',   value: dentists.filter(d => d.isActive).length },
    { label: 'Inactive', value: dentists.filter(d => !d.isActive).length },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return dentists.filter(d => {
      const ms =
        d.dentistNumber.toLowerCase().includes(q) ||
        d.firstName.toLowerCase().includes(q) ||
        d.lastName.toLowerCase().includes(q) ||
        (d.email ?? '').toLowerCase().includes(q) ||
        (d.phone ?? '').toLowerCase().includes(q);
      const mst =
        statusF === 'ALL' ||
        (statusF === 'ACTIVE' && d.isActive) ||
        (statusF === 'INACTIVE' && !d.isActive);
      return ms && mst;
    });
  }, [dentists, search, statusF]);

  const { page, pageSize, paged, setPage, setPageSize } = usePagination(filtered, 10);

  const toDentist = (f: typeof blank, id: string, existing?: Dentist): Dentist => ({
    ...(existing ?? {}),
    id, dentistNumber: existing?.dentistNumber ?? `DNT-${new Date().getFullYear()}-${String(dentists.length + 4).padStart(5, '0')}`,
    firstName: f.firstName, lastName: f.lastName,
    phone: f.phone, email: f.email, licenseNumber: f.licenseNumber,
    specialties: f.specialties ? f.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
    isActive: f.isActive === 'active',
    version: existing?.version ?? 1,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleAdd = () => {
    if (!form.firstName || !form.lastName) return;
    setDentists(prev => [toDentist(form, String(Date.now())), ...prev]);
    setForm(blank);
    showSaved();
    setTimeout(() => setAddOpen(false), 1600);
  };

  const openEdit = (d: Dentist) => {
    setSelected(d);
    setEditForm({
      firstName: d.firstName, lastName: d.lastName,
      phone: d.phone || '+93 ', email: d.email || '',
      licenseNumber: d.licenseNumber || '',
      specialties: d.specialties?.join(', ') || '',
      isActive: d.isActive ? 'active' : 'inactive',
    });
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!selected) return;
    setDentists(prev => prev.map(d => d.id === selected.id ? toDentist(editForm, d.id, d) : d));
    setEditOpen(false);
    showSaved();
  };

  const handleDelete = () => {
    if (selected) setDentists(prev => prev.filter(d => d.id !== selected.id));
    setDelOpen(false); setSelected(null);
  };

  // Fix: use controlled inputs with explicit value — no onInput tricks needed;
  // The issue was FormFields being defined inside the component. Now it's a plain div block.

  return (
    <div className="space-y-4">
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Saved!
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dentists</h1>
          <p className="text-xs text-muted-foreground">Manage dentist profiles</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New Dentist
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="py-3 px-4">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input className="h-8 pl-7 text-xs" placeholder="Search dentists…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Filter className="h-3 w-3" />
              {statusF === 'ALL' ? 'All Status' : statusF === 'ACTIVE' ? 'Active' : 'Inactive'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-xs">
            <DropdownMenuItem onClick={() => { setStatusF('ALL');      setPage(1); }}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setStatusF('ACTIVE');   setPage(1); }}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setStatusF('INACTIVE'); setPage(1); }}>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Dentist Records</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Number</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Contact</TableHead>
                <TableHead className="text-xs">License</TableHead>
                <TableHead className="text-xs">Specialties</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-8">No dentists found</TableCell></TableRow>
              )}
              {paged.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="text-xs font-medium">{d.dentistNumber}</TableCell>
                  <TableCell className="text-xs font-medium">{d.firstName} {d.lastName}</TableCell>
                  <TableCell className="text-xs">
                    {d.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{d.phone}</div>}
                    {d.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{d.email}</div>}
                  </TableCell>
                  <TableCell className="text-xs">{d.licenseNumber || '—'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {d.specialties?.map(s => <Badge key={s} variant="outline" className="text-[10px] py-0">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.isActive ? 'default' : 'secondary'} className="text-[10px]">
                      {d.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View"
                        onClick={() => { setSelected(d); setViewOpen(true); }}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {canUpdate && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit"
                          onClick={() => openEdit(d)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" title="Delete"
                          onClick={() => { setSelected(d); setDelOpen(true); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination total={filtered.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </CardContent>
      </Card>

      {/* ── Add Dialog ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-base">Add New Dentist</DialogTitle>
            <DialogDescription className="text-xs">* required</DialogDescription>
          </DialogHeader>
          {saved ? (
            <div className="py-6 text-center text-green-600"><CheckCircle className="h-8 w-8 mx-auto mb-2" /><p className="text-sm font-medium">Saved!</p></div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="space-y-1">
                  <Label className="text-xs">First Name *</Label>
                  <Input className="h-8 text-xs" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Last Name *</Label>
                  <Input className="h-8 text-xs" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone (+93 7XX XXX XXX)</Label>
                  <Input className="h-8 text-xs" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+93 700 000 000" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input className="h-8 text-xs" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="dr@clinic.af" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">License #</Label>
                  <Input className="h-8 text-xs" value={form.licenseNumber} onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} placeholder="DENT-00000" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select value={form.isActive} onValueChange={v => setForm(f => ({ ...f, isActive: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active"   className="text-xs">Active</SelectItem>
                      <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Specialties (comma-separated)</Label>
                  <Input className="h-8 text-xs" value={form.specialties} onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))} placeholder="Orthodontics, Cosmetic Dentistry" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAdd} disabled={!form.firstName || !form.lastName}>Save</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── View Dialog ── */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[400px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Dr. {selected.firstName} {selected.lastName}</DialogTitle>
                <DialogDescription className="text-xs">{selected.dentistNumber}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                  <Badge variant={selected.isActive ? 'default' : 'secondary'} className="text-[10px]">
                    {selected.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><p className="text-muted-foreground">License</p><p className="font-medium">{selected.licenseNumber || '—'}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selected.phone || '—'}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selected.email || '—'}</p></div>
                  <div><p className="text-muted-foreground">Added</p><p className="font-medium">{formatDate(selected.createdAt, 'short')}</p></div>
                </div>
                <div>
                  <p className="text-muted-foreground">Specialties</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.specialties?.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setViewOpen(false)}>Close</Button>
                {canUpdate && (
                  <Button size="sm" onClick={() => { setViewOpen(false); openEdit(selected); }}>
                    <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[440px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Edit Dentist</DialogTitle>
                <DialogDescription className="text-xs">Dr. {selected.firstName} {selected.lastName}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="space-y-1">
                  <Label className="text-xs">First Name</Label>
                  <Input className="h-8 text-xs" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Last Name</Label>
                  <Input className="h-8 text-xs" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone</Label>
                  <Input className="h-8 text-xs" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input className="h-8 text-xs" type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">License #</Label>
                  <Input className="h-8 text-xs" value={editForm.licenseNumber} onChange={e => setEditForm(f => ({ ...f, licenseNumber: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select value={editForm.isActive} onValueChange={v => setEditForm(f => ({ ...f, isActive: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active"   className="text-xs">Active</SelectItem>
                      <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Specialties</Label>
                  <Input className="h-8 text-xs" value={editForm.specialties} onChange={e => setEditForm(f => ({ ...f, specialties: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleEdit}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Dentist</DialogTitle>
            <DialogDescription className="text-xs">Delete Dr. {selected?.firstName} {selected?.lastName}? Cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDelOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
=======
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail, Stethoscope,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Dentist } from '@/types/core';
import { formatDate } from '@/lib/utils';

const mockDentistsData: Dentist[] = [
  {
    id: '1', dentistNumber: 'DNT-2024-00001', firstName: 'Michael', lastName: 'Chen',
    phone: '+1 (555) 234-5678', email: 'michael.chen@dentalclinic.com',
    licenseNumber: 'DENT-12345', specialties: ['Orthodontics', 'Cosmetic Dentistry'],
    isActive: true, version: 1, createdAt: '2024-01-10T09:15:00Z', updatedAt: '2024-01-10T09:15:00Z',
  },
  {
    id: '2', dentistNumber: 'DNT-2024-00002', firstName: 'Sarah', lastName: 'Williams',
    phone: '+1 (555) 345-6789', email: 'sarah.williams@dentalclinic.com',
    licenseNumber: 'DENT-67890', specialties: ['Periodontics', 'Oral Surgery'],
    isActive: true, version: 1, createdAt: '2024-01-15T11:30:00Z', updatedAt: '2024-01-15T11:30:00Z',
  },
  {
    id: '3', dentistNumber: 'DNT-2024-00003', firstName: 'James', lastName: 'Rodriguez',
    phone: '+1 (555) 456-7890', email: 'james.rodriguez@dentalclinic.com',
    licenseNumber: 'DENT-54321', specialties: ['Pediatric Dentistry'],
    isActive: false, version: 1, createdAt: '2024-02-01T14:20:00Z', updatedAt: '2024-02-01T14:20:00Z',
  },
];

const defaultForm = {
  firstName: '', lastName: '', phone: '', email: '',
  licenseNumber: '', specialties: '', isActive: 'active',
};

export default function DentistsPage() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dentists, setDentists] = useState<Dentist[]>(mockDentistsData);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState(defaultForm);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canCreate = hasPermission('dentist', 'create');
  const canUpdate = hasPermission('dentist', 'update');
  const canDelete = hasPermission('dentist', 'delete');

  const filteredDentists = dentists.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.dentistNumber.toLowerCase().includes(q) ||
      d.firstName.toLowerCase().includes(q) ||
      d.lastName.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.phone?.toLowerCase().includes(q) ||
      d.licenseNumber?.toLowerCase().includes(q)
    );
  });

  const handleSaveNew = () => {
    if (!form.firstName || !form.lastName) return;
    const newId = String(dentists.length + 1);
    const newDentist: Dentist = {
      id: newId,
      dentistNumber: `DNT-2024-${String(dentists.length + 4).padStart(5, '0')}`,
      firstName: form.firstName, lastName: form.lastName,
      phone: form.phone, email: form.email, licenseNumber: form.licenseNumber,
      specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
      isActive: form.isActive === 'active',
      version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setDentists([newDentist, ...dentists]);
    setForm(defaultForm);
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setIsNewDialogOpen(false); }, 1500);
  };

  const openEdit = (dentist: Dentist) => {
    setSelectedDentist(dentist);
    setEditForm({
      firstName: dentist.firstName, lastName: dentist.lastName,
      phone: dentist.phone || '', email: dentist.email || '',
      licenseNumber: dentist.licenseNumber || '',
      specialties: dentist.specialties?.join(', ') || '',
      isActive: dentist.isActive ? 'active' : 'inactive',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedDentist) return;
    const updated: Dentist = {
      ...selectedDentist,
      firstName: editForm.firstName, lastName: editForm.lastName,
      phone: editForm.phone, email: editForm.email, licenseNumber: editForm.licenseNumber,
      specialties: editForm.specialties ? editForm.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
      isActive: editForm.isActive === 'active',
      updatedAt: new Date().toISOString(),
    };
    setDentists(dentists.map(d => d.id === updated.id ? updated : d));
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedDentist) setDentists(dentists.filter(d => d.id !== selectedDentist.id));
    setIsDeleteDialogOpen(false);
    setSelectedDentist(null);
  };

  const FormFields = ({ values, onChange }: { values: typeof defaultForm; onChange: (k: string, v: string) => void }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name *</Label>
          <Input value={values.firstName} onChange={e => onChange('firstName', e.target.value)} placeholder="First name" />
        </div>
        <div className="space-y-2">
          <Label>Last Name *</Label>
          <Input value={values.lastName} onChange={e => onChange('lastName', e.target.value)} placeholder="Last name" />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={values.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={values.email} onChange={e => onChange('email', e.target.value)} placeholder="dentist@clinic.com" />
        </div>
        <div className="space-y-2">
          <Label>License Number</Label>
          <Input value={values.licenseNumber} onChange={e => onChange('licenseNumber', e.target.value)} placeholder="DENT-00000" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={values.isActive} onValueChange={v => onChange('isActive', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Specialties (comma-separated)</Label>
        <Input value={values.specialties} onChange={e => onChange('specialties', e.target.value)} placeholder="Orthodontics, Cosmetic Dentistry" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dentists</h1>
          <p className="text-muted-foreground">Manage dentist profiles and their affiliated clinics</p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Dentist
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search dentists by name, number, license, or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchQuery('')}>
              Active ({dentists.filter(d => d.isActive).length})
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Dentist Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDentists.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No dentists found</TableCell></TableRow>
              )}
              {filteredDentists.map((dentist) => (
                <TableRow key={dentist.id}>
                  <TableCell className="font-medium">{dentist.dentistNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium">{dentist.firstName} {dentist.lastName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {dentist.phone && <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" />{dentist.phone}</div>}
                      {dentist.email && <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" />{dentist.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{dentist.licenseNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {dentist.specialties?.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={dentist.isActive ? 'default' : 'secondary'}>{dentist.isActive ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(dentist.createdAt, 'short')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { setSelectedDentist(dentist); setIsViewDialogOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {canUpdate && (
                          <DropdownMenuItem onClick={() => openEdit(dentist)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedDentist(dentist); setIsDeleteDialogOpen(true); }} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Dentist Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add New Dentist</DialogTitle>
            <DialogDescription>Enter dentist details. Fields marked * are required.</DialogDescription>
          </DialogHeader>
          {saveSuccess ? (
            <div className="py-8 text-center">
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <p className="text-lg font-medium text-green-600">Dentist saved successfully!</p>
            </div>
          ) : (
            <>
              <FormFields values={form} onChange={(k, v) => setForm({ ...form, [k]: v })} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveNew} disabled={!form.firstName || !form.lastName}>Save Dentist</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedDentist && (
            <>
              <DialogHeader>
                <DialogTitle>Dentist Details</DialogTitle>
                <DialogDescription>Dr. {selectedDentist.firstName} {selectedDentist.lastName}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Dr. {selectedDentist.firstName} {selectedDentist.lastName}</h3>
                    <p className="text-muted-foreground">{selectedDentist.dentistNumber}</p>
                  </div>
                  <Badge className="ml-auto" variant={selectedDentist.isActive ? 'default' : 'secondary'}>
                    {selectedDentist.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">License:</span><p className="font-medium">{selectedDentist.licenseNumber || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{selectedDentist.phone || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selectedDentist.email || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground">Created:</span><p className="font-medium">{formatDate(selectedDentist.createdAt, 'medium')}</p></div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Specialties:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDentist.specialties?.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                {canUpdate && <Button onClick={() => { setIsViewDialogOpen(false); openEdit(selectedDentist); }}><Edit className="mr-2 h-4 w-4" />Edit</Button>}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedDentist && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Dentist</DialogTitle>
                <DialogDescription>Update information for Dr. {selectedDentist.firstName} {selectedDentist.lastName}</DialogDescription>
              </DialogHeader>
              <FormFields values={editForm} onChange={(k, v) => setEditForm({ ...editForm, [k]: v })} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dentist</DialogTitle>
            <DialogDescription>Are you sure you want to delete Dr. {selectedDentist?.firstName} {selectedDentist?.lastName}? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}><Trash2 className="mr-2 h-4 w-4" />Delete Dentist</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
