import { inject, Injectable } from '@angular/core';
import { FinancialProductsApiService } from '../../../core/services/api/financial-products-api.service';
import { FinancialProductsStateService } from '../infrastructure/financial-products-state.service';
import { tap, finalize } from 'rxjs';

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

  deleteProduct(id: string): void {
    this.api.deleteProduct(id).pipe(
      tap(() => this.state.removeProduct(id))
    ).subscribe();
  }

  updateSearch(query: string): void {
    this.state.setSearchQuery(query);
  }

  updateLimit(limit: number): void {
    this.state.setLimit(limit);
  }
}
