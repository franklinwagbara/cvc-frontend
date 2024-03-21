import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StsDocumentUploadComponent } from './sts-document-upload.component';

describe('StsDocumentUploadComponent', () => {
  let component: StsDocumentUploadComponent;
  let fixture: ComponentFixture<StsDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StsDocumentUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StsDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
