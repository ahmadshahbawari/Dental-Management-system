import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, AuthResponse } from '@/types/auth';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string; role?: Role }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedUser = localStorage.getItem('dental_lab_user');
    const token = localStorage.getItem('dental_lab_token');

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('dental_lab_user');
        localStorage.removeItem('dental_lab_token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: { username: string; password: string; role?: Role }) => {
    try {
      setIsLoading(true);
      // In real implementation, this would call the API
      // For now, simulate a successful login based on the selected role.
      const selectedRole = credentials.role ?? Role.ADMIN;

      // Build the roles array: always include the chosen role.
      // Admins additionally get full access; other roles stand on their own.
      const roles: Role[] =
        selectedRole === Role.ADMIN
          ? [Role.ADMIN]
          : [selectedRole];

      // Derive a display name from the role for the mock user
      const roleNames: Record<Role, string> = {
        [Role.ADMIN]:        'Admin',
        [Role.MANAGER]:      'Manager',
        [Role.RECEPTIONIST]: 'Receptionist',
        [Role.TECHNICIAN]:   'Technician',
        [Role.QC]:           'QC Specialist',
        [Role.ACCOUNTANT]:   'Accountant',
        [Role.STOREKEEPER]:  'Storekeeper',
      };

      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: `${credentials.username}@dentallab.com`,
        firstName: roleNames[selectedRole],
        lastName: 'User',
        roles,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockAuthResponse: AuthResponse = {
        accessToken:  'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      };

      // Store auth data
      localStorage.setItem('dental_lab_user',          JSON.stringify(mockUser));
      localStorage.setItem('dental_lab_token',          mockAuthResponse.accessToken);
      localStorage.setItem('dental_lab_refresh_token',  mockAuthResponse.refreshToken);

      // Set API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${mockAuthResponse.accessToken}`;

      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if needed
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('dental_lab_user');
      localStorage.removeItem('dental_lab_token');
      localStorage.removeItem('dental_lab_refresh_token');

      // Clear API headers
      delete api.defaults.headers.common['Authorization'];

      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('dental_lab_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh token endpoint
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });

      // Update stored tokens
      localStorage.setItem('dental_lab_token', response.data.accessToken);
      localStorage.setItem('dental_lab_refresh_token', response.data.refreshToken);

      // Update API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;

      setUser(response.data.user);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.roles.includes(Role.ADMIN)) return true;

    // Simplified permission check - in real app, this would check against a permission matrix
    const rolePermissions: Record<Role, Record<string, string[]>> = {
      [Role.ADMIN]: { '*': ['*'] },
      [Role.MANAGER]: {
        visit: ['view', 'create', 'update'],
        case: ['view', 'create', 'update'],
        report: ['view'],
        dashboard: ['view'],
      },
      [Role.RECEPTIONIST]: {
        visit: ['view', 'create', 'update'],
        patient: ['view', 'create', 'update'],
        dentist: ['view', 'create', 'update'],
        clinic: ['view', 'create', 'update'],
        case: ['view', 'create', 'update'],
        delivery: ['view', 'create', 'update'],
        invoice: ['view', 'create'],
      },
      [Role.TECHNICIAN]: {
        case: ['view'],
        assignment: ['update'],
        stage: ['update'],
        'material.usage': ['create'],
      },
      [Role.QC]: {
        case: ['view'],
        qc: ['create', 'approve'],
        remake: ['create'],
      },
      [Role.ACCOUNTANT]: {
        invoice: ['view', 'create', 'update'],
        payment: ['view', 'create', 'update'],
        expense: ['view', 'create', 'update'],
        report: ['view'],
      },
      [Role.STOREKEEPER]: {
        material: ['view', 'create', 'update'],
        supplier: ['view', 'create', 'update'],
        purchase: ['view', 'create', 'update'],
        stock: ['view', 'adjust'],
        'report.inventory': ['view'],
      },
    };

    // Check if any of user's roles have the requested permission
    return user.roles.some((role) => {
      const permissions = rolePermissions[role];
      if (!permissions) return false;

      // Check if role has wildcard permission
      if (permissions['*']?.includes('*')) return true;

      // Check specific resource permissions
      const resourcePermissions = permissions[resource];
      if (!resourcePermissions) return false;

      return resourcePermissions.includes(action) || resourcePermissions.includes('*');
    });
  };

  const hasRole = (role: Role): boolean => {
    return user?.roles.includes(role) || false;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
