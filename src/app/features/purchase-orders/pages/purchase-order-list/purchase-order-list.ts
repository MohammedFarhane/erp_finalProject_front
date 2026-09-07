import { Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseOrderService } from '../../services/purchase-order-service';
import { PurchaseOrderState } from '../../models/purchase-order';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DecimalPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'app-purchase-order-list',
  styleUrl: './purchase-order-list.scss',
  templateUrl: './purchase-order-list.html',
})
export class PurchaseOrderList {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly reference = input('');
  readonly supplierName = input('');
  readonly state = input('');
  readonly page = input(0, { transform: (value: unknown) => numberAttribute(value, 0) });

  readonly purchaseOrders = inject(PurchaseOrderService).searchPurchaseOrders(
    computed(() => ({
      reference: this.reference(),
      supplierName: this.supplierName(),
      state: this.state(),
      page: this.page(),
    })),
  );

  readonly filterForm = this.fb.nonNullable.group({
    reference: [''],
    supplierName: [''],
    state: [''],
  });

  readonly columns = [
    'reference',
    'supplierName',
    'date',
    'state',
    'total'
  ];

  readonly states: PurchaseOrderState[] = ['EN_ATTENTE', 'ANNULEE', 'RECUE'];

  constructor() {
    effect(() => {
      this.filterForm.patchValue(
        {
          reference: this.reference(),
          supplierName: this.supplierName(),
          state: this.state(),
        },
        { emitEvent: false},
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
    const { reference, supplierName, state } = this.filterForm.getRawValue();

    this.navigate(
      {
        reference: reference || null,
        supplierName: supplierName || null,
        state: state || null,
        page: null,
      },
      true,
    );
  }

  private navigate(queryParams: Record<string, string | number | null>, replaceUrl = false): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }
}
