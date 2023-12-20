import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeeComponent } from './app-depot.component';

describe('AppFeeComponent', () => {
  let component: AppFeeComponent;
  let fixture: ComponentFixture<AppFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppFeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
