import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Moon, Sun, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
<<<<<<< HEAD
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useI18n, LANG_LABELS, Lang } from '@/lib/I18nContext';
=======
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Role } from '@/types/auth';
import { formatDate } from '@/lib/utils';
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2

export function TopBar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
<<<<<<< HEAD
  const { lang, setLang } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const initialNotifications = [
    { id: 1, title: 'Case #CS-2024-00123 is due today', time: '2 hours ago' },
    { id: 2, title: 'New visit scheduled for Dr. Ahmad', time: '4 hours ago' },
    { id: 3, title: 'Material XYZ is low in stock',     time: '1 day ago'   },
  ];
  const [notifications, setNotifications] = useState(initialNotifications);

  const clearAll = () => setNotifications([]);
  const dismiss  = (id: number) => setNotifications(n => n.filter(x => x.id !== id));

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-50 flex h-11 items-center gap-3 border-b bg-background px-4">
      {/* Search */}
      <form className="flex-1" onSubmit={e => e.preventDefault()}>
        <div className="relative max-w-xs">
          <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search…"
            className="h-7 pl-7 text-xs"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="flex items-center gap-1">
        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
              {LANG_LABELS[lang]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuLabel className="text-xs">Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.entries(LANG_LABELS) as [Lang, string][]).map(([code, label]) => (
              <DropdownMenuItem
                key={code}
                onClick={() => setLang(code)}
                className={`text-xs ${lang === code ? 'font-semibold' : ''}`}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

=======
  const [searchQuery, setSearchQuery] = useState('');

  const initialNotifications = [
    { id: 1, title: 'Case #CS-2024-00123 is due today',        time: '2 hours ago' },
    { id: 2, title: 'New visit scheduled for Dr. Smith',        time: '4 hours ago' },
    { id: 3, title: 'Material XYZ is low in stock',             time: '1 day ago'   },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const clearAll = () => setNotifications([]);
  const dismiss  = (id: number) => setNotifications(n => n.filter(item => item.id !== id));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or perform search
      console.log('Searching for:', searchQuery);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case Role.MANAGER:
        return 'bg-blue-100 text-blue-800';
      case Role.RECEPTIONIST:
        return 'bg-green-100 text-green-800';
      case Role.TECHNICIAN:
        return 'bg-amber-100 text-amber-800';
      case Role.QC:
        return 'bg-cyan-100 text-cyan-800';
      case Role.ACCOUNTANT:
        return 'bg-indigo-100 text-indigo-800';
      case Role.STOREKEEPER:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search visits, cases, patients, dentists..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </form>

      <div className="flex items-center gap-4">
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
<<<<<<< HEAD
          className="h-7 w-7"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light'
            ? <Moon className="h-3.5 w-3.5" />
            : <Sun className="h-3.5 w-3.5" />}
=======
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
<<<<<<< HEAD
            <Button variant="ghost" size="icon" className="h-7 w-7 relative">
              <Bell className="h-3.5 w-3.5" />
              {notifications.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
=======
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
<<<<<<< HEAD
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0 text-xs">Notifications</DropdownMenuLabel>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-accent"
                >
                  <Trash2 className="h-3 w-3" /> Clear all
=======
          <DropdownMenuContent align="end" className="w-80">
            {/* Header row */}
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear all
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
<<<<<<< HEAD
            {notifications.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">No notifications</div>
            ) : notifications.map(n => (
              <DropdownMenuItem
                key={n.id}
                className="group flex items-start justify-between gap-2 pr-2 cursor-pointer"
                onSelect={e => e.preventDefault()}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground">{n.time}</p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="mt-0.5 shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </DropdownMenuItem>
            ))}
=======

            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map(n => (
                <DropdownMenuItem
                  key={n.id}
                  className="cursor-pointer group flex items-start justify-between gap-2 pr-2"
                  onSelect={e => e.preventDefault()}
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    title="Dismiss"
                    className="mt-0.5 shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-accent transition-opacity text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuItem>
              ))
            )}
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
<<<<<<< HEAD
            <Button variant="ghost" className="h-7 gap-1.5 px-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <User className="h-3.5 w-3.5 text-blue-600" />
              </div>
              {user && (
                <span className="hidden text-xs sm:block">
                  {user.firstName} {user.lastName}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs" onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-xs" onClick={() => navigate('/preferences')}>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
=======
            <Button variant="ghost" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              {user && (
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/preferences')}>
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user && (
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground mb-2">Roles:</p>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeColor(role)}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
                {user.lastLoginAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last login: {formatDate(user.lastLoginAt, 'short')}
                  </p>
                )}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
>>>>>>> 9d2aa396b742487e9588dd6fe04ae1ce95a81ac2
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
