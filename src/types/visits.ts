import { BaseEntity, VisitStatus, Patient, Dentist, Clinic } from './core';

export interface Visit extends BaseEntity {
  visitNumber: string;
  patient: Patient;
  dentist: Dentist;
  clinic: Clinic;
  visitDate: string;
  chiefComplaint?: string;
  diagnosis?: string;
  instructions?: string;
  requiresLab: boolean;
  status: VisitStatus;
  closedAt?: string;
  linkedCase?: {
    id: string;
    caseNumber: string;
    status: string;
  };
  files: CaseFile[];
}

export interface CaseFile extends BaseEntity {
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedBy: string;
  version: number;
  isSuperseded: boolean;
  supersededBy?: string;
}

export interface VisitCreateRequest {
  patientId: string;
  dentistId: string;
  clinicId: string;
  visitDate: string;
  chiefComplaint?: string;
  diagnosis?: string;
  instructions?: string;
  requiresLab: boolean;
}

export interface VisitUpdateRequest {
  chiefComplaint?: string;
  diagnosis?: string;
  instructions?: string;
  requiresLab?: boolean;
  version: number;
}
