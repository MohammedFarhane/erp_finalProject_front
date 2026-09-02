import { LineRequest } from '../../../shared/components/line-editor/line-editor';

export interface BillingRequest {
  clientId: number;
  discount: number;
  lines: LineRequest[];
}
