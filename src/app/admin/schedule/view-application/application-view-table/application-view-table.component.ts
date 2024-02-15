import { Component, OnInit, Input } from '@angular/core';
import { Application } from '../../../../company/cvc-applications/cvc-applications.component';

@Component({
  selector: 'app-application-view-table',
  templateUrl: './application-view-table.component.html',
  styleUrls: ['./application-view-table.component.scss'],
})
export class ApplicationViewTableComponent implements OnInit {
  @Input() application: Application;

  constructor() {}

  ngOnInit(): void {}
}
