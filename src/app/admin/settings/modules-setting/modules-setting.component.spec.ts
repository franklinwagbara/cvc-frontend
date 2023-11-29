import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesSettingComponent } from './modules-setting.component';

describe('ModulesSettingComponent', () => {
  let component: ModulesSettingComponent;
  let fixture: ComponentFixture<ModulesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulesSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
