import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../services/category-service';
import { AuthService } from '../../../../core/services/auth-service';
import { Category, CategoryRequest } from '../../models/category';
import { CategoryForm, CategoryFormData } from '../../components/category-form/category-form';
import { Observable } from 'rxjs';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  selector: 'app-category-list',
  styleUrl: './category-list.scss',
  templateUrl: './category-list.html',
})
export class CategoryList {
  private readonly dialog = inject(MatDialog);
  private readonly categoryService = inject(CategoryService);

  readonly isAdmin = inject(AuthService).isAdmin;
  readonly categories = inject(CategoryService).listAll();

  readonly columns = ['name', 'actions'];
  readonly errorMessage = signal<string | null>(null);

  openForm(category: Category | null): void {
    this.dialog
      .open<CategoryForm, CategoryFormData, CategoryRequest>(CategoryForm, {
        data: { category },
      })
      .afterClosed()
      .subscribe((request) => {
        if (!request) {
          return;
        }
        const call: Observable<unknown> = category
          ? this.categoryService.update(category.id, request)
          : this.categoryService.create(request);

        this.run(call);
      });
  }

  remove(category: Category): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Supprimer cette catégorie ?',
          message: `« ${category.name} » sera retirée. Les produits qui
  l'utilisent l'en empêcheront.`,
          confirmLabel: 'Supprimer',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.run(this.categoryService.archive(category.id));
        }
      });
  }

  private run(call: Observable<unknown>): void {
    this.errorMessage.set(null);
    call.subscribe({
      next: () => this.categories.reload(),
      error: (err: HttpErrorResponse) =>
        this.errorMessage.set(err.error?.detail ?? "L'opération a échoué."),
    });
  }
}
