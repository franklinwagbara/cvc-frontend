import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-depots',
  templateUrl: './view-depots.component.html',
  styleUrls: ['./view-depots.component.css'],
})
export class ViewDepotsComponent {
  @Input() depots: any[] = [];
  // constructor(private )
}
