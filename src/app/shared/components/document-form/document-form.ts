import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../features/products/models/product';
import { createLinesArray, LineEditor, LineRequest } from '../line-editor/line-editor';

// Client et Supplier ont tous deux `id` et `name` : aucune conversion à écrire.
export interface PartnerOption {
  id: number;
  name: string;
}

// Ce qui distingue les trois écrans, et rien d'autre.
export interface DocumentFormConfig {
  title: string;
  partnerLabel: string;
  submitLabel: string;
  cancelLink: string;
  withDiscount?: boolean;
  priceField?: 'sellingPrice' | 'purchasePrice';
}

export interface DocumentFormValue {
  partnerId: number;
  discount: number;
  lines: LineRequest[];
}

@Component({
  selector: 'app-document-form',
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
  templateUrl: './document-form.html',
  styleUrl: './document-form.scss',
})
export class DocumentForm {
  private readonly fb = inject(FormBuilder);

  readonly config = input.required<DocumentFormConfig>();
  readonly partners = input.required<PartnerOption[]>();
  readonly products = input.required<Product[]>();
  readonly loading = input(false);
  readonly busy = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitted = output<DocumentFormValue>();

  // La remise existe toujours dans le formulaire, même pour les commandes : on
  // cache seulement son champ. Un FormGroup typé dont la forme change à
  // l'exécution est une source d'ennuis pour un gain nul.
  readonly form = this.fb.group({
    partnerId: this.fb.control<number | null>(null, Validators.required),
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

    const { partnerId, discount, lines } = this.form.getRawValue();

    // `form.invalid` garantit que rien n'est nul, mais l'état d'un formulaire
    // n'informe pas le compilateur : on reconstruit en le prouvant.
    if (partnerId === null) {
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

    this.submitted.emit({ partnerId, discount, lines: lineRequests });
  }
}
