export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  TECHNICIAN = 'TECHNICIAN',
  QC = 'QC',
  ACCOUNTANT = 'ACCOUNTANT',
  STOREKEEPER = 'STOREKEEPER',
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Permission {
  resource: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'manage';
  scope?: 'own' | 'all';
}
