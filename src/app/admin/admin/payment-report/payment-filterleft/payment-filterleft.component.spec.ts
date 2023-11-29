import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFilterleftComponent } from './payment-filterleft.component';

describe('FilterleftComponent', () => {
  let component: PaymentFilterleftComponent;
  let fixture: ComponentFixture<PaymentFilterleftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentFilterleftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFilterleftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
