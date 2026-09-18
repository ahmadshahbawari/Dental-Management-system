import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search, DollarSign, Plus, Download, MoreVertical, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Payment {
  id: string;
  paymentId: string;
  invoice: string;
  patient: string;
  date: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
}

const initialPayments: Payment[] = [
  { id: '1', paymentId: 'PAY-2024-045', invoice: 'INV-2024-044', patient: 'John Doe', date: 'Today', amount: 850, method: 'Credit Card', status: 'Completed' },
  { id: '2', paymentId: 'PAY-2024-044', invoice: 'INV-2024-043', patient: 'Jane Smith', date: 'Today', amount: 1200, method: 'Bank Transfer', status: 'Pending' },
  { id: '3', paymentId: 'PAY-2024-043', invoice: 'INV-2024-042', patient: 'Robert Brown', date: 'Yesterday', amount: 680, method: 'Cash', status: 'Completed' },
  { id: '4', paymentId: 'PAY-2024-042', invoice: 'INV-2024-041', patient: 'Alice Davis', date: '2 days ago', amount: 950, method: 'Credit Card', status: 'Failed' },
];

const defaultForm = { patient: '', invoice: '', amount: '', method: 'Credit Card', date: '' };

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [recordOpen, setRecordOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [reminderPatient, setReminderPatient] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 2500); };

  const filteredPayments = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.paymentId.toLowerCase().includes(q) || p.patient.toLowerCase().includes(q) || p.invoice.toLowerCase().includes(q);
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'today' && p.date === 'Today') ||
      (activeTab === 'pending' && p.status === 'Pending') ||
      (activeTab === 'failed' && p.status === 'Failed');
    return matchSearch && matchTab;
  });

  const handleRecord = () => {
    if (!form.patient || !form.amount) return;
    const newPayment: Payment = {
      id: String(payments.length + 1),
      paymentId: `PAY-2024-0${46 + payments.length}`,
      invoice: form.invoice || 'N/A',
      patient: form.patient,
      date: 'Today',
      amount: parseFloat(form.amount),
      method: form.method,
      status: 'Completed',
    };
    setPayments([newPayment, ...payments]);
    setForm(defaultForm);
    setRecordOpen(false);
    showSuccess('Payment recorded successfully!');
  };

  const handleRefund = () => {
    if (!selectedPayment) return;
    setPayments(payments.map(p => p.id === selectedPayment.id ? { ...p, status: 'Refunded' as const } : p));
    setRefundOpen(false);
    showSuccess('Payment refunded successfully!');
  };

  const handleSendReceipt = (p: Payment) => {
    showSuccess(`Receipt sent for ${p.paymentId}!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge className="bg-green-500 text-white"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'Pending': return <Badge className="bg-amber-500 text-white"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'Failed': return <Badge className="bg-red-500 text-white">Failed</Badge>;
      case 'Refunded': return <Badge className="bg-gray-500 text-white">Refunded</Badge>;
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
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage patient payments and collections</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setExportOpen(true)}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button onClick={() => setRecordOpen(true)}><Plus className="mr-2 h-4 w-4" />Record Payment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader><CardTitle>Payment Transactions</CardTitle><CardDescription>View and manage all payment transactions</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search payments..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({payments.filter(p => p.status === 'Pending').length})</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 && (
                        <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No payments found</TableCell></TableRow>
                      )}
                      {filteredPayments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.paymentId}</TableCell>
                          <TableCell>{p.invoice}</TableCell>
                          <TableCell>{p.patient}</TableCell>
                          <TableCell>{p.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">${p.amount.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{p.method}</TableCell>
                          <TableCell>{getStatusBadge(p.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedPayment(p); setViewOpen(true); }}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => showSuccess(`Receipt downloaded for ${p.paymentId}`)}>Download Receipt</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendReceipt(p)}>Send Receipt</DropdownMenuItem>
                                {p.status === 'Completed' && (
                                  <DropdownMenuItem onClick={() => { setSelectedPayment(p); setRefundOpen(true); }} className="text-red-600">Refund Payment</DropdownMenuItem>
                                )}
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
              <CardHeader><CardTitle>Payment Methods Distribution</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {['Credit Card', 'Cash', 'Bank Transfer'].map(method => {
                  const total = payments.filter(p => p.method === method).reduce((s, p) => s + p.amount, 0);
                  const pct = payments.reduce((s, p) => s + p.amount, 0) > 0 ? Math.round(total / payments.reduce((s, p) => s + p.amount, 0) * 100) : 0;
                  return (
                    <div key={method} className="space-y-1">
                      <div className="flex justify-between text-sm"><span>{method}</span><span className="font-medium">${total.toFixed(0)} ({pct}%)</span></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {payments.slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {p.status === 'Completed' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                      <div><p className="text-sm">{p.status}</p><p className="text-xs text-muted-foreground">{p.paymentId}</p></div>
                    </div>
                    <div className="text-right"><p className={`text-sm font-medium ${p.status === 'Completed' ? '' : 'text-amber-500'}`}>${p.amount.toFixed(2)}</p><p className="text-xs text-muted-foreground">{p.date}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Payment Statistics</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm font-medium">Today</p><p className="text-2xl font-bold text-green-500">${payments.filter(p => p.date === 'Today' && p.status === 'Completed').reduce((s, p) => s + p.amount, 0).toFixed(0)}</p></div>
                <div><p className="text-sm font-medium">Total</p><p className="text-2xl font-bold">${payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0).toFixed(0)}</p></div>
                <div><p className="text-sm font-medium">Pending</p><p className="text-2xl font-bold text-amber-500">{payments.filter(p => p.status === 'Pending').length}</p></div>
                <div><p className="text-sm font-medium">Failed</p><p className="text-2xl font-bold text-red-500">{payments.filter(p => p.status === 'Failed').length}</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setRecordOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />Record Payment
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setExportOpen(true)}>
                <Download className="mr-2 h-4 w-4" />Export Report
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setReminderOpen(true)}>
                <AlertCircle className="mr-2 h-4 w-4" />Send Reminder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Record Payment Dialog */}
      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Record Payment</DialogTitle><DialogDescription>Record a new payment transaction. * required.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Patient Name *</Label><Input value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} placeholder="Patient name" /></div>
              <div className="space-y-2"><Label>Invoice Number</Label><Input value={form.invoice} onChange={e => setForm({ ...form, invoice: e.target.value })} placeholder="INV-2024-..." /></div>
              <div className="space-y-2"><Label>Amount ($) *</Label><Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={form.method} onValueChange={v => setForm({ ...form, method: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2"><Label>Payment Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecordOpen(false)}>Cancel</Button>
            <Button onClick={handleRecord} disabled={!form.patient || !form.amount}><CheckCircle className="mr-2 h-4 w-4" />Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Payment Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[400px]">
          {selectedPayment && (
            <>
              <DialogHeader><DialogTitle>Payment Details</DialogTitle><DialogDescription>{selectedPayment.paymentId}</DialogDescription></DialogHeader>
              <div className="py-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Patient:</span><span className="font-medium">{selectedPayment.patient}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Invoice:</span><span className="font-medium">{selectedPayment.invoice}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-medium">{selectedPayment.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount:</span><span className="font-bold text-lg">${selectedPayment.amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Method:</span><span className="font-medium">{selectedPayment.method}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status:</span>{getStatusBadge(selectedPayment.status)}</div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
                <Button onClick={() => { handleSendReceipt(selectedPayment); setViewOpen(false); }}>Send Receipt</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Refund Payment</DialogTitle><DialogDescription>Are you sure you want to refund ${selectedPayment?.amount.toFixed(2)} for {selectedPayment?.patient}?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRefund}>Confirm Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Export Report</DialogTitle><DialogDescription>Choose export format for payment data</DialogDescription></DialogHeader>
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

      {/* Reminder Dialog */}
      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Send Payment Reminder</DialogTitle><DialogDescription>Send reminder to patients with outstanding payments</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Send to</Label>
              <Select value={reminderPatient} onValueChange={setReminderPatient}>
                <SelectTrigger><SelectValue placeholder="Select patient or group" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients with Pending Payments</SelectItem>
                  {payments.filter(p => p.status === 'Pending').map(p => (
                    <SelectItem key={p.id} value={p.patient}>{p.patient} — ${p.amount}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderOpen(false)}>Cancel</Button>
            <Button onClick={() => { showSuccess('Reminder sent!'); setReminderOpen(false); }} disabled={!reminderPatient}>
              <AlertCircle className="mr-2 h-4 w-4" />Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
