import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  {
    path: 'product',
    component: ProductsComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];
