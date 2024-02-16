import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { forkJoin } from 'rxjs';
import { UserFormComponent } from '../../../../../src/app/shared/reusable-components/user-form/user-form.component';
import { IBranch } from '../../../../../src/app/shared/interfaces/IBranch';
import { MoveApplicationFormComponent } from '../../../../../src/app/shared/reusable-components/move-application-form/move-application-form.component';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { FieldOffice } from '../field-zonal-office/field-zonal-office.component';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';

@Component({
  selector: 'app-all-staff',
  templateUrl: './all-staff.component.html',
  styleUrls: ['./all-staff.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllStaffComponent implements OnInit {
  public users: Staff[];
  public userDetail: any;
  public roles: any;
  public staffList: any;
  public offices: FieldOffice[];
  public branches: IBranch[];
  public locations: ILocation[];
  public directorate: any[];

  tableTitles = {
    users: 'User Settings',
  };

  userKeysMappedToHeaders = {
    name: 'Name',
    // lastName: 'Last Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    role: 'Role',
    office: 'Office',
    directorate: 'Directorate',
    appCount: 'Applications on Desk',
    isActive: 'Status',
    createdBy: 'Created By',
  };

  constructor(
    public snackBar: MatSnackBar,
    private adminHttpService: AdminService,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private libService: LibaryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.spinner.show('Loading users');

    forkJoin([
      this.adminHttpService.getAllStaff(),
      this.adminHttpService.getElpsStaffList(),
      this.adminHttpService.getRoles(),
      this.libService.getAllLocations(),
      this.libService.getAllOffices(),
      this.adminHttpService.getDirectorate(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) {
          this.users = res[0].data;
        }
        if (res[1].success) {
          this.staffList = res[1].data;
        }
        if (res[2].success) this.roles = res[2].data;

        if (res[3].success) this.locations = res[3].data;

        if (res[4].success) this.offices = res[4].data;

        if (res[5]) this.directorate = res[5];
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        // this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      users: {
        data: {
          users: this.users,
          staffList: this.staffList,
          roles: this.roles,
          branches: this.branches,
          locations: this.locations,
          offices: this.offices,
          directorate: this.directorate,
        },
        form: UserFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },

      panelClass: 'userPannelClass',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: 'submitted') => {
      if (result) {
        this.progressBar.open();
        this.adminHttpService.getAllStaff().subscribe((res) => {
          this.users = res.data;

          this.progressBar.close();
        });
      }
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      users: {
        name: 'Users',
        id: 'id',
      },
    };

    const listOfDataToDelete = event.filter((s) => {
      if (s.appCount > 0) {
        this.snackBar.open(
          `Cannot delete a staff with an application on their desk.`,
          null,
          {
            panelClass: ['success'],
          }
        );
      }
      return s.appCount === 0;
    });

    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'users') {
        return this.adminHttpService.deleteStaff(
          req[typeToModelMapper[type].id]
        );
      } else
        return this.adminHttpService.deleteStaff(
          req[typeToModelMapper[type].id]
        );
    });

    this.spinner.show('Loading users');

    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(
            `${typeToModelMapper.users.name} was deleted successfully!`,
            null,
            {
              panelClass: ['success'],
            }
          );

          const responses = res
            .map((r) => r.data.data)
            .sort((a, b) => a.length - b.length);

          if (type === 'users') this.users = responses[0];
          this.spinner.show('Loading users');

          this.adminHttpService.getAllStaff().subscribe({
            next: (res: any) => {
              this.users = res.data;
              this.spinner.close();
              this.cd.markForCheck();
            },
            error: (error: unknown) => {
              console.log(error);
              this.spinner.close();
              this.cd.markForCheck();
            },
          });
        }

        this.spinner.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });

        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  onMoveApplication(staff: any, type: string) {
    const operationConfiguration = {
      users: {
        data: {
          staff,
          staffs: this.users,
          // staffs: this.staffList,
          roles: this.roles,
          offices: this.offices,
          branches: this.branches,
        },
        form: MoveApplicationFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.spinner.show('Loading users');

      this.adminHttpService.getAllStaff().subscribe((res) => {
        this.users = res.data;

        this.spinner.close();
        this.cd.markForCheck();
      });
    });
  }

  onEditData(event: any, type: string) {
    const operationConfiguration = {
      users: {
        data: {
          users: this.users,
          staffList: this.staffList,
          roles: this.roles,
          offices: this.offices,
          branches: this.branches,
          locations: this.locations,
          currentValue: event,
          directorate: this.directorate,
        },
        form: UserFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
      panelClass: 'userPannelClass',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.spinner.show('Loading users');
      this.adminHttpService.getAllStaff().subscribe((res) => {
        this.users = res.data;

        this.spinner.close();
      });
    });
  }
}

export class Staff {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  role: string;
  office: string;
  locationId: number;
  status: boolean;
  appCount: number;
  branchId: any;
  officeId: any;
  userType: string;
  elpsId: string;
  signatureFile: any;
  id: any;
  name?: string;
  signature?: any;
  directorate?: any;

  constructor(item: Staff) {
    this.firstName = item.firstName;
    this.lastName = item.lastName;
    this.name = item.firstName + ', ' + item.lastName;
    this.userId = item.userId;
    this.email = item.email;
    this.phoneNo = item.phoneNo;
    this.id = item.id;
    this.role = item.role;
    this.status = item.status;
    this.appCount = item.appCount;
    this.office = item.office;
    this.locationId = item.locationId;
    this.branchId = item.branchId;
    this.officeId = item.officeId;
    this.userType = item.userType;
    this.elpsId = item.elpsId;
    this.signatureFile = item.signatureFile;
    this.signature = item.signature;
  }
}

export class ILocation {
  id: number;
  name: string;
  statedId: number;
}
