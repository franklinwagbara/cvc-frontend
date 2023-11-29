import { TestBed } from '@angular/core/testing';

import { LibaryService } from './libary.service';

describe('LibaryService', () => {
  let service: LibaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
