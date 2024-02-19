import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPpcoqApplicationsComponent } from './all-ppcoq-applications.component';

describe('AllPpcoqApplicationsComponent', () => {
  let component: AllPpcoqApplicationsComponent;
  let fixture: ComponentFixture<AllPpcoqApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPpcoqApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPpcoqApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
