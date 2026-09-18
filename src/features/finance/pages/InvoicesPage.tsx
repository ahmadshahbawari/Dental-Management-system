import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search, FileText, DollarSign, Plus, Download, MoreVertical, TrendingUp, CheckCircle } from 'lucide-react';
interface Invoice {
  id: string;
  number: string;
  patient: string;
  clinic: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Unpaid' | 'Paid' | 'Overdue' | 'Partial';
}

const initialInvoices: Invoice[] = [
  { id: '1', number: 'INV-2024-045', patient: 'John Doe', clinic: 'Modern Dental Care', date: 'Sep 15, 2026', dueDate: 'Sep 30, 2026', amount: 850, status: 'Unpaid' },
  { id: '2', number: 'INV-2024-044', patient: 'Jane Smith', clinic: 'Bright Smile', date: 'Sep 10, 2026', dueDate: 'Sep 25, 2026', amount: 950, status: 'Paid' },
  { id: '3', number: 'INV-2024-043', patient: 'Robert Brown', clinic: 'Downtown Dental', date: 'Aug 20, 2026', dueDate: 'Sep 5, 2026', amount: 1200, status: 'Overdue' },
  { id: '4', number: 'INV-2024-042', patient: 'Alice Davis', clinic: 'Modern Dental Care', date: 'Sep 1, 2026', dueDate: 'Sep 16, 2026', amount: 680, status: 'Partial' },
];

const defaultForm = { patient: '', clinic: '', dueDate: '', services: '', amount: '', notes: '' };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewInvoiceOpen, setViewInvoiceOpen] = useState(false);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 2500); };

  const filteredInvoices = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchSearch = inv.number.toLowerCase().includes(q) || inv.patient.toLowerCase().includes(q) || inv.clinic.toLowerCase().includes(q);
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'unpaid' && inv.status === 'Unpaid') ||
      (activeTab === 'paid' && inv.status === 'Paid') ||
      (activeTab === 'overdue' && inv.status === 'Overdue');
    return matchSearch && matchTab;
  });

  const handleCreate = () => {
    if (!form.patient || !form.amount) return;
    const newInv: Invoice = {
      id: String(invoices.length + 1),
      number: `INV-2024-0${46 + invoices.length}`,
      patient: form.patient,
      clinic: form.clinic,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      dueDate: form.dueDate || 'TBD',
      amount: parseFloat(form.amount) || 0,
      status: 'Unpaid',
    };
    setInvoices([newInv, ...invoices]);
    setForm(defaultForm);
    setCreateOpen(false);
    showSuccess('Invoice created successfully!');
  };

  const markPaid = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' as const } : inv));
    showSuccess('Invoice marked as paid!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Unpaid': return <Badge className="bg-blue-500 text-white">Unpaid</Badge>;
      case 'Paid': return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case 'Overdue': return <Badge className="bg-red-500 text-white">Overdue</Badge>;
      case 'Partial': return <Badge className="bg-amber-500 text-white">Partial</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />{successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage invoices and billing</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader><CardTitle>Invoice Management</CardTitle><CardDescription>View and manage all invoices</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search invoices..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({invoices.length})</TabsTrigger>
                  <TabsTrigger value="unpaid">Unpaid ({invoices.filter(i => i.status === 'Unpaid').length})</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue ({invoices.filter(i => i.status === 'Overdue').length})</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Patient / Clinic</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 && (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No invoices found</TableCell></TableRow>
                      )}
                      {filteredInvoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">{inv.number}</TableCell>
                          <TableCell>
                            <div className="font-medium">{inv.patient}</div>
                            <div className="text-sm text-muted-foreground">{inv.clinic}</div>
                          </TableCell>
                          <TableCell>{inv.date}</TableCell>
                          <TableCell>{inv.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">${inv.amount.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(inv.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedInvoice(inv); setViewInvoiceOpen(true); }}>View Invoice</DropdownMenuItem>
                                {inv.status !== 'Paid' && <DropdownMenuItem onClick={() => markPaid(inv.id)}>Mark as Paid</DropdownMenuItem>}
                                <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => showSuccess('Invoice downloaded!')}><Download className="mr-2 h-4 w-4" />Download PDF</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Invoice Statistics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm font-medium">Outstanding</p><p className="text-2xl font-bold text-red-500">${invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0).toFixed(0)}</p></div>
                  <div><p className="text-sm font-medium">Collected</p><p className="text-2xl font-bold text-green-500">${invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0).toFixed(0)}</p></div>
                  <div><p className="text-sm font-medium">Overdue</p><p className="text-2xl font-bold text-amber-500">{invoices.filter(i => i.status === 'Overdue').length}</p></div>
                  <div><p className="text-sm font-medium">Total Invoices</p><p className="text-2xl font-bold">{invoices.length}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {invoices.filter(i => i.status === 'Paid').map(inv => (
                  <div key={inv.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div><p className="text-sm">Payment Received</p><p className="text-xs text-muted-foreground">{inv.number}</p></div>
                    </div>
                    <div className="text-right"><p className="text-sm font-medium">${inv.amount.toFixed(2)}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Financial Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm font-medium">Total Revenue</p><p className="text-2xl font-bold text-green-500">${invoices.reduce((s, i) => s + i.amount, 0).toFixed(0)}</p></div>
                <div><p className="text-sm font-medium">Collections Rate</p><p className="text-2xl font-bold text-green-500">{invoices.length > 0 ? Math.round((invoices.filter(i => i.status === 'Paid').length / invoices.length) * 100) : 0}%</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />Create Invoice
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setViewReportOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />View Reports
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setExportOpen(true)}>
                <Download className="mr-2 h-4 w-4" />Export Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Create New Invoice</DialogTitle><DialogDescription>Fields marked * are required.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Patient Name *</Label><Input value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} placeholder="Patient name" /></div>
              <div className="space-y-2"><Label>Clinic</Label><Input value={form.clinic} onChange={e => setForm({ ...form, clinic: e.target.value })} placeholder="Clinic name" /></div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>Amount ($) *</Label><Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></div>
            </div>
            <div className="space-y-2"><Label>Services</Label><Input value={form.services} onChange={e => setForm({ ...form, services: e.target.value })} placeholder="Crown, Bridge, etc." /></div>
            <div className="space-y-2"><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.patient || !form.amount}><Plus className="mr-2 h-4 w-4" />Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={viewInvoiceOpen} onOpenChange={setViewInvoiceOpen}>
        <DialogContent className="sm:max-w-[450px]">
          {selectedInvoice && (
            <>
              <DialogHeader><DialogTitle>{selectedInvoice.number}</DialogTitle><DialogDescription>Invoice details</DialogDescription></DialogHeader>
              <div className="py-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Patient:</span><span className="font-medium">{selectedInvoice.patient}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Clinic:</span><span className="font-medium">{selectedInvoice.clinic}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-medium">{selectedInvoice.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Due Date:</span><span className="font-medium">{selectedInvoice.dueDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount:</span><span className="font-bold text-lg">${selectedInvoice.amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status:</span>{getStatusBadge(selectedInvoice.status)}</div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewInvoiceOpen(false)}>Close</Button>
                {selectedInvoice.status !== 'Paid' && <Button onClick={() => { markPaid(selectedInvoice.id); setViewInvoiceOpen(false); }}>Mark as Paid</Button>}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reports Dialog */}
      <Dialog open={viewReportOpen} onOpenChange={setViewReportOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader><DialogTitle>Invoice Reports</DialogTitle><DialogDescription>Summary of billing activity</DialogDescription></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center"><p className="text-3xl font-bold">{invoices.length}</p><p className="text-sm text-muted-foreground">Total Invoices</p></Card>
              <Card className="p-4 text-center"><p className="text-3xl font-bold text-green-500">{invoices.filter(i => i.status === 'Paid').length}</p><p className="text-sm text-muted-foreground">Paid</p></Card>
              <Card className="p-4 text-center"><p className="text-3xl font-bold text-red-500">{invoices.filter(i => i.status === 'Overdue').length}</p><p className="text-sm text-muted-foreground">Overdue</p></Card>
              <Card className="p-4 text-center"><p className="text-3xl font-bold text-blue-500">{invoices.filter(i => i.status === 'Unpaid').length}</p><p className="text-sm text-muted-foreground">Unpaid</p></Card>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span>Total Billed:</span><span className="font-bold">${invoices.reduce((s, i) => s + i.amount, 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Collected:</span><span className="font-bold text-green-600">${invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Outstanding:</span><span className="font-bold text-red-600">${invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0).toFixed(2)}</span></div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => setViewReportOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Export Data</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-4">
            {['PDF', 'Excel (XLSX)', 'CSV'].map(format => (
              <Button key={format} variant="outline" className="w-full justify-start" onClick={() => { showSuccess(`Exporting as ${format}...`); setExportOpen(false); }}>
                <Download className="mr-2 h-4 w-4" />Export as {format}
              </Button>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
