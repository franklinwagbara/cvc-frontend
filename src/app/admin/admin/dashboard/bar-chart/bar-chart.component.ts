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

// // Apply chart themes

// // Create chart instance
// var chart = am4core.create('chartdiv', am4charts.XYChart3D);

// // Add data
// chart.data = [
//   {
//     country: 'Lithuania',
//     litres: 501.9,
//     units: 250,
//   },
//   {
//     country: 'Czech Republic',
//     litres: 301.9,
//     units: 222,
//   },
//   {
//     country: 'Ireland',
//     litres: 201.1,
//     units: 170,
//   },
//   {
//     country: 'Germany',
//     litres: 165.8,
//     units: 122,
//   },
//   {
//     country: 'Australia',
//     litres: 139.9,
//     units: 99,
//   },
//   {
//     country: 'Austria',
//     litres: 128.3,
//     units: 85,
//   },
//   {
//     country: 'UK',
//     litres: 99,
//     units: 93,
//   },
//   {
//     country: 'Belgium',
//     litres: 60,
//     units: 50,
//   },
//   {
//     country: 'The Netherlands',
//     litres: 50,
//     units: 42,
//   },
// ];

// // Create axes
// var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
// categoryAxis.dataFields.category = 'country';
// categoryAxis.title.text = 'Countries';

// var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
// valueAxis.title.text = 'Litres sold (M)';

// // Create series
// var series = chart.series.push(new am4charts.ColumnSeries3D());
// series.dataFields.valueY = 'litres';
// series.dataFields.categoryX = 'country';
// series.name = 'Sales';
// series.tooltipText = '{name}: [bold]{valueY}[/]';

// var series2 = chart.series.push(new am4charts.ColumnSeries3D());
// series2.dataFields.valueY = 'units';
// series2.dataFields.categoryX = 'country';
// series2.name = 'Units';
// series2.tooltipText = '{name}: [bold]{valueY}[/]';

// // Add cursor
// chart.cursor = new am4charts.XYCursor();
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart3D;
  private chart2: am4charts.PieChart3D;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_kelly);

      let chart = am4core.create('chartdiv', am4charts.XYChart3D);
      let chart2 = am4core.create('chartdiv2', am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0;
      chart2.hiddenState.properties.opacity = 0;

      chart.paddingRight = 20;
      chart2.paddingRight = 20;

      let data = [];
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
          country: 'Lithuania',
          litres: 501.9,
          units: 250,
        },
        {
          country: 'Czech Republic',
          litres: 301.9,
          units: 222,
        },
        {
          country: 'Ireland',
          litres: 201.1,
          units: 170,
        },
        {
          country: 'Germany',
          litres: 165.8,
          units: 122,
        },
        {
          country: 'Australia',
          litres: 139.9,
          units: 99,
        },
        {
          country: 'Austria',
          litres: 128.3,
          units: 85,
        },
        {
          country: 'UK',
          litres: 99,
          units: 93,
        },
        {
          country: 'Belgium',
          litres: 60,
          units: 50,
        },
        {
          country: 'The Netherlands',
          litres: 50,
          units: 42,
        },
      ];

      chart2.data = [
        {
          country: 'Lithuania',
          litres: 501.9,
        },
        {
          country: 'Czech Republic',
          litres: 301.9,
        },
        {
          country: 'Ireland',
          litres: 201.1,
        },
        {
          country: 'Germany',
          litres: 165.8,
        },
        {
          country: 'Australia',
          litres: 139.9,
        },
        {
          country: 'Austria',
          litres: 128.3,
        },
      ];

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'country';
      categoryAxis.title.text = 'Countries';

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Litres sold (M)';

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries3D());
      series.dataFields.valueY = 'litres';
      series.dataFields.categoryX = 'country';
      series.name = 'Sales';
      series.tooltipText = '{name}: [bold]{valueY}[/]';

      var series2 = chart.series.push(new am4charts.ColumnSeries3D());
      series2.dataFields.valueY = 'units';
      series2.dataFields.categoryX = 'country';
      series2.name = 'Units';
      series2.tooltipText = '{name}: [bold]{valueY}[/]';

      // Add cursor
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      //chart2 setup
      chart2.innerRadius = am4core.percent(40);
      chart.depth = 120;

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';

      var series3 = chart2.series.push(new am4charts.PieSeries3D());
      series3.dataFields.value = 'litres';
      series3.dataFields.depthValue = 'litres';
      series3.dataFields.category = 'country';
      series3.slices.template.cornerRadius = 5;
      series3.colors.step = 3;

      this.chart = chart;
      this.chart2 = chart2;
    });
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
