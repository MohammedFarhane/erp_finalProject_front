import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import {
  BillingFilters,
  BillingRequest,
  BillingSummary,
  BillingDetail,
  PaymentRequest,
} from '../models/billing';
import { map } from 'rxjs';
import { API_URL, cleanParams, idFromLocation, PAGE_SIZE } from '../../../core/api';
import { emptyPage, Page } from '../../../core/models/page';

@Service()
export class BillingService {
  private readonly http = inject(HttpClient);

  private updateStatus(id: number, action: 'validate' | 'cancel') {
    return this.http.post<BillingDetail>(`${API_URL}/billing/${id}/${action}`, null);
  }

  create(request: BillingRequest) {
    return this.http
      .post(`${API_URL}/billing`, request, { observe: 'response' })
      .pipe(map(idFromLocation));
  }

  searchBillings(filters: Signal<BillingFilters>): HttpResourceRef<Page<BillingSummary>> {
    return httpResource<Page<BillingSummary>>(
      () => ({
        url: `${API_URL}/billing`,
        params: cleanParams({
          page: filters().page,
          size: PAGE_SIZE,
          reference: filters().reference,
          clientName: filters().clientName,
          state: filters().state,
        }),
      }),
      { defaultValue: emptyPage<BillingSummary>() },
    );
  }

  getBilling(id: Signal<number>) {
    return httpResource<BillingDetail | undefined>(() => `${API_URL}/billing/${id()}`);
  }

  validate(id: number) {
    return this.updateStatus(id, 'validate');
  }

  cancel(id: number) {
    return this.updateStatus(id, 'cancel');
  }

  pay(id: number, request: PaymentRequest) {
    return this.http.post<BillingDetail>(`${API_URL}/billing/${id}/pay`, request);
  }

  downloadPdf(id: number) {
    return this.http.get(`${API_URL}/billing/${id}/pdf`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
