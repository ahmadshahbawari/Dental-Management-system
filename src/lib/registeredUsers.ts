/**
 * Registered users store — shared between LoginPage (validation)
 * and UsersPage (CRUD). Persisted in localStorage.
 */

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  username: string;   // login username
  password: string;   // plain text for demo; never do this in production
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions?: Record<string, { view: boolean; create: boolean; update: boolean; delete: boolean }>;
}

const STORE_KEY = 'dental_lab_registered_users';

const DEFAULT_USERS: RegisteredUser[] = [
  { id: 1, name: 'Ahmad Karimi',  username: 'admin',       password: 'admin123',   email: 'ahmad@dentallab.af',    role: 'ADMIN',        status: 'active',   lastLogin: 'Now' },
  { id: 2, name: 'Sara Rahimi',   username: 'sara',        password: 'sara123',    email: 'sara@dentallab.af',     role: 'QC',           status: 'active',   lastLogin: '1 day ago' },
  { id: 3, name: 'Khalid Noori',  username: 'khalid',      password: 'khalid123',  email: 'khalid@dentallab.af',   role: 'TECHNICIAN',   status: 'active',   lastLogin: '2 hours ago' },
  { id: 4, name: 'Maryam Safi',   username: 'maryam',      password: 'maryam123',  email: 'maryam@dentallab.af',   role: 'RECEPTIONIST', status: 'inactive', lastLogin: '1 week ago' },
];

export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as RegisteredUser[];
  } catch { /* ignore */ }
  // First run — seed defaults
  localStorage.setItem(STORE_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(users));
}

export function validateLogin(username: string, password: string): RegisteredUser | null {
  const users = getRegisteredUsers();
  const user  = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  if (!user) return null;
  if (user.status === 'inactive') return null; // blocked
  return user;
}
