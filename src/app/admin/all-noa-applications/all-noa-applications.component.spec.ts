import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNoaApplicationsComponent } from './all-noa-applications.component';

describe('AllNoaApplicationsComponent', () => {
  let component: AllNoaApplicationsComponent;
  let fixture: ComponentFixture<AllNoaApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllNoaApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNoaApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
