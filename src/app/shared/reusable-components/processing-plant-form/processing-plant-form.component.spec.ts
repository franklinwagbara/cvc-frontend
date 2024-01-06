import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingPlantFormComponent } from './processing-plant-form.component';

describe('ProcessingPlantFormComponent', () => {
  let component: ProcessingPlantFormComponent;
  let fixture: ComponentFixture<ProcessingPlantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingPlantFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingPlantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
