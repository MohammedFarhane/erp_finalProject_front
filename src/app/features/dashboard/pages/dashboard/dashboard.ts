import { Component, computed, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { countResource } from '../../../../core/api';
import { ProductService } from '../../../products/services/product-service';
import { StateBar, StateSlice } from '../../../../shared/components/state-bar/state-bar';

@Component({
  imports: [RouterLink, MatIconModule, StateBar],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly quotesToProcess = countResource('quote', { state: 'ENVOYE' });
  readonly quoteDrafts = countResource('quote', { state: 'BROUILLON' });
  readonly billingsToValidate = countResource('billing', { state: 'BROUILLON' });
  readonly billingsUnpaid = countResource('billing', { state: 'VALIDEE' });
  readonly ordersPending = countResource('purchase-order', { state: 'EN_ATTENTE' });

  private readonly products = inject(ProductService).listAll();

  readonly lowStock = computed(
    () => this.products.value().content.filter((p) => p.stock < p.minStockQuantity).length,
  );

  readonly quotes = this.distribution('quote', ['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE']);
  readonly billings = this.distribution('billing', ['BROUILLON', 'VALIDEE', 'PAYEE', 'ANNULEE']);
  readonly orders = this.distribution('purchase-order', ['EN_ATTENTE', 'RECUE', 'ANNULEE']);

  private distribution(path: string, states: string[]): Signal<StateSlice[]> {
    const counts = states.map((state) => ({ state, resource: countResource(path, { state }) }));

    return computed(() =>
      counts.map((c) => ({ state: c.state, count: c.resource.value().page.totalElements })),
    );
  }
}
