import { Component, inject } from '@angular/core';
import { FinancialProductsFacade } from '../../../application/financial-products-facade.service';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../../shared/ui/components/search-bar/search-bar.component';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { Router, RouterLink } from '@angular/router';
import { PaginationControlComponent } from '../../components/pagination-control/pagination-control.component';
import { SkeletonTableComponent } from '../../../../../shared/ui/components/skeleton-table/skeleton-table.component';

@Component({
  selector: 'bp-list-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    ProductsTableComponent,
    PaginationControlComponent,
    SkeletonTableComponent,
    RouterLink
  ],
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.scss'
})
export class ListPageComponent {
  private readonly facade = inject(FinancialProductsFacade);
  private readonly router = inject(Router);

  products = this.facade.products;
  loading = this.facade.loading;
  total = this.facade.total;
  filteredCount = this.facade.filteredCount;

  ngOnInit(): void {
    this.facade.fetchAllProducts();
  }

  onSearch(query: string): void {
    this.facade.updateSearch(query);
  }

  onLimitChange(limit: number): void {
    this.facade.updateLimit(limit);
  }

  goToAddProduct(): void {
    this.router.navigate(['/products/add']);
  }
}
