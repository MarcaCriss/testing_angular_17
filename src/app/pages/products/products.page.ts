import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductComponent } from './product.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProductFormComponent } from './product-form.component';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { SliderModule } from 'primeng/slider';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';

const IMPORTS_MODULES = [
  ProductComponent,
  ProgressSpinnerModule,
  AsyncPipe,
  DynamicDialogModule,
  ButtonModule,
  CommonModule,
  DividerModule,
  InputTextModule,
  FormsModule,
  ReactiveFormsModule,
  ListboxModule,
  SliderModule,
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  styles: '',
  providers: [ProductsService, DialogService, CategoriesService],
  template: `
    @if (products$ | async; as products) {
      <ng-container [formGroup]="form">
        <div class="flex justify-content-between align-items-center">
          <h1>Products</h1>
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input type="text" pInputText formControlName="title" />
          </span>
          <button pButton (click)="createProduct()">Add Product</button>
        </div>
        <p-divider></p-divider>
        <div class="grid">
          <div class="col-2">
            <h2>Categories</h2>
            <p-listbox
              [options]="categories"
              listStyleClass="custom-scroll"
              formControlName="categoryId"
              [listStyle]="{ 'max-height': '440px' }"
            ></p-listbox>
            <h2>Prices</h2>
            <p-slider
              [range]="true"
              [min]="10"
              [max]="200"
              [step]="10"
              formControlName="rangesPrices"
            ></p-slider>
            <div class="flex justify-content-between">
              <p>Min: $ {{ priceMin }}</p>
              <p>Max: $ {{ priceMax }}</p>
            </div>
          </div>
          <div class="col-10">
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
          </div>
        </div>
      </ng-container>
    } @else {
      <p-progressSpinner></p-progressSpinner>
    }
  `,
})
export class ProductsPage implements OnInit {
  private productsService = inject(ProductsService);
  private dialogService = inject(DialogService);
  private categoriesService = inject(CategoriesService);
  private fb = inject(FormBuilder);
  products$ = this.productsService.getProducts();
  isLoading = true;
  form = this.formBuild();
  categories: { label: string; value: number | null }[] = [];

  ngOnInit(): void {
    this.getCategories();
    this.formBuild();
    this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.getProducts();
    });
  }

  formBuild(): FormGroup {
    return this.fb.group({
      title: new FormControl(''),
      rangesPrices: new FormControl([10, 200]),
      categoryId: new FormControl(null),
    });
  }

  getCategories(): void {
    this.categoriesService.getCategories().subscribe((res) => {
      this.categories = res.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      this.categories.unshift({ label: 'All', value: null });
    });
  }

  createProduct() {
    const ref = this.dialogService.open(ProductFormComponent, {
      header: 'Product Form',
      width: '50%',
    });

    ref.onClose.subscribe((res) => {
      if (res?.data) {
        this.getProducts();
      }
    });
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).subscribe((res) => {
      this.isLoading = true;
      this.getProducts();
    });
  }

  getProducts() {
    this.isLoading = true;
    this.products$ = this.productsService.getProducts({
      title: this.title,
      categoryId: this.categoryId,
      price_min: this.priceMin,
      price_max: this.priceMax,
    });
  }

  get title(): string {
    return this.form.get('title')?.value;
  }

  get categoryId(): number {
    return this.form.get('categoryId')?.value;
  }

  get priceMin(): number {
    return this.form.get('rangesPrices')?.value[0];
  }

  get priceMax(): number {
    return this.form.get('rangesPrices')?.value[1];
  }
}
