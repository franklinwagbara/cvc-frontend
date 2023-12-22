import { TestBed } from '@angular/core/testing';

import { CoqFormService } from './coq-form.service';

describe('CoqFormService', () => {
  let service: CoqFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoqFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
