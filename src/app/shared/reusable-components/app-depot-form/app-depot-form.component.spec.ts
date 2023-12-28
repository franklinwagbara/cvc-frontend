import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDepotFormComponent } from './app-depot-form.component';

describe('AppDepotFormComponent', () => {
  let component: AppDepotFormComponent;
  let fixture: ComponentFixture<AppDepotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppDepotFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDepotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
