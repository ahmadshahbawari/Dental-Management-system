import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wrench, CheckCircle, Clock, Filter, MoreVertical, User, X, Plus } from 'lucide-react';

const productionStages = [
  { id: 1, name: 'Design', color: 'bg-blue-500' },
  { id: 2, name: 'Wax-up', color: 'bg-purple-500' },
  { id: 3, name: 'Framework', color: 'bg-amber-500' },
  { id: 4, name: 'Porcelain', color: 'bg-pink-500' },
  { id: 5, name: 'Polishing', color: 'bg-teal-500' },
  { id: 6, name: 'Ready for QC', color: 'bg-green-500' },
];

interface ProductionCase {
  id: string;
  caseNumber: string;
  patient: string;
  dentist: string;
  stage: string;
  technician: string;
  timeSpent: string;
  status: 'In Progress' | 'Pending' | 'Completed' | 'Overdue';
  dueDate: string;
}

const initialCases: ProductionCase[] = [
  { id: '1', caseNumber: 'CAS-2024-045', patient: 'John Doe', dentist: 'Dr. Smith', stage: 'Design', technician: 'Michael Chen', timeSpent: '2h 30m', status: 'In Progress', dueDate: 'Tomorrow' },
  { id: '2', caseNumber: 'CAS-2024-046', patient: 'Jane Smith', dentist: 'Dr. Johnson', stage: 'Porcelain', technician: 'Sarah Johnson', timeSpent: '1h 15m', status: 'Pending', dueDate: 'Today' },
  { id: '3', caseNumber: 'CAS-2024-047', patient: 'Robert Brown', dentist: 'Dr. Williams', stage: 'Framework', technician: 'Michael Chen', timeSpent: '3h 00m', status: 'Overdue', dueDate: 'Yesterday' },
  { id: '4', caseNumber: 'CAS-2024-048', patient: 'Alice Davis', dentist: 'Dr. Smith', stage: 'Polishing', technician: 'Sarah Johnson', timeSpent: '0h 45m', status: 'Completed', dueDate: 'Today' },
];

export default function ProductionPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [cases, setCases] = useState<ProductionCase[]>(initialCases);
  const [stageFilter, setStageFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  // Dialogs
  const [startCaseOpen, setStartCaseOpen] = useState(false);
  const [completeWorkOpen, setCompleteWorkOpen] = useState(false);
  const [timeEntryOpen, setTimeEntryOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ProductionCase | null>(null);

  // Forms
  const [newCaseForm, setNewCaseForm] = useState({ caseNumber: '', patient: '', dentist: '', stage: 'Design', notes: '' });
  const [timeEntryForm, setTimeEntryForm] = useState({ caseNumber: '', hours: '', minutes: '', notes: '' });
  const [completeForm, setCompleteForm] = useState({ caseNumber: '', notes: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const technicians = ['All', 'Michael Chen', 'Sarah Johnson'];

  const filteredCases = cases.filter(c => {
    const tabMatch =
      activeTab === 'all' ||
      (activeTab === 'assigned' && c.technician === 'Michael Chen') ||
      (activeTab === 'pending' && c.status === 'Pending') ||
      (activeTab === 'overdue' && c.status === 'Overdue');
    const stageMatch = stageFilter === 'All' || c.stage === stageFilter;
    const techMatch = techFilter === 'All' || c.technician === techFilter;
    return tabMatch && stageMatch && techMatch;
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleStartCase = () => {
    if (!newCaseForm.caseNumber || !newCaseForm.patient) return;
    const newCase: ProductionCase = {
      id: String(cases.length + 1),
      caseNumber: newCaseForm.caseNumber,
      patient: newCaseForm.patient,
      dentist: newCaseForm.dentist,
      stage: newCaseForm.stage,
      technician: 'Michael Chen',
      timeSpent: '0h 0m',
      status: 'In Progress',
      dueDate: 'TBD',
    };
    setCases([newCase, ...cases]);
    setNewCaseForm({ caseNumber: '', patient: '', dentist: '', stage: 'Design', notes: '' });
    setStartCaseOpen(false);
    showSuccess('Case started successfully!');
  };

  const handleCompleteWork = () => {
    if (!completeForm.caseNumber) return;
    setCases(cases.map(c =>
      c.caseNumber === completeForm.caseNumber ? { ...c, status: 'Completed' } : c
    ));
    setCompleteForm({ caseNumber: '', notes: '' });
    setCompleteWorkOpen(false);
    showSuccess('Case marked as completed!');
  };

  const handleTimeEntry = () => {
    if (!timeEntryForm.caseNumber || !timeEntryForm.hours) return;
    setCases(cases.map(c =>
      c.caseNumber === timeEntryForm.caseNumber
        ? { ...c, timeSpent: `${timeEntryForm.hours}h ${timeEntryForm.minutes || 0}m` }
        : c
    ));
    setTimeEntryForm({ caseNumber: '', hours: '', minutes: '', notes: '' });
    setTimeEntryOpen(false);
    showSuccess('Time entry added!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-amber-500 text-white';
      case 'Pending': return 'bg-blue-500 text-white';
      case 'Completed': return 'bg-green-500 text-white';
      case 'Overdue': return 'bg-red-500 text-white';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Board</h1>
          <p className="text-muted-foreground">Manage technician workflows and production stages</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setFilterOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {(stageFilter !== 'All' || techFilter !== 'All') && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">!</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {(stageFilter !== 'All' || techFilter !== 'All') && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filters:</span>
          {stageFilter !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Stage: {stageFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setStageFilter('All')} />
            </Badge>
          )}
          {techFilter !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tech: {techFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setTechFilter('All')} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={() => { setStageFilter('All'); setTechFilter('All'); }}>
            Clear All
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Stages</CardTitle>
              <CardDescription>Overview of cases in each production stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {productionStages.map((stage) => {
                  const stageCases = cases.filter(c => c.stage === stage.name);
                  return (
                    <div key={stage.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                          <span className="font-medium">{stage.name}</span>
                        </div>
                        <Badge variant="secondary">{stageCases.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {stageCases.slice(0, 2).map(c => (
                          <Card key={c.id} className="p-3 hover:bg-accent cursor-pointer transition-colors" onClick={() => setSelectedCase(c)}>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{c.caseNumber}</span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => e.stopPropagation()}>
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Assign to Me</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setCompleteForm({ caseNumber: c.caseNumber, notes: '' }); setCompleteWorkOpen(true); }}>
                                      Mark Complete
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { setTimeEntryForm({ caseNumber: c.caseNumber, hours: '', minutes: '', notes: '' }); setTimeEntryOpen(true); }}>
                                      Add Time Entry
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{c.dentist}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Due: {c.dueDate}</div>
                            </div>
                          </Card>
                        ))}
                        {stageCases.length === 0 && (
                          <p className="text-xs text-muted-foreground italic p-2">No cases</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Cases</CardTitle>
              <CardDescription>Cases currently in production — showing {filteredCases.length} of {cases.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Number</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Time Spent</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Status</TableHead>
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
                          <TableCell>
                            <Badge className={productionStages.find(s => s.name === c.stage)?.color + ' text-white'}>
                              {c.stage}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-3 w-3 text-primary" />
                              </div>
                              <span>{c.technician}</span>
                            </div>
                          </TableCell>
                          <TableCell>{c.timeSpent}</TableCell>
                          <TableCell>{c.dueDate}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(c.status)}>
                              <Clock className="mr-1 h-3 w-3" />
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setCompleteForm({ caseNumber: c.caseNumber, notes: '' });
                              setCompleteWorkOpen(true);
                            }}>
                              Complete
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Technician Dashboard</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div><p className="font-medium">Michael Chen</p><p className="text-sm text-muted-foreground">Senior Technician</p></div>
                  <Badge>{cases.filter(c => c.technician === 'Michael Chen' && c.status !== 'Completed').length} Cases</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="font-medium">Sarah Johnson</p><p className="text-sm text-muted-foreground">QC Specialist</p></div>
                  <Badge variant="outline">{cases.filter(c => c.technician === 'Sarah Johnson' && c.status !== 'Completed').length} Cases</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Production Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><p className="text-sm font-medium">Total Cases</p><p className="text-2xl font-bold">{cases.length}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">In Progress</p><p className="text-2xl font-bold text-amber-500">{cases.filter(c => c.status === 'In Progress').length}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">Completed</p><p className="text-2xl font-bold text-green-500">{cases.filter(c => c.status === 'Completed').length}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">Overdue</p><p className="text-2xl font-bold text-red-500">{cases.filter(c => c.status === 'Overdue').length}</p></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setStartCaseOpen(true)}>
                <Wrench className="mr-2 h-4 w-4" />
                Start New Case
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setCompleteWorkOpen(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Current Work
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setTimeEntryOpen(true)}>
                <Clock className="mr-2 h-4 w-4" />
                Add Time Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Filter Production Cases</DialogTitle>
            <DialogDescription>Filter cases by stage and technician</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Production Stage</Label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Stages</SelectItem>
                  {productionStages.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Technician</Label>
              <Select value={techFilter} onValueChange={setTechFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setStageFilter('All'); setTechFilter('All'); }}>Clear</Button>
            <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start New Case Dialog */}
      <Dialog open={startCaseOpen} onOpenChange={setStartCaseOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Start New Case</DialogTitle>
            <DialogDescription>Begin working on a new production case</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Case Number *</Label>
                <Input value={newCaseForm.caseNumber} onChange={e => setNewCaseForm({ ...newCaseForm, caseNumber: e.target.value })} placeholder="CAS-2024-000" />
              </div>
              <div className="space-y-2">
                <Label>Patient Name *</Label>
                <Input value={newCaseForm.patient} onChange={e => setNewCaseForm({ ...newCaseForm, patient: e.target.value })} placeholder="Patient name" />
              </div>
              <div className="space-y-2">
                <Label>Dentist</Label>
                <Input value={newCaseForm.dentist} onChange={e => setNewCaseForm({ ...newCaseForm, dentist: e.target.value })} placeholder="Dr. Name" />
              </div>
              <div className="space-y-2">
                <Label>Starting Stage</Label>
                <Select value={newCaseForm.stage} onValueChange={v => setNewCaseForm({ ...newCaseForm, stage: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {productionStages.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={newCaseForm.notes} onChange={e => setNewCaseForm({ ...newCaseForm, notes: e.target.value })} placeholder="Production notes..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStartCaseOpen(false)}>Cancel</Button>
            <Button onClick={handleStartCase} disabled={!newCaseForm.caseNumber || !newCaseForm.patient}>
              <Plus className="mr-2 h-4 w-4" /> Start Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Work Dialog */}
      <Dialog open={completeWorkOpen} onOpenChange={setCompleteWorkOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Complete Current Work</DialogTitle>
            <DialogDescription>Mark a case stage as completed</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Case Number *</Label>
              <Select value={completeForm.caseNumber} onValueChange={v => setCompleteForm({ ...completeForm, caseNumber: v })}>
                <SelectTrigger><SelectValue placeholder="Select a case" /></SelectTrigger>
                <SelectContent>
                  {cases.filter(c => c.status !== 'Completed').map(c => (
                    <SelectItem key={c.id} value={c.caseNumber}>{c.caseNumber} — {c.patient}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Completion Notes</Label>
              <Textarea value={completeForm.notes} onChange={e => setCompleteForm({ ...completeForm, notes: e.target.value })} placeholder="Notes on completion..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteWorkOpen(false)}>Cancel</Button>
            <Button onClick={handleCompleteWork} disabled={!completeForm.caseNumber}>
              <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Entry Dialog */}
      <Dialog open={timeEntryOpen} onOpenChange={setTimeEntryOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Time Entry</DialogTitle>
            <DialogDescription>Log time spent on a production case</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Case Number *</Label>
              <Select value={timeEntryForm.caseNumber} onValueChange={v => setTimeEntryForm({ ...timeEntryForm, caseNumber: v })}>
                <SelectTrigger><SelectValue placeholder="Select a case" /></SelectTrigger>
                <SelectContent>
                  {cases.map(c => (
                    <SelectItem key={c.id} value={c.caseNumber}>{c.caseNumber} — {c.patient}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hours *</Label>
                <Input type="number" min="0" max="24" value={timeEntryForm.hours} onChange={e => setTimeEntryForm({ ...timeEntryForm, hours: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Minutes</Label>
                <Input type="number" min="0" max="59" value={timeEntryForm.minutes} onChange={e => setTimeEntryForm({ ...timeEntryForm, minutes: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={timeEntryForm.notes} onChange={e => setTimeEntryForm({ ...timeEntryForm, notes: e.target.value })} placeholder="What was worked on..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTimeEntryOpen(false)}>Cancel</Button>
            <Button onClick={handleTimeEntry} disabled={!timeEntryForm.caseNumber || !timeEntryForm.hours}>
              <Clock className="mr-2 h-4 w-4" /> Add Time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Case Detail Popover */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCase.caseNumber}</DialogTitle>
                <DialogDescription>Production case details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Patient:</span><span className="font-medium">{selectedCase.patient}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dentist:</span><span className="font-medium">{selectedCase.dentist}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Stage:</span><span className="font-medium">{selectedCase.stage}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Technician:</span><span className="font-medium">{selectedCase.technician}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time Spent:</span><span className="font-medium">{selectedCase.timeSpent}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Due:</span><span className="font-medium">{selectedCase.dueDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge className={getStatusColor(selectedCase.status)}>{selectedCase.status}</Badge></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedCase(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
