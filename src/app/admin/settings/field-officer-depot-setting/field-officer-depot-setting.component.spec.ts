import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldOfficerDepotSettingComponent } from './field-officer-depot-setting.component';

describe('FieldOfficerDepotSettingComponent', () => {
  let component: FieldOfficerDepotSettingComponent;
  let fixture: ComponentFixture<FieldOfficerDepotSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldOfficerDepotSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldOfficerDepotSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
