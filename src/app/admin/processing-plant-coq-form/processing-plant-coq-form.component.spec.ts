import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingPlantCoqFormComponent } from './processing-plant-coq-form.component';

describe('ProcessingPlantCoqFormComponent', () => {
  let component: ProcessingPlantCoqFormComponent;
  let fixture: ComponentFixture<ProcessingPlantCoqFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingPlantCoqFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingPlantCoqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
