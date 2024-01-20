import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldOfficerJettySettingComponent } from './field-officer-jetty-setting.component';

describe('FieldOfficerJettySettingComponent', () => {
  let component: FieldOfficerJettySettingComponent;
  let fixture: ComponentFixture<FieldOfficerJettySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldOfficerJettySettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldOfficerJettySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
