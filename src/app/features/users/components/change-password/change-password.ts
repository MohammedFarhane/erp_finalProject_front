import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DialogDrag } from '../../../../shared/directives/dialog-drag';
import { UserService } from '../../services/user-service';
import { HttpErrorResponse } from '@angular/common/http';

function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const { newPassword, confirmation } = group.value;
  return newPassword === confirmation ? null : { mismatch: true };
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
  selector: 'app-change-password',
  styleUrl: './change-password.scss',
  templateUrl: './change-password.html',
})
export class ChangePassword {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly ref = inject<MatDialogRef<ChangePassword>>(MatDialogRef);

  readonly busy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmation: ['', Validators.required],
  },
    { validators: passwordMatch }
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.form.getRawValue();
    this.busy.set(true);
    this.errorMessage.set(null);

    this.userService.changePassword({ oldPassword, newPassword }).subscribe({
      next: () => this.ref.close(true),
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.errorMessage.set(err.error?.detail ?? "Le mot de passe n'a pas pu être modifié.");
      },
    });
  }
}
