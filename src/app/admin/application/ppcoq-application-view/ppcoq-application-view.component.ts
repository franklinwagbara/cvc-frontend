import { Location } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSource } from 'src/app/shared/constants/appSource';
import { Util } from 'src/app/shared/lib/Util';
import { LoginModel } from 'src/app/shared/models/login-model';
import { AddScheduleFormComponent } from 'src/app/shared/reusable-components/add-schedule-form/add-schedule-form.component';
import { ApproveFormComponent } from 'src/app/shared/reusable-components/approve-form/approve-form.component';
import { SendBackFormComponent } from 'src/app/shared/reusable-components/send-back-form/send-back-form.component';
import { ShowMoreComponent } from 'src/app/shared/reusable-components/show-more/show-more.component';
import { AuthenticationService } from 'src/app/shared/services';
import { CoqService } from 'src/app/shared/services/coq.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-ppcoq-application-view',
  templateUrl: './ppcoq-application-view.component.html',
  styleUrls: ['./ppcoq-application-view.component.scss'],
})
export class PpcoqApplicationViewComponent {
  public application: any;
  public appActions: any;
  public appId: number;
  public appSource: AppSource;
  public licence: any;
  public currentUser: LoginModel;
  public coqId: number;
  public documents: any[];
  public tanksList: any[];
  public appHistories: any[];

  public isPPCOQ = false;
  public PPCOQId: number;

  appLoaded = false;
  loading = true;
  isFAD: boolean;
  isSupervisor: boolean;
  isCOQProcessor: boolean;
  isFO: boolean;

  showFloatingBackBtn = false;
  showFloatingStaffActions = false;

  isIMG = Util.isIMG;
  isPDF = Util.isPDF;

  constructor(
    private auth: AuthenticationService,
    private coqService: CoqService,
    public dialog: MatDialog,
    public progressBar: ProgressBarService,
    private spinner: SpinnerService,
    public route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    public location: Location,
    private paymentService: PaymentService,
    private popUp: PopupService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.spinner.show('Loading application...');
      this.isPPCOQ = params['isPPCOQ'] === 'true';
      this.PPCOQId = parseInt(params['PPCOQId']);
      this.appSource = params['appSource'];
      this.getApplication();
    });
  }

  ngOnInit(): void {
    this.isFAD = this.auth.isFAD;
    this.isSupervisor = this.auth.isSupervisor;
    this.isCOQProcessor = this.auth.isCOQProcessor;
    this.isFO = this.auth.isFO;

    this.currentUser = this.auth.currentUser as LoginModel;
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
      let element2 = body.querySelector('#back-to-view-all-btn');
      if (element) {
        let clientRect = element.getBoundingClientRect();
        this.showFloatingStaffActions = clientRect.top < 70;
      }
      if (element2) {
        let clientRect = element2.getBoundingClientRect();
        this.showFloatingBackBtn = clientRect.top < 70;
        if (this.showFloatingBackBtn) {
          (element2 as HTMLElement).style.left = clientRect.left + 'px';
        } else {
          (element2 as HTMLElement).style.left = '0px';
        }
      }
    };
    document.addEventListener('scroll', scrollListener);
  }

  ngOnDestroy(): void {
    document.removeAllListeners('scroll');
  }

  isCreatedByMe(scheduleBy: string) {
    const currentUser = this.auth.currentUser;
    return currentUser.userId == scheduleBy;
  }

  previewDebitNote() {
    window.location.assign('#');
  }

  generateDebitNote() {
    this.loading = true;
    this.spinner.show('Generating Debit Note...');

    this.paymentService.generateDebitNote(this.coqId).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.popUp.open('Debit Note generated successfully', 'success');
          setTimeout(() => {
            this.router.navigate(['/admin/desk']);
          }, 3000);
        }
        this.loading = false;
        this.spinner.close();
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error(error);
        this.popUp.open(
          'Something went wrong while generating Debit Note',
          'error'
        );
        this.spinner.close();
      },
    });
  }

  getApplication() {
    this.loading = true;

    this.coqService.viewPPCoqApplication(this.PPCOQId).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success) {
          this.application = res.data;
          this.appLoaded = true;
        }

        this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error(error);
        this.popUp.open('Something went wrong while retrieving data.', 'error');

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
          isCOQProcessor: this.isCOQProcessor,
          isPPCOQ: this.isPPCOQ,
          PPCOQId: this.PPCOQId,
        },
        form: ApproveFormComponent,
      },
      sendBack: {
        data: {
          application: this.application,
          isFO: this.isFO,
          isCOQProcessor: this.isCOQProcessor,
          isPPCOQ: this.isPPCOQ,
          PPCOQId: this.PPCOQId,
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
      disableClose: true,
    });
  }

  showMore(type: string) {
    const operationConfiguration = {
      appHistory: {
        data: {
          appHistory: this.appHistories,
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
          applicationDocs: this.documents,
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
