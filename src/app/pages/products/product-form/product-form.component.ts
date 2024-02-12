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
import { ProductInterface } from '../../../shared/interfaces/product.interface';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CategoriesService } from '../../../services/categories.service';
import { ProductsService } from '../../../services/products.service';
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
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  providers: [CategoriesService, ProductsService],
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
      price: new FormControl(product?.price || 0, Validators.required),
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
