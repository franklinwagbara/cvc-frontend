import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeClearanceFormComponent } from './discharge-clearance-form.component';

describe('DischargeClearanceFormComponent', () => {
  let component: DischargeClearanceFormComponent;
  let fixture: ComponentFixture<DischargeClearanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargeClearanceFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DischargeClearanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
