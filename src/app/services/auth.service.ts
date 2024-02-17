import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import {
  LoginInterface,
  LoginResponseInterface,
} from '../shared/interfaces/login.interface';
import { Router } from '@angular/router';
import { UserInterface } from '../shared/interfaces/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtHelper = new JwtHelperService();
  private token = '';
  private refreshToken = '';
  baseUrl = 'https://api.escuelajs.co/api/v1';

  async init(): Promise<void> {
    this.refreshToken = localStorage.getItem('refresh_token') || '';
    this.token = localStorage.getItem('access_token') || '';
    if (this.isAuthenticated) {
      this.getRefreshToken().subscribe(() => {
        this.jwtHelper.tokenGetter = () => {
          return this.token;
        };
      });
    }
  }

  login(login: LoginInterface): Observable<LoginResponseInterface> {
    return this.http
      .post<LoginResponseInterface>(`${this.baseUrl}/auth/login`, login)
      .pipe(
        tap((login: LoginResponseInterface) => {
          this.token = login.access_token;
          this.refreshToken = login.refresh_token;
          localStorage.setItem('access_token', login.access_token);
          localStorage.setItem('refresh_token', login.refresh_token);
          this.router.navigate(['/pages/home']);
        }),
      );
  }

  getRefreshToken(): Observable<LoginResponseInterface> {
    return this.http
      .post<LoginResponseInterface>(`${this.baseUrl}/auth/refresh-token`, {
        refreshToken: this.refreshToken,
      })
      .pipe(
        tap((login: LoginResponseInterface) => {
          this.token = login.access_token;
          this.refreshToken = login.refresh_token;
          localStorage.setItem('access_token', login.access_token);
          localStorage.setItem('refresh_token', login.refresh_token);
        }),
      );
  }

  getProfile() {
    if (this.jwtHelper.isTokenExpired(this.token)) {
      return this.getRefreshToken().pipe(
        switchMap(() => {
          return this.http.get<UserInterface>(`${this.baseUrl}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
        }),
      );
    } else {
      return this.http.get<UserInterface>(`${this.baseUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    }
  }

  logout(): void {
    this.token = '';
    this.refreshToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/auth/login']);
  }

  public get isAuthenticated(): boolean {
    let response = false;
    try {
      if (!this.refreshToken || this.refreshToken === '') {
        throw new Error();
      }
      response = !this.jwtHelper.isTokenExpired(this.refreshToken);
    } catch (error) {
      response = false;
    }
    return response;
  }
}
