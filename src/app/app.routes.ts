import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/admin-shell/admin-shell').then(m => m.AdminShell),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
