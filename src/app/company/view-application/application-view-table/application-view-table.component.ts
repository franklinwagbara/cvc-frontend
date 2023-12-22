import { Component, OnInit, Input } from '@angular/core';
import { Application } from '../../my-applications/myapplication.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-application-view-table',
  templateUrl: './application-view-table.component.html',
  styleUrls: ['./application-view-table.component.scss'],
})
export class ApplicationViewTableComponent implements OnInit {
  @Input() application: Application;
  @Input() appId: number;
  @Input() appSource: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  viewApplicationInFull() {
    this.router.navigate([`/company/view-application-in-full/${this.appId}`], {
      queryParams: { id: this.appId, appSource: this.appSource },
    });
  }
}
