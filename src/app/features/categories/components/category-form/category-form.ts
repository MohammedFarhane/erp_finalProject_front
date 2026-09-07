import { DialogDrag } from '../../../../shared/directives/DialogDrag';
import { Component, inject } from '@angular/core';
import { Category } from '../../models/category';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface CategoryFormData {
  category: Category | null;
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DialogDrag,
  ],
  selector: 'app-category-form',
  styleUrl: './category-form.scss',
  templateUrl: './category-form.html',
})
export class CategoryForm {
  private readonly fb = inject(FormBuilder);

  readonly data = inject<CategoryFormData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.category?.name ?? '', Validators.required],
  });
}
