import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FinancialProductsFacade } from './financial-products-facade.service';
import { FinancialProductsApiService } from '../../../core/services/api/financial-products-api.service';
import { FinancialProductsStateService } from '../infrastructure/financial-products-state.service';
import { FinancialProduct } from '../domain/financial-product.model';

describe('FinancialProductsFacade', () => {
  let facade: FinancialProductsFacade;
  let apiServiceMock: jest.Mocked<FinancialProductsApiService>;
  let stateServiceMock: jest.Mocked<FinancialProductsStateService>;

  const mockProduct: FinancialProduct = {
    id: 'test-1',
    name: 'Test Producto',
    description: 'Test Descripción',
    logo: 'https://test.com/logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(() => {
    apiServiceMock = {
      getProducts: jest.fn().mockReturnValue(of([mockProduct])),
      createProduct: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
      deleteProduct: jest.fn().mockReturnValue(of({ message: 'Eliminado' })),
      verifyId: jest.fn().mockReturnValue(of(false))
    } as unknown as jest.Mocked<FinancialProductsApiService>;

    stateServiceMock = {
      filteredProducts: jest.fn().mockReturnValue([mockProduct]),
      loading: jest.fn().mockReturnValue('idle'),
      totalProducts: jest.fn().mockReturnValue(1),
      filteredCount: jest.fn().mockReturnValue(1),
      products: jest.fn().mockReturnValue([mockProduct]),
      setLoading: jest.fn(),
      setProducts: jest.fn(),
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      removeProduct: jest.fn(),
      setSearchQuery: jest.fn(),
      setLimit: jest.fn()
    } as unknown as jest.Mocked<FinancialProductsStateService>;

    TestBed.configureTestingModule({
      providers: [
        FinancialProductsFacade,
        { provide: FinancialProductsApiService, useValue: apiServiceMock },
        { provide: FinancialProductsStateService, useValue: stateServiceMock }
      ]
    });

    facade = TestBed.inject(FinancialProductsFacade);
  });

  it('debe ser creado', () => {
    expect(facade).toBeTruthy();
  });

  describe('fetchAllProducts', () => {
    it('debe obtener productos y actualizar estado', () => {
      facade.fetchAllProducts();

      expect(stateServiceMock.setLoading).toHaveBeenCalledWith('loading');
      expect(apiServiceMock.getProducts).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('debe devolver producto si se encuentra', () => {
      const result = facade.getProductById('test-1');
      expect(result).toEqual(mockProduct);
    });

    it('debe devolver undefined si no se encuentra', () => {
      const result = facade.getProductById('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('createProduct', () => {
    it('debe crear producto a través de la API y actualizar estado', (done) => {
      facade.createProduct(mockProduct).subscribe(result => {
        expect(result).toEqual(mockProduct);
        expect(apiServiceMock.createProduct).toHaveBeenCalledWith(mockProduct);
        expect(stateServiceMock.addProduct).toHaveBeenCalledWith(mockProduct);
        done();
      });
    });
  });

  describe('updateProduct', () => {
    it('debe actualizar producto a través de la API y actualizar estado', (done) => {
      facade.updateProduct('test-1', mockProduct).subscribe(result => {
        expect(result).toEqual(mockProduct);
        expect(apiServiceMock.updateProduct).toHaveBeenCalledWith('test-1', mockProduct);
        expect(stateServiceMock.updateProduct).toHaveBeenCalledWith('test-1', mockProduct);
        done();
      });
    });
  });

  describe('deleteProduct', () => {
    it('debe eliminar producto a través de la API y eliminar del estado', (done) => {
      facade.deleteProduct('test-1').subscribe(() => {
        expect(apiServiceMock.deleteProduct).toHaveBeenCalledWith('test-1');
        expect(stateServiceMock.removeProduct).toHaveBeenCalledWith('test-1');
        done();
      });
    });
  });

  describe('updateSearch', () => {
    it('debe actualizar la consulta de búsqueda en el estado', () => {
      facade.updateSearch('test query');
      expect(stateServiceMock.setSearchQuery).toHaveBeenCalledWith('test query');
    });
  });

  describe('updateLimit', () => {
    it('debe actualizar el límite en el estado', () => {
      facade.updateLimit(10);
      expect(stateServiceMock.setLimit).toHaveBeenCalledWith(10);
    });
  });
});
