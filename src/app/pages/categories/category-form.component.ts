import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryInterface } from '../../shared/interfaces/product.interface';
import { CategoriesService } from '../../services/categories.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const IMPORTS_MODULES = [
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  DividerModule,
  ProgressSpinnerModule,
];

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  providers: [CategoriesService],
  styles: `
    .image {
      height: 20rem;
      width: 100%;
      object-fit: contain;
    }
    .container__spinner {
      height: 573px;
    }
  `,
  template: `
    @if (!isLoading) {
      <form novalidate [formGroup]="form" (ngSubmit)="submit()">
        <span class="p-float-label mt-5 p-fluid">
          <input type="text" pInputText formControlName="name" />
          <label>Name</label>
        </span>
        <span class="p-float-label mt-5 p-fluid">
          <input type="text" pInputText formControlName="image" />
          <label>Image</label>
        </span>
        <img [src]="image" alt="Category Image" class="mt-3 image" />
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
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private categoriesService = inject(CategoriesService);
  form = this.formBuild();
  isLoading = false;
  category!: CategoryInterface;

  ngOnInit() {
    this.category = this.dialogConfig.data?.category;
    if (this.category) {
      this.form.patchValue(this.category);
    }
  }

  formBuild(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  close(category?: CategoryInterface) {
    this.dialogRef.close({
      ...(category && { data: category }),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.category) {
      this.categoriesService
        .updateCategory(this.category.id, this.form.value)
        .subscribe((category) => {
          this.isLoading = false;
          this.close(category);
        });
    } else {
      this.categoriesService
        .saveCategory(this.form.value)
        .subscribe((category) => {
          this.isLoading = false;
          this.close(category);
        });
    }
  }

  get image(): string {
    return (
      this.form.get('image')?.value ||
      'https://ih1.redbubble.net/image.1893341687.8294/fposter,small,wall_texture,product,750x1000.jpg'
    );
  }
}
