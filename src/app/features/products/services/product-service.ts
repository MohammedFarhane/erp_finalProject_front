import { Service } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { listAllResource } from '../../../core/api';
import { Page } from '../../../core/models/page';
import { Product, ProductRequest } from '../models/product';
import { CrudService } from '../../../core/crud-service';

@Service()
export class ProductService extends CrudService<Product, ProductRequest> {
  constructor() {
    super('product');
  }

  listAll(): HttpResourceRef<Page<Product>> {
    return listAllResource<Product>(this.path);
  }
}
