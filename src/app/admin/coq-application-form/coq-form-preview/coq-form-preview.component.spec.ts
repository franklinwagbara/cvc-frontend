import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqFormPreviewComponent } from './coq-form-preview.component';

describe('CoqFormPreviewComponent', () => {
  let component: CoqFormPreviewComponent;
  let fixture: ComponentFixture<CoqFormPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqFormPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqFormPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
