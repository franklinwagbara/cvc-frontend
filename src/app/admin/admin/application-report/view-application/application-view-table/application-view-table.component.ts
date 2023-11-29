import { Component, OnInit, Input } from '@angular/core';
import { IApplication } from 'src/app/shared/interfaces/IApplication';

@Component({
  selector: 'app-application-view-table',
  templateUrl: './application-view-table.component.html',
  styleUrls: ['./application-view-table.component.scss'],
})
export class ApplicationViewTableComponent implements OnInit {
  @Input('application') application: IApplication;

  constructor() {}

  ngOnInit(): void {}
}
