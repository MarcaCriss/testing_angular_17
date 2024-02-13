import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { ProductInterface } from '../../shared/interfaces/product.interface';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';

const IMPORTS_MODULES = [
  ReactiveFormsModule,
  InputTextModule,
  DividerModule,
  ButtonModule,
  InputNumberModule,
  DropdownModule,
  ProgressSpinnerModule,
  NgClass,
  InputTextareaModule,
];

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  styles: `
    .container__spinner {
      height: 573px;
    }

    .image {
      width: 60px;
      height: 50px;
      object-fit: cover;
    }
    .container__images {
      max-height: 115px;
      overflow: auto;
    }
  `,
  providers: [CategoriesService, ProductsService],
  template: `
    @if (!isLoading) {
      <form novalidate [formGroup]="form" (ngSubmit)="submit()">
        <span class="p-float-label mt-5 p-fluid">
          <input type="text" pInputText formControlName="title" />
          <label for="username">Title</label>
        </span>
        <span class="p-float-label mt-5 p-fluid">
          <p-inputNumber formControlName="price">
          </p-inputNumber>
          <label for="username">Price</label>
        </span>
        <span class="p-float-label mt-5 p-fluid">
          <textarea
            rows="2"
            cols="30"
            pInputTextarea
            formControlName="description"
          ></textarea>
          <label for="username">Description</label>
        </span>
        <span class="p-float-label mt-5 p-fluid">
          <p-dropdown
            appendTo="body"
            [options]="categoryOptions"
            formControlName="categoryId"
          ></p-dropdown>
          <label for="username">CategoryId</label>
        </span>
        <ng-container formArrayName="images">
          <div class="flex justify-content-between align-items-center">
            <h3>Images</h3>
            <p-button
              type="button"
              icon="pi pi-plus"
              label="Add Image"
              class="p-button-sm"
              size="small"
              (click)="addImage()"
            ></p-button>
          </div>
          <div class="container__images custom-scroll">
            @for (image of images.controls; track id; let id = $index) {
              <div
                class="flex justify-content-between align-items-center"
                [ngClass]="images.controls.length < 2 ? '' : 'mt-2'"
              >
                <div class="flex align-items-center">
                  <button
                    pButton
                    type="button"
                    icon="pi pi-times"
                    class="mr-1 p-button-danger"
                    (click)="removeImage(id)"
                  ></button>
                  @if (image.value && isUrlValid(image.value)) {
                    <img [src]="image.value" alt="image" class="image" />
                  } @else {
                    <img
                      src="https://ih1.redbubble.net/image.1893341687.8294/fposter,small,wall_texture,product,750x1000.jpg"
                      alt="image"
                      class="image"
                    />
                  }
                </div>
                <input type="text" pInputText [formControlName]="id" />
              </div>
            }
          </div>
        </ng-container>
        <p-divider></p-divider>
        <div class="flex justify-content-end">
          <button
            pButton
            type="button"
            label="Cancel"
            class="p-button-danger mr-3"
            (click)="close()"
          ></button>
          <button
            pButton
            type="submit"
            label="Save"
            class="p-button-outlined"
          ></button>
        </div>
      </form>
    } @else {
      <div
        class="flex justify-content-center align-items-center container__spinner"
      >
        <p-progressSpinner></p-progressSpinner>
      </div>
    }
  `,
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);

  categoryOptions: { label: string; value: number }[] = [];
  form: FormGroup = this.buildForm();
  isLoading = false;
  product?: ProductInterface;
  ngOnInit(): void {
    this.product = this.dialogConfig.data?.product;
    if (this.product) {
      this.form = this.buildForm(this.product);
    }
    this.getCategories();
  }

  getCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categoryOptions = categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    });
  }

  buildForm(product?: ProductInterface): FormGroup {
    return this.fb.group({
      title: new FormControl(product?.title, Validators.required),
      price: new FormControl(product?.price || 0, [Validators.required, Validators.min(1)]),
      description: new FormControl(product?.description, Validators.required),
      categoryId: new FormControl(product?.category?.id, Validators.required),
      images: new FormArray(
        (product?.images || []).map(
          (image) => new FormControl(image, Validators.required),
        ),
        Validators.required,
      ),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAsDirty();
      return;
    }
    this.isLoading = true;
    if (this.product && this.product.id) {
      this.productsService
        .updateProduct(this.product.id, this.form.value)
        .subscribe((product) => {
          if (product) {
            this.close(product);
          }
          this.isLoading = false;
        });
    } else {
      this.productsService.saveProduct(this.form.value).subscribe((product) => {
        if (product) {
          this.close(product);
        }
        this.isLoading = false;
      });
    }
  }

  close(product?: ProductInterface): void {
    this.dialogRef.close({
      ...(product && {
        data: product,
      }),
    });
  }

  addImage(): void {
    this.images.push(new FormControl('', Validators.required));
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  isUrlValid(url: string): boolean {
    return /http(s?):\//.test(url);
  }

  get images(): FormArray {
    return this.form.get('images') as FormArray;
  }
}
