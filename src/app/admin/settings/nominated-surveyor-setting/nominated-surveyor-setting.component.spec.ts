import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominatedSurveyorSettingComponent } from './nominated-surveyor-setting.component';

describe('NominatedSurveyorSettingComponent', () => {
  let component: NominatedSurveyorSettingComponent;
  let fixture: ComponentFixture<NominatedSurveyorSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominatedSurveyorSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominatedSurveyorSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
