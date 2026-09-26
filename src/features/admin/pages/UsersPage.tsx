<<<<<<< HEAD
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
=======
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
<<<<<<< HEAD
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, usePagination } from '@/components/ui/pagination';
=======
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
<<<<<<< HEAD
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search, UserPlus, Edit, Trash2, Eye, Mail, User, CheckCircle, XCircle, Shield } from 'lucide-react';

interface ModulePerms { view: boolean; create: boolean; update: boolean; delete: boolean; }
type PermMap = Record<string, ModulePerms>;

const MODULES = ['Dashboard','Visits','Cases','Patients','Dentists','Clinics','Production','QC','Inventory','Invoices','Payments','Expenses','Reports','Users','Settings'];

const ALL_PERMS = (): ModulePerms => ({ view: true,  create: true,  update: true,  delete: true  });
const NO_PERMS  = (): ModulePerms => ({ view: false, create: false, update: false, delete: false });
const VIEW_ONLY = (): ModulePerms => ({ view: true,  create: false, update: false, delete: false });

const DEFAULT_ROLE_PERMS: Record<string, PermMap> = {
  ADMIN:        Object.fromEntries(MODULES.map(m => [m, ALL_PERMS()])),
  MANAGER:      Object.fromEntries(MODULES.map(m => [m, m === 'Users' || m === 'Settings' ? NO_PERMS() : ALL_PERMS()])),
  RECEPTIONIST: Object.fromEntries(MODULES.map(m => [m, ['Visits','Cases','Patients','Dentists','Clinics','Invoices'].includes(m) ? ALL_PERMS() : ['Dashboard'].includes(m) ? VIEW_ONLY() : NO_PERMS()])),
  TECHNICIAN:   Object.fromEntries(MODULES.map(m => [m, ['Production','Dashboard'].includes(m) ? VIEW_ONLY() : ['Cases'].includes(m) ? VIEW_ONLY() : NO_PERMS()])),
  QC:           Object.fromEntries(MODULES.map(m => [m, ['QC','Cases','Dashboard'].includes(m) ? ALL_PERMS() : NO_PERMS()])),
  ACCOUNTANT:   Object.fromEntries(MODULES.map(m => [m, ['Invoices','Payments','Expenses','Reports','Dashboard'].includes(m) ? ALL_PERMS() : NO_PERMS()])),
  STOREKEEPER:  Object.fromEntries(MODULES.map(m => [m, ['Inventory','Dashboard'].includes(m) ? ALL_PERMS() : NO_PERMS()])),
};

interface SystemUser { id: number; name: string; email: string; role: string; status: 'active'|'inactive'; lastLogin: string; permissions: PermMap; }

const roleConfig: Record<string, { color: string; label: string }> = {
  ADMIN:       { color: 'bg-purple-500', label: 'Admin' },
  MANAGER:     { color: 'bg-blue-500',   label: 'Manager' },
  TECHNICIAN:  { color: 'bg-amber-500',  label: 'Technician' },
  QC:          { color: 'bg-teal-500',   label: 'QC' },
  RECEPTIONIST:{ color: 'bg-green-500',  label: 'Receptionist' },
  ACCOUNTANT:  { color: 'bg-indigo-500', label: 'Accountant' },
  STOREKEEPER: { color: 'bg-pink-500',   label: 'Storekeeper' },
};

const INIT: SystemUser[] = [
  { id:1, name:'Ahmad Karimi',  email:'ahmad@dentallab.af',    role:'ADMIN',       status:'active',   lastLogin:'Now',         permissions: DEFAULT_ROLE_PERMS['ADMIN'] },
  { id:2, name:'Sara Rahimi',   email:'sara@dentallab.af',     role:'QC',          status:'active',   lastLogin:'1 day ago',   permissions: DEFAULT_ROLE_PERMS['QC'] },
  { id:3, name:'Khalid Noori',  email:'khalid@dentallab.af',   role:'TECHNICIAN',  status:'active',   lastLogin:'2 hours ago', permissions: DEFAULT_ROLE_PERMS['TECHNICIAN'] },
  { id:4, name:'Maryam Safi',   email:'maryam@dentallab.af',   role:'RECEPTIONIST',status:'inactive', lastLogin:'1 week ago',  permissions: DEFAULT_ROLE_PERMS['RECEPTIONIST'] },
];

const blankForm = { name:'', email:'', role:'TECHNICIAN', password:'' };

export default function UsersPage() {
  const [users,  setUsers]  = useState<SystemUser[]>(INIT);
  const [search, setSearch] = useState('');

  const [addOpen,  setAddOpen]  = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);
  const [delOpen,  setDelOpen]  = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<SystemUser | null>(null);

  const [form,     setForm]     = useState(blankForm);
  const [editForm, setEditForm] = useState(blankForm);
  const [permEdit, setPermEdit] = useState<PermMap>({});
  const [success,  setSuccess]  = useState('');
  const showMsg = (m: string) => { setSuccess(m); setTimeout(() => setSuccess(''), 2200); };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, search]);

  const { page, pageSize, paged, setPage, setPageSize } = usePagination(filtered, 10);

  const stats = [
    { label:'Total',       value: users.length },
    { label:'Active',      value: users.filter(u => u.status==='active').length },
    { label:'Admins',      value: users.filter(u => u.role==='ADMIN').length },
    { label:'Technicians', value: users.filter(u => u.role==='TECHNICIAN').length },
  ];
=======
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search, UserPlus, Shield, Mail, User, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const initialUsers: SystemUser[] = [
  { id: 1, name: 'Michael Chen', email: 'michael@dentallab.com', role: 'TECHNICIAN', status: 'active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@dentallab.com', role: 'QC', status: 'active', lastLogin: '1 day ago' },
  { id: 3, name: 'Admin User', email: 'admin@dentallab.com', role: 'ADMIN', status: 'active', lastLogin: 'Now' },
  { id: 4, name: 'Receptionist', email: 'reception@dentallab.com', role: 'RECEPTIONIST', status: 'inactive', lastLogin: '1 week ago' },
];

const roleConfig: Record<string, { color: string; label: string }> = {
  ADMIN: { color: 'bg-purple-500', label: 'Admin' },
  MANAGER: { color: 'bg-blue-500', label: 'Manager' },
  TECHNICIAN: { color: 'bg-amber-500', label: 'Technician' },
  QC: { color: 'bg-teal-500', label: 'QC' },
  RECEPTIONIST: { color: 'bg-green-500', label: 'Receptionist' },
  ACCOUNTANT: { color: 'bg-indigo-500', label: 'Accountant' },
  STOREKEEPER: { color: 'bg-pink-500', label: 'Storekeeper' },
};

const defaultForm = { name: '', email: '', role: 'TECHNICIAN', password: '' };

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState(defaultForm);
  const [inviteEmail, setInviteEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 2500); };

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newUser: SystemUser = {
<<<<<<< HEAD
      id: Date.now(), name: form.name, email: form.email, role: form.role,
      status: 'active', lastLogin: 'Never',
      permissions: JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMS[form.role] ?? DEFAULT_ROLE_PERMS['TECHNICIAN'])),
    };
    setUsers(u => [...u, newUser]);
    setForm(blankForm);
    setAddOpen(false);
    showMsg('User created!');
  };

  const openEdit = (u: SystemUser) => {
    setSelected(u);
    setEditForm({ name: u.name, email: u.email, role: u.role, password: '' });
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!selected) return;
    setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, name: editForm.name, email: editForm.email, role: editForm.role } : u));
    setEditOpen(false);
    showMsg('User updated!');
  };

  const openPerms = (u: SystemUser) => {
    setSelected(u);
    setPermEdit(JSON.parse(JSON.stringify(u.permissions)));
    setPermOpen(true);
  };

  const savePerms = () => {
    if (!selected) return;
    setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, permissions: permEdit } : u));
    setPermOpen(false);
    showMsg('Permissions saved!');
  };

  const togglePerm = (module: string, action: keyof ModulePerms) => {
    setPermEdit(p => ({
      ...p,
      [module]: { ...p[module], [action]: !p[module][action] },
    }));
  };

  const toggleAll = (module: string, on: boolean) => {
    setPermEdit(p => ({
      ...p,
      [module]: { view: on, create: on, update: on, delete: on },
    }));
  };

  const toggleStatus = (u: SystemUser) => {
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
  };

  const handleDelete = () => {
    if (selected) setUsers(prev => prev.filter(u => u.id !== selected.id));
    setDelOpen(false); setSelected(null);
  };

  const getRoleBadge = (role: string) => {
    const cfg = roleConfig[role] || { color:'bg-gray-500', label: role };
    return <Badge className={`${cfg.color} text-white text-[10px]`}>{cfg.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />{success}
=======
      id: users.length + 1, name: form.name, email: form.email,
      role: form.role, status: 'active', lastLogin: 'Never',
    };
    setUsers([...users, newUser]);
    setForm(defaultForm);
    setAddOpen(false);
    showSuccess('User created successfully!');
  };

  const handleEdit = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name: editForm.name, email: editForm.email, role: editForm.role } : u));
    setEditOpen(false);
    showSuccess('User updated!');
  };

  const toggleStatus = (user: SystemUser) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    showSuccess(`User ${user.status === 'active' ? 'deactivated' : 'activated'}!`);
  };

  const getRoleBadge = (role: string) => {
    const cfg = roleConfig[role] || { color: 'bg-gray-500', label: role };
    return <Badge className={`${cfg.color} text-white`}>{cfg.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-500 text-white"><CheckCircle className="mr-1 h-3 w-3" />Active</Badge>;
    return <Badge className="bg-gray-500 text-white"><XCircle className="mr-1 h-3 w-3" />Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />{successMsg}
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
<<<<<<< HEAD
          <h1 className="text-xl font-bold">User Management</h1>
          <p className="text-xs text-muted-foreground">Manage system users and permissions</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="py-3 px-4">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input className="h-8 pl-7 text-xs" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="py-3 px-4"><CardTitle className="text-sm">System Users</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">User</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Last Login</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-xs py-8 text-muted-foreground">No users found</TableCell></TableRow>
              )}
              {paged.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs"><Mail className="h-3 w-3 text-muted-foreground" />{u.email}</div>
                  </TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>
                    {u.status === 'active'
                      ? <Badge className="bg-green-500 text-white text-[10px]"><CheckCircle className="mr-1 h-3 w-3" />Active</Badge>
                      : <Badge className="bg-gray-400 text-white text-[10px]"><XCircle className="mr-1 h-3 w-3" />Inactive</Badge>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View" onClick={() => { setSelected(u); setViewOpen(true); }}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => openEdit(u)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Permissions" onClick={() => openPerms(u)}><Shield className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" title="Delete" onClick={() => { setSelected(u); setDelOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination total={filtered.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </CardContent>
      </Card>

      {/* ── Add User ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-base">Add New User</DialogTitle>
            <DialogDescription className="text-xs">* required. Permissions auto-set from role and can be adjusted after.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1"><Label className="text-xs">Full Name *</Label><Input className="h-8 text-xs" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
            <div className="space-y-1"><Label className="text-xs">Email *</Label><Input className="h-8 text-xs" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@dentallab.af" /></div>
            <div className="space-y-1">
              <Label className="text-xs">Role *</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(roleConfig).map(([r, c]) => <SelectItem key={r} value={r} className="text-xs">{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Password</Label><Input className="h-8 text-xs" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={!form.name || !form.email}><UserPlus className="mr-1.5 h-3.5 w-3.5" />Create</Button>
=======
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
        <Button onClick={() => setAddOpen(true)}><UserPlus className="mr-2 h-4 w-4" />Add User</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader><CardTitle>System Users</CardTitle><CardDescription>Manage user accounts and access permissions</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users by name or email..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No users found</TableCell></TableRow>
                  )}
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" /><span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell><span className="text-sm text-muted-foreground">{user.lastLogin}</span></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setEditForm({ name: user.name, email: user.email, role: user.role, password: '' }); setEditOpen(true); }}>Edit User</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => showSuccess(`Password reset email sent to ${user.email}`)}>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem>View Activity</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleStatus(user)} className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}>
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {users.filter(u => u.status === 'active').map(u => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-3 w-3 text-primary" /></div>
                      <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.lastLogin}</p></div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>User Activity</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.role}</p></div>
                    <span className="text-xs text-muted-foreground">{u.lastLogin}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">User Statistics</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm font-medium">Total</p><p className="text-2xl font-bold">{users.length}</p></div>
                <div><p className="text-sm font-medium">Active</p><p className="text-2xl font-bold text-green-500">{users.filter(u => u.status === 'active').length}</p></div>
                <div><p className="text-sm font-medium">Admins</p><p className="text-2xl font-bold text-purple-500">{users.filter(u => u.role === 'ADMIN').length}</p></div>
                <div><p className="text-sm font-medium">Technicians</p><p className="text-2xl font-bold text-amber-500">{users.filter(u => u.role === 'TECHNICIAN').length}</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setAddOpen(true)}><UserPlus className="mr-2 h-4 w-4" />Create New User</Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setRolesOpen(true)}><Shield className="mr-2 h-4 w-4" />Manage Roles</Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setInviteOpen(true)}><Mail className="mr-2 h-4 w-4" />Send Invitation</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Add New User</DialogTitle><DialogDescription>Create a new system user account. * required.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Full Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></div>
              <div className="space-y-2 col-span-2"><Label>Email Address *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@dentallab.com" /></div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([role, cfg]) => <SelectItem key={role} value={role}>{cfg.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Temporary Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.email}><UserPlus className="mr-2 h-4 w-4" />Create User</Button>
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
          </DialogFooter>
        </DialogContent>
      </Dialog>

<<<<<<< HEAD
      {/* ── Edit User ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[380px]">
          {selected && (
            <>
              <DialogHeader><DialogTitle className="text-base">Edit User</DialogTitle><DialogDescription className="text-xs">{selected.name}</DialogDescription></DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="space-y-1"><Label className="text-xs">Name</Label><Input className="h-8 text-xs" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Email</Label><Input className="h-8 text-xs" type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <Select value={editForm.role} onValueChange={v => setEditForm(f => ({ ...f, role: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(roleConfig).map(([r, c]) => <SelectItem key={r} value={r} className="text-xs">{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Checkbox id="toggleStatus" checked={selected.status==='active'} onCheckedChange={(_v: boolean | 'indeterminate') => { toggleStatus(selected); setSelected(s => s ? { ...s, status: s.status==='active'?'inactive':'active' } : s); }} />
                  <label htmlFor="toggleStatus">Active</label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleEdit}>Save</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Permissions ── */}
      <Dialog open={permOpen} onOpenChange={setPermOpen}>
        <DialogContent className="sm:max-w-[640px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Module Permissions — {selected.name}</DialogTitle>
                <DialogDescription className="text-xs">Check which actions this user can perform per module.</DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto max-h-[55vh]">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1.5 px-2 font-medium">Module</th>
                      <th className="text-center py-1.5 w-16">All</th>
                      {(['view','create','update','delete'] as const).map(a => (
                        <th key={a} className="text-center py-1.5 w-16 capitalize">{a}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map(mod => {
                      const p = permEdit[mod] ?? { view:false, create:false, update:false, delete:false };
                      const allOn = p.view && p.create && p.update && p.delete;
                      return (
                        <tr key={mod} className="border-b hover:bg-muted/30">
                          <td className="py-1.5 px-2 font-medium">{mod}</td>
                          <td className="text-center py-1.5">
                            <Checkbox checked={allOn} onCheckedChange={v => toggleAll(mod, !!v)} />
                          </td>
                          {(['view','create','update','delete'] as const).map(action => (
                            <td key={action} className="text-center py-1.5">
                              <Checkbox checked={p[action]} onCheckedChange={() => togglePerm(mod, action)} />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <DialogFooter className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setPermOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={savePerms}><Shield className="mr-1.5 h-3.5 w-3.5" />Save Permissions</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── View ── */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[360px]">
          {selected && (
            <>
              <DialogHeader><DialogTitle className="text-base">{selected.name}</DialogTitle><DialogDescription className="text-xs">{selected.email}</DialogDescription></DialogHeader>
              <div className="space-y-2 text-xs py-2">
                <div className="flex items-center gap-2">{getRoleBadge(selected.role)}{selected.status==='active' ? <Badge className="bg-green-500 text-white text-[10px]">Active</Badge> : <Badge className="bg-gray-400 text-white text-[10px]">Inactive</Badge>}</div>
                <div><span className="text-muted-foreground">Last Login: </span>{selected.lastLogin}</div>
                <div><span className="text-muted-foreground">Modules with View access: </span>{MODULES.filter(m => selected.permissions[m]?.view).join(', ') || 'None'}</div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setViewOpen(false)}>Close</Button>
                <Button size="sm" onClick={() => { setViewOpen(false); openPerms(selected); }}><Shield className="mr-1.5 h-3.5 w-3.5" />Permissions</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete ── */}
      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader><DialogTitle className="text-base">Delete User</DialogTitle><DialogDescription className="text-xs">Delete {selected?.name}? Cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDelOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete</Button>
=======
      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[450px]">
          {selectedUser && (
            <>
              <DialogHeader><DialogTitle>Edit User</DialogTitle><DialogDescription>Update account for {selectedUser.name}</DialogDescription></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={editForm.role} onValueChange={v => setEditForm({ ...editForm, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([role, cfg]) => <SelectItem key={role} value={role}>{cfg.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button onClick={handleEdit}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Roles Dialog */}
      <Dialog open={rolesOpen} onOpenChange={setRolesOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Role Permissions</DialogTitle><DialogDescription>Overview of each role's access level</DialogDescription></DialogHeader>
          <div className="py-4 space-y-3">
            {Object.entries(roleConfig).map(([role, cfg]) => {
              const perms: Record<string, string> = {
                ADMIN: 'Full system access — all modules, all actions',
                MANAGER: 'All modules, limited admin controls',
                RECEPTIONIST: 'Visits, Patients, Cases (read), Invoices',
                TECHNICIAN: 'Production Board, Cases (assigned)',
                QC: 'Quality Control, Cases (read)',
                ACCOUNTANT: 'Finance, Payments, Invoices, Reports',
                STOREKEEPER: 'Inventory management',
              };
              return (
                <div key={role} className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2"><Badge className={`${cfg.color} text-white`}>{cfg.label}</Badge></div>
                    <p className="text-sm text-muted-foreground mt-1">{perms[role]}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{users.filter(u => u.role === role).length} users</span>
                </div>
              );
            })}
          </div>
          <DialogFooter><Button onClick={() => setRolesOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Send Invitation</DialogTitle><DialogDescription>Invite a new user to the system</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Email Address</Label><Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="newuser@example.com" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => { showSuccess(`Invitation sent to ${inviteEmail}!`); setInviteEmail(''); setInviteOpen(false); }} disabled={!inviteEmail}>
              <Mail className="mr-2 h-4 w-4" />Send Invitation
            </Button>
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
