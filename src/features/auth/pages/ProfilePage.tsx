import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Role } from '@/types/auth';
import {
  User,
  Mail,
  Shield,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  Camera,
} from 'lucide-react';

const roleColors: Record<Role, string> = {
  [Role.ADMIN]: 'bg-purple-100 text-purple-800',
  [Role.MANAGER]: 'bg-blue-100 text-blue-800',
  [Role.RECEPTIONIST]: 'bg-green-100 text-green-800',
  [Role.TECHNICIAN]: 'bg-amber-100 text-amber-800',
  [Role.QC]: 'bg-cyan-100 text-cyan-800',
  [Role.ACCOUNTANT]: 'bg-indigo-100 text-indigo-800',
  [Role.STOREKEEPER]: 'bg-orange-100 text-orange-800',
};

export default function ProfilePage() {
  const { user } = useAuth();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
    username:  user?.username  ?? '',
    phone:     '',
    jobTitle:  '',
    department:'',
    bio:       '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profileSaved,  setProfileSaved]  = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // ---------- handlers ----------
  const handleSaveProfile = () => {
    // Persist to localStorage so other parts of the app can read it
    const stored = localStorage.getItem('dental_lab_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated = {
        ...parsed,
        firstName: profileForm.firstName,
        lastName:  profileForm.lastName,
        email:     profileForm.email,
      };
      localStorage.setItem('dental_lab_user', JSON.stringify(updated));
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSavePassword = () => {
    setPasswordError('');
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    // In a real app this would call the API
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const initials = `${profileForm.firstName.charAt(0)}${profileForm.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Success toasts */}
      {profileSaved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" /> Profile saved successfully!
        </div>
      )}
      {passwordSaved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" /> Password updated successfully!
        </div>
      )}

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account security.</p>
      </div>

      {/* Avatar + role badges */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold select-none">
                {initials || <User className="h-8 w-8" />}
              </div>
              <button
                title="Change avatar"
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-background border shadow hover:bg-accent transition-colors"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {profileForm.firstName} {profileForm.lastName}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {profileForm.email}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {user?.roles.map(role => (
                  <Badge key={role} className={roleColors[role]}>
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Personal Information
          </CardTitle>
          <CardDescription>Update your name, email, and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileForm.firstName}
                onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                placeholder="Last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="you@dentallab.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileForm.username}
                onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={profileForm.jobTitle}
                onChange={e => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                placeholder="e.g. Lab Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profileForm.department}
                onChange={e => setProfileForm({ ...profileForm, department: e.target.value })}
                placeholder="e.g. Production"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Input
                id="bio"
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="A brief description about yourself…"
              />
            </div>
          </div>

          <Separator />
          <Button onClick={handleSaveProfile} className={profileSaved ? 'bg-green-600 hover:bg-green-700' : ''}>
            {profileSaved
              ? <><CheckCircle className="mr-2 h-4 w-4" />Saved!</>
              : <><Save className="mr-2 h-4 w-4" />Save Profile</>}
          </Button>
        </CardContent>
      </Card>

      {/* Roles (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Assigned Roles
          </CardTitle>
          <CardDescription>Roles are managed by the system administrator.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user?.roles.map(role => (
              <div
                key={role}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${roleColors[role]}`}
              >
                <Shield className="h-3.5 w-3.5" />
                {role}
              </div>
            ))}
          </div>
          {user && (
            <p className="mt-3 text-xs text-muted-foreground">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Use a strong password with at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current */}
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrent(v => !v)}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New */}
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNew ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="At least 8 characters"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNew(v => !v)}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {passwordForm.newPassword.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => {
                    const len  = passwordForm.newPassword.length;
                    const hasN = /\d/.test(passwordForm.newPassword);
                    const hasS = /[^a-zA-Z0-9]/.test(passwordForm.newPassword);
                    const score = (len >= 8 ? 1 : 0) + (len >= 12 ? 1 : 0) + (hasN ? 1 : 0) + (hasS ? 1 : 0);
                    const active = i <= score;
                    const color  = score <= 1 ? 'bg-red-500' : score <= 2 ? 'bg-amber-500' : score <= 3 ? 'bg-blue-500' : 'bg-green-500';
                    return (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${active ? color : 'bg-muted'}`} />
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    const len  = passwordForm.newPassword.length;
                    const hasN = /\d/.test(passwordForm.newPassword);
                    const hasS = /[^a-zA-Z0-9]/.test(passwordForm.newPassword);
                    const score = (len >= 8 ? 1 : 0) + (len >= 12 ? 1 : 0) + (hasN ? 1 : 0) + (hasS ? 1 : 0);
                    return ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score] ?? 'Strong';
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirm(v => !v)}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordForm.confirmPassword.length > 0 && (
              <p className={`text-xs ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                {passwordForm.newPassword === passwordForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {passwordError && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {passwordError}
            </div>
          )}

          <Separator />
          <Button
            onClick={handleSavePassword}
            className={passwordSaved ? 'bg-green-600 hover:bg-green-700' : ''}
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            {passwordSaved
              ? <><CheckCircle className="mr-2 h-4 w-4" />Updated!</>
              : <><Save className="mr-2 h-4 w-4" />Update Password</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
