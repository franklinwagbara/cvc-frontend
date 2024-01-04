import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationsByDepotComponent } from './coq-applications-by-depot.component';

describe('CoqApplicationsByDepotComponent', () => {
  let component: CoqApplicationsByDepotComponent;
  let fixture: ComponentFixture<CoqApplicationsByDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqApplicationsByDepotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqApplicationsByDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
