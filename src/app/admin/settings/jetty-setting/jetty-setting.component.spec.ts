import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JettySettingComponent } from './jetty-setting.component';

describe('JettySettingComponent', () => {
  let component: JettySettingComponent;
  let fixture: ComponentFixture<JettySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JettySettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JettySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
