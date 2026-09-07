import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { map } from 'rxjs';
import { API_URL, cleanParams, idFromLocation, PAGE_SIZE } from '../../../core/api';
import {
  PurchaseOrderDetail,
  PurchaseOrderFilters,
  PurchaseOrderRequest,
  PurchaseOrderSummary,
} from '../models/purchase-order';
import { emptyPage, Page } from '../../../core/models/page';

@Service()
export class PurchaseOrderService {
  private readonly http = inject(HttpClient);

  private updateStatus(id: number, action: 'receive' | 'cancel') {
    return this.http.post<PurchaseOrderDetail>(`${API_URL}/purchase-order/${id}/${action}`, null);
  }

  create(request: PurchaseOrderRequest) {
    return this.http
      .post(`${API_URL}/purchase-order`, request, { observe: 'response' })
      .pipe(map(idFromLocation));
  }

  searchPurchaseOrders(
    filters: Signal<PurchaseOrderFilters>,
  ): HttpResourceRef<Page<PurchaseOrderSummary>> {
    return httpResource<Page<PurchaseOrderSummary>>(
      () => ({
        url: `${API_URL}/purchase-order`,
        params: cleanParams({
          page: filters().page,
          size: PAGE_SIZE,
          reference: filters().reference,
          supplierName: filters().supplierName,
          state: filters().state,
        }),
      }),
      { defaultValue: emptyPage<PurchaseOrderSummary>() },
    );
  }

  getPurchaseOrder(id: Signal<number>) {
    return httpResource<PurchaseOrderDetail | undefined>(() => `${API_URL}/purchase-order/${id()}`);
  }

  receive(id: number) {
    return this.updateStatus(id, 'receive');
  }

  cancel(id: number) {
    return this.updateStatus(id, 'cancel');
  }

  downloadPdf(id: number) {
    return this.http.get(`${API_URL}/purchase-order/${id}/pdf`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
