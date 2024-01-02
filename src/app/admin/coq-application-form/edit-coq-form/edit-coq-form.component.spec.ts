import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCoqFormComponent } from './edit-coq-form.component';

describe('EditCoqFormComponent', () => {
  let component: EditCoqFormComponent;
  let fixture: ComponentFixture<EditCoqFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCoqFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCoqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
