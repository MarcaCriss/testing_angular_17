import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../shared/interfaces/product.interface';

@Injectable()
export class ProductsService {
  private http = inject(HttpClient);
  baseUrl = "https://api.escuelajs.co/api/v1";

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }
}
