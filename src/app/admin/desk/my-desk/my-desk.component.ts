import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { AppSource } from '../../../../../src/app/shared/constants/appSource';
import { IApplication } from '../../../../../src/app/shared/interfaces/IApplication';
import { IBranch } from '../../../../../src/app/shared/interfaces/IBranch';
import { AssignApplicationFormComponent } from '../../../../../src/app/shared/reusable-components/assign-application-form/assign-application-form.component';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { ApplicationService } from '../../../../../src/app/shared/services/application.service';
import { Staff } from '../../settings/all-staff/all-staff.component';
import { FieldOffice } from '../../settings/field-zonal-office/field-zonal-office.component';
import { Category } from '../../settings/modules-setting/modules-setting.component';
import { ICOQ } from 'src/app/shared/interfaces/ICoQApplication';
import { UserRole } from 'src/app/shared/constants/userRole';
import { AppType } from 'src/app/shared/constants/appType';
import { AuthenticationService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LoginModel } from 'src/app/shared/models/login-model';

@Component({
  selector: 'app-my-desk',
  templateUrl: './my-desk.component.html',
  styleUrls: ['./my-desk.component.css'],
})
export class MyDeskComponent implements OnInit {
  public applications: IApplication[];
  public applications$ = new Subject<IApplication[]>();
  public categories: Category[] = [];
  public categories$ = new Subject<Category[]>();

  public appType$ = new BehaviorSubject<string>('NOA');

  public coqApplications: ICOQ[];

  public users: Staff[];
  public userDetail: any;
  public roles: any;
  public staffList: any;
  public offices: FieldOffice[];
  public branches: IBranch[];
  isLoading = true;
  currentUser: LoginModel;

  public tableTitles = {
    applications: 'All Applications',
  };

  public applicationKeysMappedToHeaders = {
    reference: 'Reference Number',
    // importName: 'Import Name',
    companyEmail: 'Company Email',
    applicationType: 'Application Type',
    vesselName: 'Vessel Name',
    vesselType: 'Vessel Type',
    // capacity: 'Capacity',
    paymentStatus: 'Payment Status',
    status: 'Status',
    createdDate: 'Initiation Date',
  };

  public fieldOfficerNoaKeysMappedToHeaders = {
    reference: 'Reference',
    companyName: 'Company Name',
    companyEmail: 'Company Email',
    vesselName: 'Vessel Name',
    vesselType: 'Vessel Type',
    jetty: 'Jetty',
    // capacity: 'Capacity',
    status: 'Status',
    // rrr: 'RRR',
    createdDate: 'Initiated Date',
  };

  public coqKeysMappedToHeaders = {
    companyEmail: 'Company Email',
    vesselName: 'Vessel Name',
    depotName: 'Depot Name',
    mT_VAC: 'MT VAC',
    dateOfVesselArrival: 'Date of Arrival',
    dateOfSTAfterDischarge: 'Date of Discharge',
    depotPrice: 'Initiation Date',
    submittedDate: 'Date Submitted',
    status: 'Status',
  };

  public dnKeysMappedToHeaders = {
    reference: 'Reference',
    name: 'Name',
    depotName: 'Depot Name',
    depotPrice: 'Depot Price',
    gsv: 'GSV',
    debitNote: 'Debit Note',
  };

  constructor(
    private adminService: AdminService,
    private applicationService: ApplicationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    public cd: ChangeDetectorRef,
    private router: Router,
    private auth: AuthenticationService,
    private paymentService: PaymentService,
    private popUp: PopupService
  ) {
    this.categories$.subscribe((data) => {
      this.categories = [...data];
      this.applications$.subscribe((app) => {
        this.applications = app;
      });
    });
    this.currentUser = this.auth.currentUser as LoginModel;
  }

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([
      this.isFieldOfficer
        ? this.applicationService.viewApplicationByDepot()
        : this.applicationService.getApplicationsOnDesk(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) {
          this.applications = res[0].data;
          if (this.isFieldOfficer) {
            this.applications = this.applications
              .filter((app) => app.status === 'Completed')
              .reverse();
          }
          if (this.applications.length > 0)
            this.appType$.next(this.applications[0].applicationType);
          this.applications$.next(this.applications);
        }
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

        this.spinner.close();
      },
    });
  }

  get isFieldOfficer(): boolean {
    return this.currentUser.userRoles === UserRole.FIELDOFFICER;
  }

  get isFAD() {
    return this.currentUser.userRoles === UserRole.FAD;
  }

  onViewData(event: any, type: string) {
    if (this.appType$.getValue() === AppType.COQ || this.isFAD) {
      this.router.navigate([`/admin/desk/view-coq-application/${event.id}`], {
        queryParams: {
          id: event.appId,
          appSource: AppSource.MyDesk,
          depotId: event.depotId,
          coqId: event.id,
        },
      });
    } else if (
      this.isFieldOfficer ||
      this.appType$.getValue() === AppType.NOA
    ) {
      this.router.navigate([`/admin/desk/view-application/${event.id}`], {
        queryParams: { id: event.id, appSource: AppSource.MyDesk },
      });
    }
  }

  onViewCoqCert(event: any) {
    if (this.isFAD) {
      window.open(
        `${environment.apiUrl}/CoQ/view_CoQ_cert?${event.id}`,
        '_blank'
      );
    }
  }

  genDebitNote(event: any) {
    if (this.isFAD) {
      this.isLoading = true;
      this.spinner.show('Generating Debit Note...');

      this.paymentService.generateDebitNote(event.id).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.popUp.open('Debit Note generated successfully', 'success');
            setTimeout(() => {
              this.router.navigate(['/admin/desk']);
            }, 3000);
          }
          this.isLoading = false;
          this.spinner.close();
        },
        error: (error: unknown) => {
          console.log(error);
          this.popUp.open(
            'Something went wrong while generating Debit Note',
            'error'
          );
          this.spinner.close();
        },
      });
    }
  }

  public get getColumnHeaders() {
    return this.isFieldOfficer
      ? this.fieldOfficerNoaKeysMappedToHeaders
      : this.appType$.getValue() == AppType.NOA
      ? this.applicationKeysMappedToHeaders
      : this.appType$.getValue() == AppType.COQ
      ? this.coqKeysMappedToHeaders
      : this.dnKeysMappedToHeaders;
  }

  initiateCoq(event: any) {
    this.router.navigate([
      'admin',
      'coq-and-plant',
      'noa-applications-by-depot',
      event.id,
      'certificate-of-quantity',
      'new-application',
    ]);
  }

  onAssignApplication() {
    const operationConfiguration = {
      users: {
        data: {
          applications: this.applications,
          staffs: this.users,
          roles: this.roles,
          offices: this.offices,
          branches: this.branches,
        },
        form: AssignApplicationFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration['users'].form, {
      data: {
        data: operationConfiguration['users'].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.progressBar.open();

      this.adminService.getAllStaff().subscribe((res) => {
        this.users = res.data.data;

        this.progressBar.close();
      });
    });
  }
}
