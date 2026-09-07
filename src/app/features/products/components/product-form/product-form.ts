import { DialogDrag } from '../../../../shared/directives/DialogDrag';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../categories/models/category';
import { Product } from '../../models/product';

export interface ProductFormData {
  product: Product | null; // null = création
  categories: Category[];
}

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DialogDrag,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);

  readonly data = inject<ProductFormData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    purchasePrice: [0, [Validators.required, Validators.min(0.01)]],
    sellingPrice: [0, [Validators.required, Validators.min(0.01)]],
    tvaRate: [0.21, [Validators.required, Validators.min(0.01)]],
    minStockQuantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, Validators.min(1)],
  });

  constructor() {
    const product = this.data.product;

    if (product) {
      this.form.patchValue({
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        tvaRate: product.tvaRate,
        minStockQuantity: product.minStockQuantity,
        categoryId: this.data.categories.find((c) => c.name === product.categoryName)?.id ?? 0,
      });
    }
  }
}
