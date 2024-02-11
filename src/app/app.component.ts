import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule} from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ProductsComponent } from './pages/products/products.component';

const IMPORTS_MODULES = [
  CommonModule,
  RouterOutlet,
  ButtonModule,
  TabViewModule,
  ProductsComponent,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);

  redirectProducts() {
    this.router.navigate(['product']);
  }

  redirectHome() {
    this.router.navigate(['']);
  }
}
