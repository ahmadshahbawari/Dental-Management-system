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
