import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignApplicationFormComponent } from './assign-application-form.component';

describe('AssignApplicationFormComponent', () => {
  let component: AssignApplicationFormComponent;
  let fixture: ComponentFixture<AssignApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignApplicationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
