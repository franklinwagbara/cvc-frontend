import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidDataStaticEntryComponent } from './liquid-data-static-entry.component';

describe('LiquidDataStaticEntryComponent', () => {
  let component: LiquidDataStaticEntryComponent;
  let fixture: ComponentFixture<LiquidDataStaticEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidDataStaticEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidDataStaticEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
