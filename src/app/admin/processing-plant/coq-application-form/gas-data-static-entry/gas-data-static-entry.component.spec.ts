import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasDataStaticEntryComponent } from './gas-data-static-entry.component';

describe('GasDataStaticEntryComponent', () => {
  let component: GasDataStaticEntryComponent;
  let fixture: ComponentFixture<GasDataStaticEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasDataStaticEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasDataStaticEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
