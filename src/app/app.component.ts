import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

const IMPORTS_MODULES = [
  CommonModule,
  RouterOutlet,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {}
