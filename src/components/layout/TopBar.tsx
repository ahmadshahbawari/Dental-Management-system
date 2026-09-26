import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Moon, Sun, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useI18n, LANG_LABELS, Lang } from '@/lib/I18nContext';

export function TopBar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
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

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light'
            ? <Moon className="h-3.5 w-3.5" />
            : <Sun className="h-3.5 w-3.5" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 relative">
              <Bell className="h-3.5 w-3.5" />
              {notifications.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0 text-xs">Notifications</DropdownMenuLabel>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-accent"
                >
                  <Trash2 className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
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
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
