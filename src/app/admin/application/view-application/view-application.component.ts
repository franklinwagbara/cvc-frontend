import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppSource } from '../../../../../src/app/shared/constants/appSource';
import { AddScheduleFormComponent } from '../../../../../src/app/shared/reusable-components/add-schedule-form/add-schedule-form.component';
import { ApproveFormComponent } from '../../../../../src/app/shared/reusable-components/approve-form/approve-form.component';
import { SendBackFormComponent } from '../../../../../src/app/shared/reusable-components/send-back-form/send-back-form.component';
import { AuthenticationService } from '../../../../../src/app/shared/services';

import { ApplyService } from '../../../../../src/app/shared/services/apply.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { ApplicationService } from '../../../../../src/app/shared/services/application.service';
import { Application } from '../../../company/cvc-applications/cvc-applications.component';
import { LicenceService } from '../../../../../src/app/shared/services/licence.service';
import { ShowMoreComponent } from '../../../shared/reusable-components/show-more/show-more.component';
import { Subject, takeUntil } from 'rxjs';
import { Util } from 'src/app/shared/lib/Util';


@Component({
  selector: 'app-view-coq-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss'],
})
export class ViewApplicationComponent implements OnInit, OnDestroy, AfterViewInit {
  public application: Application;
  public appActions: any;
  public appId: number;
  public appSource: AppSource;
  public licence: any;
  public coqId: number;
  private destroy = new Subject<void>();

  public loading = true;
  isApprover: boolean;
  isFieldOfficer: boolean;
  isFO: boolean;
  isFAD: boolean;
  isSupervisor: boolean;
  isPDF = Util.isPDF;
  isIMG = Util.isIMG;

  showFloatingStaffActions = false;

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private appService: ApplyService,
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    public progressBar: ProgressBarService,
    private spinner: SpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private licenceService: LicenceService,
    public location: Location
  ) {
    this.isFO = auth.isFO;
    this.isSupervisor = auth.isSupervisor;
    this.isFieldOfficer = auth.isFieldOfficer;
    this.isApprover = auth.isApprover;
    this.isFAD = auth.isFAD;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (Object.keys(params).length !== 0) {
        this.appId = parseInt(params['id']);
        if (isNaN(this.appId)) {
          this.location.back();
        }
      } else {
        this.location.back();
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length !== 0) {
        this.appSource = params['appSource'];
        this.coqId = parseInt(params['coqId']);
        if (this.appSource != AppSource.Licence) this.getApplication();
      }
    });
  }

  ngAfterViewInit(): void {
    const scrollListener = () => {
      let body: HTMLElement;
      if (document.body) {
        body = document.body;
      } else {
        body = document.documentElement;
      }
      let element = body.querySelector('#staff-actions-container');
      if (element) {
        let clientRect = element.getBoundingClientRect();
        this.showFloatingStaffActions = clientRect.top < 70;
      }
    }
    document.addEventListener('scroll', scrollListener);
  }

  ngOnDestroy(): void {
    document.removeAllListeners('scroll');
    this.destroy.next();
    this.destroy.complete();
  }

  isCreatedByMe(scheduleBy: string) {
    const currentUser = this.auth.currentUser;
    return currentUser.userId == scheduleBy;
  }

  getApplication() {
    this.loading = true;
    this.spinner.show('Loading application...');
    this.applicationService.viewApplication(this.appId)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.application = res.data;
          }
          this.loading = false;
          this.progressBar.close();
          this.spinner.close();
          this.cd.markForCheck();
        },
        error: (error: unknown) => {
          console.log(error);
          this.loading = false;
          this.snackBar.open(
            'Something went wrong while retrieving data.',
            null,
            {
              panelClass: ['error'],
            }
          );

          this.progressBar.close();
          this.spinner.close();
          this.cd.markForCheck();
        },
      });
  }

  getLicence() {
    this.spinner.show('Loading license details');
    this.licenceService.getLicence(this.appId)
      .pipe(takeUntil(this.destroy))  
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.licence = res.data;
          }

          this.progressBar.close();
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

          this.progressBar.close();
          this.spinner.close();
          this.cd.markForCheck();
        },
      });
  }

  public get isStaffDesk() {
    return this.appSource == AppSource.MyDesk;
  }

  action(type: string, param = null) {
    const operationConfiguration = {
      approve: {
        data: {
          application: this.application,
          isFO: this.isFO,
          coqId: this.coqId,
        },
        form: ApproveFormComponent,
      },
      sendBack: {
        data: {
          application: this.application,
          isFO: this.isFO,
          coqId: this.coqId,
        },
        form: SendBackFormComponent,
      },
      addSchedule: {
        data: {
          application: this.application,
          isFO: this.isFO,
        },
        form: AddScheduleFormComponent,
      },
      editSchedule: {
        data: {
          application: this.application,
          isFO: this.isFO,
          schedule: param,
        },
        form: AddScheduleFormComponent,
      },
    };

    this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });
  }

  showMore(type: string) {
    const operationConfiguration = {
      appHistory: {
        data: {
          appHistory: this.application.appHistories,
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
