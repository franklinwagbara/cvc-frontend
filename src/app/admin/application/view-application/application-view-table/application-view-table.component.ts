import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'src/app/company/my-applications/myapplication.component';

@Component({
  selector: 'app-application-view-table',
  templateUrl: './application-view-table.component.html',
  styleUrls: ['./application-view-table.component.scss'],
})
export class ApplicationViewTableComponent implements OnInit {
  @Input() application: Application;
  @Input() appId: number;
  @Input() appSource: string;

  public depotId?: number;
  public coqId?: number;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.depotId = +param['depotId'];
      this.coqId = +param['coqId'];
    });
  }

  viewApplicationInFull() {
    this.router.navigate([`/admin/view-application-in-full/${this.appId}`], {
      queryParams: { id: this.appId, appSource: this.appSource },
    });
  }

  viewCOQApplication() {
    this.router.navigate(
      [
        'admin',
        'noa-applications-by-depot',
        this.appId,
        'certificate-of-quantity',
        'new-application',
      ],
      { queryParams: { depotId: this.depotId, view: true, coqId: this.coqId } }
    );
  }
}
