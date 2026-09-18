import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
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

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newUser: SystemUser = {
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
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
