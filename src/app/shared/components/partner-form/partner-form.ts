import { DialogDrag } from '../../directives/DialogDrag';
import { Component, inject } from '@angular/core';
import { Address } from '../../../core/models/address';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface PartnerRequest {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface PartnerFormData {
  title: string;
  value: PartnerRequest | null;
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
  selector: 'app-partner-form',
  styleUrl: './partner-form.scss',
  templateUrl: './partner-form.html',
})
export class PartnerForm {
  private readonly fb = inject(FormBuilder);

  readonly data = inject<PartnerFormData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.value?.name ?? '', Validators.required],
    email: [this.data.value?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.data.value?.phone ?? '', Validators.required],
    address: this.fb.nonNullable.group({
      street: [this.data.value?.address.street ?? '', Validators.required],
      number: [this.data.value?.address.number ?? '', Validators.required],
      postalCode: [this.data.value?.address.postalCode ?? '', Validators.required],
      locality: [this.data.value?.address.locality ?? '', Validators.required],
    }),
  });
}
