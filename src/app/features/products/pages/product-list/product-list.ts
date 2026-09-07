import { Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { PAGE_SIZE } from '../../../../core/api';
import { CategoryService } from '../../../categories/services/category-service';
import { debounceTime, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ProductForm, ProductFormData } from '../../components/product-form/product-form';
import { MatDialog } from '@angular/material/dialog';
import { Product, ProductRequest } from '../../models/product';
import { AuthService } from '../../../../core/services/auth-service';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButton,
    MatIcon,
    MatIconButton,
  ],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly productService = inject(ProductService);

  readonly name = input('');
  readonly categoryId = input('');
  readonly page = input(0, { transform: (value: unknown) => numberAttribute(value, 0) });
  readonly isAdmin = inject(AuthService).isAdmin;

  readonly products = inject(ProductService).search(
    computed(() => ({
      page: this.page(),
      size: PAGE_SIZE,
      name: this.name(),
      categoryId: this.categoryId(),
    })),
  );

  readonly categories = inject(CategoryService).listAll();

  readonly filterForm = this.fb.group({
    name: [''],
    categoryId: [''],
  });

  readonly columns = ['reference', 'name', 'categoryName', 'sellingPrice', 'stock', 'actions'];

  constructor() {
    effect(() => {
      this.filterForm.patchValue(
        { name: this.name(), categoryId: this.categoryId() },
        { emitEvent: false },
      );
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.applyFilters());
  }

  onPageChange(event: PageEvent): void {
    this.navigate({ page: event.pageIndex || null });
  }

  private applyFilters(): void {
    const { name, categoryId } = this.filterForm.getRawValue();
    this.navigate({ name: name || null, categoryId: categoryId || null, page: null }, true);
  }

  private navigate(queryParams: Record<string, string | number | null>, replaceUrl = false): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }

  openForm(product: Product | null): void {
    this.dialog
      .open<ProductForm, ProductFormData, ProductRequest>(ProductForm, {
        data: { product, categories: this.categories.value() },
      })
      .afterClosed()
      .subscribe((request) => {
        if (!request) {
          return;
        }
        const call: Observable<unknown> = product
          ? this.productService.update(product.id, request)
          : this.productService.create(request);

        call.subscribe(() => this.products.reload());
      });
  }

  remove(product: Product): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Archiver ce produit ?',
          message: `« ${product.name} » disparaîtra des listes mais restera
  visible sur les documents existants.`,
          confirmLabel: 'Archiver',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.productService.archive(product.id).subscribe(() => this.products.reload());
        }
      });
  }
}
