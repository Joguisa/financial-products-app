import { inject, Injectable } from '@angular/core';
import { FinancialProductsApiService } from '../../../core/services/api/financial-products-api.service';
import { FinancialProductsStateService } from '../infrastructure/financial-products-state.service';
import { FinancialProduct } from '../domain/financial-product.model';
import { Observable, tap, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductsFacade {
  private readonly api = inject(FinancialProductsApiService);
  private readonly state = inject(FinancialProductsStateService);

  products = this.state.filteredProducts;
  loading = this.state.loading;
  total = this.state.totalProducts;
  filteredCount = this.state.filteredCount;

  fetchAllProducts(): void {
    this.state.setLoading('loading');
    this.api.getProducts().pipe(
      tap(products => this.state.setProducts(products)),
      finalize(() => this.state.setLoading('idle'))
    ).subscribe();
  }

  getProductById(id: string): FinancialProduct | undefined {
    return this.state.products().find(p => p.id === id);
  }

  createProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.api.createProduct(product).pipe(
      tap(created => this.state.addProduct(created))
    );
  }

  updateProduct(id: string, product: FinancialProduct): Observable<FinancialProduct> {
    return this.api.updateProduct(id, product).pipe(
      tap(updated => this.state.updateProduct(id, updated))
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.deleteProduct(id).pipe(
      tap(() => this.state.removeProduct(id))
    );
  }

  updateSearch(query: string): void {
    this.state.setSearchQuery(query);
  }

  updateLimit(limit: number): void {
    this.state.setLimit(limit);
  }
}
