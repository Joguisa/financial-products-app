import { Component, inject, signal } from '@angular/core';
import { FinancialProductsFacade } from '../../../application/financial-products-facade.service';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../../shared/ui/components/search-bar/search-bar.component';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { Router, RouterLink } from '@angular/router';
import { PaginationControlComponent } from '../../components/pagination-control/pagination-control.component';
import { SkeletonTableComponent } from '../../../../../shared/ui/components/skeleton-table/skeleton-table.component';
import { ModalComponent } from '../../../../../shared/ui/components/modal/modal.component';
import { FinancialProduct } from '../../../domain/financial-product.model';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'bp-list-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    ProductsTableComponent,
    PaginationControlComponent,
    SkeletonTableComponent,
    ModalComponent
  ],
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.scss'
})
export class ListPageComponent {
  private readonly facade = inject(FinancialProductsFacade);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  products = this.facade.products;
  loading = this.facade.loading;
  total = this.facade.total;
  filteredCount = this.facade.filteredCount;

  showDeleteModal = signal(false);
  productToDelete = signal<FinancialProduct | null>(null);

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

  onEditProduct(product: FinancialProduct): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  onDeleteProduct(product: FinancialProduct): void {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  onConfirmDelete(): void {
    const product = this.productToDelete();
    if (product) {
      this.facade.deleteProduct(product.id).subscribe({
        next: () => {
          this.notificationService.success('Producto eliminado correctamente');
        },
        error: () => {
          this.notificationService.error('Error al eliminar el producto');
        }
      });
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  get deleteModalTitle(): string {
    const product = this.productToDelete();
    return product ? `¿Estás seguro de eliminar el producto ${product.name}?` : '';
  }
}
