import { TestBed } from '@angular/core/testing';

import { FinancialProductsStateService } from './financial-products-state.service';

describe('FinancialProductsStateService', () => {
  let service: FinancialProductsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialProductsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
