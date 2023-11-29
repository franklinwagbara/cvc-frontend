import { TestBed } from '@angular/core/testing';

import { ApplicationProcessesService } from './application-processes.service';

describe('ApplicationProcessesService', () => {
  let service: ApplicationProcessesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationProcessesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
