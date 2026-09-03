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
      //  QUOTES
      {
        path: 'quotes',
        loadComponent: () =>
          import('./features/quotes/pages/quote-list/quote-list').then((m) => m.QuoteList),
      },
      {
        path: 'quotes/new',
        loadComponent: () =>
          import('./features/quotes/pages/quote-create/quote-create').then((m) => m.QuoteCreate),
      },
      {
        path: 'quotes/:id',
        loadComponent: () =>
          import('./features/quotes/pages/quote-details/quote-details').then((m) => m.QuoteDetails),
      },
      //  BILLINGS
      {
        path: 'billings',
        loadComponent: () =>
          import('./features/billings/pages/billing-list/billing-list').then((m) => m.BillingList),
      },
      {
        path: 'billings/new',
        loadComponent: () =>
          import('./features/billings/pages/billing-create/billing-create').then(
            (m) => m.BillingCreate),
      },
      {
        path: 'billings/:id',
        loadComponent: () =>
          import('./features/billings/pages/billing-detail/billing-detail').then(
            (m) => m.BillingDetail),
      },
      //  PURCHASE ORDERS
      {
        path: 'purchase-orders/new',
        loadComponent: () =>
          import('./features/purchase-order/pages/purchase-order-create/purchase-order-create').then(
            (m) => m.PurchaseOrderCreate),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
