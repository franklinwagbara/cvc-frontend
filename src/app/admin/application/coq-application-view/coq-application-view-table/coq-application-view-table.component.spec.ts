import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoqApplicationViewTableComponent } from './coq-application-view-table.component';

describe('CoqApplicationViewTableComponent', () => {
  let component: CoqApplicationViewTableComponent;
  let fixture: ComponentFixture<CoqApplicationViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoqApplicationViewTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoqApplicationViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
