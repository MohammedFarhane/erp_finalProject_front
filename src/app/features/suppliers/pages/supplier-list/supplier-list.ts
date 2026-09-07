import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import {
  Partner,
  PartnerList,
  PartnerListConfig,
} from '../../../../shared/components/partner-list/partner-list';
import { SupplierService } from '../../services/supplier-service';
import { Address } from '../../../../core/models/address';
import { Supplier } from '../../models/supplier';
import { PAGE_SIZE } from '../../../../core/api';

@Component({
  imports: [PartnerList],
  selector: 'app-suppliers',
  templateUrl: './supplier-list.html',
})
export class SupplierList {
  readonly supplierService = inject(SupplierService);

  readonly name = input('');
  readonly email = input('');
  readonly page = input(0, { transform: (value: unknown) => numberAttribute(value, 0) });

  // Construite ici et non dans le composant partagé : un initialiseur de champ
  // est un contexte d'injection, ce dont httpResource a besoin.
  readonly partners = this.supplierService.search(
    computed(() => ({
      page: this.page(),
      size: PAGE_SIZE,
      name: this.name(),
      email: this.email(),
    })),
  );

  readonly config: PartnerListConfig = { title: 'Fournisseurs', singularName: 'fournisseur' };

  // Le fournisseur range son adresse dans `address`, le client dans
  // `billingAddress` : c'est la seule différence entre les deux écrans.
  readonly addressOf = (partner: Partner): Address => (partner as Supplier).address;
}
