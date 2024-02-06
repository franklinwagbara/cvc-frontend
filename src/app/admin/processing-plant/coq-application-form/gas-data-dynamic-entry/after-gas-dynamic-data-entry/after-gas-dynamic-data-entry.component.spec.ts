import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterGasDynamicDataEntryComponent } from './after-gas-dynamic-data-entry.component';

describe('AfterGasDynamicDataEntryComponent', () => {
  let component: AfterGasDynamicDataEntryComponent;
  let fixture: ComponentFixture<AfterGasDynamicDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterGasDynamicDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterGasDynamicDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
