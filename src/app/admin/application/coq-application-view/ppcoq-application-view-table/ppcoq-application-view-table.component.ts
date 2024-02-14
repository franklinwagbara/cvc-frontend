import { Component } from '@angular/core';

@Component({
  selector: 'app-ppcoq-application-view-table',
  templateUrl: './ppcoq-application-view-table.component.html',
  styleUrls: ['./ppcoq-application-view-table.component.css']
})
export class PpcoqApplicationViewTableComponent {
  application;
  isProcessingPlant;
  isCoqProcessor;
  tankList: any[];

  viewTanks(): void {

  }
}
