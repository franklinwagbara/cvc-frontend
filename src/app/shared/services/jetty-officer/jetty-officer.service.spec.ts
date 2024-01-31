import { TestBed } from '@angular/core/testing';

import { JettyOfficerService } from './jetty-officer.service';

describe('JettyOfficerService', () => {
  let service: JettyOfficerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JettyOfficerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
