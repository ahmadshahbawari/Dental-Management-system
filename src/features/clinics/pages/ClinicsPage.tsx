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
  Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail,
  Building, MapPin, CreditCard, DollarSign,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Clinic } from '@/types/core';
import { formatCurrency, formatDate } from '@/lib/utils';

const mockClinicsData: Clinic[] = [
  {
    id: '1', clinicNumber: 'CLN-2024-00001', name: 'Modern Dental Care',
    address: '123 Main Street, Suite 101, New York, NY 10001',
    phone: '+1 (555) 123-4567', email: 'info@moderndentalcare.com',
    taxId: 'TAX-123456789', paymentTerms: 30, creditLimit: 50000,
    isActive: true, version: 1, createdAt: '2024-01-05T08:30:00Z', updatedAt: '2024-01-05T08:30:00Z',
  },
  {
    id: '2', clinicNumber: 'CLN-2024-00002', name: 'Bright Smile Dentistry',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    phone: '+1 (555) 987-6543', email: 'info@brightsmiledentistry.com',
    taxId: 'TAX-987654321', paymentTerms: 45, creditLimit: 75000,
    isActive: true, version: 1, createdAt: '2024-01-12T10:15:00Z', updatedAt: '2024-01-12T10:15:00Z',
  },
  {
    id: '3', clinicNumber: 'CLN-2024-00003', name: 'Downtown Dental Clinic',
    address: '789 Pine Street, Chicago, IL 60601',
    phone: '+1 (555) 456-7890', email: 'info@downtowndental.com',
    taxId: 'TAX-456789123', paymentTerms: 15, creditLimit: 25000,
    isActive: false, version: 1, createdAt: '2024-02-01T14:45:00Z', updatedAt: '2024-02-01T14:45:00Z',
  },
];

const defaultForm = {
  name: '', address: '', phone: '', email: '',
  taxId: '', paymentTerms: '30', creditLimit: '50000', isActive: 'active',
};

export default function ClinicsPage() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [clinics, setClinics] = useState<Clinic[]>(mockClinicsData);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState(defaultForm);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canCreate = hasPermission('clinic', 'create');
  const canUpdate = hasPermission('clinic', 'update');
  const canDelete = hasPermission('clinic', 'delete');

  const filteredClinics = clinics.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.clinicNumber.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q)
    );
  });

  const handleSaveNew = () => {
    if (!form.name) return;
    const newId = String(clinics.length + 1);
    const newClinic: Clinic = {
      id: newId,
      clinicNumber: `CLN-2024-${String(clinics.length + 4).padStart(5, '0')}`,
      name: form.name, address: form.address, phone: form.phone, email: form.email,
      taxId: form.taxId, paymentTerms: parseInt(form.paymentTerms) || 30,
      creditLimit: parseFloat(form.creditLimit) || 0,
      isActive: form.isActive === 'active',
      version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setClinics([newClinic, ...clinics]);
    setForm(defaultForm);
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setIsNewDialogOpen(false); }, 1500);
  };

  const openEdit = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setEditForm({
      name: clinic.name, address: clinic.address || '',
      phone: clinic.phone || '', email: clinic.email || '',
      taxId: clinic.taxId || '', paymentTerms: String(clinic.paymentTerms || 30),
      creditLimit: String(clinic.creditLimit || 0), isActive: clinic.isActive ? 'active' : 'inactive',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedClinic) return;
    const updated: Clinic = {
      ...selectedClinic,
      name: editForm.name, address: editForm.address, phone: editForm.phone,
      email: editForm.email, taxId: editForm.taxId,
      paymentTerms: parseInt(editForm.paymentTerms) || 30,
      creditLimit: parseFloat(editForm.creditLimit) || 0,
      isActive: editForm.isActive === 'active', updatedAt: new Date().toISOString(),
    };
    setClinics(clinics.map(c => c.id === updated.id ? updated : c));
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedClinic) setClinics(clinics.filter(c => c.id !== selectedClinic.id));
    setIsDeleteDialogOpen(false);
    setSelectedClinic(null);
  };

  const FormFields = ({ values, onChange }: { values: typeof defaultForm; onChange: (k: string, v: string) => void }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label>Clinic Name *</Label>
          <Input value={values.name} onChange={e => onChange('name', e.target.value)} placeholder="Clinic name" />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={values.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={values.email} onChange={e => onChange('email', e.target.value)} placeholder="info@clinic.com" />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Address</Label>
          <Input value={values.address} onChange={e => onChange('address', e.target.value)} placeholder="Full address" />
        </div>
        <div className="space-y-2">
          <Label>Tax ID</Label>
          <Input value={values.taxId} onChange={e => onChange('taxId', e.target.value)} placeholder="TAX-000000000" />
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
        <div className="space-y-2">
          <Label>Payment Terms (days)</Label>
          <Input type="number" value={values.paymentTerms} onChange={e => onChange('paymentTerms', e.target.value)} placeholder="30" min="1" />
        </div>
        <div className="space-y-2">
          <Label>Credit Limit ($)</Label>
          <Input type="number" value={values.creditLimit} onChange={e => onChange('creditLimit', e.target.value)} placeholder="50000" min="0" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinics</h1>
          <p className="text-muted-foreground">Manage dental clinic information and billing details</p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Clinic
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
                placeholder="Search clinics by name, number, email, or phone..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Badge variant="outline">Active ({clinics.filter(c => c.isActive).length})</Badge>
            <Badge variant="outline">Inactive ({clinics.filter(c => !c.isActive).length})</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Clinic Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Clinic Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClinics.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No clinics found</TableCell></TableRow>
              )}
              {filteredClinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium">{clinic.clinicNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium">{clinic.name}</div>
                    {clinic.taxId && <div className="text-sm text-muted-foreground">Tax: {clinic.taxId}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {clinic.phone && <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" />{clinic.phone}</div>}
                      {clinic.email && <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" />{clinic.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate">{clinic.address || 'N/A'}</TableCell>
                  <TableCell><div className="flex items-center gap-1"><CreditCard className="h-3 w-3" />{clinic.paymentTerms || 30} days</div></TableCell>
                  <TableCell><div className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatCurrency(clinic.creditLimit || 0)}</div></TableCell>
                  <TableCell>
                    <Badge variant={clinic.isActive ? 'default' : 'secondary'}>{clinic.isActive ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(clinic.createdAt, 'short')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { setSelectedClinic(clinic); setIsViewDialogOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {canUpdate && (
                          <DropdownMenuItem onClick={() => openEdit(clinic)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedClinic(clinic); setIsDeleteDialogOpen(true); }} className="text-red-600">
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

      {/* New Clinic Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add New Clinic</DialogTitle>
            <DialogDescription>Enter clinic details. Fields marked * are required.</DialogDescription>
          </DialogHeader>
          {saveSuccess ? (
            <div className="py-8 text-center">
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <p className="text-lg font-medium text-green-600">Clinic saved successfully!</p>
            </div>
          ) : (
            <>
              <FormFields values={form} onChange={(k, v) => setForm({ ...form, [k]: v })} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveNew} disabled={!form.name}>Save Clinic</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedClinic && (
            <>
              <DialogHeader>
                <DialogTitle>Clinic Details</DialogTitle>
                <DialogDescription>{selectedClinic.name}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedClinic.name}</h3>
                    <p className="text-muted-foreground">{selectedClinic.clinicNumber}</p>
                  </div>
                  <Badge className="ml-auto" variant={selectedClinic.isActive ? 'default' : 'secondary'}>
                    {selectedClinic.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{selectedClinic.phone || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selectedClinic.email || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground">Tax ID:</span><p className="font-medium">{selectedClinic.taxId || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground">Payment Terms:</span><p className="font-medium">{selectedClinic.paymentTerms || 30} days</p></div>
                  <div><span className="text-muted-foreground">Credit Limit:</span><p className="font-medium">{formatCurrency(selectedClinic.creditLimit || 0)}</p></div>
                  <div><span className="text-muted-foreground">Created:</span><p className="font-medium">{formatDate(selectedClinic.createdAt, 'medium')}</p></div>
                </div>
                {selectedClinic.address && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Address:</span>
                    <p className="font-medium flex items-start gap-1 mt-1"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{selectedClinic.address}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                {canUpdate && <Button onClick={() => { setIsViewDialogOpen(false); openEdit(selectedClinic); }}><Edit className="mr-2 h-4 w-4" />Edit</Button>}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedClinic && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Clinic</DialogTitle>
                <DialogDescription>Update information for {selectedClinic.name}</DialogDescription>
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
            <DialogTitle>Delete Clinic</DialogTitle>
            <DialogDescription>Are you sure you want to delete {selectedClinic?.name}? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}><Trash2 className="mr-2 h-4 w-4" />Delete Clinic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
