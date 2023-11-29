import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitStageDocFormComponent } from './permit-stage-doc-form.component';

describe('PermitStageDocFormComponent', () => {
  let component: PermitStageDocFormComponent;
  let fixture: ComponentFixture<PermitStageDocFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitStageDocFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitStageDocFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
