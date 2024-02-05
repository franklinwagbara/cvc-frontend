import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingDetailsGasComponent } from './processing-details-gas.component';

describe('ProcessingDetailsGasComponent', () => {
  let component: ProcessingDetailsGasComponent;
  let fixture: ComponentFixture<ProcessingDetailsGasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingDetailsGasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingDetailsGasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
