import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinancialProductsApiService } from './financial-products-api.service';
import { FinancialProduct } from '../../../features/financial-products/domain/financial-product.model';
import { environment } from '../../../../environments/environment';

describe('FinancialProductsApiService', () => {
  let service: FinancialProductsApiService;
  let httpMock: HttpTestingController;

  const mockProduct: FinancialProduct = {
    id: 'test-1',
    name: 'Test Producto',
    description: 'Test Descripción',
    logo: 'https://test.com/logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancialProductsApiService]
    });
    service = TestBed.inject(FinancialProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('debe devolver productos de la respuesta de la API', () => {
      const mockProducts = [mockProduct];

      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(1);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockProducts });
    });

    it('debe manejar lista de productos vacía', () => {
      service.getProducts().subscribe(products => {
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/products`);
      req.flush({ data: [] });
    });
  });

  describe('verifyId', () => {
    it('debe devolver true cuando el id existe', () => {
      service.verifyId('existing-id').subscribe(result => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/products/verification/existing-id`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('debe devolver false cuando el id no existe', () => {
      service.verifyId('new-id').subscribe(result => {
        expect(result).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/products/verification/new-id`);
      req.flush(false);
    });
  });

  describe('createProduct', () => {
    it('debe crear producto y devolver producto creado', () => {
      service.createProduct(mockProduct).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ data: mockProduct, message: 'Product created' });
    });
  });

  describe('updateProduct', () => {
    it('debe actualizar producto y devolver producto actualizado', () => {
      const { id, ...productWithoutId } = mockProduct;

      service.updateProduct(id, productWithoutId).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/products/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(productWithoutId);
      req.flush({ data: mockProduct, message: 'Product updated' });
    });
  });

  describe('deleteProduct', () => {
    it('debe eliminar producto exitosamente', (done) => {
      service.deleteProduct('test-1').subscribe({
        next: () => {
          expect(true).toBe(true);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/products/test-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Producto eliminado exitosamente' });
    });
  });
});
