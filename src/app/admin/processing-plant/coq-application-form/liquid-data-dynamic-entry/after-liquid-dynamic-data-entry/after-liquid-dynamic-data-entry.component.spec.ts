import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterLiquidDynamicDataEntryComponent } from './after-liquid-dynamic-data-entry.component';

describe('AfterLiquidDynamicDataEntryComponent', () => {
  let component: AfterLiquidDynamicDataEntryComponent;
  let fixture: ComponentFixture<AfterLiquidDynamicDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterLiquidDynamicDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterLiquidDynamicDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
