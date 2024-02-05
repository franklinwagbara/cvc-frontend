import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidDataDynamicEntryComponent } from './liquid-data-dynamic-entry.component';

describe('LiquidDataDynamicEntryComponent', () => {
  let component: LiquidDataDynamicEntryComponent;
  let fixture: ComponentFixture<LiquidDataDynamicEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidDataDynamicEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidDataDynamicEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
