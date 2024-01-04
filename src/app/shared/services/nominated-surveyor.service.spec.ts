import { TestBed } from '@angular/core/testing';

import { NominatedSurveyorService } from './nominated-surveyor.service';

describe('NominatedSurveyorService', () => {
  let service: NominatedSurveyorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominatedSurveyorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
