import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitnotePaymentsumComponent } from './debitnote-paymentsum.component';

describe('DebitnotePaymentsumComponent', () => {
  let component: DebitnotePaymentsumComponent;
  let fixture: ComponentFixture<DebitnotePaymentsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitnotePaymentsumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitnotePaymentsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
