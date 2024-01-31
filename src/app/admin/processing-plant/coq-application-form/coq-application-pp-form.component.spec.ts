import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationPPFormComponent } from './coq-application-pp-form.component';

describe('CoqApplicationPPFormComponent', () => {
  let component: CoqApplicationPPFormComponent;
  let fixture: ComponentFixture<CoqApplicationPPFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoqApplicationPPFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoqApplicationPPFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
