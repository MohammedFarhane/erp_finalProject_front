import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { startWith, switchMap } from 'rxjs';
import { Product } from '../../../features/products/models/product';

/* ---------- Le formulaire d'une ligne ---------- */

export type LineForm = FormGroup<{
  product: FormControl<Product | null>;
  quantity: FormControl<number>;
}>;

export type LinesArray = FormArray<LineForm>;

export interface LineRequest {
  productId: number;
  quantity: number;
}

// mat-autocomplete écrit la saisie brute dans le contrôle tant qu'aucune option
// n'est choisie : le type annonce `Product | null`, la valeur peut être une
// chaîne. D'où le test sur `typeof` plutôt qu'un simple `required`.
function productSelected(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return value !== null && typeof value === 'object' ? null : { productRequired: true };
}

export function createLine(fb: FormBuilder): LineForm {
  return fb.group({
    product: fb.control<Product | null>(null, productSelected),
    quantity: fb.nonNullable.control(1, [Validators.required, Validators.min(1)]),
  });
}

// On démarre avec une ligne et `removeLine` refuse d'ôter la dernière : la
// contrainte « au moins une ligne » tient sans validateur.
export function createLinesArray(fb: FormBuilder): LinesArray {
  return fb.array([createLine(fb)]);
}

/* ---------- Le filtrage des produits ---------- */

function filterProducts(products: Product[], search: unknown): Product[] {
  if (typeof search !== 'string' || !search.trim()) {
    return products;
  }
  const term = search.trim().toLowerCase();
  return products.filter(
    (p) => p.name.toLowerCase().includes(term) || p.reference.toLowerCase().includes(term),
  );
}

/* ---------- Le composant ---------- */

@Component({
  selector: 'app-line-editor',
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './line-editor.html',
  styleUrl: './line-editor.scss',
})
export class LineEditor {
  private readonly fb = inject(FormBuilder);

  readonly lines = input.required<LinesArray>();
  readonly products = input.required<Product[]>();
  readonly priceField = input<'sellingPrice' | 'purchasePrice'>('sellingPrice');

  // Un formulaire réactif n'est pas un signal. On convertit ses changements en
  // signal une seule fois : c'est la seule plomberie du fichier.
  private readonly formChanged = toSignal(
    toObservable(this.lines).pipe(switchMap((array) => array.valueChanges.pipe(startWith(null)))),
  );

  // Lire `formChanged()` déclare la dépendance : la méthode est réévaluée à
  // chaque frappe, et relit alors la valeur à jour du contrôle.
  optionsFor(line: LineForm): Product[] {
    this.formChanged();
    return filterProducts(this.products(), line.controls.product.value);
  }

  readonly estimate = computed(() => {
    this.formChanged();
    const priceKey = this.priceField();

    return this.lines().controls.reduce((total, line) => {
      const product = line.controls.product.value;
      const selected = product !== null && typeof product === 'object';
      return total + (selected ? product[priceKey] * line.controls.quantity.value : 0);
    }, 0);
  });

  // Propriété fléchée : Material appelle `displayWith` sans contexte, une
  // méthode classique perdrait son `this`.
  readonly displayProduct = (value: Product | string | null): string =>
    value !== null && typeof value === 'object' ? value.name : (value ?? '');

  addLine(): void {
    this.lines().push(createLine(this.fb));
  }

  removeLine(index: number): void {
    if (this.lines().length > 1) {
      this.lines().removeAt(index);
    }
  }
}
