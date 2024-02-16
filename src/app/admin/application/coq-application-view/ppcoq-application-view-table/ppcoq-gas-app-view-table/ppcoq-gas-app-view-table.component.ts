import { Component } from '@angular/core';

@Component({
  selector: 'ppcoq-gas-app-view-table',
  templateUrl: './ppcoq-gas-app-view-table.component.html',
  styleUrls: ['./ppcoq-gas-app-view-table.component.css']
})
export class PpcoqGasAppViewTableComponent {
  application;
  isProcessingPlant;
  isCoqProcessor;
  tankList: any[];

  viewReadings(): void {

  }
}
