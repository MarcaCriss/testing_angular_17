import { Component, inject } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsService } from '../../services/products.service';
import { ProductComponent } from './product.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProductFormComponent } from './product-form.component';

const IMPORTS_MODULES = [
  ProductComponent,
  ProgressSpinnerModule,
  AsyncPipe,
  DynamicDialogModule,
  ButtonModule,
  CommonModule,
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  styles: '',
  providers: [ProductsService, DialogService],
  template: `
    @if (products$ | async; as products) {
      <div class="flex justify-content-between align-items-center">
        <h1>Products</h1>
        <button pButton (click)="createProduct()">Add Product</button>
      </div>
      <div class="grid">
        @for (product of products; track product.id) {
          <app-product
            class="col-3"
            [product]="product"
            (deleteProductEmit)="deleteProduct($event)"
          ></app-product>
        } @empty {
          <p>There are no products to display.</p>
        }
      </div>
    } @else {
      <p-progressSpinner></p-progressSpinner>
    }
  `,
})
export class ProductsComponent {
  private productsService = inject(ProductsService);
  private dialogService = inject(DialogService);
  products$ = this.productsService.getProducts();
  isLoading = true;

  createProduct() {
    const ref = this.dialogService.open(ProductFormComponent, {
      header: 'Product Form',
      width: '50%',
    });

    ref.onClose.subscribe((res) => {
      if (res?.product) {
        this.products$ = this.productsService.getProducts();
      }
    });
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).subscribe((res) => {
      this.isLoading = true;
      this.products$ = this.productsService.getProducts();
    });
  }
}
