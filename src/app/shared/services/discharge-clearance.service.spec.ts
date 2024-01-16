import { TestBed } from '@angular/core/testing';

import { DischargeClearanceService } from './discharge-clearance.service';

describe('DischargeClearanceService', () => {
  let service: DischargeClearanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DischargeClearanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
