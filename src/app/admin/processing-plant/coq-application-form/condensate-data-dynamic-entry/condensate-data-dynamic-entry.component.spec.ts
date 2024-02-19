import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondensateDataDynamicEntryComponent } from './condensate-data-dynamic-entry.component';

describe('CondensateDataDynamicEntryComponent', () => {
  let component: CondensateDataDynamicEntryComponent;
  let fixture: ComponentFixture<CondensateDataDynamicEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondensateDataDynamicEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondensateDataDynamicEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
