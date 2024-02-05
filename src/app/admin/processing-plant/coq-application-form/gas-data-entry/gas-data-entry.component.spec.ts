import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasDataEntryComponent } from './gas-data-entry.component';

describe('GasDataEntryComponent', () => {
  let component: GasDataEntryComponent;
  let fixture: ComponentFixture<GasDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
