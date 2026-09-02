import { Service } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { API_URL } from '../../../core/api';
import { emptyPage, Page } from '../../../core/models/page';
import { Product } from '../models/product';

@Service()
export class ProductService {
  listAll(): HttpResourceRef<Page<Product>> {
    return httpResource<Page<Product>>(
      () => ({ url: `${API_URL}/product`, params: { page: 0, size: 100 } }),
      { defaultValue: emptyPage<Product>() },
    );
  }
}
