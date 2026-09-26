export interface Case {
  id: string;
  caseNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  dentistName: string;
  clinicName: string;
  treatmentType: string;
  teethInvolved: string;
  shade: string;
  material: string;
  dateReceived: string;
  dueDate: string;
  priority: string;
  status: 'pending' | 'in_progress' | 'ready_for_delivery' | 'delivered' | 'cancelled';
  notes: string;
  specialInstructions?: string;
  technicianId?: string;
  qcInspectorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseDto {
  caseNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  dentistName: string;
  clinicName?: string;
  treatmentType: string;
  teethInvolved: string;
  shade?: string;
  material?: string;
  dateReceived: string;
  dueDate: string;
  priority: string;
  notes?: string;
  specialInstructions?: string;
}

export interface UpdateCaseDto {
  status?: Case['status'];
  notes?: string;
  specialInstructions?: string;
  technicianId?: string;
  qcInspectorId?: string;
}