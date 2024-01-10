import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationsComponent } from './coq-applications.component';

describe('CoqApplicationsComponent', () => {
  let component: CoqApplicationsComponent;
  let fixture: ComponentFixture<CoqApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
