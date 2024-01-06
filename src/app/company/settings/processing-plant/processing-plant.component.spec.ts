import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingPlantComponent } from './processing-plant.component';

describe('ProcessingPlantComponent', () => {
  let component: ProcessingPlantComponent;
  let fixture: ComponentFixture<ProcessingPlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingPlantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
