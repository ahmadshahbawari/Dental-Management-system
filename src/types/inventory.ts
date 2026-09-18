import { BaseEntity } from './core';

export interface Material extends BaseEntity {
  sku: string;
  name: string;
  materialCategory: {
    id: string;
    name: string;
  };
  unit: 'g' | 'ml' | 'pc';
  minStock: number;
  currentStock: number;
  averageCost: number;
  isActive: boolean;
}

export interface MaterialBatch extends BaseEntity {
  batchNumber: string;
  materialId: string;
  material: Material;
  supplierId?: string;
  quantity: number;
  unitCost: number;
  receivedAt: string;
  expiryDate?: string;
  currentQuantity: number;
  isExpired: boolean;
}

export interface Supplier extends BaseEntity {
  supplierNumber: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
  paymentTerms?: number;
  isActive: boolean;
}

export interface PurchaseOrder extends BaseEntity {
  orderNumber: string;
  supplierId: string;
  supplier: Supplier;
  status: 'DRAFT' | 'SUBMITTED' | 'RECEIVED' | 'CANCELLED';
  orderDate: string;
  expectedDeliveryDate?: string;
  receivedAt?: string;
  items: PurchaseOrderItem[];
  notes?: string;
}

export interface PurchaseOrderItem extends BaseEntity {
  materialId: string;
  material: Material;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
}

export interface StockTransaction extends BaseEntity {
  transactionNo: string;
  materialId: string;
  batchId?: string;
  transactionType: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  unitCost?: number;
  sourceType: 'PURCHASE' | 'CASE_USAGE' | 'ADJUSTMENT' | 'OPENING';
  sourceId: string;
  transactionAt: string;
}

export interface MaterialUsage extends BaseEntity {
  caseId: string;
  caseItemId?: string;
  materialId: string;
  batchId?: string;
  quantity: number;
  unitCost: number;
  usedAt: string;
  technicianId: string;
  notes?: string;
}

export interface StockAdjustment extends BaseEntity {
  adjustmentNumber: string;
  materialId: string;
  batchId?: string;
  adjustmentType: 'DAMAGE' | 'LOSS' | 'COUNT_CORRECTION' | 'EXPIRY_WRITEOFF';
  quantity: number;
  reason: string;
  adjustedBy: string;
  adjustedAt: string;
}
