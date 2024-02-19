import { TestBed } from '@angular/core/testing';

import { ScreenDetectorService } from './screen-detector.service';

describe('ScreenDetectorService', () => {
  let service: ScreenDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
