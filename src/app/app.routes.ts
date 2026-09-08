import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

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
            (m) => m.BillingCreate,
          ),
      },
      {
        path: 'billings/:id',
        loadComponent: () =>
          import('./features/billings/pages/billing-details/billing-details').then(
            (m) => m.BillingDetails,
          ),
      },
      //  PURCHASE-ORDERS
      {
        path: 'purchase-orders',
        loadComponent: () =>
          import('./features/purchase-orders/pages/purchase-order-list/purchase-order-list').then(
            (m) => m.PurchaseOrderList,
          ),
      },
      {
        path: 'purchase-orders/new',
        loadComponent: () =>
          import('./features/purchase-orders/pages/purchase-order-create/purchase-order-create').then(
            (m) => m.PurchaseOrderCreate,
          ),
      },
      {
        path: 'purchase-orders/:id',
        loadComponent: () =>
          import('./features/purchase-orders/pages/purchase-order-details/purchase-order-details').then(
            (m) => m.PurchaseOrderDetails,
          ),
      },
      //  PRODUCTS
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/product-list/product-list').then((m) => m.ProductList),
      },
      //  CATEGORIES
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/pages/category-list/category-list').then(
            (m) => m.CategoryList,
          ),
      },
      //  CLIENTS
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/pages/client-list/client-list').then((m) => m.ClientList),
      },
      //  SUPPLIERS
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/suppliers/pages/supplier-list/supplier-list').then((m) => m.SupplierList),
      },
      // USERS
      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/users/pages/user-list/user-list').then((m) => m.UserList),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
