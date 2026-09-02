import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { QuoteService } from '../../services/quote-service';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { QuoteDetail } from '../../models/quotes';

@Component({
  imports: [MatTableModule, RouterLink, MatIcon, DecimalPipe, DatePipe, MatProgressBar, MatButton],
  selector: 'app-quote-details',
  styleUrl: './quote-details.scss',
  templateUrl: './quote-details.html',
})
export class QuoteDetails {
  private readonly quoteService = inject(QuoteService);
  private readonly dialog = inject(MatDialog);

  readonly id = input.required({ transform: (value: unknown) => numberAttribute(value, 0) });

  readonly quote = this.quoteService.getQuote(this.id);

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly lineColumns = ['productName', 'quantity', 'unitPrice', 'tvaRate', 'totalLinePrice'];

  send(): void {
    this.runTransition(this.quoteService.send(this.id()));
  }

  accept(): void {
    this.confirm({
      title: 'Accepter ce devis ?',
      message: 'Une facture sera créée.',
      confirmLabel: 'Accepter',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.runTransition(this.quoteService.accept(this.id()));
      }
    });
  }

  refuse(): void {
    this.confirm({
      title: 'Refuser ce devis ?',
      message: 'Cette action est irreversible.',
      confirmLabel: 'Refuser',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.runTransition(this.quoteService.refuse(this.id()));
      }
    });
  }

  openPdf(): void {
    this.quoteService.downloadPdf(this.id()).subscribe({
      next: (response) => {
        const url = URL.createObjectURL(response.body!);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.quote.value()?.reference ?? 'devis'}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.errorMessage.set("Le PDF n'a pas pu être généré."),
    });
  }

  // `afterClosed()` émet `undefined` sur Échap ou clic à côté : tout ce qui
  // n'est pas explicitement `true` est un refus.
  private confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
      .afterClosed()
      .pipe(map((result) => result === true));
  }

  // Les trois transitions ne diffèrent que par l'appel.
  private runTransition(request: Observable<QuoteDetail>): void {
    this.busy.set(true);
    this.errorMessage.set(null);

    request.subscribe({
      next: (updated) => {
        this.busy.set(false);
        // Le POST renvoie le devis complet : on écrit dans la ressource plutôt
        // que de la recharger. Un aller-retour en moins, pas de clignotement.
        this.quote.set(updated);
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        // 409 : mauvais état de départ, ou devis expiré. Le back rédige le
        // message, l'intercepteur laisse ce code passer intact.
        this.errorMessage.set(err.error?.detail ?? "L'opération a échoué.");
      },
    });
  }
}
