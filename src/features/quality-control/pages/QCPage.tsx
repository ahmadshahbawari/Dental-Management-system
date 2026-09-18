import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Filter, AlertCircle, Eye, RefreshCw, X, ClipboardList } from 'lucide-react';

interface QCCase {
  id: string;
  caseNumber: string;
  patient: string;
  dentist: string;
  technician: string;
  inspectionDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Rework';
  priority: 'Normal' | 'High' | 'Urgent';
  notes?: string;
}

const initialCases: QCCase[] = [
  { id: '1', caseNumber: 'CAS-2024-045', patient: 'John Doe', dentist: 'Dr. Smith', technician: 'Michael Chen', inspectionDate: 'Today', status: 'Pending', priority: 'High' },
  { id: '2', caseNumber: 'CAS-2024-046', patient: 'Jane Smith', dentist: 'Dr. Johnson', technician: 'Sarah Johnson', inspectionDate: 'Today', status: 'Approved', priority: 'Normal' },
  { id: '3', caseNumber: 'CAS-2024-047', patient: 'Robert Brown', dentist: 'Dr. Williams', technician: 'Michael Chen', inspectionDate: 'Yesterday', status: 'Rejected', priority: 'Urgent', notes: 'Shade mismatch, marginal fit issues' },
  { id: '4', caseNumber: 'CAS-2024-048', patient: 'Alice Davis', dentist: 'Dr. Smith', technician: 'Sarah Johnson', inspectionDate: 'Today', status: 'Pending', priority: 'Normal' },
];

export default function QCPage() {
  const [cases, setCases] = useState<QCCase[]>(initialCases);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Dialogs
  const [inspectOpen, setInspectOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [inspectForm, setInspectForm] = useState({
    caseNumber: '', result: 'Approved' as 'Approved' | 'Rejected' | 'Rework', notes: '',
    marginalFit: '', occlusion: '', shadeMatch: '', surfaceFinish: '', porosity: '', contour: '',
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showSuccess('QC queue refreshed!');
    }, 1000);
  };

  const filteredCases = cases.filter(c => {
    const tabMatch =
      activeTab === 'all' ||
      (activeTab === 'pending' && c.status === 'Pending') ||
      (activeTab === 'approved' && c.status === 'Approved') ||
      (activeTab === 'rejected' && c.status === 'Rejected');
    const priMatch = priorityFilter === 'All' || c.priority === priorityFilter;
    const techMatch = techFilter === 'All' || c.technician === techFilter;
    return tabMatch && priMatch && techMatch;
  });

  const handleInspect = () => {
    if (!inspectForm.caseNumber) return;
    setCases(cases.map(c =>
      c.caseNumber === inspectForm.caseNumber
        ? { ...c, status: inspectForm.result, notes: inspectForm.notes }
        : c
    ));
    setInspectOpen(false);
    setInspectForm({ caseNumber: '', result: 'Approved', notes: '', marginalFit: '', occlusion: '', shadeMatch: '', surfaceFinish: '', porosity: '', contour: '' });
    showSuccess(`Case ${inspectForm.result.toLowerCase()} successfully!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <Badge className="bg-amber-500 text-white"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'Approved': return <Badge className="bg-green-500 text-white"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'Rejected': return <Badge className="bg-red-500 text-white"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      case 'Rework': return <Badge className="bg-orange-500 text-white"><AlertCircle className="mr-1 h-3 w-3" />Rework</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return <Badge variant="secondary" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'Urgent': return <Badge variant="secondary" className="bg-red-100 text-red-800">Urgent</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  const qcMetrics = [
    { label: 'Marginal Fit', key: 'marginalFit', critical: true },
    { label: 'Occlusion', key: 'occlusion', critical: true },
    { label: 'Shade Match', key: 'shadeMatch', critical: false },
    { label: 'Surface Finish', key: 'surfaceFinish', critical: false },
    { label: 'Porosity', key: 'porosity', critical: true },
    { label: 'Contour', key: 'contour', critical: false },
  ] as const;

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />{successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground">Inspect cases and ensure quality standards</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setFilterOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {(priorityFilter !== 'All' || techFilter !== 'All') && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">!</Badge>
            )}
          </Button>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(priorityFilter !== 'All' || techFilter !== 'All') && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filters:</span>
          {priorityFilter !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Priority: {priorityFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setPriorityFilter('All')} />
            </Badge>
          )}
          {techFilter !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tech: {techFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setTechFilter('All')} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={() => { setPriorityFilter('All'); setTechFilter('All'); }}>Clear All</Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QC Inspection Queue</CardTitle>
              <CardDescription>Showing {filteredCases.length} of {cases.length} cases</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="pending">Pending ({cases.filter(c => c.status === 'Pending').length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Number</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Dentist</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>QC Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCases.length === 0 && (
                        <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No cases found</TableCell></TableRow>
                      )}
                      {filteredCases.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.caseNumber}</TableCell>
                          <TableCell>{c.patient}</TableCell>
                          <TableCell>{c.dentist}</TableCell>
                          <TableCell>{c.technician}</TableCell>
                          <TableCell>{c.inspectionDate}</TableCell>
                          <TableCell>{getPriorityBadge(c.priority)}</TableCell>
                          <TableCell>{getStatusBadge(c.status)}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => {
                              setInspectForm({ ...inspectForm, caseNumber: c.caseNumber });
                              setInspectOpen(true);
                            }}>
                              <Eye className="mr-1 h-4 w-4" />
                              Inspect
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QC Checklist Reference</CardTitle>
              <CardDescription>Standard quality inspection points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qcMetrics.map((m) => (
                  <Card key={m.label} className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">{m.label}</h3>
                      <Badge variant={m.critical ? 'default' : 'outline'}>{m.critical ? 'Critical' : 'Important'}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">QC Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><p className="text-sm font-medium">Pending</p><p className="text-2xl font-bold text-amber-500">{cases.filter(c => c.status === 'Pending').length}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">Approved</p><p className="text-2xl font-bold text-green-500">{cases.filter(c => c.status === 'Approved').length}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">Rejected</p><p className="text-2xl font-bold text-red-500">{cases.filter(c => c.status === 'Rejected').length}</p></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Approval Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {cases.length > 0 ? Math.round((cases.filter(c => c.status === 'Approved').length / cases.filter(c => c.status !== 'Pending').length) * 100) || 0 : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Recent QC Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {cases.filter(c => c.status !== 'Pending').slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {c.status === 'Approved' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <div><p className="text-sm">{c.caseNumber} {c.status}</p><p className="text-xs text-muted-foreground">{c.inspectionDate}</p></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setInspectOpen(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Start Inspection
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setReportOpen(true)}>
                <ClipboardList className="mr-2 h-4 w-4" />
                View QC Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Filter QC Cases</DialogTitle>
            <DialogDescription>Filter by priority and technician</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Technician</Label>
              <Select value={techFilter} onValueChange={setTechFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Technicians</SelectItem>
                  <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPriorityFilter('All'); setTechFilter('All'); }}>Clear</Button>
            <Button onClick={() => setFilterOpen(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspect Dialog */}
      <Dialog open={inspectOpen} onOpenChange={setInspectOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>QC Inspection</DialogTitle>
            <DialogDescription>Perform quality control inspection for a case</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Case Number *</Label>
              <Select value={inspectForm.caseNumber} onValueChange={v => setInspectForm({ ...inspectForm, caseNumber: v })}>
                <SelectTrigger><SelectValue placeholder="Select case to inspect" /></SelectTrigger>
                <SelectContent>
                  {cases.map(c => <SelectItem key={c.id} value={c.caseNumber}>{c.caseNumber} — {c.patient} ({c.status})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>QC Checklist</Label>
              <div className="grid grid-cols-2 gap-3">
                {qcMetrics.map((m) => (
                  <div key={m.key} className="flex items-center gap-2 p-2 border rounded">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{m.label}</span>
                      {m.critical && <span className="ml-1 text-xs text-red-500">*</span>}
                    </div>
                    <Select
                      value={(inspectForm as Record<string, string>)[m.key] || ''}
                      onValueChange={v => setInspectForm({ ...inspectForm, [m.key]: v })}
                    >
                      <SelectTrigger className="w-24 h-7 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="na">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Overall Result *</Label>
              <Select value={inspectForm.result} onValueChange={v => setInspectForm({ ...inspectForm, result: v as 'Approved' | 'Rejected' | 'Rework' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved ✓</SelectItem>
                  <SelectItem value="Rejected">Rejected ✗</SelectItem>
                  <SelectItem value="Rework">Requires Rework</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Inspector Notes</Label>
              <Textarea value={inspectForm.notes} onChange={e => setInspectForm({ ...inspectForm, notes: e.target.value })} placeholder="Detailed inspection notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInspectOpen(false)}>Cancel</Button>
            <Button onClick={handleInspect} disabled={!inspectForm.caseNumber}>
              <CheckCircle className="mr-2 h-4 w-4" /> Submit Inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QC Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>QC Report Summary</DialogTitle>
            <DialogDescription>Quality control statistics and recent inspections</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-green-500">{cases.filter(c => c.status === 'Approved').length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-red-500">{cases.filter(c => c.status === 'Rejected').length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-amber-500">{cases.filter(c => c.status === 'Pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </Card>
            </div>
            <div>
              <h3 className="font-medium mb-3">All Inspections</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cases.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 border rounded text-sm">
                    <span className="font-medium">{c.caseNumber}</span>
                    <span className="text-muted-foreground">{c.patient}</span>
                    <span>{c.technician}</span>
                    {getStatusBadge(c.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
