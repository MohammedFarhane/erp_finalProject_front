import { DialogDrag } from '../../directives/DialogDrag';
import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PaymentMethod } from '../../../features/billings/models/billing';

export interface PaymentDialogData {
  reference: string;
  remainingAmount: number;
}

@Component({
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DialogDrag,
  ],
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.html',
})
export class PaymentDialog {
  private readonly fb = inject(FormBuilder);

  readonly data = inject<PaymentDialogData>(MAT_DIALOG_DATA);
  readonly methods: PaymentMethod[] = ['VIREMENT', 'CARTE', 'ESPECE', 'CHEQUE'];

  readonly form = this.fb.nonNullable.group({
    amount: [
      this.data.remainingAmount,
      [Validators.required, Validators.min(0.01), Validators.max(this.data.remainingAmount)],
    ],
    method: this.fb.nonNullable.control<PaymentMethod>('VIREMENT'),
  });
}
