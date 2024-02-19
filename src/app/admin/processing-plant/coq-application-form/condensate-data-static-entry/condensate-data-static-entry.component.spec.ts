import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondensateDataStaticEntryComponent } from './condensate-data-static-entry.component';

describe('CondensateDataStaticEntryComponent', () => {
  let component: CondensateDataStaticEntryComponent;
  let fixture: ComponentFixture<CondensateDataStaticEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondensateDataStaticEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondensateDataStaticEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
