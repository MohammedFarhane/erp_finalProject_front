import { Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../../../core/services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserForm, UserFormData } from '../../components/user-form/user-form';
import { User, UserRequest, UserRole, UserUpdateRequest } from '../../models/user';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { PAGE_SIZE } from '../../../../core/api';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButton,
    MatIcon,
    MatIconButton,
  ],
  selector: 'app-user-list',
  styleUrl: './user-list.scss',
  templateUrl: './user-list.html',
})
export class UserList {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);

  readonly isAdmin = inject(AuthService).isAdmin;
  readonly name = input('');
  readonly email = input('');
  readonly role = input('');
  readonly page = input(0,
    {transform: (value: unknown) => numberAttribute(value, 0)});

  readonly users = inject(UserService).search(
    computed(() => ({
      page: this.page(),
      size: PAGE_SIZE,
      name: this.name(),
      email: this.email(),
      role: this.role(),
    })),
  );

  readonly columns= ['name', 'email', 'role', 'actions'];

  readonly roles: UserRole[] = ['ADMIN', 'EMPLOYEE'];

  readonly filterForm = this.fb.nonNullable.group({
    name: [''],
    email: [''],
    role: [''],
  });

  constructor() {
    effect(() => {
      this.filterForm.patchValue(
        { name: this.name(), email: this.email(), role: this.role() },
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
    const { name, email, role } = this.filterForm.getRawValue();
    this.navigate({ name: name || null, email: email || null, role: role || null });
  }

  private navigate(queryParams: Record<string, string | number | null>, replaceUrl = false): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }

  openForm(user: User | null): void {
    this.dialog
      .open<UserForm, UserFormData, UserRequest | UserUpdateRequest>(UserForm, {
        data: { user },
      })
      .afterClosed()
      .subscribe((request) => {
        if (!request) {
          return;
        }
        const call: Observable<unknown> = user
          ? this.userService.update(user.id, request)
          : this.userService.create(request as UserRequest);

        call.subscribe(() => this.users.reload());
      });
  }

  remove(user: User): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Archiver cet utilisateur ?',
          message: `« ${user.name} » disparaîtra des listes mais restera visible sur les documents existants.`,
          confirmLabel: 'Archiver',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.userService.archive(user.id).subscribe(() => this.users.reload());
        }
      });
  }
}
