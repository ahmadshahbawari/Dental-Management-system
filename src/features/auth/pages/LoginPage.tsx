import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '../context/AuthContext';
import { Role } from '@/types/auth';
import { Activity as ToothIcon, ChevronDown, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Every available role with a friendly label + description
const roleOptions: { role: Role; label: string; description: string; color: string; bg: string }[] = [
  {
    role: Role.ADMIN,
    label: 'Admin',
    description: 'Full system access — all modules and settings',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
  },
  {
    role: Role.MANAGER,
    label: 'Manager',
    description: 'Manage visits, cases, reports and staff',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    role: Role.RECEPTIONIST,
    label: 'Receptionist',
    description: 'Handle visits, patients, dentists and invoices',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
  },
  {
    role: Role.TECHNICIAN,
    label: 'Technician',
    description: 'Work on production board and assigned cases',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  {
    role: Role.QC,
    label: 'QC Specialist',
    description: 'Inspect cases and manage quality control',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50 border-cyan-200',
  },
  {
    role: Role.ACCOUNTANT,
    label: 'Accountant',
    description: 'Manage invoices, payments and financial reports',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
  },
  {
    role: Role.STOREKEEPER,
    label: 'Storekeeper',
    description: 'Manage inventory, stock levels and suppliers',
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
  },
];

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isLoading } = useAuth();

  const [selectedRole,   setSelectedRole]   = useState<Role>(Role.ADMIN);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [showPassword,   setShowPassword]   = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError(null);
      await login({ ...values, role: selectedRole });
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    }
  };

  const activeRoleOption = roleOptions.find(r => r.role === selectedRole)!;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <ToothIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dental Lab</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Management System</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Select your role, then enter your credentials.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">

            {/* ── Role selector ── */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>

              {/* Selected role button */}
              <button
                type="button"
                onClick={() => setRolePickerOpen(v => !v)}
                className={`w-full flex items-center justify-between rounded-lg border-2 px-4 py-2.5 text-left transition-colors
                  ${activeRoleOption.bg} ${activeRoleOption.color} hover:opacity-90`}
              >
                <div>
                  <span className="font-semibold">{activeRoleOption.label}</span>
                  <span className="ml-2 text-xs opacity-70">{activeRoleOption.description}</span>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${rolePickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown list */}
              {rolePickerOpen && (
                <div className="rounded-lg border bg-background shadow-lg overflow-hidden">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => { setSelectedRole(opt.role); setRolePickerOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent transition-colors
                        ${opt.role === selectedRole ? 'bg-accent' : ''}`}
                    >
                      <div>
                        <span className={`font-medium text-sm ${opt.color}`}>{opt.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                      </div>
                      {opt.role === selectedRole && (
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${opt.color}`} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Credentials form ── */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" autoComplete="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(v => !v)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="rounded-md bg-red-50 text-red-600 text-sm p-3 border border-red-200">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    `Sign In as ${activeRoleOption.label}`
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-0">
            <div className="w-full rounded-lg bg-muted/60 p-3 text-center text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Demo — any username &amp; password works</p>
              <p>Select a role above to explore the system with those permissions.</p>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Dental Lab Management System · v1.0.0
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
