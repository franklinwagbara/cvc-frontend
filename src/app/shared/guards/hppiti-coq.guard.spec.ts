import { TestBed } from '@angular/core/testing';

import { HppitiCoqGuard } from './hppiti-coq.guard';

describe('HppitiCoqGuard', () => {
  let guard: HppitiCoqGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HppitiCoqGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
