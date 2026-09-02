import { Supplier } from '../models/supplier';
import { listAllResource } from '../../../core/api';
import { Page } from '../../../core/models/page';
import { Service } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';

@Service()
export class SupplierService {
  listAll(): HttpResourceRef<Page<Supplier>> {
    return listAllResource<Supplier>('supplier');
  }
}
