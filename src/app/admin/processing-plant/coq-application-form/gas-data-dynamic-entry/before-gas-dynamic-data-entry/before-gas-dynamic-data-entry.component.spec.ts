import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeGasDynamicDataEntryComponent } from './before-gas-dynamic-data-entry.component';

describe('BeforeGasDynamicDataEntryComponent', () => {
  let component: BeforeGasDynamicDataEntryComponent;
  let fixture: ComponentFixture<BeforeGasDynamicDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeGasDynamicDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeGasDynamicDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
