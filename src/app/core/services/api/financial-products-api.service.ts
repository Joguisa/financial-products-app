import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FinancialProduct } from '../../../features/financial-products/domain/financial-product.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductsApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.baseUrl}/products`;

  getProducts(): Observable<FinancialProduct[]> {
    return this.http.get<{ data: FinancialProduct[] }>(this.url).pipe(
      map(response => response.data)
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/verification/${id}`);
  }

  createProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http.post<{ message: string; data: FinancialProduct }>(this.url, product).pipe(
      map(response => response.data)
    );
  }

  updateProduct(id: string, product: Omit<FinancialProduct, 'id'>): Observable<FinancialProduct> {
    return this.http.put<{ message: string; data: FinancialProduct }>(`${this.url}/${id}`, product).pipe(
      map(response => response.data)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`).pipe(
      map(() => void 0)
    );
  }
}