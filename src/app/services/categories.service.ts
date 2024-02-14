import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from '../shared/interfaces/product.interface';

@Injectable()
export class CategoriesService {
  private http = inject(HttpClient);
  baseUrl = 'https://api.escuelajs.co/api/v1';

  getCategories(): Observable<CategoryInterface[]> {
    return this.http.get<CategoryInterface[]>(`${this.baseUrl}/categories`);
  }

  saveCategory(category: CategoryInterface): Observable<CategoryInterface> {
    return this.http.post<CategoryInterface>(
      `${this.baseUrl}/categories`,
      category,
    );
  }

  updateCategory(
    id: number,
    category: CategoryInterface,
  ): Observable<CategoryInterface> {
    return this.http.put<CategoryInterface>(
      `${this.baseUrl}/categories/${id}`,
      category,
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }
}
