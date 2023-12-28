import { TestBed } from '@angular/core/testing';

import { DepotOfficerService } from './depot-officer.service';

describe('DepotOfficerService', () => {
  let service: DepotOfficerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotOfficerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
