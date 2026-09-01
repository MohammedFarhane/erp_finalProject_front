import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAdmin()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
