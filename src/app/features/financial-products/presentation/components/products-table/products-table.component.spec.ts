import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsTableComponent } from './products-table.component';
import { FinancialProduct } from '../../../domain/financial-product.model';
import { ComponentRef } from '@angular/core';

describe('ProductsTableComponent', () => {
  let component: ProductsTableComponent;
  let fixture: ComponentFixture<ProductsTableComponent>;
  let componentRef: ComponentRef<ProductsTableComponent>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'prod-1',
      name: 'Tarjeta de Crédito',
      description: 'Una tarjeta de crédito',
      logo: 'https://test.com/cc.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: 'prod-2',
      name: 'Cuenta de Ahorros',
      description: 'Una cuenta de ahorros',
      logo: 'https://test.com/sa.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('products', mockProducts);
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleMenu', () => {
    it('debe abrir el menú para un producto', () => {
      component.toggleMenu('prod-1');
      expect(component.openMenuId()).toBe('prod-1');
    });

    it('debe cerrar el menú si se hace clic en el mismo producto', () => {
      component.toggleMenu('prod-1');
      expect(component.openMenuId()).toBe('prod-1');

      component.toggleMenu('prod-1');
      expect(component.openMenuId()).toBeNull();
    });

    it('debe cambiar al menú de otro producto', () => {
      component.toggleMenu('prod-1');
      expect(component.openMenuId()).toBe('prod-1');

      component.toggleMenu('prod-2');
      expect(component.openMenuId()).toBe('prod-2');
    });
  });

  describe('closeMenu', () => {
    it('debe cerrar el menú', () => {
      component.toggleMenu('prod-1');
      expect(component.openMenuId()).toBe('prod-1');

      component.closeMenu();
      expect(component.openMenuId()).toBeNull();
    });
  });

  describe('onEdit', () => {
    it('debe emitir el evento editProduct', () => {
      const emitSpy = jest.spyOn(component.editProduct, 'emit');

      component.onEdit(mockProducts[0]);

      expect(emitSpy).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('debe cerrar el menú después de editar', () => {
      component.toggleMenu('prod-1');

      component.onEdit(mockProducts[0]);

      expect(component.openMenuId()).toBeNull();
    });
  });

  describe('onDelete', () => {
    it('debe emitir el evento deleteProduct', () => {
      const emitSpy = jest.spyOn(component.deleteProduct, 'emit');

      component.onDelete(mockProducts[0]);

      expect(emitSpy).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('debe cerrar el menú después de eliminar', () => {
      component.toggleMenu('prod-1');

      component.onDelete(mockProducts[0]);

      expect(component.openMenuId()).toBeNull();
    });
  });

  describe('onImageError', () => {
    it('debe establecer la imagen de respaldo en el primer error', () => {
      const mockImg = {
        dataset: {},
        src: 'invalid-url.png'
      } as HTMLImageElement;

      const event = { target: mockImg } as unknown as Event;

      component.onImageError(event);

      expect(mockImg.dataset['fallback']).toBe('true');
      expect(mockImg.src).toBe('/assets/icons/default-logo.svg');
    });

    it('no debe establecer la imagen de respaldo en el segundo error', () => {
      const mockImg = {
        dataset: { fallback: 'true' },
        src: '/assets/icons/default-logo.svg'
      } as unknown as HTMLImageElement;

      const event = { target: mockImg } as unknown as Event;

      component.onImageError(event);

      expect(mockImg.src).toBe('/assets/icons/default-logo.svg');
    });
  });

  describe('rendering', () => {
    it('debe mostrar los productos en la tabla', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');

      expect(rows.length).toBe(2);
    });

    it('debe mostrar los nombres de los productos', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent).toContain('Tarjeta de Crédito');
      expect(compiled.textContent).toContain('Cuenta de Ahorros');
    });
  });
});
