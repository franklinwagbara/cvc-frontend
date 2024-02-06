import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTypeSettingComponent } from './meter-type-setting.component';

describe('MeterTypeSettingComponent', () => {
  let component: MeterTypeSettingComponent;
  let fixture: ComponentFixture<MeterTypeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeterTypeSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeterTypeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
