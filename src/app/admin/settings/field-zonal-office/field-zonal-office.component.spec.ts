import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldZonalOfficeComponent } from './field-zonal-office.component';

describe('FieldZonalOfficeComponent', () => {
  let component: FieldZonalOfficeComponent;
  let fixture: ComponentFixture<FieldZonalOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldZonalOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldZonalOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
