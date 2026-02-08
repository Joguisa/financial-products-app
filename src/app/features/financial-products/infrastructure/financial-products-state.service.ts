import { computed, Injectable, signal } from '@angular/core';
import { FinancialProduct, LoadingState } from '../domain/financial-product.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductsStateService {
  private readonly _products = signal<FinancialProduct[]>([]);
  private readonly _loading = signal<LoadingState>('idle');
  private readonly _searchQuery = signal<string>('');
  private readonly _limit = signal<number>(5);

  readonly filteredProducts = computed(() => {
    const query = this._searchQuery().toLowerCase();
    const allProducts = this._products();

    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );

    return filtered.slice(0, this._limit());
  });

  readonly filteredCount = computed(() => {
    const query = this._searchQuery().toLowerCase();
    const allProducts = this._products();

    return allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    ).length;
  });

  readonly totalFound = computed(() => this.filteredProducts().length);

  setSearchQuery(query: string): void { this._searchQuery.set(query); }
  setLimit(limit: number): void { this._limit.set(limit); }

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly totalProducts = computed(() => this._products().length);

  setProducts(products: FinancialProduct[]): void {
    this._products.set(products);
    this._loading.set('success');
  }

  setLoading(state: LoadingState): void {
    this._loading.set(state);
  }

  removeProduct(id: string): void {
    this._products.update(list => list.filter(p => p.id !== id));
  }

  addProduct(product: FinancialProduct): void {
    this._products.update(list => [...list, product]);
  }

  updateProduct(id: string, product: FinancialProduct): void {
    this._products.update(list =>
      list.map(p => p.id === id ? { ...p, ...product } : p)
    );
  }
}