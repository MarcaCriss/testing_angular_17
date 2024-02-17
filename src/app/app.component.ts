import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';

const IMPORTS_MODULES = [
  CommonModule,
  RouterOutlet,
  ToastModule,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  template: `
    <p-toast></p-toast>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.init();
  }
}
