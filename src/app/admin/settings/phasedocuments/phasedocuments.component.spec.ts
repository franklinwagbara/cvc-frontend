import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhasedocumentsComponent } from './phasedocuments.component';

describe('PhasedocumentsComponent', () => {
  let component: PhasedocumentsComponent;
  let fixture: ComponentFixture<PhasedocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhasedocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhasedocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
