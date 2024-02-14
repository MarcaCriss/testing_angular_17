import { Component, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  CategoryInterface,
  ProductInterface,
} from '../../shared/interfaces/product.interface';
import { CategoriesService } from '../../services/categories.service';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';

const IMPORTS_MODULES = [TableModule, CurrencyPipe];

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  providers: [CategoriesService],
  template: `
    <p-table
      #dt1
      [value]="products"
      dataKey="id"
      [rows]="5"
      [showCurrentPageReport]="true"
      [loading]="isLoading"
      [paginator]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      [globalFilterFields]="['title', 'price']"
    >
      <ng-template pTemplate="header">
        <tr>
          @for (column of columns; track $index) {
            <th>
              <div class="flex align-items-center">
                {{ column.header }}
                @if (column.type) {
                  <p-columnFilter
                    [type]="column.type"
                    [field]="column.field"
                    display="menu"
                  ></p-columnFilter>
                }
              </div>
            </th>
          }
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-product>
        <tr>
          <td>{{ product.id }}</td>
          <td>
            {{ product.title }}
          </td>
          <td>
            {{ product.price | currency: 'USD' }}
          </td>
          <td>
            <p class="m-0 description">{{ product.description }}</p>
          </td>
          <td>
            @for (image of product.images; track $index) {
              <img [src]="image" style="width: 50px" class="mr-2" />
            }
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="5">No products found.</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: `
    .description {
      width: 10rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  `,
})
export class CategoryProductsComponent implements OnInit {
  private dialogConfig = inject(DynamicDialogConfig);
  private categoryService = inject(CategoriesService);
  category!: CategoryInterface;
  products: ProductInterface[] = [];
  isLoading = false;
  columns = [
    { field: 'id', header: 'Id' },
    { field: 'title', header: 'Name', type: 'text' },
    { field: 'price', header: 'Price', type: 'numeric' },
    { field: 'description', header: 'Description' },
    { field: 'images', header: 'Images' },
  ];

  ngOnInit(): void {
    this.category = this.dialogConfig.data.category;
    this.getProducts();
  }

  getProducts() {
    this.isLoading = true;
    this.categoryService
      .showProducts(this.category.id)
      .subscribe((products) => {
        this.products = products;
        this.isLoading = false;
      });
  }
}
