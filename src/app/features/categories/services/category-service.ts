import { CrudService } from '../../../core/crud-service';
import { Category, CategoryRequest } from '../models/category';
import { httpResource, HttpResourceRef } from '@angular/common/http';

export class CategoryService extends CrudService<Category, CategoryRequest>{
  constructor() {
    super('category');
  }

  listAll(): HttpResourceRef<Category[]> {
    return httpResource<Category[]>(() => this.url(),
      { defaultValue: [] });
  }


}
