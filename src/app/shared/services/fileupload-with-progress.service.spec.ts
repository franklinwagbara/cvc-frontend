import { TestBed } from '@angular/core/testing';

import { FileuploadWithProgressService } from './fileupload-with-progress.service';

describe('FileuploadWithProgressService', () => {
  let service: FileuploadWithProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileuploadWithProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
