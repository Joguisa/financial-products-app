import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinancialProductsFacade } from './features/financial-products/application/financial-products-facade.service';

@Component({
  selector: 'bp-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly facade = inject(FinancialProductsFacade);

  constructor() {
    effect(() => {
      console.log('Datos en el Estado (Signals):', this.facade.products());
    });
  }

  ngOnInit(): void {
    console.log('Iniciando petición de productos...');
    this.facade.fetchAllProducts();
  }
}
