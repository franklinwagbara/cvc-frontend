import { TestBed } from '@angular/core/testing';

import { HppitiFieldofficerGuard } from './hppiti-fieldofficer.guard';

describe('HppitiFieldofficerGuard', () => {
  let guard: HppitiFieldofficerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HppitiFieldofficerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
