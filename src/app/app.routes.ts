import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/admin-shell/admin-shell').then(m => m.AdminShell),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
