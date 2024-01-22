import { TestBed } from '@angular/core/testing';

import { FieldOfficerOrOfficeGuard } from './field-officer-or-office.guard';

describe('FieldOfficerOrOfficeGuard', () => {
  let guard: FieldOfficerOrOfficeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FieldOfficerOrOfficeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
