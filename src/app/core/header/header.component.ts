import { Component, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { PrimeIcons } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

const IMPORTS_MODULES = [
  TabViewModule,
  MenubarModule,
  ToolbarModule,
  ButtonModule,
  InputTextModule,
  InputSwitchModule,
  FormsModule,
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  styles: '',
  template: `
    <p-toolbar>
      <div class="p-toolbar-group-start">
        <a
          pButton
          [icon]="primeIcons.HOME"
          class="mr-2 no-underline"
          routerLink="/home"
        ></a>
        <a
          pButton
          [icon]="primeIcons.LIST"
          class="mr-2 no-underline"
          routerLink="/products"
        ></a>
        <a
          pButton
          [icon]="primeIcons.TAG"
          class="mr-2 no-underline"
          routerLink="/categories"
        ></a>
      </div>
      <div class="p-toolbar-group-end">
        <p-inputSwitch
          [(ngModel)]="themeSelected"
          (ngModelChange)="changeTheme()"
          class="mr-3"
        ></p-inputSwitch>
        <button pButton icon="pi pi-sign-out" label="Logout"></button>
      </div>
    </p-toolbar>
  `,
})
export class HeaderComponent {
  private document: Document = inject(DOCUMENT);
  primeIcons = PrimeIcons;
  themeSelected = false;

  constructor() {
    let theme = window.localStorage.getItem('theme');
    if (theme) {
      this.themeSelected = theme === 'dark' ? true : false;
    }
    this.changeTheme();
  }

  changeTheme(): void {
    let theme = this.themeSelected ? 'dark' : 'light';
    window.localStorage.setItem('theme', theme);
    let themeLink = this.document.getElementById(
      'app-theme',
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `lara-${theme}-blue.css`;
    }
  }
}
