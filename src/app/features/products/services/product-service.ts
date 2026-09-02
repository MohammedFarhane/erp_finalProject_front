import { Service } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { listAllResource } from '../../../core/api';
import { Page } from '../../../core/models/page';
import { Product } from '../models/product';

@Service()
export class ProductService {
  listAll(): HttpResourceRef<Page<Product>> {
    return listAllResource<Product>('product');
  }
}
