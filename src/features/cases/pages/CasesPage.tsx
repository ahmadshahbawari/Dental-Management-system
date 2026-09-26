import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, usePagination } from '@/components/ui/pagination';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, Filter, ChevronRight, Calendar, User, Briefcase } from 'lucide-react';
import { Case } from '@/types/cases';
import { getCases } from '@/lib/api';
import { Link } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { NewCaseDialog } from '@/features/cases/components/NewCaseDialog';

const STATUS_OPTIONS = [
  { value: 'all',                label: 'All Status' },
  { value: 'pending',            label: 'Pending' },
  { value: 'in_progress',        label: 'In Progress' },
  { value: 'ready_for_delivery', label: 'Ready for Delivery' },
  { value: 'delivered',          label: 'Delivered' },
  { value: 'cancelled',          label: 'Cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  pending:             'bg-yellow-500',
  in_progress:         'bg-blue-500',
  ready_for_delivery:  'bg-green-500',
  delivered:           'bg-purple-500',
  cancelled:           'bg-red-500',
};

export default function CasesPage() {
  const [cases, setCases]           = useState<Case[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  useEffect(() => { fetchCases(); }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await getCases();
      setCases(data);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => cases.filter(c => {
    const q = search.toLowerCase();
    const ms = c.patientName.toLowerCase().includes(q) ||
               c.caseNumber.toLowerCase().includes(q) ||
               c.dentistName.toLowerCase().includes(q);
    const mst = statusFilter === 'all' || c.status === statusFilter;
    return ms && mst;
  }), [cases, search, statusFilter]);

  const { page, pageSize, paged, setPage, setPageSize } = usePagination(filtered, 10);

  const getStatusBadge = (status: string) => {
    const label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <Badge className={`${STATUS_COLORS[status] ?? 'bg-gray-500'} text-white text-[10px]`}>
        {label}
      </Badge>
    );
  };

  const isOverdue = (due: string) => new Date(due) < new Date();

  if (loading) return <LoadingScreen />;

  /* ── Stats ── */
  const stats = [
    { label: 'Total',             value: cases.length,                                      color: '' },
    { label: 'In Progress',       value: cases.filter(c => c.status === 'in_progress').length, color: 'text-blue-600' },
    { label: 'Ready for Delivery',value: cases.filter(c => c.status === 'ready_for_delivery').length, color: 'text-green-600' },
    { label: 'Overdue',           value: cases.filter(c => isOverdue(c.dueDate)).length,    color: 'text-red-600' },
  ];

  const activeLabel = STATUS_OPTIONS.find(o => o.value === statusFilter)?.label ?? 'All Status';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Cases</h1>
          <p className="text-xs text-muted-foreground">Manage dental laboratory cases and workflows</p>
        </div>
        <Button size="sm" onClick={() => setNewCaseOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New Case
          </Button>
      </div>

      {/* Stats — directly below title */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="py-3 px-4">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="h-8 pl-7 text-xs"
            placeholder="Search by patient, case number or dentist…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Dropdown filter — replaces raw <select> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Filter className="h-3 w-3" />
              {activeLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-xs">
            {STATUS_OPTIONS.map(opt => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                className={statusFilter === opt.value ? 'font-semibold' : ''}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">
            Case Records
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Case #</TableHead>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Dentist</TableHead>
                <TableHead className="text-xs">Received</TableHead>
                <TableHead className="text-xs">Due Date</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-8">
                    No cases found
                  </TableCell>
                </TableRow>
              ) : paged.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {c.caseNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {c.patientName}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{c.dentistName}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {new Date(c.dateReceived).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className={isOverdue(c.dueDate) ? 'text-red-600 font-semibold' : ''}>
                      {new Date(c.dueDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(c.status)}</TableCell>
                  {/* Inline action — single View button instead of 3-dots */}
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2" asChild>
                      <Link to={`/cases/${c.id}`}>
                        View <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            total={filtered.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>

      <NewCaseDialog open={newCaseOpen} onOpenChange={setNewCaseOpen} onCreated={fetchCases} />
    </div>
  );
}
