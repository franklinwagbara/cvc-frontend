import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasDataDynamicEntryComponent } from './gas-data-dynamic-entry.component';

describe('GasDataDynamicEntryComponent', () => {
  let component: GasDataDynamicEntryComponent;
  let fixture: ComponentFixture<GasDataDynamicEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasDataDynamicEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasDataDynamicEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
