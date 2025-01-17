import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AppSource } from '../../../../../../src/app/shared/constants/appSource';
import { IApplication } from '../../../../../../src/app/shared/interfaces/IApplication';
import { AddScheduleFormComponent } from '../../../../../../src/app/shared/reusable-components/add-schedule-form/add-schedule-form.component';
import { ApproveFormComponent } from '../../../../../../src/app/shared/reusable-components/approve-form/approve-form.component';
import { SendBackFormComponent } from '../../../../../../src/app/shared/reusable-components/send-back-form/send-back-form.component';
import { AuthenticationService } from '../../../../../../src/app/shared/services';
import { AdminService } from '../../../../../../src/app/shared/services/admin.service';
import { ApplyService } from '../../../../../../src/app/shared/services/apply.service';
import { ProgressBarService } from '../../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../../src/app/shared/services/spinner.service';
import { ShowMoreComponent } from '../../../../shared/reusable-components/show-more/show-more.component';
import { ApplicationService } from '../../../../../../src/app/shared/services/application.service';

@Component({
  selector: 'app-view-coq-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss'],
})
export class ViewApplicationComponent implements OnInit {
  public application: IApplication | any;
  public appActions: any;
  public appId: number;
  public appSource: AppSource;

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private appService: ApplicationService,
    public dialog: MatDialog,
    public progressBar: ProgressBarService,
    private spinner: SpinnerService,
    public route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe((params) => {
      this.spinner.open();
      this.appId = parseInt(params['id']);

      this.getApplication().subscribe({
        next: (res) => {
          if (res.success) {
            this.application = res.data.data;
          }

          this.progressBar.close();
          this.spinner.close();
        },
        error: (error) => {
          this.snackBar.open(
            'Something went wrong while retrieving data.',
            null,
            {
              panelClass: ['error'],
            }
          );

          this.progressBar.close();
          this.spinner.close();
        },
      });
    });
  }

  ngOnInit(): void {}

  isCreatedByMe(scheduleBy: string) {
    const currentUser = this.auth.currentUser;
    return currentUser.userId == scheduleBy;
  }

  getApplication() {
    return this.appService.viewApplication(this.appId);
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
      this.progressBar.open();

      this.getApplication().subscribe((res) => {
        this.application = res.data.data;

        this.progressBar.close();
        this.cd.markForCheck();
      });
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
          applicationDocs: this.application.applicationDocs,
        },
      },
    };

    this.dialog.open(ShowMoreComponent, {
      data: {
        data: operationConfiguration[type].data,
      },
    });
  }

  isPDF(filePath: string) {
    if (!filePath) return false;

    const fileType = filePath.split('.').slice(-1)[0];

    return fileType == 'pdf';
  }

  isIMG(filePath) {
    if (!filePath) return false;
    const imageTypes = ['png', 'jpg', 'jpeg', 'tiff'];

    const fileType = filePath.split('.').slice(-1)[0];

    return imageTypes.includes(fileType);
  }
}
