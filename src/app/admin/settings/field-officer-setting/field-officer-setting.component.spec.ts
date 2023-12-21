import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldOfficerSettingComponent } from './field-officer-setting.component';

describe('FieldOfficerSettingComponent', () => {
  let component: FieldOfficerSettingComponent;
  let fixture: ComponentFixture<FieldOfficerSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldOfficerSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldOfficerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
