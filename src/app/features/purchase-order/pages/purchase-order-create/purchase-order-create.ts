import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../products/services/product-service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  DocumentForm,
  DocumentFormConfig,
  DocumentFormValue,
} from '../../../../shared/components/document-form/document-form';
import { PurchaseOrderService } from '../../services/purchase-order-service';
import { SupplierService } from '../../../suppliers/services/supplier-service';

@Component({
  selector: 'app-purchase-order-create',
  imports: [DocumentForm],
  templateUrl: './purchase-order-create.html',
})
export class PurchaseOrderCreate {
  private readonly router = inject(Router);
  private readonly purchaseOrderService = inject(PurchaseOrderService);

  readonly supplier = inject(SupplierService).listAll();
  readonly products = inject(ProductService).listAll();

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly config: DocumentFormConfig = {
    title: 'Nouvelle commande',
    partnerLabel: 'Fournisseur',
    submitLabel: 'Créer la commande',
    cancelLink: '/dashboard',
    withDiscount: false,
    priceField: 'purchasePrice',
  };

  create(value: DocumentFormValue): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    this.purchaseOrderService
      .create({ supplierId: value.partnerId, lines: value.lines })
      .subscribe({
        next: (id) => this.router.navigate(['/purchase-orders', id]),
        error: (err: HttpErrorResponse) => {
          this.busy.set(false);
          this.errorMessage.set(err.error?.detail ?? 'La création a échoué.');
        },
      });
  }
}
