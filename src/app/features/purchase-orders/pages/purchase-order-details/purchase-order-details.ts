import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PurchaseOrderService } from '../../services/purchase-order-service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { map, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PurchaseOrderDetail } from '../../models/purchase-order';

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
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.html',
})
export class PurchaseOrderDetails {
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly dialog = inject(MatDialog);

  readonly id = input.required({
    transform: (value: unknown) => numberAttribute(value, 0),
  });

  readonly purchaseOrder = this.purchaseOrderService.getPurchaseOrder(this.id);

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly lineColumns = ['productName', 'quantity', 'unitPrice'];

  receive(): void {
    this.runTransition(this.purchaseOrderService.receive(this.id()));
  }

  cancel(): void {
    this.confirm({
      title: 'Annuler la commande ?',
      message: 'Êtes vous sur ?',
      confirmLabel: 'Confirmer',
    }).subscribe((confirmed) => {
      if (confirmed) this.runTransition(this.purchaseOrderService.cancel(this.id()));
    });
  }

  openPdf(): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    this.purchaseOrderService.downloadPdf(this.id()).subscribe({
      next: (response) => {
        this.busy.set(false);
        const url = URL.createObjectURL(response.body!);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.purchaseOrder.value()?.reference ?? 'commande'}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.busy.set(false);
        this.errorMessage.set("Le PDF n'a pas pu être généré.");
      },
    });
  }

  private confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
      .afterClosed()
      .pipe(map((result) => result === true));
  }

  private runTransition(request: Observable<PurchaseOrderDetail>): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    request.subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.purchaseOrder.set(updated);
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.errorMessage.set(err.error?.detail ?? "L'opération a échoué.");
      },
    });
  }
}
