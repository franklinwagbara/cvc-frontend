import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFilterrightComponent } from './payment-filterright.component';

describe('FilterrightComponent', () => {
  let component: PaymentFilterrightComponent;
  let fixture: ComponentFixture<PaymentFilterrightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentFilterrightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFilterrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
