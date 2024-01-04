import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoqApplicationComponent } from './view-coq-application.component';

describe('ViewCoqApplicationComponent', () => {
  let component: ViewCoqApplicationComponent;
  let fixture: ComponentFixture<ViewCoqApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoqApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCoqApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
