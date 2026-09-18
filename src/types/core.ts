// Base entity interface
export interface BaseEntity {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Common status types
export type VisitStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';
export type CaseStatus =
  | 'DRAFT'
  | 'RECEIVED'
  | 'IN_INSPECTION'
  | 'IN_PRODUCTION'
  | 'IN_QC'
  | 'REWORK'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';
export type StageStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'low' | 'normal' | 'rush';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'VOID';
export type QCResult = 'PASSED' | 'FAILED' | 'NEEDS_CORRECTION';
export type QCItemResult = 'pass' | 'fail' | 'na';

// Common entity interfaces
export interface Patient extends BaseEntity {
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  address?: string;
  allergies?: string;
  medicalNotes?: string;
  isActive: boolean;
}

export interface Dentist extends BaseEntity {
  dentistNumber: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  specialties?: string[];
  isActive: boolean;
}

export interface Clinic extends BaseEntity {
  clinicNumber: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxId?: string;
  paymentTerms?: number;
  creditLimit?: number;
  isActive: boolean;
}

export interface DentistClinic extends BaseEntity {
  dentistId: string;
  clinicId: string;
  dentist: Dentist;
  clinic: Clinic;
}
