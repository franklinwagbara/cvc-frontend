import { TestBed } from '@angular/core/testing';

import { MeterTypeService } from './meter-type.service';

describe('MeterTypeService', () => {
  let service: MeterTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeterTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
