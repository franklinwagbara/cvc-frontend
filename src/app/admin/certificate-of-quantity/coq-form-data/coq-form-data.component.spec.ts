import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqFormDataComponent } from './coq-form-data.component';

describe('CoqFormDataComponent', () => {
  let component: CoqFormDataComponent;
  let fixture: ComponentFixture<CoqFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqFormDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
