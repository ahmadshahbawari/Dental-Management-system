import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { BarChart3, Download, FileText, Calendar, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', cases: 120, revenue: 45000, expenses: 22000 },
  { month: 'Feb', cases: 135, revenue: 52000, expenses: 24000 },
  { month: 'Mar', cases: 148, revenue: 58000, expenses: 28000 },
  { month: 'Apr', cases: 162, revenue: 62000, expenses: 30000 },
  { month: 'May', cases: 178, revenue: 70000, expenses: 32000 },
  { month: 'Jun', cases: 165, revenue: 68000, expenses: 31000 },
  { month: 'Jul', cases: 190, revenue: 74000, expenses: 33000 },
  { month: 'Aug', cases: 205, revenue: 78000, expenses: 34500 },
  { month: 'Sep', cases: 212, revenue: 82000, expenses: 35000 },
];

export default function ReportsPage() {
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [scheduleForm, setScheduleForm] = useState({ frequency: 'weekly', email: '', reportType: 'overview' });

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 2500); };

  const reportTypes = [
    { name: 'Monthly Revenue Report', description: 'Revenue and collections by month' },
    { name: 'Case Volume Report', description: 'Number of cases processed' },
    { name: 'Technician Performance', description: 'Output and quality per technician' },
    { name: 'QC Pass Rate Report', description: 'Quality control statistics' },
    { name: 'Inventory Usage Report', description: 'Material consumption analysis' },
    { name: 'Outstanding Invoices', description: 'Unpaid invoices and aging' },
  ];

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />{successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analytics and performance reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setDateRangeOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />Date Range
          </Button>
          <Button onClick={() => setExportOpen(true)}>
            <Download className="mr-2 h-4 w-4" />Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Cases (YTD)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">1,245</div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">+12% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">$589K</div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md"><DollarSign className="h-5 w-5 text-green-600" /></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">+8% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg. Completion</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">3.2 days</div>
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md"><Calendar className="h-5 w-5 text-amber-600" /></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">-0.5 days improvement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">QC Pass Rate</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md"><BarChart3 className="h-5 w-5 text-blue-600" /></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">+2% from last period</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Monthly Cases & Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cases" fill="#3b82f6" name="Cases" radius={[4,4,0,0]} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#22c55e" name="Revenue ($)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Production Performance</CardTitle><CardDescription>Completion rates by stage</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {[{ label: 'Design', pct: 85, color: 'bg-blue-500' }, { label: 'Framework', pct: 78, color: 'bg-amber-500' }, { label: 'Porcelain', pct: 92, color: 'bg-pink-500' }, { label: 'Polishing', pct: 96, color: 'bg-teal-500' }].map(item => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm"><span>{item.label}</span><span className="font-medium">{item.pct}%</span></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Dentists</CardTitle><CardDescription>Cases by referring dentist</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {[{ name: 'Dr. Smith', cases: 45 }, { name: 'Dr. Johnson', cases: 38 }, { name: 'Dr. Williams', cases: 32 }, { name: 'Dr. Brown', cases: 28 }, { name: 'Dr. Davis', cases: 22 }].map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2"><Users className="h-4 w-4 text-muted-foreground" /><span>{item.name}</span></div>
                    <Badge>{item.cases} cases</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Expenses" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Revenue Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[{ label: 'Crowns', amount: 42500 }, { label: 'Bridges', amount: 28750 }, { label: 'Dentures', amount: 14000 }, { label: 'Implants', amount: 12000 }].map(item => (
                  <div key={item.label} className="flex justify-between text-sm"><span>{item.label}</span><span className="font-medium">${item.amount.toLocaleString()}</span></div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Expense Categories</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[{ label: 'Materials', amount: 18250 }, { label: 'Labor', amount: 32500 }, { label: 'Overhead', amount: 8750 }, { label: 'Equipment', amount: 5000 }].map(item => (
                  <div key={item.label} className="flex justify-between text-sm"><span>{item.label}</span><span className="font-medium text-red-600">-${item.amount.toLocaleString()}</span></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Production Efficiency</CardTitle><CardDescription>Monthly case volume</CardDescription></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="cases" fill="#8b5cf6" name="Cases Completed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>QC Pass Rate Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4 text-center"><p className="text-3xl font-bold text-green-500">94%</p><p className="text-sm text-muted-foreground">This Month</p></Card>
                <Card className="p-4 text-center"><p className="text-3xl font-bold text-blue-500">92%</p><p className="text-sm text-muted-foreground">Last Month</p></Card>
                <Card className="p-4 text-center"><p className="text-3xl font-bold">5%</p><p className="text-sm text-muted-foreground">Rejection Rate</p></Card>
              </div>
              <p className="text-sm text-muted-foreground">Detailed QC analytics available after backend integration.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Inventory Reports</CardTitle><CardDescription>Stock levels and consumption analysis</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4"><p className="text-2xl font-bold">156</p><p className="text-sm text-muted-foreground">Total SKUs</p></Card>
                <Card className="p-4"><p className="text-2xl font-bold text-red-500">3</p><p className="text-sm text-muted-foreground">Low Stock</p></Card>
                <Card className="p-4"><p className="text-2xl font-bold text-green-500">$12,850</p><p className="text-sm text-muted-foreground">Total Value</p></Card>
                <Card className="p-4"><p className="text-2xl font-bold text-amber-500">12</p><p className="text-sm text-muted-foreground">Expiring Soon</p></Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Standard Reports, Export Options, Schedule Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Standard Reports</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reportTypes.map(r => (
              <Button key={r.name} className="w-full justify-start text-left h-auto py-2" variant="outline"
                onClick={() => { showSuccess(`Generating: ${r.name}`); }}>
                <div>
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 shrink-0" /><span className="font-medium">{r.name}</span></div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-6">{r.description}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Export Options</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[['PDF', 'Best for printing and sharing'], ['Excel (XLSX)', 'For data analysis in spreadsheets'], ['CSV', 'For import into other systems'], ['JSON', 'For API integrations']].map(([format, desc]) => (
              <Button key={format} className="w-full justify-start h-auto py-2" variant="outline"
                onClick={() => { showSuccess(`Exporting as ${format}...`); }}>
                <div>
                  <div className="flex items-center gap-2"><Download className="h-4 w-4 shrink-0" /><span className="font-medium">Export as {format}</span></div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-6">{desc}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Schedule Reports</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[['Daily Digest', 'Sent every morning at 8 AM'], ['Weekly Summary', 'Sent every Monday morning'], ['Monthly Analysis', 'Sent on 1st of each month']].map(([name, desc]) => (
              <Button key={name} className="w-full justify-start h-auto py-2" variant="outline"
                onClick={() => setScheduleOpen(true)}>
                <div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0" /><span className="font-medium">{name}</span></div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-6">{desc}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Date Range Dialog */}
      <Dialog open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Select Date Range</DialogTitle><DialogDescription>Filter reports by date range</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>From</Label><Input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} /></div>
            <div className="space-y-2"><Label>To</Label><Input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} /></div>
            <div className="flex gap-2 flex-wrap">
              {['Last 7 days', 'Last 30 days', 'This Month', 'Last Month', 'This Year'].map(preset => (
                <Button key={preset} variant="outline" size="sm" onClick={() => { showSuccess(`Date range set: ${preset}`); setDateRangeOpen(false); }}>{preset}</Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDateRangeOpen(false)}>Cancel</Button>
            <Button onClick={() => { showSuccess('Date range applied!'); setDateRangeOpen(false); }} disabled={!dateRange.from || !dateRange.to}>Apply Range</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Export Report</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-4">
            <div className="space-y-2"><Label>Report Type</Label>
              <Select defaultValue="overview">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="production">Production Report</SelectItem>
                  <SelectItem value="quality">Quality Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
            <Button onClick={() => { showSuccess('Report exported!'); setExportOpen(false); }}><Download className="mr-2 h-4 w-4" />Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Schedule Report</DialogTitle><DialogDescription>Set up automated report delivery</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Email Address</Label><Input type="email" value={scheduleForm.email} onChange={e => setScheduleForm({ ...scheduleForm, email: e.target.value })} placeholder="your@email.com" /></div>
            <div className="space-y-2"><Label>Frequency</Label>
              <Select value={scheduleForm.frequency} onValueChange={v => setScheduleForm({ ...scheduleForm, frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Report Type</Label>
              <Select value={scheduleForm.reportType} onValueChange={v => setScheduleForm({ ...scheduleForm, reportType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={() => { showSuccess('Report scheduled!'); setScheduleOpen(false); }} disabled={!scheduleForm.email}><Calendar className="mr-2 h-4 w-4" />Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
