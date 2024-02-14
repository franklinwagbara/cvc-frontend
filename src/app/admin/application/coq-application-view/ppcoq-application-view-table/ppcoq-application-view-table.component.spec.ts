import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcoqApplicationViewTableComponent } from './ppcoq-application-view-table.component';

describe('PpcoqApplicationViewTableComponent', () => {
  let component: PpcoqApplicationViewTableComponent;
  let fixture: ComponentFixture<PpcoqApplicationViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpcoqApplicationViewTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpcoqApplicationViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
