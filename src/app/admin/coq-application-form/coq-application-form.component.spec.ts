import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationFormComponent } from './coq-application-form.component';

describe('CoqApplicationFormComponent', () => {
  let component: CoqApplicationFormComponent;
  let fixture: ComponentFixture<CoqApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqApplicationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
