// Shared mock data — single source of truth for all pages
// In a real app these come from the API; here they're used as dropdowns across pages.

export interface MockDentist {
  id: string;
  dentistNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  specialties: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MockClinic {
  id: string;
  clinicNumber: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  paymentTerms: number;
  creditLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MockPatient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_DENTISTS: MockDentist[] = [
  {
    id: '1', dentistNumber: 'DNT-2024-00001', firstName: 'Ahmad', lastName: 'Karimi',
    phone: '+93 700 123 456', email: 'a.karimi@clinic.af',
    licenseNumber: 'DENT-12345', specialties: ['Orthodontics', 'Cosmetic Dentistry'],
    isActive: true, version: 1,
    createdAt: '2024-01-10T09:15:00Z', updatedAt: '2024-01-10T09:15:00Z',
  },
  {
    id: '2', dentistNumber: 'DNT-2024-00002', firstName: 'Sara', lastName: 'Rahimi',
    phone: '+93 701 234 567', email: 's.rahimi@clinic.af',
    licenseNumber: 'DENT-67890', specialties: ['Periodontics', 'Oral Surgery'],
    isActive: true, version: 1,
    createdAt: '2024-01-15T11:30:00Z', updatedAt: '2024-01-15T11:30:00Z',
  },
  {
    id: '3', dentistNumber: 'DNT-2024-00003', firstName: 'Khalid', lastName: 'Noori',
    phone: '+93 702 345 678', email: 'k.noori@clinic.af',
    licenseNumber: 'DENT-54321', specialties: ['Pediatric Dentistry'],
    isActive: true, version: 1,
    createdAt: '2024-02-01T14:20:00Z', updatedAt: '2024-02-01T14:20:00Z',
  },
];

export const MOCK_CLINICS: MockClinic[] = [
  {
    id: '1', clinicNumber: 'CLN-2024-00001', name: 'Modern Dental Care',
    address: 'Share-e-Naw, Kabul', phone: '+93 700 111 222',
    email: 'info@moderndentalcare.af', taxId: 'TAX-123456789',
    paymentTerms: 30, creditLimit: 50000,
    isActive: true, version: 1,
    createdAt: '2024-01-05T08:30:00Z', updatedAt: '2024-01-05T08:30:00Z',
  },
  {
    id: '2', clinicNumber: 'CLN-2024-00002', name: 'Bright Smile Dentistry',
    address: 'Wazir Akbar Khan, Kabul', phone: '+93 701 222 333',
    email: 'info@brightsmile.af', taxId: 'TAX-987654321',
    paymentTerms: 45, creditLimit: 75000,
    isActive: true, version: 1,
    createdAt: '2024-01-12T10:15:00Z', updatedAt: '2024-01-12T10:15:00Z',
  },
  {
    id: '3', clinicNumber: 'CLN-2024-00003', name: 'Aria Dental Clinic',
    address: 'Karte Char, Kabul', phone: '+93 702 333 444',
    email: 'info@ariadental.af', taxId: 'TAX-456789123',
    paymentTerms: 15, creditLimit: 25000,
    isActive: true, version: 1,
    createdAt: '2024-02-01T14:45:00Z', updatedAt: '2024-02-01T14:45:00Z',
  },
];

export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: '1', patientNumber: 'PAT-2024-00001', firstName: 'Ahmad', lastName: 'Shah',
    dateOfBirth: '1985-05-15', gender: 'male',
    phone: '+93 700 100 200', email: 'ahmad.shah@email.af',
    address: 'Kabul, Afghanistan', isActive: true, version: 1,
    createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2', patientNumber: 'PAT-2024-00002', firstName: 'Fatima', lastName: 'Mohammadi',
    dateOfBirth: '1990-08-22', gender: 'female',
    phone: '+93 701 200 300', email: 'fatima.m@email.af',
    address: 'Herat, Afghanistan', isActive: true, version: 1,
    createdAt: '2024-01-20T14:45:00Z', updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '3', patientNumber: 'PAT-2024-00003', firstName: 'Omar', lastName: 'Barakzai',
    dateOfBirth: '1978-11-30', gender: 'male',
    phone: '+93 702 300 400', email: 'omar.b@email.af',
    address: 'Kandahar, Afghanistan', isActive: false, version: 1,
    createdAt: '2024-02-05T09:15:00Z', updatedAt: '2024-02-05T09:15:00Z',
  },
];

// Treatment types — editable list stored in localStorage
const TREATMENT_KEY = 'dental_lab_treatment_types';
const DEFAULT_TREATMENTS = [
  'Crown', 'Bridge', 'Denture', 'Partial Denture', 'Implant',
  'Veneer', 'Inlay/Onlay', 'Orthodontic Appliance', 'Night Guard',
];

export function getTreatmentTypes(): string[] {
  try {
    const raw = localStorage.getItem(TREATMENT_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [...DEFAULT_TREATMENTS];
}

export function saveTreatmentTypes(types: string[]): void {
  localStorage.setItem(TREATMENT_KEY, JSON.stringify(types));
}
