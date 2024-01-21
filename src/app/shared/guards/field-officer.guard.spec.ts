import { TestBed } from '@angular/core/testing';

import { FieldOfficerGuard } from './field-officer.guard';

describe('FieldOfficerGuard', () => {
  let guard: FieldOfficerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FieldOfficerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
