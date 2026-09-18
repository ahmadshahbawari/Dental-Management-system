import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Calendar,
  User, Stethoscope, Building, FileText, Link, CalendarDays, AlertCircle,
} from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Visit } from '@/types/visits'
import { VisitStatus } from '@/types/core'
import { formatDate } from '@/lib/utils'

const mockVisits: Visit[] = [
  {
    id: '1',
    visitNumber: 'VS-2024-00123',
    patient: { id: '1', patientNumber: 'PAT-2024-00001', firstName: 'John', lastName: 'Doe', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z', version: 1 },
    dentist: { id: '1', dentistNumber: 'DNT-2024-00001', firstName: 'Michael', lastName: 'Chen', isActive: true, createdAt: '2024-01-10T09:15:00Z', updatedAt: '2024-01-10T09:15:00Z', version: 1 },
    clinic: { id: '1', clinicNumber: 'CLN-2024-00001', name: 'Modern Dental Care', isActive: true, createdAt: '2024-01-05T08:30:00Z', updatedAt: '2024-01-05T08:30:00Z', version: 1 },
    visitDate: '2024-01-15T10:30:00Z',
    chiefComplaint: 'Toothache in lower left molar',
    diagnosis: 'Caries on tooth #36',
    instructions: 'Schedule for restoration',
    requiresLab: true,
    status: 'OPEN',
    files: [],
    version: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    linkedCase: { id: '1', caseNumber: 'CS-2024-00123', status: 'IN_PRODUCTION' },
  },
  {
    id: '2',
    visitNumber: 'VS-2024-00124',
    patient: { id: '2', patientNumber: 'PAT-2024-00002', firstName: 'Jane', lastName: 'Smith', isActive: true, createdAt: '2024-01-20T14:45:00Z', updatedAt: '2024-01-20T14:45:00Z', version: 1 },
    dentist: { id: '2', dentistNumber: 'DNT-2024-00002', firstName: 'Sarah', lastName: 'Williams', isActive: true, createdAt: '2024-01-15T11:30:00Z', updatedAt: '2024-01-15T11:30:00Z', version: 1 },
    clinic: { id: '2', clinicNumber: 'CLN-2024-00002', name: 'Bright Smile Dentistry', isActive: true, createdAt: '2024-01-12T10:15:00Z', updatedAt: '2024-01-12T10:15:00Z', version: 1 },
    visitDate: '2024-01-16T14:00:00Z',
    chiefComplaint: 'Regular checkup',
    diagnosis: 'Good oral health',
    instructions: 'Continue regular brushing',
    requiresLab: false,
    status: 'CLOSED',
    closedAt: '2024-01-16T14:30:00Z',
    files: [],
    version: 1,
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    visitNumber: 'VS-2024-00125',
    patient: { id: '3', patientNumber: 'PAT-2024-00003', firstName: 'Robert', lastName: 'Johnson', isActive: false, createdAt: '2024-02-05T09:15:00Z', updatedAt: '2024-02-05T09:15:00Z', version: 1 },
    dentist: { id: '1', dentistNumber: 'DNT-2024-00001', firstName: 'Michael', lastName: 'Chen', isActive: true, createdAt: '2024-01-10T09:15:00Z', updatedAt: '2024-01-10T09:15:00Z', version: 1 },
    clinic: { id: '1', clinicNumber: 'CLN-2024-00001', name: 'Modern Dental Care', isActive: true, createdAt: '2024-01-05T08:30:00Z', updatedAt: '2024-01-05T08:30:00Z', version: 1 },
    visitDate: '2024-01-17T09:00:00Z',
    chiefComplaint: 'Crown replacement needed',
    diagnosis: 'Fractured crown on tooth #11',
    instructions: 'Prepare for crown fabrication',
    requiresLab: true,
    status: 'OPEN',
    files: [],
    version: 1,
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
    linkedCase: { id: '2', caseNumber: 'CS-2024-00124', status: 'DRAFT' },
  },
]

const defaultNewVisit = {
  patientFirstName: '',
  patientLastName: '',
  patientNumber: '',
  dentistFirstName: '',
  dentistLastName: '',
  clinicName: '',
  visitDate: new Date().toISOString().split('T')[0],
  chiefComplaint: '',
  diagnosis: '',
  instructions: '',
  requiresLab: 'no',
  status: 'OPEN' as VisitStatus,
}

export default function VisitsPage() {
  const { hasPermission } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [visits, setVisits] = useState<Visit[]>(mockVisits)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<VisitStatus | 'ALL'>('ALL')
  const [labFilter, setLabFilter] = useState<'ALL' | 'WITH_LAB' | 'WITHOUT_LAB'>('ALL')
  const [newVisit, setNewVisit] = useState(defaultNewVisit)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const canCreate = hasPermission('visit', 'create')
  const canUpdate = hasPermission('visit', 'update')
  const canDelete = hasPermission('visit', 'delete')

  const filteredVisits = visits.filter((visit) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      visit.visitNumber.toLowerCase().includes(searchLower) ||
      visit.patient.firstName.toLowerCase().includes(searchLower) ||
      visit.patient.lastName.toLowerCase().includes(searchLower) ||
      visit.dentist.firstName.toLowerCase().includes(searchLower) ||
      visit.dentist.lastName.toLowerCase().includes(searchLower) ||
      visit.clinic.name.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === 'ALL' || visit.status === statusFilter
    const matchesLab =
      labFilter === 'ALL' ||
      (labFilter === 'WITH_LAB' && visit.requiresLab) ||
      (labFilter === 'WITHOUT_LAB' && !visit.requiresLab)
    return matchesSearch && matchesStatus && matchesLab
  })

  const handleNewVisitSave = () => {
    if (!newVisit.patientFirstName || !newVisit.dentistFirstName || !newVisit.clinicName) return
    const nextId = String(visits.length + 1)
    const created: Visit = {
      id: nextId,
      visitNumber: `VS-2024-${String(visits.length + 126).padStart(5, '0')}`,
      patient: {
        id: nextId, patientNumber: `PAT-2024-${String(visits.length + 4).padStart(5, '0')}`,
        firstName: newVisit.patientFirstName, lastName: newVisit.patientLastName,
        isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1,
      },
      dentist: {
        id: nextId, dentistNumber: `DNT-2024-${String(visits.length + 3).padStart(5, '0')}`,
        firstName: newVisit.dentistFirstName, lastName: newVisit.dentistLastName,
        isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1,
      },
      clinic: {
        id: nextId, clinicNumber: `CLN-2024-${String(visits.length + 4).padStart(5, '0')}`,
        name: newVisit.clinicName, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1,
      },
      visitDate: new Date(newVisit.visitDate).toISOString(),
      chiefComplaint: newVisit.chiefComplaint,
      diagnosis: newVisit.diagnosis,
      instructions: newVisit.instructions,
      requiresLab: newVisit.requiresLab === 'yes',
      status: newVisit.status,
      files: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setVisits([created, ...visits])
    setNewVisit(defaultNewVisit)
    setSaveSuccess(true)
    setTimeout(() => { setSaveSuccess(false); setIsNewDialogOpen(false) }, 1500)
  }

  const handleDeleteConfirm = () => {
    if (selectedVisit) setVisits(visits.filter(v => v.id !== selectedVisit.id))
    setIsDeleteDialogOpen(false)
    setSelectedVisit(null)
  }

  const getStatusColor = (status: VisitStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CLOSED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visits</h1>
          <p className="text-muted-foreground">Manage patient visits — default entry point for reception</p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Visit
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search visits by number, patient, dentist, or clinic..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Status: {statusFilter === 'ALL' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('ALL')}>All Status</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('OPEN')}>Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('CLOSED')}>Closed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('CANCELLED')}>Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Lab: {labFilter === 'ALL' ? 'All' : labFilter === 'WITH_LAB' ? 'With Lab' : 'Without Lab'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLabFilter('ALL')}>All Visits</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLabFilter('WITH_LAB')}>With Lab Work</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLabFilter('WITHOUT_LAB')}>Without Lab Work</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{visits.length}</div><p className="text-sm text-muted-foreground">Total Visits</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{visits.filter(v => v.status === 'OPEN').length}</div><p className="text-sm text-muted-foreground">Open Visits</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{visits.filter(v => v.status === 'CLOSED').length}</div><p className="text-sm text-muted-foreground">Closed Visits</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{visits.filter(v => v.requiresLab).length}</div><p className="text-sm text-muted-foreground">Visits with Lab</p></CardContent></Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>Visit Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit Number</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Dentist & Clinic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lab Required</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Linked Case</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No visits found</TableCell></TableRow>
              )}
              {filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">{visit.visitNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium">{visit.patient.firstName} {visit.patient.lastName}</div>
                    <div className="text-sm text-muted-foreground">{visit.patient.patientNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">Dr. {visit.dentist.firstName} {visit.dentist.lastName}</div>
                    <div className="text-sm text-muted-foreground">{visit.clinic.name}</div>
                  </TableCell>
                  <TableCell>{formatDate(visit.visitDate, 'short')}</TableCell>
                  <TableCell>
                    <Badge variant={visit.requiresLab ? 'default' : 'outline'}>{visit.requiresLab ? 'LAB' : 'NO LAB'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {visit.linkedCase ? <Badge variant="outline">{visit.linkedCase.caseNumber}</Badge> : <span className="text-sm text-muted-foreground">None</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { setSelectedVisit(visit); setIsViewDialogOpen(true) }}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {visit.requiresLab && !visit.linkedCase && (
                          <DropdownMenuItem asChild>
                            <RouterLink to={`/visits/${visit.id}/create-lab-case`}>
                              <Link className="mr-2 h-4 w-4" /> Create Lab Case
                            </RouterLink>
                          </DropdownMenuItem>
                        )}
                        {canUpdate && (
                          <DropdownMenuItem onClick={() => { setSelectedVisit(visit); setIsEditDialogOpen(true) }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedVisit(visit); setIsDeleteDialogOpen(true) }} className="text-red-600">
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

      {/* New Visit Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>New Visit</DialogTitle>
            <DialogDescription>Record a new patient visit. Fields marked * are required.</DialogDescription>
          </DialogHeader>
          {saveSuccess ? (
            <div className="py-8 text-center">
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <p className="text-lg font-medium text-green-600">Visit saved successfully!</p>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient First Name *</Label>
                  <Input value={newVisit.patientFirstName} onChange={e => setNewVisit({ ...newVisit, patientFirstName: e.target.value })} placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label>Patient Last Name *</Label>
                  <Input value={newVisit.patientLastName} onChange={e => setNewVisit({ ...newVisit, patientLastName: e.target.value })} placeholder="Last name" />
                </div>
                <div className="space-y-2">
                  <Label>Dentist First Name *</Label>
                  <Input value={newVisit.dentistFirstName} onChange={e => setNewVisit({ ...newVisit, dentistFirstName: e.target.value })} placeholder="Dr. First name" />
                </div>
                <div className="space-y-2">
                  <Label>Dentist Last Name</Label>
                  <Input value={newVisit.dentistLastName} onChange={e => setNewVisit({ ...newVisit, dentistLastName: e.target.value })} placeholder="Last name" />
                </div>
                <div className="space-y-2">
                  <Label>Clinic Name *</Label>
                  <Input value={newVisit.clinicName} onChange={e => setNewVisit({ ...newVisit, clinicName: e.target.value })} placeholder="Clinic name" />
                </div>
                <div className="space-y-2">
                  <Label>Visit Date *</Label>
                  <Input type="date" value={newVisit.visitDate} onChange={e => setNewVisit({ ...newVisit, visitDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Requires Lab Work</Label>
                  <Select value={newVisit.requiresLab} onValueChange={v => setNewVisit({ ...newVisit, requiresLab: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newVisit.status} onValueChange={v => setNewVisit({ ...newVisit, status: v as VisitStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Chief Complaint</Label>
                <Textarea value={newVisit.chiefComplaint} onChange={e => setNewVisit({ ...newVisit, chiefComplaint: e.target.value })} placeholder="Patient's main complaint..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Textarea value={newVisit.diagnosis} onChange={e => setNewVisit({ ...newVisit, diagnosis: e.target.value })} placeholder="Diagnosis details..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Instructions</Label>
                <Input value={newVisit.instructions} onChange={e => setNewVisit({ ...newVisit, instructions: e.target.value })} placeholder="Any special instructions..." />
              </div>
            </div>
          )}
          {!saveSuccess && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleNewVisitSave} disabled={!newVisit.patientFirstName || !newVisit.dentistFirstName || !newVisit.clinicName}>
                Save Visit
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          {selectedVisit && (
            <>
              <DialogHeader>
                <DialogTitle>Visit Details</DialogTitle>
                <DialogDescription>Complete information for {selectedVisit.visitNumber}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedVisit.visitNumber}</h3>
                    <p className="text-muted-foreground">{formatDate(selectedVisit.visitDate, 'full')}</p>
                  </div>
                  <Badge className="ml-auto" variant={selectedVisit.requiresLab ? 'default' : 'outline'}>
                    {selectedVisit.requiresLab ? 'LAB REQUIRED' : 'NO LAB'}
                  </Badge>
                  <Badge className={getStatusColor(selectedVisit.status)}>{selectedVisit.status}</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Patient Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2"><User className="h-4 w-4" /><span className="font-medium">{selectedVisit.patient.firstName} {selectedVisit.patient.lastName}</span></div>
                      <div className="pl-6 text-muted-foreground">ID: {selectedVisit.patient.patientNumber}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Dentist & Clinic</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4" /><span className="font-medium">Dr. {selectedVisit.dentist.firstName} {selectedVisit.dentist.lastName}</span></div>
                      <div className="flex items-center gap-2 pl-6"><Building className="h-4 w-4" /><span>{selectedVisit.clinic.name}</span></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Clinical Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><p className="font-medium text-muted-foreground">Chief Complaint:</p><p>{selectedVisit.chiefComplaint || 'Not specified'}</p></div>
                      <div><p className="font-medium text-muted-foreground">Diagnosis:</p><p>{selectedVisit.diagnosis || 'Not specified'}</p></div>
                      <div><p className="font-medium text-muted-foreground">Instructions:</p><p>{selectedVisit.instructions || 'None'}</p></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">System Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Created:</span><span>{formatDate(selectedVisit.createdAt, 'medium')}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Updated:</span><span>{formatDate(selectedVisit.updatedAt, 'medium')}</span></div>
                    </div>
                  </div>
                </div>
                {selectedVisit.requiresLab && !selectedVisit.linkedCase && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-600" /><h4 className="font-medium text-amber-800">Lab Work Required</h4></div>
                    <p className="mt-2 text-sm text-amber-700">This visit requires lab work but no case has been created yet.</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedVisit && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Visit</DialogTitle>
                <DialogDescription>Update visit information for {selectedVisit.visitNumber}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Chief Complaint</Label>
                  <Textarea
                    defaultValue={selectedVisit.chiefComplaint}
                    onChange={e => setSelectedVisit({ ...selectedVisit, chiefComplaint: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Diagnosis</Label>
                  <Textarea
                    defaultValue={selectedVisit.diagnosis}
                    onChange={e => setSelectedVisit({ ...selectedVisit, diagnosis: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedVisit.status} onValueChange={v => setSelectedVisit({ ...selectedVisit, status: v as VisitStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  setVisits(visits.map(v => v.id === selectedVisit.id ? selectedVisit : v))
                  setIsEditDialogOpen(false)
                }}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Visit</DialogTitle>
            <DialogDescription>Are you sure you want to delete visit {selectedVisit?.visitNumber}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}><Trash2 className="mr-2 h-4 w-4" />Delete Visit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
