import { LineRequest } from '../../../shared/components/line-editor/line-editor';

export interface PurchaseOrderRequest {
  supplierId: number;
  lines: LineRequest[];
}
