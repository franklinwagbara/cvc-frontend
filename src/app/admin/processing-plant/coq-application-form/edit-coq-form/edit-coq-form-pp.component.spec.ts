import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCoqFormPPComponent } from './edit-coq-form-pp.component';

describe('EditCoqFormPPComponent', () => {
  let component: EditCoqFormPPComponent;
  let fixture: ComponentFixture<EditCoqFormPPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCoqFormPPComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCoqFormPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
