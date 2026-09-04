import { Supplier, SupplierRequest } from '../models/supplier';
import { listAllResource } from '../../../core/api';
import { Page } from '../../../core/models/page';
import { Service } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { CrudService } from '../../../core/crud-service';

@Service()
export class SupplierService extends CrudService<Supplier, SupplierRequest>{
  constructor() {
    super('supplier');
  }

  listAll(): HttpResourceRef<Page<Supplier>> {
    return listAllResource<Supplier>(this.path);
  }
}
