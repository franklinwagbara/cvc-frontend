import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGraphModalComponent } from './payment-graph-modal.component';

describe('GraphModalComponent', () => {
  let component: PaymentGraphModalComponent;
  let fixture: ComponentFixture<PaymentGraphModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentGraphModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentGraphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
