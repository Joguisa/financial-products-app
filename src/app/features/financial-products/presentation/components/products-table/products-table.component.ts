import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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
}
