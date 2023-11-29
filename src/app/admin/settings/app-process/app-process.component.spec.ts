import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProcessComponent } from './app-process.component';

describe('AppProcessComponent', () => {
  let component: AppProcessComponent;
  let fixture: ComponentFixture<AppProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
