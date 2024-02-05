import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterGasStaticDataEntryComponent } from './after-gas-static-data-entry.component';

describe('AfterGasStaticDataEntryComponent', () => {
  let component: AfterGasStaticDataEntryComponent;
  let fixture: ComponentFixture<AfterGasStaticDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterGasStaticDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterGasStaticDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
