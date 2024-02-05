import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipMethodSettingComponent } from './dip-method-setting.component';

describe('DipMethodSettingComponent', () => {
  let component: DipMethodSettingComponent;
  let fixture: ComponentFixture<DipMethodSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DipMethodSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DipMethodSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
