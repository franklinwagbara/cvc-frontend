import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqFormReviewPPComponent } from './coq-form-review-pp.component';

describe('CoqFormReviewPPComponent', () => {
  let component: CoqFormReviewPPComponent;
  let fixture: ComponentFixture<CoqFormReviewPPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoqFormReviewPPComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoqFormReviewPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
