import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffdeskComponent } from './staffdesk.component';

describe('StaffdeskComponent', () => {
  let component: StaffdeskComponent;
  let fixture: ComponentFixture<StaffdeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffdeskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
