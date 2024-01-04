import { TestBed } from '@angular/core/testing';

import { CoqAppFormService } from './coq-app-form.service';

describe('CoqAppFormService', () => {
  let service: CoqAppFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoqAppFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
