import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDocListFormComponent } from './additional-doc-list-form.component';

describe('PermitStageDocFormComponent', () => {
  let component: AdditionalDocListFormComponent;
  let fixture: ComponentFixture<AdditionalDocListFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalDocListFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalDocListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
