import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { FilesService } from '../../services/files.service';

const IMPORTS_MODULES = [
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  DividerModule,
  ProgressSpinnerModule,
  DropdownModule,
  TitleCasePipe,
  PasswordModule,
  FileUploadModule,
];

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  providers: [TitleCasePipe, UsersService, FilesService],
  styles: `
    .container__spinner {
      height: 573px;
    }
    .image {
      width: 20rem;
      height: 20rem;
      border-radius: 50%;
      object-fit: contain;
    }
  `,
  template: `
    @if (!isLoading) {
      <div class="grid grid-nogutter">
        <div class="col-5">
          <div
            class="flex flex-column justify-content-center align-items-center"
          >
            <img [src]="avatar" alt="avatar" class="image" />
            <div class="flex justify-content-center">
              <p-fileUpload
                (uploadHandler)="uploadImage($event)"
                [customUpload]="true"
                mode="basic"
                chooseLabel="Upload Image"
                class="mt-2 mr-2"
                accept="image/*"
                [auto]="true"
              ></p-fileUpload>
              @if (file) {
                <button
                  pButton
                  label="Delete Image"
                  class="p-button-danger mt-2"
                  (click)="deleteImage()"
                ></button>
              }
            </div>
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
  @ViewChild(FileUpload) avatarImageUploader?: FileUpload;
  private fb = inject(FormBuilder);
  private titleCasePipe = inject(TitleCasePipe);
  private dialogConfig = inject(DynamicDialogConfig);
  private dialogRef = inject(DynamicDialogRef);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private filesService = inject(FilesService);
  isLoading = false;
  form = this.buildForm();
  roleOptions = Object.entries(UserRole).map(([key, value]) => ({
    label: this.titleCasePipe.transform(key),
    value,
  }));
  user!: UserInterface;
  isEmailRegistered = false;
  file: File | null = null;
  urlAvatarTemp: string | null = null;
  isUserProfile = false;

  ngOnInit() {
    this.user = this.dialogConfig.data?.user;
    this.isUserProfile = this.dialogConfig.data?.isUserProfile;
    if (this.user) {
      this.form.patchValue(this.user);
      this.urlAvatarTemp = this.user.avatar;
    } else {
      this.form
        .get('email')
        ?.valueChanges.pipe(debounceTime(400))
        .subscribe((email) => {
          this.checkEmail(email);
        });
    }
    if (this.user && !this.isAdmin) {
      this.form.get('role')?.disable();
    }
    this.form.get('avatar')?.valueChanges.subscribe((value) => {
      if (value && this.isUrlValid(value)) {
        this.file = null;
      }
    });
  }

  uploadImage(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio === 1) {
          this.file = event.files[0];
          this.form.get('avatar')?.setValue(reader.result);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'The image must be square',
          });
        }
      };
    };
    this.avatarImageUploader?.clear();
  }

  deleteImage() {
    this.file = null;
    if (
      this.form.get('avatar')?.value &&
      !this.isUrlValid(this.form.get('avatar')?.value)
    ) {
      this.form.get('avatar')?.setValue(this.urlAvatarTemp);
    }
  }

  isUrlValid(url: string): boolean {
    return url.includes('http');
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
    if (this.file) {
      this.filesService.uploadFile(this.file).subscribe((file) => {
        this.form.get('avatar')?.setValue(file.location);
        this.saveOrUpdateUser();
      });
    } else {
      this.saveOrUpdateUser();
    }
  }

  saveOrUpdateUser() {
    if (this.user && this.user.id) {
      this.usersService
        .updateUser(this.user.id, this.form.value)
        .subscribe((user) => {
          this.saveUserProfile(user);
          this.isLoading = false;
          this.close(user);
        });
    } else {
      this.usersService.saveUser(this.form.value).subscribe((user) => {
        this.saveUserProfile(user);
        this.isLoading = false;
        this.close(user);
      });
    }
  }

  saveUserProfile(user: UserInterface) {
    if (this.isUserProfile) {
      this.authService.user = user;
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

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
}
