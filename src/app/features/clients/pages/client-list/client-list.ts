import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import {
  Partner,
  PartnerList,
  PartnerListConfig,
} from '../../../../shared/components/partner-list/partner-list';
import { ClientService } from '../../services/client-service';
import { Address } from '../../../../core/models/address';
import { Client } from '../../models/client';
import { PAGE_SIZE } from '../../../../core/api';

@Component({
  imports: [PartnerList],
  selector: 'app-clients',
  templateUrl: './client-list.html',
})
export class ClientList {
  readonly clientService = inject(ClientService);

  readonly name = input('');
  readonly email = input('');
  readonly page = input(0, { transform: (value: unknown) => numberAttribute(value, 0) });

  readonly partners = this.clientService.search(
    computed(() => ({
      page: this.page(),
      size: PAGE_SIZE,
      name: this.name(),
      email: this.email(),
    })),
  );

  readonly config: PartnerListConfig = { title: 'Clients', singularName: 'client' };

  readonly addressOf = (partner: Partner): Address => (partner as Client).billingAddress;
}
