import { TestBed } from '@angular/core/testing';

import { ProcessingPlantCOQService } from './processing-plant-coq.service';

describe('ProcessingPlantCOQService', () => {
  let service: ProcessingPlantCOQService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessingPlantCOQService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
