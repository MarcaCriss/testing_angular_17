import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { ProductComponent } from '../product/product.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe } from '@angular/common';

const IMPORTS_MODULES = [
  ProductComponent,
  ProgressSpinnerModule,
  AsyncPipe
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [ProductsService]
})
export class ProductsComponent {
  private productsService = inject(ProductsService);
  products$ = this.productsService.getProducts();
  isLoading = true;
}
