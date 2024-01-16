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
import { decodeFullUserInfo } from 'src/app/helpers/tokenUtils';
import { UserRole } from 'src/app/shared/constants/userRole';

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
    capacity: 'Capacity',
    paymentStatus: 'Payment Status',
    status: 'Status',
    createdDate: 'Initiation Date',
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

  constructor(
    private adminService: AdminService,
    private applicationService: ApplicationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    public cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.categories$.subscribe((data) => {
      this.categories = [...data];
      this.applications$.subscribe((app) => {
        this.applications = app;
      });
    });
  }

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([this.applicationService.getApplicationsOnDesk()]).subscribe({
      next: (res) => {
        if (res[0].success) {
          this.applications = res[0].data;
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

  ngAfterViewInit(): void {}

  get isFieldOfficer(): boolean {
    const currentUser = decodeFullUserInfo();
    return currentUser.userRoles === UserRole.FIELDOFFICER;
  }

  onViewData(event: any, type: string) {
    if (this.appType$.getValue() == 'COQ') {
      this.router.navigate([`/admin/view-coq-application/${event.id}`], {
        queryParams: {
          id: event.appId,
          appSource: AppSource.MyDesk,
          depotId: event.depotId,
          coqId: event.id,
        },
      });
    } else
      this.router.navigate([`/admin/desk/view-application/${event.id}`], {
        queryParams: { id: event.id, appSource: AppSource.MyDesk },
      });
  }

  public get getColumnHeaders() {
    return this.appType$.getValue() == 'NOA'
      ? this.applicationKeysMappedToHeaders
      : this.coqKeysMappedToHeaders;
  }

  initiateCoq(event: any) {
    this.router.navigate([
      'admin', 
      'my-desk', 
      'noa-applications',
      event.id, 
      'certificate-of-quantity', 
      'new-application'
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
