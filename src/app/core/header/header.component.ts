import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { PrimeIcons } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const IMPORTS_MODULES = [
  TabViewModule,
  MenubarModule,
  ToolbarModule,
  ButtonModule,
  InputTextModule
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  styles: '',
  template: `
    <p-toolbar>
      <div class="p-toolbar-group-start">
        <a pButton [icon]="primeIcons.HOME" class="mr-2" routerLink="/home"></a>
        <a pButton [icon]="primeIcons.LIST" class="mr-2" routerLink="/products"></a>
      </div>
      <div class="p-toolbar-group-end">
        <button pButton icon="pi pi-sign-out" label="Logout"></button>
      </div>
    </p-toolbar>
  `,
})
export class HeaderComponent {
  primeIcons = PrimeIcons;
}
