import { Component, inject } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsService } from '../../services/products.service';
import { ProductComponent } from './product/product.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProductFormComponent } from './product-form/product-form.component';

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
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [ProductsService, DialogService]
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
}
