import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/material.module';

const IMPORTS_MODULES = [
  CommonModule,
  RouterOutlet,
  MaterialModule,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);

  redirectHome() {
    this.router.navigate(['home']);
  }
}
