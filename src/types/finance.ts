import { BaseEntity, InvoiceStatus, Clinic, Dentist } from './core';

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  caseId?: string;
  visitId?: string;
  clinic: Clinic;
  dentist?: Dentist;
  status: InvoiceStatus;
  issueDate?: string;
  subtotal: number;
  discountAmount: number;
  taxRate: number;
  total: number;
  currency: string;
  fxRate: number;
  items: InvoiceItem[];
  balance: number;
}

export interface InvoiceItem extends BaseEntity {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Payment extends BaseEntity {
  receiptNumber: string;
  clinic: Clinic;
  amount: number;
  currency: string;
  fxRate: number;
  paymentMethod: 'CASH' | 'BANK' | 'TRANSFER' | 'OTHER';
  paidAt: string;
  referenceNo?: string;
  receivedBy: {
    id: string;
    fullName: string;
  };
  isReversal: boolean;
  allocations: PaymentAllocation[];
}

export interface PaymentAllocation extends BaseEntity {
  invoiceId: string;
  amount: number;
  allocatedAt: string;
}

export interface Expense extends BaseEntity {
  expenseNumber: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  fxRate: number;
  expenseDate: string;
  vendor?: string;
  paymentMethod?: string;
  referenceNo?: string;
  notes?: string;
}

export interface InvoiceCreateRequest {
  caseId?: string;
  visitId?: string;
  clinicId: string;
  dentistId?: string;
  issueDate: string;
  items: InvoiceItemCreateRequest[];
  discountAmount: number;
  taxRate: number;
  currency: string;
  fxRate: number;
}

export interface InvoiceItemCreateRequest {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface PaymentCreateRequest {
  clinicId: string;
  amount: number;
  currency: string;
  fxRate: number;
  paymentMethod: 'CASH' | 'BANK' | 'TRANSFER' | 'OTHER';
  paidAt: string;
  referenceNo?: string;
  allocations: PaymentAllocationCreateRequest[];
}

export interface PaymentAllocationCreateRequest {
  invoiceId: string;
  amount: number;
}

export interface ExpenseCreateRequest {
  category: string;
  description: string;
  amount: number;
  currency: string;
  fxRate: number;
  expenseDate: string;
  vendor?: string;
  paymentMethod?: string;
  referenceNo?: string;
  notes?: string;
}
