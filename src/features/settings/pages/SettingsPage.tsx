import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, Shield, Bell, Database, Globe, Palette, Users, FileText, CheckCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const STORAGE_KEY = 'dental_lab_settings';

interface Settings {
  general: {
    labName: string;
    email: string;
    phone: string;
    address: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    caseStatusUpdates: boolean;
    paymentReminders: boolean;
    inventoryAlerts: boolean;
    monthlyReports: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    passwordExpireDays: number;
  };
}

const defaultSettings: Settings = {
  general: {
    labName: 'Modern Dental Laboratory',
    email: 'info@dentallab.com',
    phone: '+1 (555) 123-4567',
    address: '123 Dental Avenue, Suite 100, New York, NY 10001',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    caseStatusUpdates: true,
    paymentReminders: true,
    inventoryAlerts: true,
    monthlyReports: true,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordExpireDays: 90,
  },
};

const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return defaultSettings;
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [savedTab, setSavedTab] = useState<string | null>(null);
  const [unsaved, setUnsaved] = useState<Record<string, boolean>>({});

  const markUnsaved = (tab: string) => setUnsaved(u => ({ ...u, [tab]: true }));

  const saveTab = (tab: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedTab(tab);
    setUnsaved(u => ({ ...u, [tab]: false }));
    setTimeout(() => setSavedTab(null), 2500);
  };

  const updateGeneral = (key: string, value: string) => {
    setSettings(s => ({ ...s, general: { ...s.general, [key]: value } }));
    markUnsaved('general');
  };

  const updateNotification = (key: string, value: boolean) => {
    setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
    markUnsaved('notifications');
  };

  const updateSecurity = (key: string, value: boolean | number) => {
    setSettings(s => ({ ...s, security: { ...s.security, [key]: value } }));
    markUnsaved('security');
  };

  useEffect(() => {
    if (savedTab) {
      const timer = setTimeout(() => setSavedTab(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [savedTab]);

  const SaveButton = ({ tab }: { tab: string }) => (
    <Button onClick={() => saveTab(tab)} className={savedTab === tab ? 'bg-green-600 hover:bg-green-700' : ''}>
      {savedTab === tab ? (
        <><CheckCircle className="mr-2 h-4 w-4" />Saved!</>
      ) : (
        <><Save className="mr-2 h-4 w-4" />Save Changes{unsaved[tab] ? ' *' : ''}</>
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {savedTab && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />Settings saved successfully!
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and options</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />General{unsaved['general'] ? ' •' : ''}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />Notifications{unsaved['notifications'] ? ' •' : ''}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />Security{unsaved['security'] ? ' •' : ''}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />Appearance
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />Users
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="mr-2 h-4 w-4" />Backup
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="labName">Laboratory Name</Label>
                    <Input id="labName" value={settings.general.labName} onChange={e => updateGeneral('labName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input id="email" type="email" value={settings.general.email} onChange={e => updateGeneral('email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={settings.general.phone} onChange={e => updateGeneral('phone', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={settings.general.address} onChange={e => updateGeneral('address', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm"
                      value={settings.general.timezone}
                      onChange={e => updateGeneral('timezone', e.target.value)}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Kabul">Kabul (AFT +4:30)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm"
                      value={settings.general.currency}
                      onChange={e => updateGeneral('currency', e.target.value)}
                    >
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="CAD">Canadian Dollar (CA$)</option>
                      <option value="AFN">Afghan Afghani (؋)</option>
                    </select>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <SaveButton tab="general" />
                {unsaved['general'] && <span className="text-sm text-amber-600">You have unsaved changes</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                  { key: 'caseStatusUpdates', label: 'Case Status Updates', desc: 'Get notified when case status changes' },
                  { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Get payment due date reminders' },
                  { key: 'inventoryAlerts', label: 'Inventory Alerts', desc: 'Get notified when stock is low' },
                  { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Receive monthly summary reports' },
                ].map((item, i) => (
                  <div key={item.key}>
                    {i > 0 && <Separator className="mb-4" />}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.key}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        id={item.key}
                        checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                        onCheckedChange={v => updateNotification(item.key, v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <SaveButton tab="notifications" />
                {unsaved['notifications'] && <span className="text-sm text-amber-600">You have unsaved changes</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security preferences and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch id="twoFactorAuth" checked={settings.security.twoFactorAuth} onCheckedChange={v => updateSecurity('twoFactorAuth', v)} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number" min="5" max="480"
                    value={settings.security.sessionTimeout}
                    onChange={e => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                    className="max-w-[200px]"
                  />
                </div>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium">Password Policy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Length</Label>
                      <Input type="number" min="6" max="32" value={settings.security.passwordMinLength} onChange={e => updateSecurity('passwordMinLength', parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Expire After (days)</Label>
                      <Input type="number" min="30" max="365" value={settings.security.passwordExpireDays} onChange={e => updateSecurity('passwordExpireDays', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <SaveButton tab="security" />
                {unsaved['security'] && <span className="text-sm text-amber-600">You have unsaved changes</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Configure visual preferences and themes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => { setTheme('light'); }}
                  >
                    <Sun className="mr-2 h-4 w-4" />Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => { setTheme('dark'); }}
                  >
                    <Moon className="mr-2 h-4 w-4" />Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => { setTheme('system'); }}
                  >
                    System
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Current theme: <strong>{theme}</strong> — changes apply immediately.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">User management is available in the Admin section.</p>
              <Button asChild>
                <a href="/admin/users"><Users className="mr-2 h-4 w-4" />Go to User Management</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup &amp; Restore</CardTitle>
              <CardDescription>Manage data backups and restoration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-medium">Last Backup</h3>
                  <p className="text-sm text-muted-foreground">September 16, 2026 23:45</p>
                  <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" />Backup successful</p>
                </div>
                <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-medium">Backup Schedule</h3>
                  <p className="text-sm text-muted-foreground">Daily at 2:00 AM (Automatic)</p>
                  <p className="text-sm text-muted-foreground">Retention: 30 days</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => alert('Backup initiated! (Frontend only — requires backend)')}>
                  <FileText className="mr-2 h-4 w-4" />Backup Now
                </Button>
                <Button variant="outline" onClick={() => alert('Restore requires backend integration')}>
                  <Database className="mr-2 h-4 w-4" />Restore from Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
