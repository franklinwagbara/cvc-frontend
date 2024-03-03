import { Component, Input } from '@angular/core';

@Component({
  selector: 'ppcoq-liquid-app-view-table',
  templateUrl: './ppcoq-liquid-app-view-table.component.html',
  styleUrls: ['./ppcoq-liquid-app-view-table.component.css']
})
export class PpcoqLiquidAppViewTableComponent {
  @Input() application;
  isCoqProcessor;
  tankList: any[];

  viewTanks(): void {

  }
}
