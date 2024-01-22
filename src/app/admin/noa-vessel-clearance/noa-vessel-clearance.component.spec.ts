import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaVesselClearanceComponent } from './noa-vessel-clearance.component';

describe('NoaVesselClearanceComponent', () => {
  let component: NoaVesselClearanceComponent;
  let fixture: ComponentFixture<NoaVesselClearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoaVesselClearanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoaVesselClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
