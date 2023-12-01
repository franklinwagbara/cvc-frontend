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
import { ApplicationService } from 'src/app/shared/services/application.service';
import { LicenceService } from 'src/app/shared/services/licence.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { environment } from 'src/environments/environment';
import { ScheduleService } from 'src/app/shared/services/schedule.service';
import { Category } from '../settings/modules-setting/modules-setting.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  public schedules: any[];
  public categories: Category[];

  public tableTitles = {
    schedules: 'All Licences',
  };

  public applicationKeysMappedToHeaders = {
    scheduleType: 'Schedule Type',
    scheduledBy: 'Scheduled By',
    scheduleMessage: 'Schedule Message',
    inspectionDate: 'Inspection Date',
    expiryDate: 'Expiry Date',
    issuedDate: 'Issued Date',
    isApproved: 'Approval Status',
    isAccepted: 'Acceptance Status',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private popup: PopupService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([this.scheduleService.getAllSchedules()]).subscribe({
      next: (res) => {
        if (res[0].success) this.schedules = res[0].data;

        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popup.open('Something went wrong while retrieving data.', 'error');

        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  ngAfterViewInit(): void {
    // this.categories = [...this.categories];
  }

  onViewData(event: any, type: string) {
    // this.router.navigate([`/admin/view-application/${event.appId}`], {
    //   queryParams: { id: event.id, appSource: AppSource.Licence },
    // });
    window.location.assign(
      `${environment}/licenses/view-schedule?id=${event.id}`
    );
  }
}
