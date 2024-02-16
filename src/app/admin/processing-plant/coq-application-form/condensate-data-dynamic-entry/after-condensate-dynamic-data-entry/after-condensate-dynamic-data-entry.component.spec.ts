import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterCondensateDynamicDataEntryComponent } from './after-condensate-dynamic-data-entry.component';

describe('AfterCondensateDynamicDataEntryComponent', () => {
  let component: AfterCondensateDynamicDataEntryComponent;
  let fixture: ComponentFixture<AfterCondensateDynamicDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterCondensateDynamicDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterCondensateDynamicDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
