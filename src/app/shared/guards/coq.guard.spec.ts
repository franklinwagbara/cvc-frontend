import { TestBed } from '@angular/core/testing';

import { CoqGuard } from './coq.guard';

describe('CoqGuard', () => {
  let guard: CoqGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CoqGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
