import { Service } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { API_URL } from '../../../core/api';
import { emptyPage, Page } from '../../../core/models/page';
import { Client } from '../models/clients';

@Service()
export class ClientService {
  // Liste complète pour remplir un sélecteur. La pagination viendra avec l'écran de gestion.
  listAll(): HttpResourceRef<Page<Client>> {
    return httpResource<Page<Client>>(
      () => ({ url: `${API_URL}/client`, params: { page: 0, size: 100 } }),
      { defaultValue: emptyPage<Client>() },
    );
  }
}
