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
