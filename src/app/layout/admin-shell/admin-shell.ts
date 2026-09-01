import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';

@Component({
  imports: [
    MatToolbar,
    MatButton,
    MatIcon,
    MatListItem,
    RouterLinkActive,
    MatListItemIcon,
    MatListItemTitle,
    MatNavList,
    RouterOutlet,
    RouterLink,
  ],
  selector: 'app-admin-shell',
  styleUrl: './admin-shell.scss',
  templateUrl: './admin-shell.html',
})
export class AdminShell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;
  readonly isAdmin = this.authService.isAdmin;

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
