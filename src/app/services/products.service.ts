import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ProductFilter,
  ProductInterface,
} from '../shared/interfaces/product.interface';

@Injectable()
export class ProductsService {
  private http = inject(HttpClient);
  baseUrl = 'https://api.escuelajs.co/api/v1';

  getProducts(productFilter?: ProductFilter): Observable<ProductInterface[]> {
    let { offset = 0, limit = 10, ...filters } = productFilter || {};
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string' && value.trim() === '') return;
        params = params.set(key, value);
      }
    });
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());
    return this.http.get<ProductInterface[]>(`${this.baseUrl}/products`, {
      params,
    });
  }

  saveProduct(product: ProductInterface): Observable<ProductInterface> {
    return this.http.post<ProductInterface>(
      `${this.baseUrl}/products`,
      product,
    );
  }

  updateProduct(
    id: number,
    product: ProductInterface,
  ): Observable<ProductInterface> {
    return this.http.put<ProductInterface>(
      `${this.baseUrl}/products/${id}`,
      product,
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }
}
