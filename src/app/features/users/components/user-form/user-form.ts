import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DialogDrag } from '../../../../shared/directives/dialog-drag';
import { User, UserRequest, UserRole, UserUpdateRequest } from '../../models/user';

export interface UserFormData {
  user: User | null;
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DialogDrag,
  ],
  selector: 'app-user-form',
  styleUrl: './user-form.scss',
  templateUrl: './user-form.html',
})
export class UserForm {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject<MatDialogRef<UserForm, UserRequest | UserUpdateRequest>>(MatDialogRef)

  readonly data = inject<UserFormData>(MAT_DIALOG_DATA);
  readonly isEdit = this.data.user !== null;
  readonly roles: UserRole[] = ['ADMIN', 'EMPLOYEE'];

  readonly form = this.fb.nonNullable.group({
    name: [this.data.user?.name ?? ``, Validators.required],
    email: [this.data.user?.email ?? ``, [Validators.required, Validators.email]],
    password: [``, this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
    role: this.fb.nonNullable.control<UserRole>(this.data.user?.role ?? 'EMPLOYEE'),
  });

  submit(): void {
    const { name, email, password, role } = this.form.getRawValue();
    this.ref.close(this.isEdit ? { name, email, role } : { name, email, password, role });
  }
}
