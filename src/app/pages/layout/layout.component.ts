import { Component, inject } from '@angular/core';

import { ProductsComponent } from '../products/products.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';

const IMPORTS_MODULES = [
  ProductsComponent,
  HeaderComponent,
  RouterOutlet
];

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  template: `
    <app-header></app-header>
    <main style="padding: 1rem;">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {}
