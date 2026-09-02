import { inject, Service, Signal } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { QuoteDetail, QuoteFilters, QuoteRequest, QuoteSummary } from '../models/quote';
import { emptyPage, Page } from '../../../core/models/page';
import { API_URL, cleanParams, idFromLocation, PAGE_SIZE } from '../../../core/api';
import { map } from 'rxjs';

@Service()
export class QuoteService {
  private readonly http = inject(HttpClient);

  private updateStatus(id: number, action: 'send' | 'accept' | 'refuse') {
    return this.http.post<QuoteDetail>(`${API_URL}/quote/${id}/${action}`, null);
  }

  searchQuotes(filters: Signal<QuoteFilters>): HttpResourceRef<Page<QuoteSummary>> {
    return httpResource<Page<QuoteSummary>>(
      () => ({
        url: `${API_URL}/quote`,
        params: cleanParams({
          page: filters().page,
          size: PAGE_SIZE,
          reference: filters().reference,
          clientName: filters().clientName,
          state: filters().state,
        }),
      }),
      { defaultValue: emptyPage<QuoteSummary>() },
    );
  }

  getQuote(id: Signal<number>) {
    return httpResource<QuoteDetail | undefined>(() => `${API_URL}/quote/${id()}`);
  }

  send(id: number) {
    return this.updateStatus(id, 'send');
  }

  accept(id: number) {
    return this.updateStatus(id, 'accept');
  }

  refuse(id: number) {
    return this.updateStatus(id, 'refuse');
  }

  downloadPdf(id: number) {
    return this.http.get(`${API_URL}/quote/${id}/pdf`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  create(request: QuoteRequest) {
    // observe: 'response'` est indispensable : le corps est vide, tout est
    // dans les en-têtes.
    return this.http
      .post(`${API_URL}/quote`, request, { observe: 'response' })
      .pipe(map(idFromLocation));
  }
}
