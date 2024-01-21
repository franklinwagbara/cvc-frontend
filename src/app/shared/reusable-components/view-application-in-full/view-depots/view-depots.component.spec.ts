import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDepotsComponent } from './view-depots.component';

describe('ViewDepotsComponent', () => {
  let component: ViewDepotsComponent;
  let fixture: ComponentFixture<ViewDepotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDepotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
