import { Service } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { listAllResource } from '../../../core/api';
import { Page } from '../../../core/models/page';
import { Client, ClientRequest } from '../models/client';
import { CrudService } from '../../../core/crud-service';

@Service()
export class ClientService extends CrudService<Client, ClientRequest> {
  constructor() {
    super('client');
  }

  listAll(): HttpResourceRef<Page<Client>> {
    return listAllResource<Client>(this.path);
  }
}
