import { Component, OnInit, inject } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { CategoryInterface } from '../../shared/interfaces/product.interface';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoryFormComponent } from './category-form.component';
import { PrimeIcons } from 'primeng/api';
import { CategoryProductsComponent } from './category-products.component';
import { OnlyAdminDirective } from '../../shared/directives/only-admin.directive';

const IMPORTS_MODULES = [
  TableModule,
  DividerModule,
  InputTextModule,
  ButtonModule,
  OnlyAdminDirective,
];

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  providers: [CategoriesService, DialogService],
  styles: `
    .image {
      width: 60px;
      height: 50px;
    }
  `,
  template: `
    <div class="flex justify-content-between align-items-center">
      <h1>Categories</h1>
      <button
        pButton
        (click)="addCategory()"
        [icon]="primeIcons.PLUS"
        label="Add Category"
        *appOnlyAdmin
      ></button>
    </div>
    <p-divider></p-divider>
    <p-table
      [value]="categories"
      [paginator]="true"
      [rows]="5"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      [rowsPerPageOptions]="[5, 15, 25]"
      [loading]="isLoading"
    >
      <ng-template pTemplate="header">
        <tr>
          @for (column of columns; track $index) {
            <th [pSortableColumn]="column.field">
              {{ column.header }}
              @if (column.field !== 'actions' && column.field !== 'image') {
                <p-sortIcon [field]="column.field"></p-sortIcon>
              }
            </th>
          }
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-category>
        <tr>
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <img [src]="category.image" [alt]="category.name" class="image" />
          </td>
          <td>
            <button
              *appOnlyAdmin
              pButton
              label="Edit"
              [icon]="primeIcons.PENCIL"
              (click)="editCategory(category)"
              class="mr-2 p-button-outlined p-button-success"
            ></button>
            <button
              pButton
              label="Products"
              [icon]="primeIcons.EYE"
              (click)="showProducts(category)"
              class="mr-2 p-button-outlined p-button-info"
            ></button>
            <button
              *appOnlyAdmin
              pButton
              label="Delete"
              [icon]="primeIcons.TIMES"
              (click)="deleteCategory(category.id)"
              class="p-button-outlined p-button-danger"
            ></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class CategoriesPage implements OnInit {
  private categoriesService = inject(CategoriesService);
  private dialogService = inject(DialogService);
  categories: CategoryInterface[] = [];
  columns = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Name' },
    { field: 'image', header: 'Image' },
    { field: 'actions', header: 'Actions' },
  ];
  isLoading = false;
  primeIcons = PrimeIcons;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.isLoading = true;
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.isLoading = false;
    });
  }

  addCategory(): void {
    this.dialogService
      .open(CategoryFormComponent, {
        header: 'Category Form',
        width: '50%',
      })
      .onClose.subscribe((res) => {
        if (res?.data) {
          this.getCategories();
        }
      });
  }

  editCategory(category: CategoryInterface): void {
    this.dialogService
      .open(CategoryFormComponent, {
        data: {
          category,
        },
        header: 'Category Form',
        width: '50%',
      })
      .onClose.subscribe((res) => {
        if (res?.data) {
          this.getCategories();
        }
      });
  }

  deleteCategory(id: number): void {
    this.isLoading = true;
    this.categoriesService.deleteCategory(id).subscribe(() => {
      this.getCategories();
    });
  }

  showProducts(category: CategoryInterface): void {
    this.dialogService.open(CategoryProductsComponent, {
      data: {
        category,
      },
      header: `Products of "${category.name}"`,
      width: '60%',
    });
  }
}
