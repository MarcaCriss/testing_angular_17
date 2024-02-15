import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../shared/interfaces/user.interface';

@Injectable()
export class UsersService {
  private http = inject(HttpClient);
  baseUrl = 'https://api.escuelajs.co/api/v1';

  getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.baseUrl}/users`);
  }

  saveUser(category: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${this.baseUrl}/users`, category);
  }

  updateUser(id: number, category: UserInterface): Observable<UserInterface> {
    return this.http.put<UserInterface>(
      `${this.baseUrl}/users/${id}`,
      category,
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  checkEmail(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/users/is-available`,
      { email },
    );
  }
}
