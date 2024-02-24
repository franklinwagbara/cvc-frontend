import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AddScheduleFormComponent } from '../../../../../src/app/shared/reusable-components/add-schedule-form/add-schedule-form.component';
import { CoqApplicationPreviewComponent } from '../../coq-application-form/coq-application-preview/coq-application-preview.component';
import { SendBackFormComponent } from '../../../../../src/app/shared/reusable-components/send-back-form/send-back-form.component';
import { ApproveFormComponent } from '../../../../../src/app/shared/reusable-components/approve-form/approve-form.component';
import { ShowMoreComponent } from '../../../shared/reusable-components/show-more/show-more.component';
import { Application } from '../../../company/cvc-applications/cvc-applications.component';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { LicenceService } from '../../../../../src/app/shared/services/licence.service';
import { AuthenticationService } from '../../../../../src/app/shared/services';
import { AppSource } from '../../../../../src/app/shared/constants/appSource';
import { LoginModel } from '../../../../../src/app/shared/models/login-model';
import { CoqService } from 'src/app/shared/services/coq.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { Util } from 'src/app/shared/lib/Util';

@Component({
  selector: 'app-coq-application-view',
  templateUrl: './coq-application-view.component.html',
  styleUrls: ['./coq-application-view.component.scss'],
})
export class CoqApplicationViewComponent implements OnInit {
  public application: Application | any;
  public ppCoq: any;
  public appActions: any;
  public appId: number;
  public appSource: AppSource;
  public licence: any;
  public currentUser: LoginModel;
  public coqId: number;
  public documents: any;
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
  isProcessingPlant: boolean;
  isIMG = Util.isIMG;
  isPDF = Util.isPDF;

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private coqService: CoqService,
    public dialog: MatDialog,
    public progressBar: ProgressBarService,
    private spinner: SpinnerService,
    public route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private licenceService: LicenceService,
    public location: Location,
    private paymentService: PaymentService,
    private popUp: PopupService,
    private router: Router
  ) {
    this.route.params.subscribe((param) => {
      this.appId = parseInt(param['id']);
      this.coqId = parseInt(param['id']);
      this.PPCOQId = parseInt(param['id']);
    });

    this.route.queryParams.subscribe((params) => {
      this.spinner.show('Loading application...');
      this.isPPCOQ = params['isPPCOQ'] === 'true';
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
    console.log('isPPCOQ =============> ', this.isPPCOQ);
    this.loading = true;
    (!this.isPPCOQ
      ? this.coqService.viewCoqApplication(this.appId)
      : this.coqService.viewPPCoqApplication(this.PPCOQId)
    ).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && this.isPPCOQ) {
          this.ppCoq = res.data;
          this.appLoaded = true;
        } else if (res.success) {
          this.application = res.data.coq;
          this.tanksList = res.data.tankList;
          this.documents = res.data.docs;
          this.appHistories = res.data.appHistories;
          this.appLoaded = true;
        }
        this.isProcessingPlant = this.isPPCOQ;

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
          application: !this.isPPCOQ ? this.application : this.ppCoq,
          isFO: this.isFO,
          isCOQProcessor: this.isCOQProcessor,
          coqId: !this.isPPCOQ ? this.coqId : this.PPCOQId,
          isPPCOQ: this.isPPCOQ,
        },
        form: ApproveFormComponent,
      },
      sendBack: {
        data: {
          application: !this.isPPCOQ ? this.application : this.ppCoq,
          isFO: this.isFO,
          isCOQProcessor: this.isCOQProcessor,
          coqId: !this.isPPCOQ ? this.coqId : this.PPCOQId,
          isPPCOQ: this.isPPCOQ,
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

  previewDetails(): void {
    const vesselData = {
      dateOfArrival: this.application?.DateOfVesselArrival,
      dateOfUllage: this.application?.DateOfVesselUllage,
      dateOfShoreTank: this.application?.DateOfSTAfterDischarge,
      depotPrice: this.application?.DepotPrice,
    };
    const isGasProduct = this.application?.ProductType.toLowerCase() === 'gas';
    this.dialog.open(CoqApplicationPreviewComponent, {
      data: {
        tankData: {},
        isGasProduct,
        vesselDischargeData: isGasProduct
          ? {
              ...vesselData,
              quauntityReflectedOnBill:
                this.application?.QuauntityReflectedOnBill,
              arrivalShipFigure: this.application?.ArrivalShipFigure,
              dischargeShipFigure: this.application?.DischargeShipFigure,
            }
          : vesselData,
      },
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
}
