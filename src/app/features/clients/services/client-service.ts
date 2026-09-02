import { Service } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { listAllResource } from '../../../core/api';
import { Page } from '../../../core/models/page';
import { Client } from '../models/client';

@Service()
export class ClientService {
  listAll(): HttpResourceRef<Page<Client>> {
    return listAllResource<Client>('client');
  }
}
