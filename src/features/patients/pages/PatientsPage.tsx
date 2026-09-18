import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Patient } from '@/types/core';
import { formatDate } from '@/lib/utils';

// Mock data for patients
const mockPatients: Patient[] = [
  {
    id: '1',
    patientNumber: 'PAT-2024-00001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    address: '123 Main St, New York, NY 10001',
    allergies: 'Penicillin, Latex',
    medicalNotes: 'Hypertension, Type 2 Diabetes',
    isActive: true,
    version: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    patientNumber: 'PAT-2024-00002',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    phone: '+1 (555) 987-6543',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    allergies: 'None',
    medicalNotes: 'Asthma',
    isActive: true,
    version: 1,
    createdAt: '2024-01-20T14:45:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '3',
    patientNumber: 'PAT-2024-00003',
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    phone: '+1 (555) 456-7890',
    email: 'robert.j@example.com',
    address: '789 Pine St, Chicago, IL 60601',
    allergies: 'Sulfa drugs',
    medicalNotes: 'High cholesterol',
    isActive: false,
    version: 1,
    createdAt: '2024-02-05T09:15:00Z',
    updatedAt: '2024-02-05T09:15:00Z',
  },
];

export default function PatientsPage() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canCreate = hasPermission('patient', 'create');
  const canUpdate = hasPermission('patient', 'update');
  const canDelete = hasPermission('patient', 'delete');

  // Filter patients based on search query
  const filteredPatients = mockPatients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.patientNumber.toLowerCase().includes(searchLower) ||
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In real app, this would call API to delete patient
    console.log('Deleting patient:', selectedPatient?.id);
    setIsDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        {canCreate && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter patient details. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name *</label>
                    <Input placeholder="Enter first name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name *</label>
                    <Input placeholder="Enter last name" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth *</label>
                    <Input type="date" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender *</label>
                    <select className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input placeholder="Enter phone number" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input placeholder="Enter full address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Allergies</label>
                    <Input placeholder="e.g., Penicillin, Latex" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Medical Notes</label>
                    <Input placeholder="e.g., Hypertension, Diabetes" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit">Save Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <p className="text-3xl font-bold">{mockPatients.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
              <p className="text-3xl font-bold text-green-600">
                {mockPatients.filter((p) => p.isActive).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg. Age</p>
              <p className="text-3xl font-bold">42</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients by name, number, phone, or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Active ({mockPatients.filter((p) => p.isActive).length})
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Inactive ({mockPatients.filter((p) => !p.isActive).length})
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                All ({mockPatients.length})
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.patientNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {patient.gender === 'male'
                        ? 'Male'
                        : patient.gender === 'female'
                          ? 'Female'
                          : 'Other'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {patient.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {patient.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.dateOfBirth ? formatDate(patient.dateOfBirth, 'short') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={patient.isActive ? 'default' : 'secondary'}>
                      {patient.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(patient.createdAt, 'short')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {canUpdate && (
                          <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePatient(patient)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle>Patient Details</DialogTitle>
                <DialogDescription>
                  Complete information for {selectedPatient.firstName} {selectedPatient.lastName}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h3>
                      <p className="text-muted-foreground">{selectedPatient.patientNumber}</p>
                    </div>
                    <Badge
                      className="ml-auto"
                      variant={selectedPatient.isActive ? 'default' : 'secondary'}
                    >
                      {selectedPatient.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Personal Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gender:</span>
                          <span>
                            {selectedPatient.gender === 'male'
                              ? 'Male'
                              : selectedPatient.gender === 'female'
                                ? 'Female'
                                : 'Other'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date of Birth:</span>
                          <span>
                            {selectedPatient.dateOfBirth
                              ? formatDate(selectedPatient.dateOfBirth, 'short')
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Contact Information</h4>
                      <div className="space-y-1 text-sm">
                        {selectedPatient.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{selectedPatient.phone}</span>
                          </div>
                        )}
                        {selectedPatient.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span>{selectedPatient.email}</span>
                          </div>
                        )}
                        {selectedPatient.address && (
                          <div>
                            <span className="text-muted-foreground">Address:</span>
                            <p>{selectedPatient.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Medical Information</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-muted-foreground">Allergies:</span>
                          <p>{selectedPatient.allergies || 'None reported'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Medical Notes:</span>
                          <p>{selectedPatient.medicalNotes || 'None'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">System Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{formatDate(selectedPatient.createdAt, 'medium')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated:</span>
                          <span>{formatDate(selectedPatient.updatedAt, 'medium')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {canUpdate && (
                  <Button onClick={() => handleEditPatient(selectedPatient)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Patient
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Patient</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedPatient?.firstName}{' '}
              {selectedPatient?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
