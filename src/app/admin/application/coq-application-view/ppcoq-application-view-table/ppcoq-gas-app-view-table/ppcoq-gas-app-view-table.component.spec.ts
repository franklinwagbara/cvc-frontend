import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcoqGasAppViewTableComponent } from './ppcoq-gas-app-view-table.component';

describe('PpcoqGasAppViewTableComponent', () => {
  let component: PpcoqGasAppViewTableComponent;
  let fixture: ComponentFixture<PpcoqGasAppViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpcoqGasAppViewTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpcoqGasAppViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
