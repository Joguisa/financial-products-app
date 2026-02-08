import { TestBed } from '@angular/core/testing';
import { FinancialProductsStateService } from './financial-products-state.service';
import { FinancialProduct } from '../domain/financial-product.model';

describe('FinancialProductsStateService', () => {
  let service: FinancialProductsStateService;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'prod-1',
      name: 'Tarjeta de Crédito',
      description: 'Producto de tarjeta de crédito',
      logo: 'https://test.com/cc.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: 'prod-2',
      name: 'Cuenta de Ahorros',
      description: 'Producto de cuenta de ahorros',
      logo: 'https://test.com/sa.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01'
    },
    {
      id: 'prod-3',
      name: 'Préstamo',
      description: 'Préstamo personal para necesidades de crédito',
      logo: 'https://test.com/loan.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialProductsStateService);
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('setProducts', () => {
    it('debe establecer productos y cambiar la carga a éxito', () => {
      service.setProducts(mockProducts);

      expect(service.products()).toEqual(mockProducts);
      expect(service.loading()).toBe('success');
    });

    it('debe actualizar el total de productos calculado', () => {
      service.setProducts(mockProducts);

      expect(service.totalProducts()).toBe(3);
    });
  });

  describe('setLoading', () => {
    it('debe establecer el estado de carga', () => {
      service.setLoading('loading');
      expect(service.loading()).toBe('loading');

      service.setLoading('error');
      expect(service.loading()).toBe('error');

      service.setLoading('idle');
      expect(service.loading()).toBe('idle');
    });
  });

  describe('setSearchQuery', () => {
    beforeEach(() => {
      service.setProducts(mockProducts);
    });

    it('debe filtrar productos por nombre', () => {
      service.setLimit(10);
      service.setSearchQuery('Crédito');

      const filtered = service.filteredProducts();
      expect(filtered.length).toBe(2);
    });

    it('debe filtrar productos por descripción', () => {
      service.setLimit(10);
      service.setSearchQuery('ahorros');

      const filtered = service.filteredProducts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Cuenta de Ahorros');
    });

    it('debe ser insensible a mayúsculas y minúsculas', () => {
      service.setLimit(10);
      service.setSearchQuery('PRÉSTAMO');

      const filtered = service.filteredProducts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Préstamo');
    });
  });

  describe('setLimit', () => {
    it('debe limitar el número de productos devueltos', () => {
      service.setProducts(mockProducts);
      service.setLimit(2);

      expect(service.filteredProducts().length).toBe(2);
    });

    it('debe devolver todos los productos si el límite excede el conteo', () => {
      service.setProducts(mockProducts);
      service.setLimit(100);

      expect(service.filteredProducts().length).toBe(3);
    });
  });

  describe('filteredCount', () => {
    it('debe devolver el conteo de todos los productos filtrados (ignorando el límite)', () => {
      service.setProducts(mockProducts);
      service.setSearchQuery('');
      service.setLimit(1);

      expect(service.filteredCount()).toBe(3);
      expect(service.filteredProducts().length).toBe(1);
    });
  });

  describe('totalFound', () => {
    it('debe devolver el conteo de productos mostrados', () => {
      service.setProducts(mockProducts);
      service.setLimit(2);

      expect(service.totalFound()).toBe(2);
    });
  });

  describe('addProduct', () => {
    it('debe agregar un producto a la lista', () => {
      service.setProducts(mockProducts);
      const newProduct: FinancialProduct = {
        id: 'prod-4',
        name: 'Nuevo Producto',
        description: 'Descripción',
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      };

      service.addProduct(newProduct);

      expect(service.products().length).toBe(4);
      expect(service.products()[3]).toEqual(newProduct);
    });
  });

  describe('removeProduct', () => {
    it('debe eliminar un producto por id', () => {
      service.setProducts(mockProducts);

      service.removeProduct('prod-2');

      expect(service.products().length).toBe(2);
      expect(service.products().find(p => p.id === 'prod-2')).toBeUndefined();
    });

    it('no debe afectar a otros productos', () => {
      service.setProducts(mockProducts);

      service.removeProduct('prod-1');

      expect(service.products()[0].id).toBe('prod-2');
      expect(service.products()[1].id).toBe('prod-3');
    });
  });

  describe('updateProduct', () => {
    it('debe actualizar un producto existente', () => {
      service.setProducts(mockProducts);
      const updatedProduct: FinancialProduct = {
        ...mockProducts[0],
        name: 'Tarjeta de Crédito Actualizada',
        description: 'Descripción actualizada'
      };

      service.updateProduct('prod-1', updatedProduct);

      const found = service.products().find(p => p.id === 'prod-1');
      expect(found?.name).toBe('Tarjeta de Crédito Actualizada');
      expect(found?.description).toBe('Descripción actualizada');
    });

    it('no debe afectar a otros productos', () => {
      service.setProducts(mockProducts);
      const updatedProduct: FinancialProduct = {
        ...mockProducts[0],
        name: 'Actualizado'
      };

      service.updateProduct('prod-1', updatedProduct);

      expect(service.products()[1].name).toBe('Cuenta de Ahorros');
      expect(service.products()[2].name).toBe('Préstamo');
    });
  });
});
