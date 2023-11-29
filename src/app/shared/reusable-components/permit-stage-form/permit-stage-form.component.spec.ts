import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitStageFormComponent } from './permit-stage-form.component';

describe('PermitStageFormComponent', () => {
  let component: PermitStageFormComponent;
  let fixture: ComponentFixture<PermitStageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitStageFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitStageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
