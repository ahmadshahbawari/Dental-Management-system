import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Search, DollarSign, Plus, MoreVertical, TrendingDown, FileText, Package, Wrench, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

interface Expense {
  id: string;
  expenseId: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes?: string;
}

const initialExpenses: Expense[] = [
  { id: '1', expenseId: 'EXP-2024-045', description: 'Zirconia Material Purchase', category: 'Materials', date: 'Today', amount: 1250, status: 'Approved' },
  { id: '2', expenseId: 'EXP-2024-044', description: 'Equipment Maintenance', category: 'Equipment', date: 'Yesterday', amount: 450, status: 'Approved' },
  { id: '3', expenseId: 'EXP-2024-043', description: 'Electricity Bill', category: 'Utilities', date: 'Sep 1, 2026', amount: 320, status: 'Approved' },
  { id: '4', expenseId: 'EXP-2024-042', description: 'Staff Overtime', category: 'Labor', date: 'Sep 5, 2026', amount: 800, status: 'Pending' },
];

const defaultForm = { description: '', category: 'Materials', amount: '', date: new Date().toISOString().split('T')[0], notes: '', recurring: 'no' };

const BUDGETS: Record<string, number> = { Materials: 8000, Equipment: 5000, Utilities: 2500, Labor: 5000, Other: 2000 };

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [trendsOpen, setTrendsOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 2500); };

  const filteredExpenses = expenses.filter(exp => {
    const q = search.toLowerCase();
    const matchSearch = exp.expenseId.toLowerCase().includes(q) || exp.description.toLowerCase().includes(q) || exp.category.toLowerCase().includes(q);
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'this-month' && (exp.date === 'Today' || exp.date === 'Yesterday')) ||
      (activeTab === 'pending' && exp.status === 'Pending') ||
      (activeTab === 'recurring' && exp.expenseId.includes('043'));
    return matchSearch && matchTab;
  });

  const handleAdd = () => {
    if (!form.description || !form.amount) return;
    const newExp: Expense = {
      id: String(expenses.length + 1),
      expenseId: `EXP-2024-0${46 + expenses.length}`,
      description: form.description,
      category: form.category,
      date: form.date === new Date().toISOString().split('T')[0] ? 'Today' : form.date,
      amount: parseFloat(form.amount),
      status: 'Pending',
      notes: form.notes,
    };
    setExpenses([newExp, ...expenses]);
    setForm(defaultForm);
    setAddOpen(false);
    showSuccess('Expense added successfully!');
  };

  const totalByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'Pending': return <Badge className="bg-amber-500 text-white">Pending</Badge>;
      case 'Rejected': return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const catIcons: Record<string, JSX.Element> = {
    Materials: <Package className="h-4 w-4 text-blue-500" />,
    Equipment: <Wrench className="h-4 w-4 text-amber-500" />,
    Utilities: <FileText className="h-4 w-4 text-green-500" />,
    Labor: <DollarSign className="h-4 w-4 text-purple-500" />,
    Other: <DollarSign className="h-4 w-4 text-gray-500" />,
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
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Track and manage business expenses</p>
        </div>
        <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader><CardTitle>Expense Management</CardTitle><CardDescription>Track all business expenses</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search expenses..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({expenses.length})</TabsTrigger>
                  <TabsTrigger value="this-month">This Month</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({expenses.filter(e => e.status === 'Pending').length})</TabsTrigger>
                  <TabsTrigger value="recurring">Recurring</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Expense ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.length === 0 && (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No expenses found</TableCell></TableRow>
                      )}
                      {filteredExpenses.map((exp) => (
                        <TableRow key={exp.id}>
                          <TableCell className="font-medium">{exp.expenseId}</TableCell>
                          <TableCell>{exp.description}</TableCell>
                          <TableCell><Badge variant="outline">{exp.category}</Badge></TableCell>
                          <TableCell>{exp.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-red-500">-${exp.amount.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(exp.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Expense</DropdownMenuItem>
                                <DropdownMenuItem>Attach Receipt</DropdownMenuItem>
                                {exp.status === 'Pending' && <DropdownMenuItem onClick={() => { setExpenses(expenses.map(e => e.id === exp.id ? { ...e, status: 'Approved' as const } : e)); showSuccess('Expense approved!'); }}>Approve</DropdownMenuItem>}
                                <DropdownMenuItem className="text-red-600" onClick={() => { setExpenses(expenses.filter(e => e.id !== exp.id)); showSuccess('Expense deleted!'); }}>Delete</DropdownMenuItem>
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
              <CardHeader><CardTitle>Expense Categories</CardTitle><CardDescription>Breakdown by type</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(totalByCategory).map(([cat, total]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">{catIcons[cat] || catIcons.Other}<span>{cat}</span></div>
                    <span className="font-medium">${total.toFixed(0)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Budget vs Actual</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(BUDGETS).map(([cat, budget]) => {
                  const actual = totalByCategory[cat] || 0;
                  const pct = Math.min(Math.round((actual / budget) * 100), 100);
                  const over = actual > budget;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{cat}</span>
                        <span className={over ? 'text-red-600 font-medium' : ''}>${actual.toFixed(0)} / ${budget}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${over ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Expense Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm font-medium">Total</p><p className="text-2xl font-bold text-red-500">${expenses.reduce((s, e) => s + e.amount, 0).toFixed(0)}</p></div>
                <div><p className="text-sm font-medium">Pending</p><p className="text-2xl font-bold text-amber-500">{expenses.filter(e => e.status === 'Pending').length}</p></div>
                <div><p className="text-sm font-medium">Approved</p><p className="text-2xl font-bold text-green-500">{expenses.filter(e => e.status === 'Approved').length}</p></div>
                <div><p className="text-sm font-medium">Categories</p><p className="text-2xl font-bold">{Object.keys(totalByCategory).length}</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setTrendsOpen(true)}><TrendingDown className="mr-2 h-4 w-4" />View Trends</Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setAlertsOpen(true)}><AlertCircle className="mr-2 h-4 w-4" />Budget Alerts</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle><DialogDescription>Record a new business expense. * required.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Description *</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Expense description" /></div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Materials">Materials</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Labor">Labor</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Amount ($) *</Label><Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></div>
              <div className="space-y-2 col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional details..." rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.description || !form.amount}><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trends Dialog */}
      <Dialog open={trendsOpen} onOpenChange={setTrendsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Expense Trends</DialogTitle><DialogDescription>Monthly expense comparison</DialogDescription></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center"><p className="text-2xl font-bold text-red-500">${expenses.filter(e => e.date === 'Today' || e.date === 'Yesterday').reduce((s, e) => s + e.amount, 0).toFixed(0)}</p><p className="text-sm text-muted-foreground">This Week</p></Card>
              <Card className="p-4 text-center"><p className="text-2xl font-bold">${expenses.reduce((s, e) => s + e.amount, 0).toFixed(0)}</p><p className="text-sm text-muted-foreground">This Month</p></Card>
              <Card className="p-4 text-center"><p className="text-2xl font-bold">{expenses.filter(e => e.status === 'Pending').length}</p><p className="text-sm text-muted-foreground">Pending</p></Card>
            </div>
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4" />By Category</h3>
              <div className="space-y-2">
                {Object.entries(totalByCategory).map(([cat, total]) => (
                  <div key={cat} className="flex justify-between items-center text-sm border-b pb-2">
                    <span>{cat}</span>
                    <span className="font-medium text-red-500">-${total.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => setTrendsOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Budget Alerts Dialog */}
      <Dialog open={alertsOpen} onOpenChange={setAlertsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Budget Alerts</DialogTitle><DialogDescription>Categories approaching or exceeding budget</DialogDescription></DialogHeader>
          <div className="py-4 space-y-3">
            {Object.entries(BUDGETS).map(([cat, budget]) => {
              const actual = totalByCategory[cat] || 0;
              const pct = Math.round((actual / budget) * 100);
              const over = actual > budget;
              if (pct < 80) return null;
              return (
                <div key={cat} className={`flex items-center justify-between p-3 rounded-md ${over ? 'bg-red-50 dark:bg-red-950/20' : 'bg-amber-50 dark:bg-amber-950/20'}`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`h-5 w-5 ${over ? 'text-red-500' : 'text-amber-500'}`} />
                    <div>
                      <p className="font-medium">{cat}</p>
                      <p className="text-sm text-muted-foreground">${actual.toFixed(0)} of ${budget} ({pct}%)</p>
                    </div>
                  </div>
                  <Badge variant={over ? 'destructive' : 'secondary'}>{over ? 'Over Budget' : 'Warning'}</Badge>
                </div>
              );
            })}
            {Object.entries(BUDGETS).every(([cat, budget]) => (totalByCategory[cat] || 0) / budget < 0.8) && (
              <div className="text-center text-muted-foreground py-4">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>All categories are within budget!</p>
              </div>
            )}
          </div>
          <DialogFooter><Button onClick={() => setAlertsOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
