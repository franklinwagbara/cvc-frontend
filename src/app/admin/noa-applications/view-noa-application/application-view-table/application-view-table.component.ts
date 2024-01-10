import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplication } from '../../../../shared/interfaces/IApplication';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';


@Component({
  selector: 'app-application-view-table',
  templateUrl: './application-view-table.component.html',
  styleUrls: ['./application-view-table.component.css']
})
export class ApplicationViewTableComponent implements OnInit {
  application: IApplication;
  appId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService,
    private applicationService: ApplicationService
  ) {
    this.route.params.subscribe((params) => {
      this.appId = parseInt(params['id']);
    })
  }

  ngOnInit(): void {
    this.spinner.open();
    this.applicationService.viewApplication(this.appId).subscribe({
      next: (res: any) => {
        this.application = res?.data;
        this.spinner.close()
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close()
      }
    })
  }

  viewApplicationInFull(): void {
    this.router.navigate(['admin', 'view-application-in-full', this.appId]);
  }
}
