import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { API_URL, idFromLocation } from '../../../core/api';
import { PurchaseOrderRequest } from '../models/purchase-order';

@Service()
export class PurchaseOrderService {
  private readonly http = inject(HttpClient);

  create(request: PurchaseOrderRequest) {
    return this.http
      .post(`${API_URL}/purchase-order`, request, { observe: 'response' })
      .pipe(map(idFromLocation));
  }
}
