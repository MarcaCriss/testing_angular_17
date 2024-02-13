import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ProductInterface } from '../../shared/interfaces/product.interface';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from './product-form.component';
import { ButtonModule } from 'primeng/button';

const IMPORTS_MODULES = [CardModule, ButtonModule];

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  styles: '',
  template: `
    <p-card [header]="product?.title">
      <ng-template pTemplate="header">
        <div class="relative">
          <img alt="Card" [src]="images[0]" />
          <div class="absolute top-0 right-0">
            <button
              pButton
              icon="pi pi-pencil"
              (click)="editProduct()"
              class="p-button-sm mr-2"
            ></button>
            <button
              pButton
              icon="pi pi-trash"
              (click)="deleteProduct()"
              class="p-button-sm p-button-danger"
            ></button>
          </div>
        </div>
      </ng-template>
      <p class="m-0">
        {{ product?.description }}
      </p>
      <ng-template pTemplate="footer">
        <div class="flex justify-content-between">
          <p>$ {{ product?.price }}</p>
          <p>{{ product?.category?.name }}</p>
        </div>
      </ng-template>
    </p-card>
  `,
})
export class ProductComponent {
  @Input({ required: true }) product?: ProductInterface;
  @Output() deleteProductEmit = new EventEmitter<number>();
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

  deleteProduct(): void {
    this.deleteProductEmit.emit(this.product?.id);
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
