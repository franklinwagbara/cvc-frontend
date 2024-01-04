import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppSource } from 'src/app/shared/constants/appSource';
import { IApplication } from 'src/app/shared/interfaces/IApplication';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
// import { ApplicationService } from 'src/app/shared/services/application.service';
import { Category } from '../settings/modules-setting/modules-setting.component';
import { ApplicationService } from 'src/app/shared/services/application.service';


@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent implements OnInit, AfterViewInit {
  public applications: IApplication[];
  public categories: Category[];

  public tableTitles = {
    applications: 'All Applications',
  };

  public applicationKeysMappedToHeaders = {
    reference: 'Reference Number',
    companyName: 'Company Name',
    // appType: 'Application Type',
    vesselName: 'Vessel Name',
    createdDate: 'Initiation Date',
    capacity: 'Capacity',
    status: 'Status',
  };

  constructor(
    private applicationService: ApplicationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.progressBar.open();
    this.spinner.open();

    forkJoin([
      this.applicationService.getAllApplications(),
      // this.adminService.getModule(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) this.applications = res[0].data;

        // if (res[1].success) this.categories = res[1].data;

        // this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        // this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  ngAfterViewInit(): void {
    // this.categories = [...this.categories];
  }

  onViewData(event: any, type: string) {
    this.router.navigate([`/admin/view-application/${event.id}`], {
      queryParams: { id: event.id, appSource: AppSource.Application },
    });
  }
}
