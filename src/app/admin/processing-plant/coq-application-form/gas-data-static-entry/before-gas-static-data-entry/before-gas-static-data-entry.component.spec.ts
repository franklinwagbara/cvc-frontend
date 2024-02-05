import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeGasStaticDataEntryComponent } from './before-gas-static-data-entry.component';

describe('BeforeGasStaticDataEntryComponent', () => {
  let component: BeforeGasStaticDataEntryComponent;
  let fixture: ComponentFixture<BeforeGasStaticDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeGasStaticDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeGasStaticDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
