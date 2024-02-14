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
import { Directorate, UserRole } from 'src/app/shared/constants/userRole';
import { AppType } from 'src/app/shared/constants/appType';
import { AuthenticationService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LoginModel } from 'src/app/shared/models/login-model';
import {
  APPLICATION_KEYS_MAPPED_TO_HEADERS,
  COQ_KEYS_MAPPED_TO_HEADERS,
  DN_KEYS_MAPPED_TO_HEADERS,
  FIELD_OFFICER_NOA_KEYS_MAPPED_TO_HEADERS,
  PP_COQ_KEYS_MAPPED_TO_HEADERS,
} from './mappings';

@Component({
  selector: 'app-my-desk',
  templateUrl: './my-desk.component.html',
  styleUrls: ['./my-desk.component.css'],
})
export class MyDeskComponent implements OnInit {
  public applications: IApplication[];
  public processingPlantCOQs: any[];
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

  public applicationKeysMappedToHeaders = APPLICATION_KEYS_MAPPED_TO_HEADERS;
  public fieldOfficerNoaKeysMappedToHeaders =
    FIELD_OFFICER_NOA_KEYS_MAPPED_TO_HEADERS;
  public coqKeysMappedToHeaders = COQ_KEYS_MAPPED_TO_HEADERS;
  public PPCoqKeysMappedToHeaders = PP_COQ_KEYS_MAPPED_TO_HEADERS;
  public dnKeysMappedToHeaders = DN_KEYS_MAPPED_TO_HEADERS;

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
      this.isDssriFieldOfficer
        ? this.applicationService.viewApplicationByDepot()
        : this.applicationService.getApplicationsOnDesk(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) {
          this.applications = res[0].data.coQ;
          this.processingPlantCOQs = res[0].data.processingPlantCOQ;
          if (this.isDssriFieldOfficer) {
            this.applications = this.applications
              ?.filter((app) => app.status === 'Completed')
              .reverse();
          }
          if (this.applications?.length > 0)
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

  get isDssriFieldOfficer(): boolean {
    return (
      this.currentUser.userRoles === UserRole.FIELDOFFICER &&
      this.currentUser.directorate === Directorate.DSSRI
    );
  }

  get isHppitiFieldOfficer(): boolean {
    return (
      this.currentUser.userRoles === UserRole.FIELDOFFICER &&
      this.currentUser.directorate === Directorate.HPPITI
    );
  }

  get isFAD() {
    return this.currentUser.userRoles === UserRole.FAD;
  }

  onViewData(event: any, type: string) {
    // debugger;
    if (
      this.appType$.value === AppType.COQ ||
      this.appType$.value == AppType.PPCOQ ||
      this.isFAD
    ) {
      this.router.navigate(
        [
          '/admin/desk/view-coq-application/',
          event.id ?? event.processingPlantCOQId
        ],
        {
          queryParams: {
            id: event.appId ?? event.processingPlantCOQId,
            appSource: AppSource.MyDesk,
            depotId: event.depotId,
            coqId: event.id,
            isPPCOQ: event.applicationType == AppType.PPCOQ,
            PPCOQId: event.processingPlantCOQId,
          },
        }
      );
    } else if (
      this.isDssriFieldOfficer ||
      this.appType$.value === AppType.NOA
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
    return this.isDssriFieldOfficer
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
      'coq',
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
