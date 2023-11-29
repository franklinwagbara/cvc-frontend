import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentExtrasComponent } from './payments-extras.component';

describe('ExtrasComponent', () => {
  let component: PaymentExtrasComponent;
  let fixture: ComponentFixture<PaymentExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentExtrasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
