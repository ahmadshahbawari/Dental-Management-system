import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Role } from '@/types/auth';
import { formatCurrency } from '@/lib/utils';
import { usePreferences } from '@/lib/usePreferences';
import {
  Calendar,
  Briefcase,
  Users,
  CheckSquare,
  Package,
  DollarSign,
  ArrowDownRight,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { prefs } = usePreferences();
  const [chartView, setChartView] = useState<'monthly' | 'weekly'>('monthly');

  // Mock dashboard data
  const dashboardStats = {
    visitsToday: { total: 24, withLab: 18, withoutLab: 6, open: 8, closed: 16 },
    casesToday: { received: 12, dueToday: 8, dueTomorrow: 15, overdue: 3 },
    production: { inProduction: 42, inQC: 8, readyForDelivery: 6 },
    finance: { paymentsToday: 12500, expensesToday: 4200, outstandingBalance: 56700 },
    inventory: { lowStock: 7, expiringSoon: 12 },
  };

  // Chart data
  const monthlyVisitsData = [
    { month: 'Jan', visits: 450, labVisits: 320 },
    { month: 'Feb', visits: 520, labVisits: 380 },
    { month: 'Mar', visits: 580, labVisits: 420 },
    { month: 'Apr', visits: 620, labVisits: 480 },
    { month: 'May', visits: 700, labVisits: 520 },
    { month: 'Jun', visits: 680, labVisits: 500 },
    { month: 'Jul', visits: 730, labVisits: 540 },
    { month: 'Aug', visits: 710, labVisits: 525 },
    { month: 'Sep', visits: 760, labVisits: 570 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 22000 },
    { month: 'Feb', revenue: 52000, expenses: 24000 },
    { month: 'Mar', revenue: 58000, expenses: 28000 },
    { month: 'Apr', revenue: 62000, expenses: 30000 },
    { month: 'May', revenue: 70000, expenses: 32000 },
    { month: 'Jun', revenue: 68000, expenses: 31000 },
    { month: 'Jul', revenue: 74000, expenses: 33000 },
    { month: 'Aug', revenue: 78000, expenses: 34500 },
    { month: 'Sep', revenue: 82000, expenses: 35000 },
  ];

  const casesByStageData = [
    { name: 'Design', value: 15, color: '#3b82f6' },
    { name: 'Wax-up', value: 8, color: '#a855f7' },
    { name: 'Framework', value: 12, color: '#f59e0b' },
    { name: 'Porcelain', value: 10, color: '#ec4899' },
    { name: 'Polishing', value: 6, color: '#14b8a6' },
    { name: 'QC', value: 8, color: '#22c55e' },
  ];

  const weeklyProductionData = [
    { day: 'Mon', completed: 8, pending: 5 },
    { day: 'Tue', completed: 12, pending: 3 },
    { day: 'Wed', completed: 10, pending: 6 },
    { day: 'Thu', completed: 15, pending: 4 },
    { day: 'Fri', completed: 9, pending: 7 },
    { day: 'Sat', completed: 5, pending: 2 },
  ];

  // Role-based visibility
  const showVisits =
    user?.roles.includes(Role.RECEPTIONIST) ||
    user?.roles.includes(Role.MANAGER) ||
    user?.roles.includes(Role.ADMIN);
  const showCases =
    user?.roles.includes(Role.RECEPTIONIST) ||
    user?.roles.includes(Role.MANAGER) ||
    user?.roles.includes(Role.ADMIN) ||
    user?.roles.includes(Role.QC);
  const showProduction =
    user?.roles.includes(Role.TECHNICIAN) ||
    user?.roles.includes(Role.MANAGER) ||
    user?.roles.includes(Role.ADMIN);
  const showQC =
    user?.roles.includes(Role.QC) ||
    user?.roles.includes(Role.MANAGER) ||
    user?.roles.includes(Role.ADMIN);
  const showFinance =
    user?.roles.includes(Role.ACCOUNTANT) ||
    user?.roles.includes(Role.MANAGER) ||
    user?.roles.includes(Role.ADMIN);
  const showInventory =
    user?.roles.includes(Role.STOREKEEPER) ||
    user?.roles.includes(Role.MANAGER) ||
    user?.roles.includes(Role.ADMIN);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setChartView(chartView === 'monthly' ? 'weekly' : 'monthly')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            {chartView === 'monthly' ? 'Weekly View' : 'Monthly View'}
          </Button>
          <span className="text-sm text-muted-foreground">Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showVisits && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visits Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.visitsToday.total}</div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">With Lab</span>
                  <span className="text-sm font-medium text-blue-600">{dashboardStats.visitsToday.withLab}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Without Lab</span>
                  <span className="text-sm font-medium text-gray-600">{dashboardStats.visitsToday.withoutLab}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open</span>
                  <span className="text-sm font-medium text-amber-600">{dashboardStats.visitsToday.open}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showCases && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cases Today</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.casesToday.received}</div>
              <p className="text-xs text-muted-foreground">Received today</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">Due Today</span>
                    <span className={`text-sm font-medium ${dashboardStats.casesToday.dueToday > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {dashboardStats.casesToday.dueToday}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">Overdue</span>
                    <span className="text-sm font-medium text-red-600">{dashboardStats.casesToday.overdue}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showProduction && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.production.inProduction}</div>
              <p className="text-xs text-muted-foreground">Cases in production</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">In QC</span>
                  <span className="text-sm font-medium text-purple-600">{dashboardStats.production.inQC}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ready for Delivery</span>
                  <span className="text-sm font-medium text-green-600">{dashboardStats.production.readyForDelivery}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showQC && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QC Pending</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.production.inQC}</div>
              <p className="text-xs text-muted-foreground">Cases awaiting inspection</p>
              <Button className="mt-4 w-full" size="sm" onClick={() => navigate('/quality-control')}>
                Go to QC Queue
              </Button>
            </CardContent>
          </Card>
        )}

        {showFinance && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finance Today</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardStats.finance.paymentsToday)}</div>
              <p className="text-xs text-muted-foreground">Payments received</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <ArrowDownRight className="mr-2 h-4 w-4 text-red-600" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">Expenses</span>
                    <span className="text-sm font-medium text-red-600">{formatCurrency(dashboardStats.finance.expensesToday)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">Outstanding</span>
                    <span className="text-sm font-medium text-amber-600">{formatCurrency(dashboardStats.finance.outstandingBalance)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showInventory && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.inventory.lowStock}</div>
              <p className="text-xs text-muted-foreground">Items low in stock</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">Expiring Soon</span>
                    <span className="text-sm font-medium text-amber-600">{dashboardStats.inventory.expiringSoon}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {showVisits && (
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/visits/new')}>
                <Calendar className="mr-2 h-4 w-4" />
                New Visit
              </Button>
            )}
            {showCases && (
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/cases/new')}>
                <Briefcase className="mr-2 h-4 w-4" />
                New Case
              </Button>
            )}
            {showProduction && (
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/production')}>
                <Users className="mr-2 h-4 w-4" />
                My Work Board
              </Button>
            )}
            {showQC && (
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/quality-control')}>
                <CheckSquare className="mr-2 h-4 w-4" />
                QC Queue
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section — only shown when pref is enabled */}
      {prefs.showCharts && (
      <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visits Bar Chart */}
        {showVisits && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Monthly Visits Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyVisitsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="visits" fill="#3b82f6" name="Total Visits" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="labVisits" fill="#60a5fa" name="Lab Visits" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Revenue Area Chart */}
        {showFinance && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revenueGradient)" name="Revenue" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expenseGradient)" name="Expenses" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Weekly Production Bar Chart */}
        {showProduction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Weekly Production Output
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyProductionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Cases by Stage Pie Chart */}
        {showProduction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-600" />
                Cases by Production Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="60%" height={280}>
                  <PieChart>
                    <Pie
                      data={casesByStageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {casesByStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 flex-1">
                  {casesByStageData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="flex-1">{item.name}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Line Chart for Revenue Trend (full width) */}
      {showFinance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Revenue Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} name="Revenue" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      </>
      )}

      {/* Recent Activity */}
      {prefs.showRecentActivity && (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Case #CS-2024-00123 marked as Ready</p>
                <p className="text-sm text-muted-foreground">Just now • Patient: John Doe, Clinic: Dental Care</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-2">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">New visit scheduled for Dr. Smith</p>
                <p className="text-sm text-muted-foreground">15 minutes ago • Patient: Jane Smith</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-amber-100 p-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Material XYZ is low in stock</p>
                <p className="text-sm text-muted-foreground">1 hour ago • Current stock: 5 units, Min: 10 units</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-2">
                <CheckSquare className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">QC inspection passed for CAS-2024-044</p>
                <p className="text-sm text-muted-foreground">2 hours ago • Technician: Michael Chen</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
