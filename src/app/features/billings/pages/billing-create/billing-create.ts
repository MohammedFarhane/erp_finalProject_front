import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BillingService } from '../../services/billing-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientService } from '../../../clients/services/client-service';
import { ProductService } from '../../../products/services/product-service';
import {
  DocumentForm,
  DocumentFormConfig,
  DocumentFormValue,
} from '../../../../shared/components/document-form/document-form';

@Component({
  selector: 'app-billing-create',
  imports: [DocumentForm],
  templateUrl: './billing-create.html',
})
export class BillingCreate {
  private readonly router = inject(Router);
  private readonly billingService = inject(BillingService);

  readonly clients = inject(ClientService).listAll();
  readonly products = inject(ProductService).listAll();

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly config: DocumentFormConfig = {
    title: 'Nouvelle facture',
    partnerLabel: 'Client',
    submitLabel: 'Créer la facture',
    cancelLink: '/billings',
  };

  create(value: DocumentFormValue): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    this.billingService
      .create({ clientId: value.partnerId, discount: value.discount, lines: value.lines })
      .subscribe({
        next: (id) => this.router.navigate(['/billings', id]),
        error: (err: HttpErrorResponse) => {
          this.busy.set(false);
          this.errorMessage.set(err.error?.detail ?? 'La création a échoué.');
        },
      });
  }
}
