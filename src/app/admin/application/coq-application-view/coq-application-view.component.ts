import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppSource } from '../../../../../src/app/shared/constants/appSource';
import { AddScheduleFormComponent } from '../../../../../src/app/shared/reusable-components/add-schedule-form/add-schedule-form.component';
import { ApproveFormComponent } from '../../../../../src/app/shared/reusable-components/approve-form/approve-form.component';
import { SendBackFormComponent } from '../../../../../src/app/shared/reusable-components/send-back-form/send-back-form.component';
import { AuthenticationService } from '../../../../../src/app/shared/services';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { Application } from '../../../../../src/app/company/my-applications/myapplication.component';
import { LicenceService } from '../../../../../src/app/shared/services/licence.service';
import { ShowMoreComponent } from '../../../shared/reusable-components/show-more/show-more.component';
import { LoginModel } from '../../../../../src/app/shared/models/login-model';
import { LOCATION } from '../../../../../src/app/shared/constants/location';
import { CoqService } from 'src/app/shared/services/coq.service';
import { CoqApplicationPreviewComponent } from '../../coq-application-form/coq-application-preview/coq-application-preview.component';

@Component({
  selector: 'app-coq-application-view',
  templateUrl: './coq-application-view.component.html',
  styleUrls: ['./coq-application-view.component.scss'],
})
export class CoqApplicationViewComponent implements OnInit {
  public application: Application | any;
  public appActions: any;
  public appId: number;
  public appSource: AppSource;
  public licence: any;
  public currentUser: LoginModel;
  public coqId: number;
  public documents: any;
  public tanksList: any[];

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
    public location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.appId = parseInt(param['id']);
      this.coqId = parseInt(param['id']);
      this.getApplication();
    });

    this.route.queryParams.subscribe((params) => {
      this.spinner.show('Loading application');
      this.appSource = params['appSource'];
    });

    this.currentUser = this.auth.currentUser as LoginModel;
  }

  public get isSupervisor() {
    return (this.currentUser as any).userRoles === 'Supervisor';
  }

  public get isCOQProcessor() {
    return (
      (this.currentUser as any).userRoles === 'FAD' ||
      (this.currentUser as any).userRoles === 'Controller' ||
      this.currentUser.location == LOCATION.FO
    );
  }

  public get isFO() {
    return this.currentUser.location == LOCATION.FO;
  }

  isCreatedByMe(scheduleBy: string) {
    const currentUser = this.auth.currentUser;
    return currentUser.userId == scheduleBy;
  }

  getApplication() {
    this.coqService.viewCoqApplication(this.appId).subscribe({
      next: (res) => {
        if (res.success) {
          this.application = res.data.coq;
          this.tanksList = res.data.tankList;
          this.documents = res.data.docs;
        }

        this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
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
    this.application.reference = this.application.Reference;
    const operationConfiguration = {
      approve: {
        data: {
          application: this.application,
          isFO: this.isFO,
          isCOQProcessor: this.isCOQProcessor,
          coqId: this.coqId,
        },
        form: ApproveFormComponent,
      },
      sendBack: {
        data: {
          application: this.application,
          isFO: this.isFO,
          isCOQProcessor: this.isCOQProcessor,
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

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.progressBar.open();

      this.getApplication();
    });
  }

  previewDetails(): void {
    const vesselData = {
      dateOfArrival: this.application?.DateOfVesselArrival,
      dateOfUllage: this.application?.DateOfVesselUllage,
      dateOfShoreTank: this.application?.DateOfSTAfterDischarge,
      depotPrice: this.application?.DepotPrice
    }
    const isGasProduct = this.application?.ProductType.toLowerCase() === 'gas';
    this.dialog.open(CoqApplicationPreviewComponent, { data: {
      tankData: {},
      isGasProduct,
      vesselDischargeData: isGasProduct ? {
        ...vesselData,
        quauntityReflectedOnBill: this.application?.QuauntityReflectedOnBill,
        arrivalShipFigure: this.application?.ArrivalShipFigure,
        dischargeShipFigure: this.application?.DischargeShipFigure,
      } : vesselData,
    } })
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

    const dialogRef = this.dialog.open(ShowMoreComponent, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.progressBar.open();

      this.getApplication();
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
