import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/shared/services';
import { ApplyService } from 'src/app/shared/services/apply.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { AppSource } from 'src/app/shared/constants/appSource';
import { PopupService } from 'src/app/shared/services/popup.service';
import { PaymentSummary } from '../payment-summary/paymentsum.component';
import {
  IFacility,
  ITankDTO,
} from '../apply/new-application/new-application.component';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  templateUrl: 'myapplication.component.html',
  styleUrls: ['./myapplication.component.scss'],
})
export class MyApplicationComponent implements OnInit {
  genk: GenericService;
  application_id: number = null;
  paymentSummary: PaymentSummary;
  public rrr$ = new Subject<string>();
  public applicationStatus$ = new Subject<string>();
  private rrr: string;
  public applications$ = new Subject<Application[]>();

  applications: Application[];

  tableTitles = {
    app: 'My Applications',
  };

  applicationTableKeysMappedToHeaders = {
    reference: 'App. Reference',
    companyName: 'Company Name',
    vesselName: 'Vessel Name',
    vesselType: 'Vessel Type',
    capacity: 'Capacity',
    createdDate: 'Date Initiated',
    status: 'Status',
  };

  constructor(
    private gen: GenericService,
    private router: Router,
    public dialog: MatDialog,
    private progressbar: ProgressBarService,
    private applicationServer: ApplyService,
    private snackBar: MatSnackBar,
    private applicationService: ApplicationService,
    private cd: ChangeDetectorRef,
    private popUp: PopupService,
    private spinner: SpinnerService
  ) {
    this.genk = gen;
    this.rrr$.subscribe((data) => {
      this.rrr = data;
    });
  }

  ngOnInit(): void {
    this.getCompanyApplication();
  }

  getCompanyApplication() {
    this.progressbar.open();
    this.spinner.open();
    this.applicationService.getApplicationsOnDesk().subscribe({
      next: (res) => {
        if (res.success) {
          this.applications = res.data;
          this.applications$.next(res.data);

          //todo: display success dialog
          this.progressbar.close();
          this.spinner.close();
          this.cd.markForCheck();
        }
      },
      error: (error: unknown) => {
        //todo: display error dialog
        this.progressbar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  generateRRR(app: Application) {
    this.progressbar.open();
    this.spinner.open();
    this.applicationServer.createPayment_RRR(app.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.rrr$.next(res.data.rrr);

          this.router.navigate(['/company/paymentsum/' + app.id]);

          this.snackBar.open('RRR was generated successfully!', null, {
            panelClass: ['success'],
          });

          this.popUp.open('RRR was generated successfully!', 'success');
          this.progressbar.close();
          this.spinner.close();
          this.cd.markForCheck();
        }
      },
      error: (error: unknown) => {
        this.popUp.open('RRR generation failed!', 'error');
        this.progressbar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  confirmPayment(app: Application) {
    this.progressbar.open();
    this.spinner.open();

    this.applicationServer.confirmPayment(app.id).subscribe({
      next: (res) => {
        this.router.navigate(['/company/paymentsum/' + app.id]);
        this.progressbar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Payment confirmation not successfull. Please contact support or proceed to pay online.',
          null,
          {
            panelClass: ['error'],
          }
        );
        this.router.navigate(['/company/paymentsum/' + app.id]);
        this.progressbar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  uploadDocument(app: Application) {
    this.router.navigate([`/company/upload-document/${app.id}`]);
  }

  // viewApplication(event: Event, type: string) {
  //   const operationConfiguration = {
  //     applications: {
  //       data: {
  //         application: event,
  //       },
  //       view: ViewApplicationComponent,
  //     },
  //   };

  //   let dialogRef = this.dialog.open(operationConfiguration[type].view, {
  //     data: {
  //       data: operationConfiguration[type].data,
  //     },
  //     minHeight: '99vh',
  //     minWidth: '94vw',
  //   });

  //   dialogRef.afterClosed().subscribe((res) => {
  //     //The need to Refetch data not apparent at the moment
  //   });
  // }

  viewApplication(event: any, type: string) {
    this.router.navigate([`/company/view-application/${event.id}`], {
      queryParams: { id: event.id, appSource: AppSource.Application },
    });
  }
}

export interface Application {
  addedDate: string;
  appHistory: any[];
  appReference: string;
  appType: string;
  applicationforms: any[];
  category: string;
  companyAddress: string;
  companyEmail: string;
  companyName: string;
  currentDesk: string;
  extraPayments: any[];
  facilityAddress: string;
  gpsCordinates: string;
  id: string;
  inspectionForm: any[];
  permitType: string;
  rrr: string;
  schedules: any[];
  stage: string;
  stateName: string;
  status: string;
  submittedDate: string;
  applicationDocs: any[];

  createdDate: string;
  paymnetDate: string;
  paymnetStatus: string;
  paymentStatus: string;
  paymentDescription: string;
  email: string;
  reference: string;
  applicationTypeId: number;
  facilityName: string;
  vesselTypeId: number;
  capacity: number;
  operator: string;
  imoNumber: string;
  callSIgn: string;
  flag: string;
  yearOfBuild: string;
  placeOfBuild: string;
  deadWeight: number;
  vessel: Vessel;
  appHistories: any[];
  documents?: any[];
}

export interface Vessel {
  name: string;
  capacity: number;
  operator: string;
  vesselType: string;
  placeOfBuild: string;
  loadingPort: string;
  dischargePort: string;
  yearOfBuild: number;
  flag: string;
  callSIgn: string;
  imoNumber: string;
  tanks: ITankDTO[];
  facilitySources: IFacility[];
}

export interface ApplicationHistory {
  action: string;
  applicationId: number;
  comment: string;
  date: string;
  id: number;
  targetRole: string;
  targetedTo: string;
  triggeredBy: string;
  triggeredByRole: string;
}
