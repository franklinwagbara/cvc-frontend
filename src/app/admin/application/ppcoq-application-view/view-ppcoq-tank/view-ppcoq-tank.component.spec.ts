import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPpcoqTankComponent } from './view-ppcoq-tank.component';

describe('ViewPpcoqTankComponent', () => {
  let component: ViewPpcoqTankComponent;
  let fixture: ComponentFixture<ViewPpcoqTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPpcoqTankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPpcoqTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
