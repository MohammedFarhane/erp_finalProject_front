import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BillingRequest } from '../models/billing';
import { map } from 'rxjs';
import { API_URL, idFromLocation } from '../../../core/api';

@Service()
export class BillingService {
  private readonly http = inject(HttpClient);

  create(request: BillingRequest) {
    return this.http
      .post(`${API_URL}/billing`, request, { observe: 'response' })
      .pipe(map(idFromLocation));
  }
}
