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
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/admin-shell/admin-shell').then((m) => m.AdminShell),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'quotes',
        loadComponent: () =>
          import('./features/quotes/pages/quote-list/quote-list').then((m) => m.QuoteList),
      },
      {
        path: 'quotes/:id',
        loadComponent: () =>
          import('./features/quotes/pages/quote-details/quote-details').then((m) => m.QuoteDetails),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
