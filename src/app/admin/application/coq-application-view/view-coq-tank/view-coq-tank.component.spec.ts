import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoqTankComponent } from './view-coq-tank.component';

describe('ViewCoqTankComponent', () => {
  let component: ViewCoqTankComponent;
  let fixture: ComponentFixture<ViewCoqTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoqTankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCoqTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
