import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationReportBarChartComponent } from './bar-chart.component';


describe('BarChartComponent', () => {
  let component: ApplicationReportBarChartComponent;
  let fixture: ComponentFixture<ApplicationReportBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationReportBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationReportBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
