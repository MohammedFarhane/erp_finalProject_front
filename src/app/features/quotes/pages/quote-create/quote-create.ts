import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClientService } from '../../../clients/services/client-service';
import { ProductService } from '../../../products/services/product-service';
import {
  DocumentForm,
  DocumentFormConfig,
  DocumentFormValue,
} from '../../../../shared/components/document-form/document-form';
import { QuoteService } from '../../services/quote-service';

@Component({
  selector: 'app-quote-create',
  imports: [DocumentForm],
  templateUrl: './quote-create.html',
})
export class QuoteCreate {
  private readonly router = inject(Router);
  private readonly quoteService = inject(QuoteService);

  readonly clients = inject(ClientService).listAll();
  readonly products = inject(ProductService).listAll();

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly config: DocumentFormConfig = {
    title: 'Nouveau devis',
    partnerLabel: 'Client',
    submitLabel: 'Créer le devis',
    cancelLink: '/quotes',
  };

  create(value: DocumentFormValue): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    this.quoteService
      .create({ clientId: value.partnerId, discount: value.discount, lines: value.lines })
      .subscribe({
        next: (id) => this.router.navigate(['/quotes', id]),
        error: (err: HttpErrorResponse) => {
          this.busy.set(false);
          this.errorMessage.set(err.error?.detail ?? 'La création a échoué.');
        },
      });
  }
}
