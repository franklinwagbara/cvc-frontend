import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';
import { DashBoardModel } from '../dashboard.component';
import { AuthenticationService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart3D;
  private chart2: am4charts.PieChart3D;
  chartLoaded: boolean | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId, 
    private zone: NgZone,
    private auth: AuthenticationService,
  ) {
    
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    const currentUser = this.auth.currentUser;
    const isLoggedIn = currentUser && currentUser.token;
    
    // Chart code goes in here
    this.browserOnly(() => {
      if (isLoggedIn) {
        fetch(`${environment.apiUrl}/Staff/get-dashboard`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((result) => {
            this.zone.run(() => {
              this.chartLoaded = true;
              am4core.useTheme(am4themes_animated);
              am4core.useTheme(am4themes_kelly);

              const chart = am4core.create('chartdiv', am4charts.XYChart3D);
              const chart2 = am4core.create('chartdiv2', am4charts.PieChart3D);
              chart.hiddenState.properties.opacity = 0;
              chart2.hiddenState.properties.opacity = 0;

              chart.paddingRight = 20;
              chart2.paddingRight = 20;

              const data = [];
              let visits = 10;
              for (let i = 1; i < 366; i++) {
                visits += Math.round(
                  (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10
                );
                data.push({
                  date: new Date(2018, 0, i),
                  name: 'name' + i,
                  value: visits,
                });
              }

              // chart.data = data;

              chart.data = [
                {
                  category: 'Desk',
                  noa: result?.data?.deskCount || 0,
                  coq: 250,
                },
                {
                  category: 'Approved',
                  noa: result?.data.tApproved || 0,
                  coq: 222,
                },
                {
                  category: 'Processing',
                  noa: result?.data?.tProcessing || 0,
                  coq: 170,
                },
                {
                  category: 'Declined',
                  noa: result?.data?.tRejected || 0,
                  coq: 122,
                },
              ];

              chart2.data = [
                {
                  category: 'NoA',
                  noa: 501.9,
                },
                {
                  category: 'CoQ',
                  noa: 301.9,
                },
              ];

              // Create axes
              const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
              categoryAxis.dataFields.category = 'category';
              categoryAxis.title.text = 'Categories';

              const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
              valueAxis.title.text = 'Applications Count';

              // Create series
              const series = chart.series.push(new am4charts.ColumnSeries3D());
              series.dataFields.valueY = 'noa';
              series.dataFields.categoryX = 'category';
              series.name = 'NoA';
              series.tooltipText = '{name}: [bold]{valueY}[/]';

              const series2 = chart.series.push(new am4charts.ColumnSeries3D());
              series2.dataFields.valueY = 'coq';
              series2.dataFields.categoryX = 'category';
              series2.name = 'CoQ';
              series2.tooltipText = '{name}: [bold]{valueY}[/]';

              // Add cursor
              chart.cursor = new am4charts.XYCursor();

              const scrollbarX = new am4charts.XYChartScrollbar();
              scrollbarX.series.push(series);
              chart.scrollbarX = scrollbarX;

              //chart2 setup
              chart2.innerRadius = am4core.percent(40);
              chart.depth = 120;

              chart.legend = new am4charts.Legend();
              chart.legend.position = 'right';

              const series3 = chart2.series.push(new am4charts.PieSeries3D());
              series3.dataFields.value = 'noa';
              series3.dataFields.depthValue = 'noa';
              series3.dataFields.category = 'category';
              series3.slices.template.cornerRadius = 5;
              series3.colors.step = 3;

              this.chart = chart;
              this.chart2 = chart2;
    
            })
          }).catch(error => {
            this.zone.run(() => {
              this.chartLoaded = false;
            })
            console.log(error)
          });
      }
    })
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
