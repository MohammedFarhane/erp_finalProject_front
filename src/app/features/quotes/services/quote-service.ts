import { inject, Service, Signal } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { QuoteDetail, QuoteFilters, QuoteRequest, QuoteSummary } from '../models/quotes';
import { Page } from '../../../core/models/page';
import { API_URL, idFromLocation } from '../../../core/api';
import { map } from 'rxjs';

const PAGE_SIZE = 10;

const EMPTY_PAGE: Page<QuoteSummary> = {
  content: [],
  page: { size: PAGE_SIZE, number: 0, totalElements: 0, totalPages: 0}
};

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
        params: buildParams(filters()),
      }),
      { defaultValue: EMPTY_PAGE },
    );
  }

  getQuote(id: Signal<number>) {
    return httpResource<QuoteDetail>(() => `${API_URL}/quote/${id()}`);
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
    // `observe: 'response'` est indispensable : le corps est vide, tout est
    // dans les en-têtes.
    return this.http
      .post(`${API_URL}/quote`, request, { observe: 'response' })
      .pipe(map(idFromLocation));
  }
}

function buildParams(filters: QuoteFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: filters.page,
    size: PAGE_SIZE,
  };

  if (filters.reference) {
    params['reference'] = filters.reference;
  }
  if (filters.clientName) {
    params['clientName'] = filters.clientName;
  }
  if (filters.state) {
    params['state'] = filters.state;
  }

  return params;
}
