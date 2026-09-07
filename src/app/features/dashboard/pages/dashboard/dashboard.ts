import { Component, computed, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { countResource, listAllResource } from '../../../../core/api';
import { ProductService } from '../../../products/services/product-service';
import { StateBar, StateSlice } from '../../../../shared/components/state-bar/state-bar';
import { DecimalPipe } from '@angular/common';
import { BillingSummary } from '../../../billings/models/billing';
import { PurchaseOrderSummary } from '../../../purchase-orders/models/purchase-order';

@Component({
  imports: [RouterLink, MatIconModule, StateBar, DecimalPipe],
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
  private readonly allBillings = listAllResource<BillingSummary>('billing');
  private readonly allOrders = listAllResource<PurchaseOrderSummary>('purchase-order');

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

  readonly finance = computed(() => {
    const billings = this.allBillings.value().content.filter((b) => b.state !== 'ANNULEE');
    const orders = this.allOrders.value().content.filter((o) => o.state !== 'ANNULEE');

    const invoiced = sum(billings.map((b) => b.totalPrice));
    const collected = sum(billings.map((b) => b.paidAmount));
    const outstanding = sum(billings.map((b) => b.remainingAmount));
    const ordered = sum(orders.map((o) => o.totalPrice));

    return { invoiced, collected, outstanding, ordered, balance: collected - ordered };
  });
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
