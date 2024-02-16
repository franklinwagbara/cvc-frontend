import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingDetailsCondensateComponent } from './processing-details-condensate.component';

describe('ProcessingDetailsCondensateComponent', () => {
  let component: ProcessingDetailsCondensateComponent;
  let fixture: ComponentFixture<ProcessingDetailsCondensateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingDetailsCondensateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingDetailsCondensateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
