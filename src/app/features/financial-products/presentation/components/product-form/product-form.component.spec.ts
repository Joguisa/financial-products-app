import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { FinancialProductsApiService } from '../../../../../core/services/api/financial-products-api.service';
import { FinancialProduct } from '../../../domain/financial-product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let apiServiceMock: Partial<FinancialProductsApiService>;

  const mockProduct: FinancialProduct = {
    id: 'test-1',
    name: 'Test Producto',
    description: 'Test Descripción para pruebas',
    logo: 'https://test.com/logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  beforeEach(async () => {
    apiServiceMock = {
      verifyId: jest.fn().mockReturnValue(of(false))
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: FinancialProductsApiService, useValue: apiServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores vacíos para el modo de creación', () => {
    expect(component.form).toBeTruthy();
    expect(component.isEditMode).toBeFalsy();
    expect(component.form.get('id')?.value).toBe('');
  });

  it('debe tener validadores requeridos en todos los campos', () => {
    const form = component.form;

    expect(form.get('id')?.hasError('required')).toBeTruthy();
    expect(form.get('name')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('logo')?.hasError('required')).toBeTruthy();
    expect(form.get('date_release')?.hasError('required')).toBeTruthy();
  });

  it('debe validar la longitud mínima del id', () => {
    const idControl = component.form.get('id');
    idControl?.setValue('ab');
    expect(idControl?.hasError('minLengthTrimmed')).toBeTruthy();

    idControl?.setValue('abc');
    expect(idControl?.hasError('minLengthTrimmed')).toBeFalsy();
  });

  it('debe validar la longitud máxima del id', () => {
    const idControl = component.form.get('id');
    idControl?.setValue('12345678901');
    expect(idControl?.hasError('maxLengthTrimmed')).toBeTruthy();

    idControl?.setValue('1234567890');
    expect(idControl?.hasError('maxLengthTrimmed')).toBeFalsy();
  });

  it('debe calcular la fecha de revisión automáticamente', () => {
    const releaseControl = component.form.get('date_release');
    const revisionControl = component.form.get('date_revision');

    releaseControl?.setValue('2025-01-15');

    expect(revisionControl?.value).toBe('2026-01-15');
  });

  it('debe emitir el evento formSubmit cuando el formulario es válido y no está pendiente', () => {
    const emitSpy = jest.spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      id: 'test-id',
      name: 'Nombre Válido',
      description: 'Descripción Válida',
      logo: 'https://test.com/logo.png',
      date_release: '2025-01-15'
    });

    Object.defineProperty(component.form, 'valid', { get: () => true });
    Object.defineProperty(component.form, 'pending', { get: () => false });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('no debe emitir formSubmit en formulario inválido', () => {
    const emitSpy = jest.spyOn(component.formSubmit, 'emit');

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('debe resetear el formulario en la llamada onReset', () => {
    component.form.patchValue({
      id: 'test-id',
      name: 'Test Name'
    });

    component.onReset();

    expect(component.form.get('id')?.value).toBeFalsy();
    expect(component.form.get('name')?.value).toBeFalsy();
  });

  it('debe identificar campos inválidos correctamente', () => {
    const idControl = component.form.get('id');
    idControl?.markAsTouched();

    expect(component.isInvalid('id')).toBeTruthy();

    idControl?.setValue('valid-id');
    expect(component.isInvalid('id')).toBeFalsy();
  });
});
