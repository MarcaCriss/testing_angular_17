import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { UserFormComponent } from './user-form.component';
import { TitleCasePipe } from '@angular/common';
import { OnlyAdminDirective } from '../../shared/directives/only-admin.directive';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

const IMPORTS_MODULES = [
  ButtonModule,
  TableModule,
  DividerModule,
  TitleCasePipe,
  OnlyAdminDirective,
];

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [...IMPORTS_MODULES],
  styles: ``,
  providers: [UsersService, DialogService],
  template: `
    <div class="flex justify-content-between align-items-center">
      <h1>Users</h1>
      <button
        *appOnlyAdmin
        pButton
        (click)="addUser()"
        [icon]="primeIcons.PLUS"
        label="Add user"
      ></button>
    </div>
    <p-divider></p-divider>
    <p-table
      [value]="users"
      [paginator]="true"
      [rows]="5"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      [rowsPerPageOptions]="[5, 15, 25]"
      [loading]="isLoading"
    >
      <ng-template pTemplate="header">
        <tr>
          @for (column of columns; track $index) {
            <th [pSortableColumn]="column.field">
              {{ column.header }}
              @if (column.field !== 'actions') {
                <p-sortIcon [field]="column.field"></p-sortIcon>
              }
            </th>
          }
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-user>
        <tr>
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role | titlecase }}</td>
          @if (isAdmin) {
            <td>
              <button
                pButton
                label="Edit"
                [icon]="primeIcons.PENCIL"
                (click)="editUser(user)"
                class="mr-2 p-button-outlined p-button-success"
              ></button>
              <button
                pButton
                label="Delete"
                [icon]="primeIcons.TIMES"
                (click)="deleteUser(user)"
                class="p-button-outlined p-button-danger"
              ></button>
            </td>
          }
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class UsersPage implements OnInit {
  private usersService = inject(UsersService);
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  primeIcons = PrimeIcons;
  users: UserInterface[] = [];
  isLoading = false;
  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email' },
    { header: 'Role', field: 'role' },
    { header: 'Actions', field: 'actions' },
  ];

  ngOnInit(): void {
    this.getUsers();
    if (!this.isAdmin) {
      this.columns.pop();
    }
  }

  getUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
      this.isLoading = false;
    });
  }

  addUser(): void {
    this.dialogService
      .open(UserFormComponent, {
        header: 'User Form',
        width: '50%',
      })
      .onClose.subscribe((res) => {
        if (res?.data) {
          this.getUsers();
        }
      });
  }

  editUser(user: UserInterface): void {
    this.dialogService
      .open(UserFormComponent, {
        data: {
          user,
        },
        header: 'User Form',
        width: '50%',
      })
      .onClose.subscribe((res) => {
        if (res?.data) {
          this.getUsers();
        }
      });
  }

  deleteUser(user: UserInterface): void {
    this.alertService.confirmation({
      header: 'Delete User',
      message: `Do you want to delete "${user.name}"?`,
      accept: () => {
        this.usersService.deleteUser(user.id).subscribe((res) => {
          this.getUsers();
        });
      },
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
}
