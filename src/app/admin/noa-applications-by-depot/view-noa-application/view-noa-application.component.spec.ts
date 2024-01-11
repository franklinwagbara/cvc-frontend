import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNoaApplicationComponent } from './view-noa-application.component';

describe('ViewNoaApplicationComponent', () => {
  let component: ViewNoaApplicationComponent;
  let fixture: ComponentFixture<ViewNoaApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNoaApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNoaApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
