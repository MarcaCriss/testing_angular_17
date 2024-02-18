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
import { AuthService } from '../../services/auth.service';
import { MenuModule } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { UserFormComponent } from '../../pages/users/user-form.component';

const IMPORTS_MODULES = [
  TabViewModule,
  MenubarModule,
  ToolbarModule,
  ButtonModule,
  InputTextModule,
  InputSwitchModule,
  FormsModule,
  MenuModule,
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  providers: [DialogService],
  styles: '',
  template: `
    <p-toolbar>
      <div class="p-toolbar-group-start">
        <a
          pButton
          [icon]="primeIcons.HOME"
          class="mr-2 no-underline"
          routerLink="/pages/home"
        ></a>
        <a
          pButton
          [icon]="primeIcons.LIST"
          class="mr-2 no-underline"
          routerLink="/pages/products"
        ></a>
        <a
          pButton
          [icon]="primeIcons.TAG"
          class="mr-2 no-underline"
          routerLink="/pages/categories"
        ></a>
        <a
          pButton
          [icon]="primeIcons.USERS"
          class="mr-2 no-underline"
          routerLink="/pages/users"
        ></a>
      </div>
      <div class="p-toolbar-group-end">
        <label
          for="toggle__theme"
          style="margin-bottom: .3rem; margin-right: .5rem; cursor: pointer;"
        >
          Dark mode
        </label>
        <p-inputSwitch
          [(ngModel)]="themeSelected"
          (ngModelChange)="changeTheme()"
          class="mr-3"
          inputId="toggle__theme"
        ></p-inputSwitch>
        <button
          pButton
          type="button"
          (click)="menu.toggle($event)"
          class="p-button-rounded p-button-plain p-button-lg mr-3 p-button-icon-only"
          style="background-image: url({{ avatarUrl }}); background-size: cover"
        ></button>
        <p-menu #menu [model]="items" [popup]="true"></p-menu>
      </div>
    </p-toolbar>
  `,
})
export class HeaderComponent {
  private document: Document = inject(DOCUMENT);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  primeIcons = PrimeIcons;
  themeSelected = false;
  items = [
    {
      label: 'Profile',
      icon: 'pi pi-cog',
      command: () => {
        this.showConfigProfile();
      },
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout();
      },
    },
  ];

  constructor() {
    let theme = window.localStorage.getItem('theme');
    if (theme) {
      this.themeSelected = theme === 'dark' ? true : false;
    }
    this.changeTheme();
  }

  showConfigProfile(): void {
    this.authService.getProfile().subscribe((data) => {
      this.dialogService.open(UserFormComponent, {
        header: 'Profile',
        width: '50%',
        data: {
          user: data,
          isUserProfile: true,
        },
      });
    });
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

  logout(): void {
    this.authService.logout();
  }

  get avatarUrl(): string {
    return this.authService.user?.avatar || '';
  }
}
