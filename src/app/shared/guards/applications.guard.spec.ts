import { TestBed } from '@angular/core/testing';

import { ApplicationsGuard } from './applications.guard';

describe('ApplicationsGuard', () => {
  let guard: ApplicationsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ApplicationsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
