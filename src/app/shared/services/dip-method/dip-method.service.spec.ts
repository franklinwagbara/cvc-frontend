import { TestBed } from '@angular/core/testing';

import { DipMethodService } from './dip-method.service';

describe('DipMethodService', () => {
  let service: DipMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DipMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
