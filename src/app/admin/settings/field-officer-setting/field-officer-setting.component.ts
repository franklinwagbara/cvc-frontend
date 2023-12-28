import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { IDepot } from 'src/app/shared/interfaces/IDepot';
import { IDepotOfficer } from 'src/app/shared/interfaces/IDepotOfficer';
import { IRole } from 'src/app/shared/interfaces/IRole';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { UserFormComponent } from 'src/app/shared/reusable-components/user-form/user-form.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { Staff } from '../all-staff/all-staff.component';

@Component({
  selector: 'app-field-officer-setting',
  templateUrl: './field-officer-setting.component.html',
  styleUrls: ['./field-officer-setting.component.css']
})
export class FieldOfficerSettingComponent implements OnInit {
  fieldOfficers: IDepotOfficer[];
  fieldOfficerUsers: IUser[];
  fieldOfficerDepots: IDepot[];
  allUsers: Staff[];
  elpsUsers: any[];
  roles: IRole[];
  locations: any[];
  offices: any[];

  fieldOfficersData: FieldOfficer[];
  
  officerKeysMappedToHeaders: any = {
    name: 'Name',
    email: 'Email',
    phoneNumber: 'Phone',
    role: 'Role',
    office: 'Office',
    location: 'Location',
    isActive: 'Status'
  }

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private progressBar: ProgressBarService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.progressBar.open();
    forkJoin([
      this.adminService.getAllStaff(),
      this.adminService.getElpsStaffList(),
      this.adminService.getRoles()
    ]).subscribe({
      next: (res: any[]) => {
        this.allUsers = res[0]?.data ? res[0].data : res[0];
        this.elpsUsers = res[1]?.data ? res[1].data : res[1];
        this.roles = res[2]?.data ? res[2].data : res[2];
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Something went wrong while fetching elps users', null, {
          panelClass: ['error']
        });
      }
    })
    this.progressBar.close();
  }

  addData() {
    const data = {
      data: {
        users: this.elpsUsers,
        staffList: this.elpsUsers,
        roles: this.roles,
        offices: this.offices,
      }
    }
    const dialogRef = this.dialog.open(UserFormComponent, { data });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

      }
    })
  }

  deleteData(event: any) {
    const listOfDataToDelete = event.filter((s) => {
      if (s.appCount > 0) {
        this.snackBar.open(
          `Cannot delete a field officer with an assigned depot`,
          null,
          {
            panelClass: ['success'],
          }
        );
      }
      return s.appCount === 0;
    });

    const requests = (listOfDataToDelete as any[]).map((req) => {
      return this.adminService.deleteStaff(req.id);
    });

    this.progressBar.open();

    forkJoin(requests).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.snackBar.open(
            `User${res.length > 1 ? 's' : ''} was deleted successfully!`,
            null,
            {
              panelClass: ['success'],
            }
          );

          const responses = res
            .map((r) => r.data.data)
            .sort((a, b) => a.length - b.length);

          this.fieldOfficerUsers = responses[0];
        }

        this.progressBar.close();
      },
      error: (error: unknown) => {
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });

        this.progressBar.close();
      },
    });
  }

  editData(event: Event) {
    const data = {
      data: {
        users: this.fieldOfficerUsers,
        staffList: this.fieldOfficers,
        roles: this.roles,
        offices: this.offices,
        currentValue: ''
      }
    }
    const dialogRef = this.dialog.open(UserFormComponent, { data });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

      }
    })
  }

}

interface FieldOfficer {
  name: string,
  email: string,
  phoneNumber: string,
  role: string,
  office: string,
  location: string,
  status: string
}