import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FinancialProduct } from '../../../domain/financial-product.model';

@Component({
  selector: 'bp-products-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {
  products = input<FinancialProduct[]>([]);

  editProduct = output<FinancialProduct>();
  deleteProduct = output<FinancialProduct>();

  openMenuId = signal<string | null>(null);

  toggleMenu(productId: string): void {
    if (this.openMenuId() === productId) {
      this.openMenuId.set(null);
    } else {
      this.openMenuId.set(productId);
    }
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  onEdit(product: FinancialProduct): void {
    this.closeMenu();
    this.editProduct.emit(product);
  }

  onDelete(product: FinancialProduct): void {
    this.closeMenu();
    this.deleteProduct.emit(product);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    if (!img.dataset['fallback']) {
      img.dataset['fallback'] = 'true';
      img.src = '/assets/icons/default-logo.svg';
    }
  }
}
