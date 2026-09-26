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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, Edit, Trash2, Eye, Phone, Mail, User, Filter, CheckCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Patient } from '@/types/core';
import { formatDate } from '@/lib/utils';

const MOCK_PATIENTS: Patient[] = [
  { id:'1', patientNumber:'PAT-2024-00001', firstName:'Ahmad',  lastName:'Shah',       dateOfBirth:'1985-05-15', gender:'male',   phone:'+93 700 100 200', email:'ahmad.shah@email.af',  address:'Kabul, Afghanistan', allergies:'None',      medicalNotes:'Healthy',      isActive:true,  version:1, createdAt:'2024-01-15T10:30:00Z', updatedAt:'2024-01-15T10:30:00Z' },
  { id:'2', patientNumber:'PAT-2024-00002', firstName:'Fatima', lastName:'Mohammadi',  dateOfBirth:'1990-08-22', gender:'female', phone:'+93 701 200 300', email:'fatima.m@email.af',   address:'Herat, Afghanistan', allergies:'Penicillin', medicalNotes:'Asthma',       isActive:true,  version:1, createdAt:'2024-01-20T14:45:00Z', updatedAt:'2024-01-20T14:45:00Z' },
  { id:'3', patientNumber:'PAT-2024-00003', firstName:'Omar',   lastName:'Barakzai',   dateOfBirth:'1978-11-30', gender:'male',   phone:'+93 702 300 400', email:'omar.b@email.af',     address:'Kandahar, Afghanistan', allergies:'Sulfa',   medicalNotes:'Hypertension', isActive:false, version:1, createdAt:'2024-02-05T09:15:00Z', updatedAt:'2024-02-05T09:15:00Z' },
];

const blankForm = {
  firstName:'', lastName:'', dateOfBirth:'', gender:'male',
  phone:'', email:'', address:'', allergies:'', medicalNotes:'', isActive:true as boolean,
};

type Form = typeof blankForm;
type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function PatientsPage() {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('patient', 'create');
  const canUpdate = hasPermission('patient', 'update');
  const canDelete = hasPermission('patient', 'delete');

  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [search, setSearch]     = useState('');
  const [statusF, setStatusF]   = useState<StatusFilter>('ALL');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [addOpen,  setAddOpen]  = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen,  setDelOpen]  = useState(false);
  const [form,     setForm]     = useState<Form>({ ...blankForm });
  const [editForm, setEditForm] = useState<Form>({ ...blankForm });
  const [saved,    setSaved]    = useState(false);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter(p => {
      const ms = p.patientNumber.toLowerCase().includes(q) || p.firstName.toLowerCase().includes(q) ||
                 p.lastName.toLowerCase().includes(q) || (p.email??'').toLowerCase().includes(q) || (p.phone??'').toLowerCase().includes(q);
      const mst = statusF === 'ALL' || (statusF === 'ACTIVE' && p.isActive) || (statusF === 'INACTIVE' && !p.isActive);
      return ms && mst;
    });
  }, [patients, search, statusF]);

  const { page, pageSize, paged, setPage, setPageSize } = usePagination(filtered, 10);

  const handleAdd = () => {
    if (!form.firstName || !form.lastName) return;
    const p: Patient = {
      id: String(Date.now()),
      patientNumber: `PAT-${new Date().getFullYear()}-${String(patients.length + 4).padStart(5,'0')}`,
      firstName: form.firstName, lastName: form.lastName,
      dateOfBirth: form.dateOfBirth || undefined,
      gender: (form.gender as 'male'|'female'|'other') || undefined,
      phone: form.phone || undefined, email: form.email || undefined,
      address: form.address || undefined, allergies: form.allergies || undefined,
      medicalNotes: form.medicalNotes || undefined,
      isActive: form.isActive, version: 1,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setPatients(prev => [p, ...prev]);
    setForm({ ...blankForm });
    showSaved();
    setTimeout(() => setAddOpen(false), 1600);
  };

  const openEdit = (p: Patient) => {
    setSelected(p);
    setEditForm({
      firstName: p.firstName, lastName: p.lastName,
      dateOfBirth: p.dateOfBirth ?? '', gender: p.gender ?? 'male',
      phone: p.phone ?? '', email: p.email ?? '', address: p.address ?? '',
      allergies: p.allergies ?? '', medicalNotes: p.medicalNotes ?? '', isActive: p.isActive,
    });
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!selected) return;
    setPatients(prev => prev.map(p => p.id !== selected.id ? p : {
      ...p,
      firstName: editForm.firstName, lastName: editForm.lastName,
      dateOfBirth: editForm.dateOfBirth || undefined,
      gender: (editForm.gender as 'male'|'female'|'other') || undefined,
      phone: editForm.phone || undefined, email: editForm.email || undefined,
      address: editForm.address || undefined, allergies: editForm.allergies || undefined,
      medicalNotes: editForm.medicalNotes || undefined,
      isActive: editForm.isActive, updatedAt: new Date().toISOString(),
    }));
    setEditOpen(false); showSaved();
  };

  const handleDelete = () => {
    if (selected) setPatients(prev => prev.filter(p => p.id !== selected.id));
    setDelOpen(false); setSelected(null);
  };

  const stats = [
    { label:'Total',    value: patients.length,                           color:'' },
    { label:'Active',   value: patients.filter(p=>p.isActive).length,    color:'text-green-600' },
    { label:'Inactive', value: patients.filter(p=>!p.isActive).length,   color:'text-gray-500' },
    { label:'This Month', value: 3, color:'' },
  ];

  // Inline form fields — avoids focus-loss bug caused by nested component definitions
  const renderFields = (vals: Form, set: React.Dispatch<React.SetStateAction<Form>>) => (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label className="text-xs">First Name *</Label>
        <Input className="h-8 text-xs" value={vals.firstName}
          onChange={e => set(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Last Name *</Label>
        <Input className="h-8 text-xs" value={vals.lastName}
          onChange={e => set(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Date of Birth</Label>
        <Input className="h-8 text-xs" type="date" value={vals.dateOfBirth}
          onChange={e => set(f => ({ ...f, dateOfBirth: e.target.value }))} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Gender</Label>
        <select className="h-8 w-full border border-input bg-background rounded-md px-2 text-xs"
          value={vals.gender} onChange={e => set(f => ({ ...f, gender: e.target.value }))}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Phone <span className="text-muted-foreground">(optional)</span></Label>
        <Input className="h-8 text-xs" value={vals.phone}
          onChange={e => set(f => ({ ...f, phone: e.target.value }))} placeholder="+93 7XX XXX XXX" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Email</Label>
        <Input className="h-8 text-xs" type="email" value={vals.email}
          onChange={e => set(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
      </div>
      <div className="space-y-1 col-span-2">
        <Label className="text-xs">Address</Label>
        <Input className="h-8 text-xs" value={vals.address}
          onChange={e => set(f => ({ ...f, address: e.target.value }))} placeholder="City, Province, Afghanistan" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Allergies</Label>
        <Input className="h-8 text-xs" value={vals.allergies}
          onChange={e => set(f => ({ ...f, allergies: e.target.value }))} placeholder="e.g. Penicillin" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Medical Notes</Label>
        <Input className="h-8 text-xs" value={vals.medicalNotes}
          onChange={e => set(f => ({ ...f, medicalNotes: e.target.value }))} placeholder="e.g. Hypertension" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Saved!
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Patients</h1>
          <p className="text-xs text-muted-foreground">Manage patient records</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New Patient
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="py-3 px-4">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input className="h-8 pl-7 text-xs" placeholder="Search patients…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <Filter className="h-3 w-3" />
              {statusF === 'ALL' ? 'All Status' : statusF === 'ACTIVE' ? 'Active' : 'Inactive'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs">
            <DropdownMenuItem onClick={() => { setStatusF('ALL');      setPage(1); }}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setStatusF('ACTIVE');   setPage(1); }}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setStatusF('INACTIVE'); setPage(1); }}>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Patient Records</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Number</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Contact</TableHead>
                <TableHead className="text-xs">DOB</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">No patients found</TableCell></TableRow>
              )}
              {paged.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs font-medium">{p.patientNumber}</TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{p.firstName} {p.lastName}</div>
                    <div className="text-muted-foreground capitalize">{p.gender}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.phone}</div>}
                    {p.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.email}</div>}
                  </TableCell>
                  <TableCell className="text-xs">{p.dateOfBirth ? formatDate(p.dateOfBirth,'short') : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? 'default' : 'secondary'} className="text-[10px]">
                      {p.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View" onClick={() => { setSelected(p); setViewOpen(true); }}><Eye className="h-3.5 w-3.5" /></Button>
                      {canUpdate && <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => openEdit(p)}><Edit className="h-3.5 w-3.5" /></Button>}
                      {canDelete && <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" title="Delete" onClick={() => { setSelected(p); setDelOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination total={filtered.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </CardContent>
      </Card>

      {/* Add Dialog — inline fields, no nested component */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base">Add New Patient</DialogTitle>
            <DialogDescription className="text-xs">* required fields</DialogDescription>
          </DialogHeader>
          {saved ? (
            <div className="py-6 text-center text-green-600"><CheckCircle className="h-8 w-8 mx-auto mb-2" /><p className="text-sm font-medium">Patient saved!</p></div>
          ) : (
            <>
              {renderFields(form, setForm)}
              <DialogFooter className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAdd} disabled={!form.firstName || !form.lastName}>Save Patient</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[420px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Patient Details</DialogTitle>
                <DialogDescription className="text-xs">{selected.patientNumber}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-xs py-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><User className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="font-semibold text-sm">{selected.firstName} {selected.lastName}</p>
                    <p className="text-muted-foreground capitalize">{selected.gender} · {selected.dateOfBirth ? formatDate(selected.dateOfBirth,'short') : '—'}</p>
                  </div>
                  <Badge variant={selected.isActive ? 'default' : 'secondary'} className="ml-auto text-[10px]">{selected.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{selected.phone || '—'}</p></div>
                  <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selected.email || '—'}</p></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span><p>{selected.address || '—'}</p></div>
                  <div><span className="text-muted-foreground">Allergies:</span><p>{selected.allergies || 'None'}</p></div>
                  <div><span className="text-muted-foreground">Medical Notes:</span><p>{selected.medicalNotes || 'None'}</p></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setViewOpen(false)}>Close</Button>
                {canUpdate && <Button size="sm" onClick={() => { setViewOpen(false); openEdit(selected); }}><Edit className="mr-1.5 h-3.5 w-3.5" />Edit</Button>}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog — inline fields */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Edit Patient</DialogTitle>
                <DialogDescription className="text-xs">{selected.firstName} {selected.lastName}</DialogDescription>
              </DialogHeader>
              {renderFields(editForm, setEditForm)}
              <DialogFooter className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleEdit}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Patient</DialogTitle>
            <DialogDescription className="text-xs">Delete {selected?.firstName} {selected?.lastName}? Cannot be undone.</DialogDescription>
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
