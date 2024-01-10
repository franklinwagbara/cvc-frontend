import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNoaClearancesComponent } from './all-noa-clearances.component';

describe('AllNoaClearancesComponent', () => {
  let component: AllNoaClearancesComponent;
  let fixture: ComponentFixture<AllNoaClearancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllNoaClearancesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNoaClearancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
