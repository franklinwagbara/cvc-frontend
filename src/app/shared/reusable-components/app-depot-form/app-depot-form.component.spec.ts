import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeeFormComponent } from './app-depot-form.component';

describe('AppFeeFormComponent', () => {
  let component: AppFeeFormComponent;
  let fixture: ComponentFixture<AppFeeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppFeeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
