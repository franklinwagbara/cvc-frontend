import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCoqApplicationsComponent } from './all-coq-applications.component';

describe('AllCoqApplicationsComponent', () => {
  let component: AllCoqApplicationsComponent;
  let fixture: ComponentFixture<AllCoqApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCoqApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCoqApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
