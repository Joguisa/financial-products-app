import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { UpsertPageComponent } from './upsert-page.component';
import { FinancialProductsFacade } from '../../../application/financial-products-facade.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FinancialProduct } from '../../../domain/financial-product.model';
import { FinancialProductsApiService } from '../../../../../core/services/api/financial-products-api.service';

describe('UpsertPageComponent', () => {
  let component: UpsertPageComponent;
  let fixture: ComponentFixture<UpsertPageComponent>;
  let facadeMock: Partial<FinancialProductsFacade>;
  let notificationMock: Partial<NotificationService>;
  let apiServiceMock: Partial<FinancialProductsApiService>;

  const mockProduct: FinancialProduct = {
    id: 'test-1',
    name: 'Test Producto',
    description: 'Test Descripción',
    logo: 'https://test.com/logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(async () => {
    facadeMock = {
      products: signal([mockProduct]),
      loading: signal('idle' as const),
      createProduct: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
      getProductById: jest.fn().mockReturnValue(mockProduct),
      fetchAllProducts: jest.fn()
    };

    notificationMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    apiServiceMock = {
      verifyId: jest.fn().mockReturnValue(of(false))
    };

    await TestBed.configureTestingModule({
      imports: [UpsertPageComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: FinancialProductsFacade, useValue: facadeMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: FinancialProductsApiService, useValue: apiServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar en modo creación cuando no hay parámetro id', () => {
    expect(component.isEditMode).toBeFalsy();
  });

  it('debe manejar el envío del formulario para un nuevo producto', () => {
    component.onFormSubmit(mockProduct);
    expect(facadeMock.createProduct).toHaveBeenCalledWith(mockProduct);
  });
});

describe('UpsertPageComponent en modo edición', () => {
  let component: UpsertPageComponent;
  let fixture: ComponentFixture<UpsertPageComponent>;
  let facadeMock: Partial<FinancialProductsFacade>;

  const mockProduct: FinancialProduct = {
    id: 'test-1',
    name: 'Test Producto',
    description: 'Test Descripción',
    logo: 'https://test.com/logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(async () => {
    facadeMock = {
      products: signal([mockProduct]),
      loading: signal('idle' as const),
      createProduct: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
      getProductById: jest.fn().mockReturnValue(mockProduct),
      fetchAllProducts: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UpsertPageComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: FinancialProductsFacade, useValue: facadeMock },
        { provide: NotificationService, useValue: { showSuccess: jest.fn(), showError: jest.fn() } },
        { provide: FinancialProductsApiService, useValue: { verifyId: jest.fn().mockReturnValue(of(false)) } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'test-1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe iniciar en modo edición cuando existe el parámetro id', () => {
    expect(component.isEditMode).toBeTruthy();
  });

  it('debe manejar el envío del formulario para un producto existente', () => {
    component.onFormSubmit(mockProduct);
    expect(facadeMock.updateProduct).toHaveBeenCalledWith('test-1', mockProduct);
  });
});
