import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterLiquidStaticDataEntryComponent } from './after-liquid-static-data-entry.component';

describe('AfterLiquidStaticDataEntryComponent', () => {
  let component: AfterLiquidStaticDataEntryComponent;
  let fixture: ComponentFixture<AfterLiquidStaticDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterLiquidStaticDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterLiquidStaticDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
