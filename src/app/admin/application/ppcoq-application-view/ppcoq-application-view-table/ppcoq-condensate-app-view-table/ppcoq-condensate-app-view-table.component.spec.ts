import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcoqCondensateAppViewTableComponent } from './ppcoq-condensate-app-view-table.component';

describe('PpcoqCondensateAppViewTableComponent', () => {
  let component: PpcoqCondensateAppViewTableComponent;
  let fixture: ComponentFixture<PpcoqCondensateAppViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpcoqCondensateAppViewTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpcoqCondensateAppViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
