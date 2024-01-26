import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentReportBarChartComponent } from './bar-chart.component';


describe('BarChartComponent', () => {
  let component: PaymentReportBarChartComponent;
  let fixture: ComponentFixture<PaymentReportBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentReportBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentReportBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
