import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const IMPORTS_MODULES = [
  CardModule,
  InputTextModule,
  ButtonModule,
  PasswordModule,
  ReactiveFormsModule,
  ProgressSpinnerModule,
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  template: `
    <div class="flex justify-content-center align-items-center h-screen">
      <p-card [style]="{ width: '27rem' }">
        @if (!isLoading) {
          <h1 class="m-0">Login</h1>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <span class="p-float-label mt-5 p-fluid">
              <input type="text" pInputText formControlName="email" />
              <label>Email*</label>
            </span>
            <span class="p-float-label mt-5 p-fluid">
              <p-password
                formControlName="password"
                [toggleMask]="true"
                [feedback]="false"
              ></p-password>
              <label>Password*</label>
            </span>
            <button pButton label="Login" type="submit" class="mt-5"></button>
          </form>
        } @else {
          <div class="flex justify-content-center align-items-center container__spinner">
            <p-progressSpinner class="p-text-center"></p-progressSpinner>
          </div>
        }
      </p-card>
    </div>
  `,
  styles: `
    .container__spinner {
      height: 300px;
    }
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  form = this.formBuild();
  isLoading = false;

  formBuild(): FormGroup {
    return this.fb.group({
      email: ['admin@mail.com', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
