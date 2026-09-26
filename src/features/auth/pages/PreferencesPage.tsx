import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/theme-provider';
import { usePreferences } from '@/lib/usePreferences';
import {
  Sun, Moon, Monitor, Bell, Layout, Globe, Save,
  CheckCircle, Languages, SlidersHorizontal,
} from 'lucide-react';

// ─── Toggle lives OUTSIDE the page component so React never remounts it ───
interface ToggleProps {
  id: string;
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}
function Toggle({ id, label, description, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5 flex-1">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch id={id} checked={value} onCheckedChange={onChange} />
    </div>
  );
}

// Language name map used in the preview pill
const LANG_NAMES: Record<string, string> = {
  en: 'English',
  fa: 'دری (Dari)',
  ps: 'پښتو (Pashto)',
  ar: 'العربية (Arabic)',
  fr: 'Français',
  de: 'Deutsch',
};

// Languages that need RTL layout
const RTL_LANGS = new Set(['fa', 'ps', 'ar']);

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const { prefs, update } = usePreferences();
  const [saved, setSaved] = useState(false);

  /* ── Helpers that both update prefs AND apply the effect immediately ── */

  const handleTheme = (t: 'light' | 'dark' | 'system') => {
    update('theme', t);   // persist to localStorage via hook
    setTheme(t);          // apply to DOM via ThemeProvider
  };

  const handleLanguage = (lang: string) => {
    update('language', lang);
    // Apply dir attribute so RTL languages render correctly
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';
  };

  const handleCompactMode = (on: boolean) => {
    update('compactMode', on);
    // Toggle a CSS class on <body> — components can target .compact-mode
    document.body.classList.toggle('compact-mode', on);
  };

  const handleSave = () => {
    // Everything is already persisted on each change via the hook.
    // This is a final "confirm" action that also shows the toast.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Keep the active theme indicator in sync with ThemeProvider (top-bar toggle
  // also changes the theme, so we read from useTheme() as the source of truth).
  const activeTheme = theme;

  return (
    <div className="space-y-6 max-w-3xl">
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" /> Preferences saved!
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
        <p className="text-muted-foreground">Customise how the application looks and behaves for you.</p>
      </div>

      {/* ──────────── Appearance ──────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" /> Appearance
          </CardTitle>
          <CardDescription>Theme, layout density and sidebar defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Theme — reads activeTheme which comes from ThemeProvider */}
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { key: 'light',  icon: <Sun  className="h-6 w-6 text-amber-500" />,         label: 'Light'  },
                { key: 'dark',   icon: <Moon className="h-6 w-6 text-indigo-400" />,        label: 'Dark'   },
                { key: 'system', icon: <Monitor className="h-6 w-6 text-muted-foreground" />, label: 'System' },
              ] as const).map(({ key, icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTheme(key)}
                  className={[
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all',
                    activeTheme === key
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/40 hover:bg-accent/50',
                  ].join(' ')}
                >
                  {icon}
                  <span className="text-sm font-medium">{label}</span>
                  {activeTheme === key && (
                    <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                      <CheckCircle className="h-3 w-3" /> Active
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Changes apply instantly — no save needed.
            </p>
          </div>

          <Separator />

          <Toggle
            id="compactMode"
            label="Compact Mode"
            description="Reduce padding and font sizes for a denser layout."
            value={prefs.compactMode}
            onChange={handleCompactMode}
          />

          <Toggle
            id="sidebarCollapsed"
            label="Collapse Sidebar by Default"
            description="Start with the sidebar in its icon-only (collapsed) state on next load."
            value={prefs.sidebarCollapsed}
            onChange={v => update('sidebarCollapsed', v)}
          />
        </CardContent>
      </Card>

      {/* ──────────── Notifications ──────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </CardTitle>
          <CardDescription>Choose which in-app alerts you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            id="desktopNotifications"
            label="Desktop Notifications"
            description="Show browser notifications when the tab is in the background."
            value={prefs.desktopNotifications}
            onChange={v => {
              update('desktopNotifications', v);
              // Actually request browser permission when user enables this
              if (v && 'Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
              }
            }}
          />
          <Separator />
          <Toggle
            id="soundAlerts"
            label="Sound Alerts"
            description="Play a sound when important notifications arrive."
            value={prefs.soundAlerts}
            onChange={v => update('soundAlerts', v)}
          />
          <Separator />
          <Toggle
            id="caseAlerts"
            label="Case Status Alerts"
            description="Notify me when a case status changes or is overdue."
            value={prefs.caseAlerts}
            onChange={v => update('caseAlerts', v)}
          />
          <Separator />
          <Toggle
            id="inventoryAlerts"
            label="Inventory Low-Stock Alerts"
            description="Notify me when an item falls below its minimum level."
            value={prefs.inventoryAlerts}
            onChange={v => update('inventoryAlerts', v)}
          />
          <Separator />
          <Toggle
            id="paymentAlerts"
            label="Payment &amp; Invoice Alerts"
            description="Notify me about overdue invoices and received payments."
            value={prefs.paymentAlerts}
            onChange={v => update('paymentAlerts', v)}
          />
        </CardContent>
      </Card>

      {/* ──────────── Dashboard ──────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" /> Dashboard
          </CardTitle>
          <CardDescription>Control what appears on your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            id="showCharts"
            label="Show Charts"
            description="Display bar, line and pie charts on the dashboard."
            value={prefs.showCharts}
            onChange={v => update('showCharts', v)}
          />
          <Separator />
          <Toggle
            id="showRecentActivity"
            label="Show Recent Activity"
            description="Display the recent-activity feed at the bottom of the dashboard."
            value={prefs.showRecentActivity}
            onChange={v => update('showRecentActivity', v)}
          />
          <Separator />
          <div className="space-y-2">
            <Label>Default Dashboard View</Label>
            <div className="flex gap-3">
              {([
                { key: 'all',     label: 'All Modules'  },
                { key: 'my-work', label: 'My Work Only' },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update('defaultDashboardView', key)}
                  className={[
                    'flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-all',
                    prefs.defaultDashboardView === key
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ──────────── Language & Region ──────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" /> Language &amp; Region
          </CardTitle>
          <CardDescription>
            Set your preferred language, date format and clock format.
            Language changes apply immediately to page direction (RTL/LTR).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-1">
              <Languages className="h-4 w-4" /> Language
            </Label>
            <div className="flex items-center gap-3">
              <select
                id="language"
                className="flex-1 border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={prefs.language}
                onChange={e => handleLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="fa">دری (Dari)</option>
                <option value="ps">پښتو (Pashto)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              {/* Live preview pill */}
              <span className={[
                'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
                RTL_LANGS.has(prefs.language)
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800',
              ].join(' ')}>
                {RTL_LANGS.has(prefs.language) ? '← RTL' : 'LTR →'}&nbsp;
                {LANG_NAMES[prefs.language] ?? prefs.language}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              RTL languages (Dari, Pashto, Arabic) flip the layout direction instantly.
            </p>
          </div>

          <Separator />

          {/* Date format */}
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <div className="flex items-center gap-3">
              <select
                id="dateFormat"
                className="flex-1 border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={prefs.dateFormat}
                onChange={e => update('dateFormat', e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD MMM YYYY">DD MMM YYYY</option>
              </select>
              {/* Preview of today's date in the selected format */}
              <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-mono text-muted-foreground">
                {formatPreviewDate(prefs.dateFormat)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Time format */}
          <div className="space-y-2">
            <Label>Time Format</Label>
            <div className="flex gap-3">
              {([
                { key: '12h', label: '12-hour (1:30 PM)' },
                { key: '24h', label: '24-hour (13:30)'   },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update('timeFormat', key)}
                  className={[
                    'flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-all',
                    prefs.timeFormat === key
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ──────────── Save ──────────── */}
      <div className="pb-8">
        <Button
          onClick={handleSave}
          size="lg"
          className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {saved
            ? <><CheckCircle className="mr-2 h-4 w-4" />All preferences saved!</>
            : <><Save className="mr-2 h-4 w-4" />Save Preferences</>}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Most changes apply immediately. Click Save to confirm and persist across sessions.
        </p>
      </div>
    </div>
  );
}

/** Return today formatted according to the given pattern string */
function formatPreviewDate(fmt: string): string {
  const d   = new Date();
  const dd  = String(d.getDate()).padStart(2, '0');
  const mm  = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return fmt
    .replace('DD',  dd)
    .replace('MM',  mm)
    .replace('YYYY', yyyy)
    .replace('MMM', months[d.getMonth()]);
}
