import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Role } from '@/types/auth';
import { readSidebarPref } from '@/lib/usePreferences';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Stethoscope,
  Building,
  Workflow,
  CheckSquare,
  Package,
  Receipt,
  DollarSign,
  FileText,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Activity as ToothIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: [
      Role.ADMIN,
      Role.MANAGER,
      Role.RECEPTIONIST,
      Role.TECHNICIAN,
      Role.QC,
      Role.ACCOUNTANT,
      Role.STOREKEEPER,
    ],
  },
  {
    title: 'Visits',
    href: '/visits',
    icon: Calendar,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST],
  },
  {
    title: 'Cases',
    href: '/cases',
    icon: Briefcase,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.QC],
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: Users,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST],
  },
  {
    title: 'Dentists',
    href: '/dentists',
    icon: Stethoscope,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST],
  },
  {
    title: 'Clinics',
    href: '/clinics',
    icon: Building,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST],
  },
  {
    title: 'Production',
    href: '/production',
    icon: Workflow,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.TECHNICIAN],
  },
  {
    title: 'QC',
    href: '/qc',
    icon: CheckSquare,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.QC],
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.STOREKEEPER],
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: Receipt,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.ACCOUNTANT],
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: DollarSign,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT],
  },
  {
    title: 'Expenses',
    href: '/expenses',
    icon: DollarSign,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: UserCog,
    allowedRoles: [Role.ADMIN],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    allowedRoles: [Role.ADMIN],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => readSidebarPref());
  const { user } = useAuth();

  // Filter nav items based on user roles
  const visibleNavItems = navItems.filter((item) => {
    if (!user) return false;
    return item.allowedRoles.some((role) => user.roles.includes(role));
  });

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-background transition-all duration-300 h-screen sticky top-0 shrink-0 overflow-y-auto',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
            <ToothIcon className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-semibold">Dental Lab</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                    isActive ? 'bg-accent font-medium' : 'text-muted-foreground',
                    collapsed ? 'justify-center' : ''
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
