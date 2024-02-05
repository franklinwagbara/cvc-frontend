import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeLiquidStaticDataEntryComponent } from './before-liquid-static-data-entry.component';

describe('BeforeLiquidStaticDataEntryComponent', () => {
  let component: BeforeLiquidStaticDataEntryComponent;
  let fixture: ComponentFixture<BeforeLiquidStaticDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeLiquidStaticDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeLiquidStaticDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
