import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ListPageComponent } from './list-page.component';
import { FinancialProductsFacade } from '../../../application/financial-products-facade.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FinancialProduct } from '../../../domain/financial-product.model';

describe('ListPageComponent', () => {
  let component: ListPageComponent;
  let fixture: ComponentFixture<ListPageComponent>;
  let facadeMock: Partial<FinancialProductsFacade>;
  let notificationMock: Partial<NotificationService>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'test-1',
      name: 'Test Producto',
      description: 'Test Descripción',
      logo: 'https://test.com/logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    }
  ];

  beforeEach(async () => {
    facadeMock = {
      products: signal(mockProducts),
      loading: signal('idle' as const),
      total: signal(1),
      filteredCount: signal(1),
      fetchAllProducts: jest.fn(),
      updateSearch: jest.fn(),
      updateLimit: jest.fn(),
      deleteProduct: jest.fn()
    };

    notificationMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ListPageComponent],
      providers: [
        provideRouter([]),
        { provide: FinancialProductsFacade, useValue: facadeMock },
        { provide: NotificationService, useValue: notificationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener los productos al iniciar', () => {
    expect(facadeMock.fetchAllProducts).toHaveBeenCalled();
  });

  it('debe actualizar la consulta de búsqueda', () => {
    component.onSearch('test query');
    expect(facadeMock.updateSearch).toHaveBeenCalledWith('test query');
  });

  it('debe actualizar el límite', () => {
    component.onLimitChange(10);
    expect(facadeMock.updateLimit).toHaveBeenCalledWith(10);
  });

  it('debe tener acceso a los productos del facade', () => {
    expect(component.products()).toEqual(mockProducts);
  });

  it('debe tener acceso al estado de carga del facade', () => {
    expect(component.loading()).toBe('idle');
  });
});
