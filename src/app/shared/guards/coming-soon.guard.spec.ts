import { TestBed } from '@angular/core/testing';

import { ComingSoonGuard } from './coming-soon.guard';

describe('ComingSoonGuard', () => {
  let guard: ComingSoonGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ComingSoonGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
