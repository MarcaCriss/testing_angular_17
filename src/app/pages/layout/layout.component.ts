import { Component, inject } from '@angular/core';

import { ProductsPage } from '../products/products.page';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';

const IMPORTS_MODULES = [
  ProductsPage,
  HeaderComponent,
  RouterOutlet
];

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  template: `
    <app-header></app-header>
    <main class="p-card p-3 mt-5">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `
    main {
      width: 1600px;
      margin: 0 auto;
    }
  `
})
export class LayoutComponent {}
