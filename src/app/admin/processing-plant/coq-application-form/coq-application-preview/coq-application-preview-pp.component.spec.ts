import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationPreviewPPComponent } from './coq-application-preview-pp.component';

describe('CoqApplicationPreviewPPComponent', () => {
  let component: CoqApplicationPreviewPPComponent;
  let fixture: ComponentFixture<CoqApplicationPreviewPPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoqApplicationPreviewPPComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoqApplicationPreviewPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
