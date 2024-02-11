import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, PrimeIcons } from 'primeng/api';

const IMPORTS_MODULES = [TabViewModule, MenubarModule];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: PrimeIcons.HOME,
        routerLink: '/home',
      },
      {
        label: 'Products',
        icon: PrimeIcons.LIST,
        routerLink: '/products',
      },
    ];
  }
}
