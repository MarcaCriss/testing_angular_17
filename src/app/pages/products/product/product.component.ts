import { Component, Input, inject } from '@angular/core';
import { ProductInterface } from '../../../shared/interfaces/product.interface';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ButtonModule } from 'primeng/button';

const IMPORTS_MODULES = [CardModule, ButtonModule];

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  @Input({ required: true }) product?: ProductInterface;
  private dialogService = inject(DialogService);

  editProduct(): void {
    this.dialogService
      .open(ProductFormComponent, {
        data: {
          product: {
            ...this.product,
            images: this.images,
          },
        },
        header: 'Product Form',
        width: '50%',
      })
      .onClose.subscribe((res) => {
        if (res?.data) {
          this.product = res.data;
        }
      });
  }

  get images(): string[] {
    if (this.product?.images) {
      if (
        typeof this.product.images[0] === 'string' &&
        this.product.images[0].startsWith('["')
      ) {
        return this.product.images.map((url) => url.replace(/\\|\[|\]|"/g, ''));
      } else {
        return this.product.images;
      }
    }
    return [
      'https://ih1.redbubble.net/image.1893341687.8294/fposter,small,wall_texture,product,750x1000.jpg',
    ];
  }
}
