import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeLiquidDynamicDataEntryComponent } from './before-liquid-dynamic-data-entry.component';

describe('BeforeLiquidDynamicDataEntryComponent', () => {
  let component: BeforeLiquidDynamicDataEntryComponent;
  let fixture: ComponentFixture<BeforeLiquidDynamicDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeLiquidDynamicDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeLiquidDynamicDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
