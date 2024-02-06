import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingDetailsLiquidComponent } from './processing-details-liquid.component';

describe('ProcessingDetailsLiquidComponent', () => {
  let component: ProcessingDetailsLiquidComponent;
  let fixture: ComponentFixture<ProcessingDetailsLiquidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingDetailsLiquidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingDetailsLiquidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
