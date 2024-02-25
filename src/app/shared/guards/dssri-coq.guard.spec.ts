import { TestBed } from '@angular/core/testing';

import { DssriCoqGuard } from './dssri-coq.guard';

describe('DssriCoqGuard', () => {
  let guard: DssriCoqGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DssriCoqGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
