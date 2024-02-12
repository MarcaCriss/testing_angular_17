import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductInterface } from '../shared/interfaces/product.interface';

@Injectable()
export class ProductsService {
  private http = inject(HttpClient);
  baseUrl = 'https://api.escuelajs.co/api/v1';

  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(
      `${this.baseUrl}/products?offset=0&limit=10`,
    );
  }

  saveProduct(product: ProductInterface): Observable<ProductInterface> {
    return this.http.post<ProductInterface>(
      `${this.baseUrl}/products`,
      product,
    );
  }
}
