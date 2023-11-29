import { TestBed } from '@angular/core/testing';

import { AppStageDocumentService } from './app-stage-document.service';

describe('AppStageDocumentService', () => {
  let service: AppStageDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStageDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
