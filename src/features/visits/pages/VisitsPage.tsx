<<<<<<< HEAD
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Search, Plus, Edit, Trash2, Eye, AlertCircle,
  Stethoscope, Building, FileText, Filter, CheckCircle,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Visit } from '@/types/visits';
import { VisitStatus } from '@/types/core';
import { formatDate } from '@/lib/utils';
import { MOCK_DENTISTS, MOCK_CLINICS } from '@/lib/mockData';

// ── Mock visits ──────────────────────────────────────────────────────────────
const INIT_VISITS: Visit[] = [
  {
    id: '1', visitNumber: 'VS-2024-00123',
    patient:  { id: '1', patientNumber: 'PAT-2024-00001', firstName: 'Ahmad',  lastName: 'Shah',       isActive: true,  createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z', version: 1 },
    dentist:  { id: '1', dentistNumber: 'DNT-2024-00001', firstName: 'Ahmad',  lastName: 'Karimi',     isActive: true,  createdAt: '2024-01-10T09:15:00Z', updatedAt: '2024-01-10T09:15:00Z', version: 1 },
    clinic:   { id: '1', clinicNumber:  'CLN-2024-00001', name: 'Modern Dental Care',                  isActive: true,  createdAt: '2024-01-05T08:30:00Z', updatedAt: '2024-01-05T08:30:00Z', version: 1 },
    visitDate: '2024-01-15T10:30:00Z', chiefComplaint: 'Toothache in lower left molar',
    diagnosis: 'Caries on tooth #36', instructions: 'Schedule for restoration',
    requiresLab: true, status: 'OPEN', files: [], version: 1,
    createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z',
    linkedCase: { id: '1', caseNumber: 'CS-2024-00123', status: 'IN_PRODUCTION' },
  },
  {
    id: '2', visitNumber: 'VS-2024-00124',
    patient:  { id: '2', patientNumber: 'PAT-2024-00002', firstName: 'Fatima', lastName: 'Mohammadi',  isActive: true,  createdAt: '2024-01-20T14:45:00Z', updatedAt: '2024-01-20T14:45:00Z', version: 1 },
    dentist:  { id: '2', dentistNumber: 'DNT-2024-00002', firstName: 'Sara',   lastName: 'Rahimi',     isActive: true,  createdAt: '2024-01-15T11:30:00Z', updatedAt: '2024-01-15T11:30:00Z', version: 1 },
    clinic:   { id: '2', clinicNumber:  'CLN-2024-00002', name: 'Bright Smile Dentistry',              isActive: true,  createdAt: '2024-01-12T10:15:00Z', updatedAt: '2024-01-12T10:15:00Z', version: 1 },
    visitDate: '2024-01-16T14:00:00Z', chiefComplaint: 'Regular checkup',
    diagnosis: 'Good oral health', instructions: 'Continue regular brushing',
    requiresLab: false, status: 'CLOSED', closedAt: '2024-01-16T14:30:00Z',
    files: [], version: 1, createdAt: '2024-01-16T14:00:00Z', updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3', visitNumber: 'VS-2024-00125',
    patient:  { id: '3', patientNumber: 'PAT-2024-00003', firstName: 'Omar',   lastName: 'Barakzai',   isActive: false, createdAt: '2024-02-05T09:15:00Z', updatedAt: '2024-02-05T09:15:00Z', version: 1 },
    dentist:  { id: '1', dentistNumber: 'DNT-2024-00001', firstName: 'Ahmad',  lastName: 'Karimi',     isActive: true,  createdAt: '2024-01-10T09:15:00Z', updatedAt: '2024-01-10T09:15:00Z', version: 1 },
    clinic:   { id: '1', clinicNumber:  'CLN-2024-00001', name: 'Modern Dental Care',                  isActive: true,  createdAt: '2024-01-05T08:30:00Z', updatedAt: '2024-01-05T08:30:00Z', version: 1 },
    visitDate: '2024-01-17T09:00:00Z', chiefComplaint: 'Crown replacement needed',
    diagnosis: 'Fractured crown on tooth #11', instructions: 'Prepare for crown fabrication',
    requiresLab: true, status: 'OPEN', files: [], version: 1,
    createdAt: '2024-01-17T09:00:00Z', updatedAt: '2024-01-17T09:00:00Z',
    linkedCase: { id: '2', caseNumber: 'CS-2024-00124', status: 'DRAFT' },
  },
];

const blank = {
  patientName: '', dentistId: '', clinicId: '',
  visitDate: new Date().toISOString().split('T')[0],
  chiefComplaint: '', diagnosis: '', instructions: '',
  requiresLab: 'no' as 'yes' | 'no', status: 'OPEN' as VisitStatus,
};

function statusColor(s: VisitStatus) {
  if (s === 'OPEN')      return 'bg-blue-100 text-blue-800';
  if (s === 'CLOSED')    return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
}

export default function VisitsPage() {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('visit', 'create');
  const canUpdate = hasPermission('visit', 'update');
  const canDelete = hasPermission('visit', 'delete');

  const [visits, setVisits] = useState<Visit[]>(INIT_VISITS);
  const [search, setSearch]       = useState('');
  const [statusF, setStatusF]     = useState<VisitStatus | 'ALL'>('ALL');
  const [labF, setLabF]           = useState<'ALL' | 'WITH_LAB' | 'WITHOUT_LAB'>('ALL');

  const [selected, setSelected]   = useState<Visit | null>(null);
  const [addOpen, setAddOpen]     = useState(false);
  const [viewOpen, setViewOpen]   = useState(false);
  const [editOpen, setEditOpen]   = useState(false);
  const [delOpen, setDelOpen]     = useState(false);

  const [form, setForm]       = useState(blank);
  const [editStatus, setEditStatus] = useState<VisitStatus>('OPEN');
  const [saved, setSaved]     = useState(false);
  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  // Stats
  const stats = [
    { label: 'Total',    value: visits.length },
    { label: 'Open',     value: visits.filter(v => v.status === 'OPEN').length },
    { label: 'Closed',   value: visits.filter(v => v.status === 'CLOSED').length },
    { label: 'With Lab', value: visits.filter(v => v.requiresLab).length },
  ];

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return visits.filter(v => {
      const ms =
        v.visitNumber.toLowerCase().includes(q) ||
        (v.patient.firstName + ' ' + v.patient.lastName).toLowerCase().includes(q) ||
        (v.dentist.firstName + ' ' + v.dentist.lastName).toLowerCase().includes(q) ||
        v.clinic.name.toLowerCase().includes(q);
      const mst = statusF === 'ALL' || v.status === statusF;
      const ml  = labF === 'ALL' || (labF === 'WITH_LAB' && v.requiresLab) || (labF === 'WITHOUT_LAB' && !v.requiresLab);
      return ms && mst && ml;
    });
  }, [visits, search, statusF, labF]);

  const { page, pageSize, paged, setPage, setPageSize } = usePagination(filtered, 10);

  // Add
  const handleAdd = () => {
    const dentist = MOCK_DENTISTS.find(d => d.id === form.dentistId);
    const clinic  = MOCK_CLINICS.find(c => c.id === form.clinicId);
    if (!form.patientName || !dentist || !clinic) return;
    const id = String(Date.now());
    const next: Visit = {
      id, visitNumber: `VS-${new Date().getFullYear()}-${String(visits.length + 126).padStart(5, '0')}`,
      patient: { id, patientNumber: `PAT-NEW-${id}`, firstName: form.patientName.split(' ')[0], lastName: form.patientName.split(' ').slice(1).join(' ') || '', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 },
      dentist: { id: dentist.id, dentistNumber: dentist.dentistNumber, firstName: dentist.firstName, lastName: dentist.lastName, isActive: dentist.isActive, createdAt: dentist.createdAt, updatedAt: dentist.updatedAt, version: dentist.version },
      clinic:  { id: clinic.id,  clinicNumber: clinic.clinicNumber, name: clinic.name, isActive: clinic.isActive, createdAt: clinic.createdAt, updatedAt: clinic.updatedAt, version: clinic.version },
      visitDate: new Date(form.visitDate).toISOString(),
      chiefComplaint: form.chiefComplaint, diagnosis: form.diagnosis, instructions: form.instructions,
      requiresLab: form.requiresLab === 'yes', status: form.status,
      files: [], version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setVisits(prev => [next, ...prev]);
    setForm(blank);
    showSaved();
    setTimeout(() => setAddOpen(false), 1600);
  };

  const handleDelete = () => {
    if (selected) setVisits(prev => prev.filter(v => v.id !== selected.id));
    setDelOpen(false); setSelected(null);
  };

  return (
    <div className="space-y-4">
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Visit saved!
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Visits</h1>
          <p className="text-xs text-muted-foreground">Manage patient visits</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New Visit
=======
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
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
          </Button>
        )}
      </div>

<<<<<<< HEAD
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="py-3 px-4">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input className="h-8 pl-7 text-xs" placeholder="Search visits…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Filter className="h-3 w-3" />
              Status: {statusF === 'ALL' ? 'All' : statusF}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-xs">
            {(['ALL','OPEN','CLOSED','CANCELLED'] as const).map(s => (
              <DropdownMenuItem key={s} onClick={() => { setStatusF(s); setPage(1); }}>
                {s === 'ALL' ? 'All Status' : s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Lab filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <FileText className="h-3 w-3" />
              Lab: {labF === 'ALL' ? 'All' : labF === 'WITH_LAB' ? 'With Lab' : 'No Lab'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-xs">
            <DropdownMenuItem onClick={() => { setLabF('ALL'); setPage(1); }}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setLabF('WITH_LAB'); setPage(1); }}>With Lab</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setLabF('WITHOUT_LAB'); setPage(1); }}>No Lab</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
=======
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
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
      </div>

      {/* Table */}
      <Card>
<<<<<<< HEAD
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Visit Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Visit #</TableHead>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Dentist / Clinic</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Lab</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-8">No visits found</TableCell></TableRow>
              )}
              {paged.map(v => (
                <TableRow key={v.id}>
                  <TableCell className="text-xs font-medium">{v.visitNumber}</TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{v.patient.firstName} {v.patient.lastName}</div>
                    <div className="text-muted-foreground">{v.patient.patientNumber}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1"><Stethoscope className="h-3 w-3" />Dr. {v.dentist.firstName} {v.dentist.lastName}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><Building className="h-3 w-3" />{v.clinic.name}</div>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(v.visitDate, 'short')}</TableCell>
                  <TableCell>
                    <Badge variant={v.requiresLab ? 'default' : 'outline'} className="text-[10px]">
                      {v.requiresLab ? 'LAB' : 'NO'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] ${statusColor(v.status)}`}>{v.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View"
                        onClick={() => { setSelected(v); setViewOpen(true); }}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {canUpdate && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit"
                          onClick={() => { setSelected(v); setEditStatus(v.status); setEditOpen(true); }}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" title="Delete"
                          onClick={() => { setSelected(v); setDelOpen(true); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
=======
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
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
<<<<<<< HEAD
          <Pagination total={filtered.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </CardContent>
      </Card>

      {/* Add Visit Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base">New Visit</DialogTitle>
            <DialogDescription className="text-xs">* required. Select dentist and clinic from existing records.</DialogDescription>
          </DialogHeader>
          {saved ? (
            <div className="py-6 text-center text-green-600"><CheckCircle className="h-8 w-8 mx-auto mb-2" /><p className="text-sm font-medium">Visit saved!</p></div>
          ) : (
            <div className="grid gap-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Patient Name *</Label>
                  <Input className="h-8 text-xs" placeholder="Full name" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} />
                </div>

                {/* Dentist dropdown from existing */}
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1"><Stethoscope className="h-3 w-3" />Dentist *</Label>
                  <Select value={form.dentistId} onValueChange={v => setForm(f => ({ ...f, dentistId: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select dentist" /></SelectTrigger>
                    <SelectContent>
                      {MOCK_DENTISTS.filter(d => d.isActive).map(d => (
                        <SelectItem key={d.id} value={d.id} className="text-xs">
                          Dr. {d.firstName} {d.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clinic dropdown from existing */}
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1"><Building className="h-3 w-3" />Clinic <span className="text-muted-foreground">(optional)</span></Label>
                  <Select value={form.clinicId} onValueChange={v => setForm(f => ({ ...f, clinicId: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select clinic" /></SelectTrigger>
                    <SelectContent>
                      {MOCK_CLINICS.filter(c => c.isActive).map(c => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Visit Date *</Label>
                  <Input className="h-8 text-xs" type="date" value={form.visitDate} onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Requires Lab</Label>
                  <Select value={form.requiresLab} onValueChange={v => setForm(f => ({ ...f, requiresLab: v as 'yes'|'no' }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                      <SelectItem value="no"  className="text-xs">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as VisitStatus }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN"      className="text-xs">Open</SelectItem>
                      <SelectItem value="CLOSED"    className="text-xs">Closed</SelectItem>
                      <SelectItem value="CANCELLED" className="text-xs">Cancelled</SelectItem>
=======
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
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
                    </SelectContent>
                  </Select>
                </div>
              </div>
<<<<<<< HEAD

              <div className="space-y-1">
                <Label className="text-xs">Chief Complaint</Label>
                <Textarea className="text-xs min-h-[56px]" placeholder="Patient's main complaint…" value={form.chiefComplaint} onChange={e => setForm(f => ({ ...f, chiefComplaint: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Diagnosis</Label>
                <Input className="h-8 text-xs" placeholder="Diagnosis" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Instructions</Label>
                <Input className="h-8 text-xs" placeholder="Instructions" value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} />
              </div>
            </div>
          )}
          {!saved && (
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAdd} disabled={!form.patientName || !form.dentistId}>
=======
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
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
                Save Visit
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
<<<<<<< HEAD
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[460px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selected.visitNumber}</DialogTitle>
                <DialogDescription className="text-xs">{formatDate(selected.visitDate, 'full')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-xs py-2">
                <div className="flex gap-2">
                  <Badge className={`text-[10px] ${statusColor(selected.status)}`}>{selected.status}</Badge>
                  <Badge variant={selected.requiresLab ? 'default' : 'outline'} className="text-[10px]">
                    {selected.requiresLab ? 'LAB REQUIRED' : 'NO LAB'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-medium">{selected.patient.firstName} {selected.patient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dentist</p>
                    <p className="font-medium">Dr. {selected.dentist.firstName} {selected.dentist.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clinic</p>
                    <p className="font-medium">{selected.clinic.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(selected.visitDate, 'medium')}</p>
                  </div>
                </div>
                <div><p className="text-muted-foreground">Chief Complaint</p><p>{selected.chiefComplaint || '—'}</p></div>
                <div><p className="text-muted-foreground">Diagnosis</p><p>{selected.diagnosis || '—'}</p></div>
                <div><p className="text-muted-foreground">Instructions</p><p>{selected.instructions || '—'}</p></div>
                {selected.requiresLab && !selected.linkedCase && (
                  <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <p className="text-amber-700">No lab case created yet</p>
                  </div>
                )}
                {selected.linkedCase && (
                  <div className="rounded border px-3 py-2">
                    <p className="text-muted-foreground">Linked Case</p>
                    <p className="font-medium">{selected.linkedCase.caseNumber} · {selected.linkedCase.status}</p>
=======
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
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
                  </div>
                )}
              </div>
              <DialogFooter>
<<<<<<< HEAD
                <Button variant="outline" size="sm" onClick={() => setViewOpen(false)}>Close</Button>
                {canUpdate && (
                  <Button size="sm" asChild>
                    <RouterLink to={`/visits/${selected.id}/edit`}>
                      <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </RouterLink>
                  </Button>
                )}
=======
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

<<<<<<< HEAD
      {/* Edit Status Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[360px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Edit Visit Status</DialogTitle>
                <DialogDescription className="text-xs">{selected.visitNumber}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label className="text-xs">Status</Label>
                <Select value={editStatus} onValueChange={v => setEditStatus(v as VisitStatus)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN"      className="text-xs">Open</SelectItem>
                    <SelectItem value="CLOSED"    className="text-xs">Closed</SelectItem>
                    <SelectItem value="CANCELLED" className="text-xs">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => {
                  setVisits(prev => prev.map(v => v.id === selected.id ? { ...v, status: editStatus } : v));
                  setEditOpen(false);
                }}>Save</Button>
=======
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
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
<<<<<<< HEAD
      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Visit</DialogTitle>
            <DialogDescription className="text-xs">Delete {selected?.visitNumber}? Cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDelOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete</Button>
=======
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Visit</DialogTitle>
            <DialogDescription>Are you sure you want to delete visit {selectedVisit?.visitNumber}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}><Trash2 className="mr-2 h-4 w-4" />Delete Visit</Button>
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
}
