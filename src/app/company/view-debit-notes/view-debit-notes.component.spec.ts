import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDebitNotesComponent } from './view-debit-notes.component';

describe('ViewDebitNotesComponent', () => {
  let component: ViewDebitNotesComponent;
  let fixture: ComponentFixture<ViewDebitNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDebitNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDebitNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
