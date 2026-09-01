import { Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuoteService } from '../../service/quote-service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { QuoteState } from '../../models/quotes';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    DecimalPipe,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    RouterLink,
  ],
  selector: 'app-quote-list',
  styleUrl: './quote-list.scss',
  templateUrl: './quote-list.html',
})
export class QuoteList {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly reference = input('');
  readonly clientName = input('');
  readonly state = input('');
  readonly page = input(0, { transform: (value: unknown) => numberAttribute(value, 0) });

  readonly quotes = inject(QuoteService).searchQuotes(
    computed(() => ({
      reference: this.reference(),
      clientName: this.clientName(),
      state: this.state(),
      page: this.page(),
    })),
  );

  readonly filterForm = this.fb.nonNullable.group({
    reference: [''],
    clientName: [''],
    state: [''],
  });

  readonly columns = [
    'reference',
    'clientName',
    'quoteDate',
    'expirationDate',
    'state',
    'totalPrice',
  ];
  readonly states: QuoteState[] = ['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE'];

  constructor() {
    effect(() => {
      this.filterForm.patchValue(
        { reference: this.reference(), clientName: this.clientName(), state: this.state() },
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
    const { reference, clientName, state } = this.filterForm.getRawValue();
    // `page: null` : tout changement de filtre ramène à la première page, sinon
    // l'utilisateur filtre depuis la page 4 et croit qu'il n'y a aucun résultat.
    this.navigate(
      {
        reference: reference || null,
        clientName: clientName || null,
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
