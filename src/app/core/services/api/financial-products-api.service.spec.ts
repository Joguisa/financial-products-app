import { TestBed } from '@angular/core/testing';

import { FinancialProductsApiService } from './financial-products-api.service';

describe('FinancialProductsApiService', () => {
  let service: FinancialProductsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialProductsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
