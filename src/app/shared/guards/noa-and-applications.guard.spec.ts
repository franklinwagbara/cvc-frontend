import { TestBed } from '@angular/core/testing';

import { NoaAndApplicationsGuard } from './noa-and-applications.guard';

describe('NoaAndApplicationsGuard', () => {
  let guard: NoaAndApplicationsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoaAndApplicationsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
