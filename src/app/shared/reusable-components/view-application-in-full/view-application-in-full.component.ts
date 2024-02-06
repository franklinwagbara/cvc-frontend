import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Application } from '../../../company/cvc-applications/cvc-applications.component';
import { ApplicationService } from '../../services/application.service';
import { SpinnerService } from '../../services/spinner.service';
import { ProgressBarService } from '../../services/progress-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { AppSource } from '../../constants/appSource';
import { ShowMoreComponent } from '../show-more/show-more.component';
import { AddScheduleFormComponent } from '../add-schedule-form/add-schedule-form.component';
import { SendBackFormComponent } from '../send-back-form/send-back-form.component';
import { ApproveFormComponent } from '../approve-form/approve-form.component';
import { AuthenticationService } from '../../services';
import { Util } from '../../lib/Util';
import { UserType } from '../../constants/userType';

@Component({
  selector: 'app-view-application-in-full',
  templateUrl: './view-application-in-full.component.html',
  styleUrls: ['./view-application-in-full.component.css'],
})
export class ViewApplicationInFullComponent implements OnInit {
  application: Application;
  appId: number;
  appSource: AppSource;
  currentUser: any;
  isPDF = Util.isPDF;
  isIMG = Util.isIMG;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private applicationService: ApplicationService,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public location: Location
  ) {
    this.route.queryParams.subscribe((value: Params) => {
      this.appId = parseInt(value['id']);
      this.appSource = value['appSource'];
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.currentUser = this.auth.currentUser;
    this.getApplication();
    this.cd.markForCheck();
  }

  getApplication() {
    this.spinner.show('Loading application details...');
    this.applicationService.viewApplication(this.appId).subscribe({
      next: (res) => {
        if (res.success) {
          this.application = res.data;
        }
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close();
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.cd.markForCheck();
      },
    });
  }

  public get isSupervisor() {
    return (this.currentUser as any).userRoles === 'Supervisor';
  }

  public get isCompany() {
    return (this.currentUser as any).userRoles.includes(UserType.Company);
  }

  isCreatedByMe(scheduleBy: string) {
    const currentUser = this.auth.currentUser;
    return currentUser.userId == scheduleBy;
  }

  action(type: string, param = null) {
    const operationConfiguration = {
      approve: {
        data: {
          application: this.application,
        },
        form: ApproveFormComponent,
      },
      sendBack: {
        data: {
          application: this.application,
        },
        form: SendBackFormComponent,
      },
      addSchedule: {
        data: {
          application: this.application,
        },
        form: AddScheduleFormComponent,
      },
      editSchedule: {
        data: {
          application: this.application,
          schedule: param,
        },
        form: AddScheduleFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.progressBar.open();
        this.getApplication();
      }
    });
  }

  showMore(type: string) {
    const operationConfiguration = {
      appHistory: {
        data: {
          appHistory: this.application.appHistory,
        },
      },
      schedules: {
        data: {
          schedules: this.application.schedules,
        },
      },
      inspectionForm: {
        data: {
          inspectionForm: this.application.inspectionForm,
        },
      },
      extraPayments: {
        data: {
          extraPayments: this.application.extraPayments,
        },
      },
      applicationDocs: {
        data: {
          applicationDocs: this.application.documents,
        },
      },
    };

    this.dialog.open(ShowMoreComponent, {
      data: {
        data: operationConfiguration[type].data,
      },
    });
  }
}
