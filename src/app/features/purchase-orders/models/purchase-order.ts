import { LineRequest } from '../../../shared/components/line-editor/line-editor';
import { Supplier } from '../../suppliers/models/supplier';

export type PurchaseOrderState = 'EN_ATTENTE' | 'RECUE' | 'ANNULEE';

export interface PurchaseOrderRequest {
  supplierId: number;
  lines: LineRequest[];
}

export interface PurchaseOrderSummary {
  id: number;
  reference: string;
  date: string;
  state: PurchaseOrderState;
  totalPrice: number;
  supplierName: string;
}

export interface PurchaseOrderLine {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderDetail {
  id: number;
  reference: string;
  date: string;
  state: PurchaseOrderState;
  totalPrice: number;
  supplier: Supplier;
  lines: PurchaseOrderLine[];
}

export interface PurchaseOrderFilters {
  reference: string;
  supplierName: string;
  state: string;
  page: number;
}
