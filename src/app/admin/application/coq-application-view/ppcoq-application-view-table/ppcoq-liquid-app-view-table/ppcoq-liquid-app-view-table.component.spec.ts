import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcoqLiquidAppViewTableComponent } from './ppcoq-liquid-app-view-table.component';

describe('PpcoqLiquidAppViewTableComponent', () => {
  let component: PpcoqLiquidAppViewTableComponent;
  let fixture: ComponentFixture<PpcoqLiquidAppViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpcoqLiquidAppViewTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpcoqLiquidAppViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
