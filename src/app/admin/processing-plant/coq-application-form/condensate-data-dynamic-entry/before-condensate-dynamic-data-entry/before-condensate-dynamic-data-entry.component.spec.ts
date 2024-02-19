import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeCondensateDynamicDataEntryComponent } from './before-condensate-dynamic-data-entry.component';

describe('BeforeCondensateDynamicDataEntryComponent', () => {
  let component: BeforeCondensateDynamicDataEntryComponent;
  let fixture: ComponentFixture<BeforeCondensateDynamicDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeCondensateDynamicDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeCondensateDynamicDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
