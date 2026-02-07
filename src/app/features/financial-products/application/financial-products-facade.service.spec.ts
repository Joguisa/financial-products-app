import { TestBed } from '@angular/core/testing';

import { FinancialProductsFacadeService } from './financial-products-facade.service';

describe('FinancialProductsFacadeService', () => {
  let service: FinancialProductsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialProductsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
