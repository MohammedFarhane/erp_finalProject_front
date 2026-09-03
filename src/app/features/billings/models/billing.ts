import { LineRequest } from '../../../shared/components/line-editor/line-editor';

export type BillingState = 'BROUILLON' | 'VALIDEE' | 'PAYEE' | 'ANNULEE';
export type PaymentMethod = 'VIREMENT' | 'CARTE' | 'ESPECE' | 'CHEQUE';

export interface BillingRequest {
  clientId: number;
  discount: number;
  lines: LineRequest[];
}

export interface BillingSummary {
  billingId: number;
  reference: string;
  billingDate: string;
  state: BillingState;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  clientName: string;
}

export interface BillingLine {
  name: string;
  quantity: number;
  unitPrice: number;
  tvaRate: number;
  tvaAmount: number;
  totalPrice: number;
}

export interface BillingDetail {
  billingId: number;
  reference: string;
  billingDate: string;
  state: BillingState;
  subTotal: number;
  discount: number;
  amountTva: number;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  clientName: string;
  lines: BillingLine[];
}

export interface BillingFilters {
  reference: string;
  clientName: string;
  state: string;
  page: number;
}

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
}
