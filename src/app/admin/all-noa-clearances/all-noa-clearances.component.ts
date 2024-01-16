import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-noa-clearances',
  templateUrl: './all-noa-clearances.component.html',
  styleUrls: ['./all-noa-clearances.component.css']
})
export class AllNoaClearancesComponent implements OnInit {
  clearances: any[]

  clearanceKeysMappedToHeaders = {

  }

  constructor() {}

  ngOnInit(): void {
    
  }

  onViewData(event: any): void {
    window.location.assign(event?.url);
  }
}
