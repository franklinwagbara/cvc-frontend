import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterCondensateStaticDataEntryComponent } from './after-condensate-static-data-entry.component';

describe('AfterCondensateStaticDataEntryComponent', () => {
  let component: AfterCondensateStaticDataEntryComponent;
  let fixture: ComponentFixture<AfterCondensateStaticDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterCondensateStaticDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterCondensateStaticDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
