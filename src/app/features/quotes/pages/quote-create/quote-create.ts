import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {
  createLinesArray,
  LineEditor,
  LineRequest,
} from '../../../../shared/components/line-editor/line-editor';
import { ClientService } from '../../../clients/services/client-service';
import { ProductService } from '../../../products/services/product-service';
import { QuoteService } from '../../services/quote-service';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LineEditor,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  selector: 'app-quote-create',
  styleUrl: './quote-create.scss',
  templateUrl: './quote-create.html',
})
export class QuoteCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly quoteService = inject(QuoteService);

  readonly clients = inject(ClientService).listAll();
  readonly products = inject(ProductService).listAll();

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    clientId: this.fb.control<number | null>(null, Validators.required),
    discount: this.fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    lines: createLinesArray(this.fb),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { clientId, discount, lines } = this.form.getRawValue();

    // `form.invalid` garantit que rien n'est nul, mais TypeScript ne peut pas
    // le déduire d'un état de formulaire : on reconstruit en le prouvant.
    if (clientId === null) {
      return;
    }

    const lineRequests: LineRequest[] = [];
    for (const line of lines) {
      const product = line.product;
      if (product === null || typeof product !== 'object') {
        return;
      }
      lineRequests.push({ productId: product.id, quantity: line.quantity });
    }

    this.busy.set(true);
    this.errorMessage.set(null);

    this.quoteService.create({ clientId, discount, lines: lineRequests }).subscribe({
      next: (id) => this.router.navigate(['/quotes', id]),
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.errorMessage.set(err.error?.detail ?? 'La création a échoué.');
      },
    });
  }
}
