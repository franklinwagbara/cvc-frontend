import { TestBed } from '@angular/core/testing';

import { ProcessingPlantContextService } from './ProcessingPlantContextService';

describe('ProcessingPlantContextService', () => {
  let service: ProcessingPlantContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessingPlantContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
