import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqFormReviewComponent } from './coq-form-review.component';

describe('CoqFormReviewComponent', () => {
  let component: CoqFormReviewComponent;
  let fixture: ComponentFixture<CoqFormReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqFormReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqFormReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
