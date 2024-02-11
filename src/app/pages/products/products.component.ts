import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { ProductComponent } from '../product/product.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const IMPORTS_MODULES = [
  ProductComponent,
  ProgressSpinnerModule,
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [ProductsService]
})
export class ProductsComponent implements OnInit {
  private productsService = inject(ProductsService);
  products: Product[] = [];
  isLoading = true;
  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data) => {
      this.isLoading = false;
      this.products = data;
    });
  }
}
