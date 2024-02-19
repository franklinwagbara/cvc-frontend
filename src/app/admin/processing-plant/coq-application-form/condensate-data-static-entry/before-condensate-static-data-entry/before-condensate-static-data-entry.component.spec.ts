import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeCondensateStaticDataEntryComponent } from './before-condensate-static-data-entry.component';

describe('BeforeCondensateStaticDataEntryComponent', () => {
  let component: BeforeCondensateStaticDataEntryComponent;
  let fixture: ComponentFixture<BeforeCondensateStaticDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeCondensateStaticDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeCondensateStaticDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
