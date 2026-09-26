import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Role } from '@/types/auth';
import { readSidebarPref } from '@/lib/usePreferences';
import { useI18n } from '@/lib/I18nContext';
import {
  LayoutDashboard, Calendar, Briefcase, Users, Stethoscope, Building,
  Workflow, CheckSquare, Package, Receipt, DollarSign, FileText,
  Settings, UserCog, ChevronLeft, ChevronRight, Activity as ToothIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { key: 'dashboard',  href: '/dashboard',     icon: LayoutDashboard, roles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.TECHNICIAN, Role.QC, Role.ACCOUNTANT, Role.STOREKEEPER] },
  { key: 'visits',     href: '/visits',         icon: Calendar,        roles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST] },
  { key: 'cases',      href: '/cases',          icon: Briefcase,       roles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.QC] },
  { key: 'patients',   href: '/patients',       icon: Users,           roles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST] },
  { key: 'dentists',   href: '/dentists',       icon: Stethoscope,     roles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST] },
  { key: 'clinics',    href: '/clinics',        icon: Building,        roles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST] },
  { key: 'production', href: '/production',     icon: Workflow,        roles: [Role.ADMIN, Role.MANAGER, Role.TECHNICIAN] },
  { key: 'qc',         href: '/qc',             icon: CheckSquare,     roles: [Role.ADMIN, Role.MANAGER, Role.QC] },
  { key: 'inventory',  href: '/inventory',      icon: Package,         roles: [Role.ADMIN, Role.MANAGER, Role.STOREKEEPER] },
  { key: 'invoices',   href: '/invoices',       icon: Receipt,         roles: [Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.ACCOUNTANT] },
  { key: 'payments',   href: '/payments',       icon: DollarSign,      roles: [Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT] },
  { key: 'expenses',   href: '/expenses',       icon: DollarSign,      roles: [Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT] },
  { key: 'reports',    href: '/reports',        icon: FileText,        roles: [Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT] },
  { key: 'users',      href: '/admin/users',    icon: UserCog,         roles: [Role.ADMIN] },
  { key: 'settings',   href: '/admin/settings', icon: Settings,        roles: [Role.ADMIN] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => readSidebarPref());
  const { user } = useAuth();
  const { t } = useI18n();

  const visible = navItems.filter(item =>
    user && item.roles.some(r => user.roles.includes(r))
  );

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-background transition-all duration-200 h-screen sticky top-0 shrink-0 overflow-y-auto',
        collapsed ? 'w-12' : 'w-48'
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-12 items-center border-b', collapsed ? 'justify-center px-0' : 'px-3 gap-2')}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600">
          <ToothIcon className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight truncate">Dental Lab</p>
            <p className="text-[10px] text-muted-foreground leading-tight truncate">Management</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-1.5">
        <nav className="flex flex-col gap-0.5 px-1.5">
          {visible.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                title={collapsed ? t(item.key) : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground',
                    collapsed && 'justify-center px-0'
                  )
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {!collapsed && <span className="truncate">{t(item.key)}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Collapse toggle */}
      <div className="border-t p-1.5 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed(c => !c)}
        >
          {collapsed
            ? <ChevronRight className="h-3.5 w-3.5" />
            : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </aside>
  );
}
