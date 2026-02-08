import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { FinancialProduct } from '../../../domain/financial-product.model';
import { FinancialProductsFacade } from '../../../application/financial-products-facade.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'bp-upsert-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './upsert-page.component.html',
  styleUrl: './upsert-page.component.scss'
})
export class UpsertPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facade = inject(FinancialProductsFacade);
  private readonly notificationService = inject(NotificationService);

  product = signal<FinancialProduct | null>(null);
  isEditMode = false;
  productId: string | null = null;

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(id: string): void {
    const existingProduct = this.facade.getProductById(id);
    if (existingProduct) {
      this.product.set(existingProduct);
    } else {
      this.notificationService.error('Producto no encontrado');
      this.router.navigate(['/products']);
    }
  }

  onFormSubmit(formData: FinancialProduct): void {
    if (this.isEditMode) {
      this.facade.updateProduct(this.productId!, formData).subscribe({
        next: () => {
          this.notificationService.success('Producto actualizado correctamente');
          this.router.navigate(['/products']);
        },
        error: () => {
          this.notificationService.error('Error al actualizar el producto');
        }
      });
    } else {
      this.facade.createProduct(formData).subscribe({
        next: () => {
          this.notificationService.success('Producto creado correctamente');
          this.router.navigate(['/products']);
        },
        error: () => {
          this.notificationService.error('Error al crear el producto');
        }
      });
    }
  }

  onFormCancel(): void {
    this.router.navigate(['/products']);
  }
}
