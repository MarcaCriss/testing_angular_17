import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const IMPORTS_MODULES = [
  RouterOutlet
];

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: ``
})
export class AuthPage {

}
