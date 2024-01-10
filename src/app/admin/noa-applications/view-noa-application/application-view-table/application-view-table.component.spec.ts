import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationViewTableComponent } from './application-view-table.component';

describe('ApplicationViewTableComponent', () => {
  let component: ApplicationViewTableComponent;
  let fixture: ComponentFixture<ApplicationViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationViewTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
