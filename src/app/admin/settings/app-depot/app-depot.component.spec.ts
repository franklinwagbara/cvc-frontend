import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDepotComponent } from './app-depot.component';

describe('AppDepotComponent', () => {
  let component: AppDepotComponent;
  let fixture: ComponentFixture<AppDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppDepotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
