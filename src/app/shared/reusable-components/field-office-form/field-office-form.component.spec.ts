import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldOfficeFormComponent } from './field-office-form.component';

describe('FieldOfficeFormComponent', () => {
  let component: FieldOfficeFormComponent;
  let fixture: ComponentFixture<FieldOfficeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldOfficeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldOfficeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
