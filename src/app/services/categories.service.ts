import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from '../shared/interfaces/product.interface';

@Injectable()
export class CategoriesService {
  private http = inject(HttpClient);
  baseUrl = "https://api.escuelajs.co/api/v1";

  getCategories(): Observable<CategoryInterface[]> {
    return this.http.get<CategoryInterface[]>(`${this.baseUrl}/categories`);
  }
}
