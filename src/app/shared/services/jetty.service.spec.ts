import { TestBed } from '@angular/core/testing';

import { JettyService } from './jetty.service';

describe('JettyService', () => {
  let service: JettyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JettyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
