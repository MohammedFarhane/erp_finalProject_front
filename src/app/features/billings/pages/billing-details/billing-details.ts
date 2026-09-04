import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BillingService } from '../../services/billing-service';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { BillingDetail, PaymentRequest } from '../../models/billing';
import {
  PaymentDialog,
  PaymentDialogData,
} from '../../../../shared/components/payment-dialog/payment-dialog';

@Component({
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  selector: 'app-billing-details',
  templateUrl: './billing-details.html',
})
export class BillingDetails {
  private readonly billingService = inject(BillingService);
  private readonly dialog = inject(MatDialog);

  readonly id = input.required({
    transform: (value: unknown) => numberAttribute(value, 0),
  });

  readonly billing = this.billingService.getBilling(this.id);

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly lineColumns = ['name', 'quantity', 'unitPrice', 'tvaRate', 'totalLinePrice'];

  validate(): void {
    this.runTransition(this.billingService.validate(this.id()));
  }

  cancel(): void {
    this.confirm({
      title: 'Annuler la facture ?',
      message: 'Êtes vous sur ?',
      confirmLabel: 'Confirmer',
    }).subscribe((confirmed) => {
      if (confirmed)
        this.runTransition(this.billingService.cancel(this.id()));
    });
  }

  openPdf(): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    this.billingService.downloadPdf(this.id()).subscribe({
      next: (response) => {
        this.busy.set(false);
        const url = URL.createObjectURL(response.body!);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.billing.value()?.reference ?? 'facture'}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.busy.set(false);
        this.errorMessage.set("Le PDF n'a pas pu être généré.");
      },
    });
  }

  pay(): void {
    const current = this.billing.value();
    if (!current) {
      return;
    }

    this.dialog
      .open<PaymentDialog, PaymentDialogData, PaymentRequest>(PaymentDialog, {
        data: { reference: current.reference, remainingAmount: current.remainingAmount },
      })
      .afterClosed()
      .subscribe((payment) => {
        if (payment) {
          this.runTransition(this.billingService.pay(this.id(), payment));
        }
      });
  }

  private confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
      .afterClosed()
      .pipe(map((result) => result === true));
  }

  private runTransition(request: Observable<BillingDetail>): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    request.subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.billing.set(updated);
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.errorMessage.set(err.error?.detail ?? "L'opération a échoué.");
      },
    });
  }
}
