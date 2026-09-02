import { LineRequest } from '../../../shared/components/line-editor/line-editor';

export type QuoteState = 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE'

export interface QuoteSummary {
  quoteId: number;
  reference: string;
  quoteDate: string;
  expirationDate: string;
  state: QuoteState;
  totalPrice: number;
  clientName: string;
}

export interface QuoteFilters {
  reference: string;
  clientName: string;
  state: string;
  page: number;
}

export interface QuoteLine {
  id: number;
  quantity: number;
  unitPrice: number;
  tvaRate: number;
  tvaAmount: number;
  totalLinePrice: number;
  productName: string;
}

export interface QuoteDetail {
  id: number;
  reference: string;
  state: QuoteState;
  quoteDate: string;
  subTotal: number;
  discount: number;
  amountTva: number;
  totalPrice: number;
  expirationDate: string;
  billingId: number | null;
  clientName: string;
  userId: number;
  lines: QuoteLine[];
}

export interface QuoteRequest {
  clientId: number;
  discount: number; // pourcentage : 10 = 10 %
  lines: LineRequest[];
}
