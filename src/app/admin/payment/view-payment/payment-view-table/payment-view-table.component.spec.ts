import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentViewTableComponent } from './payment-view-table.component';

describe('PaymentViewTableComponent', () => {
  let component: PaymentViewTableComponent;
  let fixture: ComponentFixture<PaymentViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentViewTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
