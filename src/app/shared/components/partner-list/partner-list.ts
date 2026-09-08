import { Component, computed, effect, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth-service';
import { CrudService } from '../../../core/crud-service';
import { Address } from '../../../core/models/address';
import { debounceTime, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PartnerForm, PartnerFormData, PartnerRequest } from '../partner-form/partner-form';
import { ConfirmDialog, ConfirmDialogData } from '../confirm-dialog/confirm-dialog';
import { HttpResourceRef } from '@angular/common/http';
import { Page } from '../../../core/models/page';

export interface Partner {
  id: number;
  name: string;
  email: string;
  phone: string;
}
export interface PartnerListConfig {
  title: string;
  singularName: string;
  adminOnly?: boolean;
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'app-partner-list',
  styleUrl: './partner-list.scss',
  templateUrl: './partner-list.html',
})
export class PartnerList {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  readonly isAdmin = inject(AuthService).isAdmin;
  readonly canWrite = computed(() => !this.config().adminOnly || this.isAdmin());

  readonly config = input.required<PartnerListConfig>();
  readonly service = input.required<CrudService<Partner, PartnerRequest>>();
  readonly addressOf = input.required<(partner: Partner) => Address>();
  readonly partners = input.required<HttpResourceRef<Page<Partner>>>();

  readonly name = input(``);
  readonly email = input(``);

  readonly columns = ['name', 'email', 'phone', 'address', 'actions'];

  readonly filterForm = this.fb.nonNullable.group({
    name: [``],
    email: [``],
  });

  constructor() {
    effect(() => {
      this.filterForm.patchValue({ name: this.name(), email: this.email() }, { emitEvent: false });
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.applyFilters());
  }

  openForm(partner: Partner | null): void {
    const singular = this.config().singularName;

    this.dialog
      .open<PartnerForm, PartnerFormData, PartnerRequest>(PartnerForm, {
        width: '42rem',
        data: {
          title: partner ? `Modifier le ${singular}` : `Nouveau ${singular}`,
          value: partner
            ? {
                name: partner.name,
                email: partner.email,
                phone: partner.phone,
                address: this.addressOf()(partner),
              }
            : null,
        },
      })
      .afterClosed()
      .subscribe((request) => {
        if (!request) return;

        const call: Observable<unknown> = partner
          ? this.service().update(partner.id, request)
          : this.service().create(request);

        call.subscribe(() => this.partners().reload());
      });
  }

  onPageChange(event: PageEvent): void {
    this.navigate({ page: event.pageIndex || null });
  }

  private applyFilters(): void {
    const { name, email } = this.filterForm.getRawValue();
    this.navigate({ name: name || null, email: email || null, page: null }, true);
  }

  private navigate(queryParams: Record<string, string | number | null>, replaceUrl = false): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }

  remove(partner: Partner): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: `Archiver ce ${this.config().singularName} ?`,
          message: `« ${partner.name} » disparaîtra des listes mais restera visible sur les documents existants.`,
          confirmLabel: 'Archiver',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.service()
            .archive(partner.id)
            .subscribe(() => this.partners().reload());
        }
      });
  }
}
