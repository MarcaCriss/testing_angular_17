import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPage)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.page').then(m => m.UsersPage)
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
];
