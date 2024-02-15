import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserRole } from '../../shared/enums/user.enum';
import { TitleCasePipe } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { debounceTime } from 'rxjs';

const IMPORTS_MODULES = [
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  DividerModule,
  ProgressSpinnerModule,
  DropdownModule,
  TitleCasePipe,
  PasswordModule,
];

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  providers: [TitleCasePipe],
  styles: `
    .container__spinner {
      height: 573px;
    }
    .image {
      width: 20rem;
      height: 20rem;
      border-radius: 50%;
      object-fit: cover;
    }
  `,
  template: `
    @if (!isLoading) {
      <div class="grid grid-nogutter">
        <div class="col-5">
          <div class="flex justify-content-center align-items-center h-full">
            <img [src]="avatar" alt="avatar" class="image" />
          </div>
        </div>
        <div class="col-1">
          <p-divider layout="vertical"></p-divider>
        </div>
        <div class="col-6">
          <form novalidate [formGroup]="form">
            <span class="p-float-label mt-5 p-fluid">
              <input type="text" pInputText formControlName="name" />
              <label>Name</label>
            </span>
            <span class="p-float-label mt-5 p-fluid">
              <input type="email" pInputText formControlName="email" />
              <label>E-mail</label>
            </span>
            @if (isEmailRegistered) {
              <p class="p-error mt-0 ml-2">The email is already registered</p>
            }
            <span class="p-float-label mt-5 p-fluid">
              <input type="text" pInputText formControlName="avatar" />
              <label>Avatar</label>
            </span>
            <span class="p-float-label mt-5 p-fluid">
              <p-dropdown
                [options]="roleOptions"
                formControlName="role"
              ></p-dropdown>
              <label>Role</label>
            </span>
            <span class="p-float-label mt-5 p-fluid">
              <p-password
                formControlName="password"
                [feedback]="true"
                [toggleMask]="true"
              ></p-password>
              <label>Password</label>
            </span>
          </form>
        </div>
      </div>
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
          type="button"
          label="Save"
          (click)="submit()"
          class="p-button-outlined"
        ></button>
      </div>
    } @else {
      <div
        class="flex justify-content-center align-items-center container__spinner"
      >
        <p-progressSpinner></p-progressSpinner>
      </div>
    }
  `,
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private titleCasePipe = inject(TitleCasePipe);
  private dialogConfig = inject(DynamicDialogConfig);
  private dialogRef = inject(DynamicDialogRef);
  private usersService = inject(UsersService);
  isLoading = false;
  form = this.buildForm();
  roleOptions = Object.entries(UserRole).map(([key, value]) => ({
    label: this.titleCasePipe.transform(key),
    value,
  }));
  user!: UserInterface;
  isEmailRegistered = false;

  ngOnInit() {
    this.user = this.dialogConfig.data?.user;
    if (this.user) {
      this.form.patchValue(this.user);
    } else {
      this.form
        .get('email')
        ?.valueChanges.pipe(debounceTime(400))
        .subscribe((email) => {
          this.checkEmail(email);
        });
    }
  }

  checkEmail(email: string): void {
    this.usersService.checkEmail(email).subscribe((data) => {
      if (data.isAvailable) {
        this.isEmailRegistered = true;
      } else {
        this.isEmailRegistered = false;
      }
    });
  }

  buildForm(): FormGroup {
    return this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', [Validators.required]],
        password: ['', [Validators.required]],
        avatar: ['', [Validators.required]],
      },
      { updateOn: 'blur' },
    );
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.user && this.user.id) {
      this.usersService
        .updateUser(this.user.id, this.form.value)
        .subscribe((user) => {
          this.isLoading = false;
          this.close(user);
        });
    } else {
      this.usersService.saveUser(this.form.value).subscribe((user) => {
        this.isLoading = false;
        this.close(user);
      });
    }
  }

  close(user?: UserInterface) {
    this.dialogRef.close({
      ...(user && { data: user }),
    });
  }

  get avatar(): string {
    return (
      this.form.get('avatar')?.value ||
      'https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png?fit=500%2C500&ssl=1'
    );
  }
}
