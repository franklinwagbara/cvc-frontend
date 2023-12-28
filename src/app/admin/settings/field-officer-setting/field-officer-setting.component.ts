import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { IDepot } from 'src/app/shared/interfaces/IDepot';
import { IDepotOfficer } from 'src/app/shared/interfaces/IDepotOfficer';
import { IRole } from 'src/app/shared/interfaces/IRole';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Staff } from '../all-staff/all-staff.component';
import { DepotOfficerService } from 'src/app/shared/services/depot-officer/depot-officer.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { DepotOfficerFormComponent } from 'src/app/shared/reusable-components/depot-officer-form/depot-officer-form.component';

@Component({
  selector: 'app-field-officer-setting',
  templateUrl: './field-officer-setting.component.html',
  styleUrls: ['./field-officer-setting.component.css'],
})
export class FieldOfficerSettingComponent implements OnInit {
  depotOfficers: IDepotOfficer[];
  depots: IDepot[];
  allUsers: Staff[];
  elpsUsers: any[];
  roles: IRole[];
  locations: any[];
  offices: any[];
  staffList: Staff[];

  officerKeysMappedToHeaders: any = {
    officerName: 'Officer Name',
    depotName: 'Depot',
  };

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private depotOfficerService: DepotOfficerService,
    private libService: LibaryService,
    private spinner: SpinnerService,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  public fetchAllData() {
    this.spinner.open();
    forkJoin([
      this.depotOfficerService.getAllMappings(),
      this.libService.getAppDepots(),
      this.adminService.getAllStaff(),
      this.adminService.getElpsStaffList(),
      this.adminService.getRoles(),
    ]).subscribe({
      next: (res: any[]) => {
        this.depotOfficers = res[0].data;
        this.depots = res[1].data;
        this.staffList = res[2].data;
        this.elpsUsers = res[3].data;
        this.roles = res[4].data;
        this.spinner.close();
      },
      error: (error: any) => {
        console.error(error);
        this.popUp.open('Something went wrong while fetching data.', 'error');
        this.spinner.close();
      },
    });
  }

  addData() {
    const data = {
      data: {
        users: this.elpsUsers,
        staffList: this.staffList,
        depots: this.depots,
        roles: this.roles,
        offices: this.offices,
      },
    };
    const dialogRef = this.dialog.open(DepotOfficerFormComponent, { data });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.fetchAllData();
      }
    });
  }

  deleteData(event: any) {
    const listOfDataToDelete = event.filter((s) => {
      if (s.appCount > 0) {
        this.popUp.open(
          'Cannot delete a field officer with an assigned depot',
          'error'
        );
      }
      return s.appCount === 0;
    });

    const requests = (listOfDataToDelete as any[]).map((req) => {
      return this.adminService.deleteStaff(req.id);
    });

    this.spinner.open();

    forkJoin(requests).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.popUp.open(
            `User${res.length > 1 ? 's' : ''} was deleted successfully!`,
            'success'
          );

          const responses = res
            .map((r) => r.data.data)
            .sort((a, b) => a.length - b.length);

          this.allUsers = responses[0];
        }

        this.spinner.close();
      },
      error: (error: unknown) => {
        this.popUp.open('Something went wrong while deleting data!', 'error');

        this.spinner.close();
      },
    });
  }

  editData(event: Event) {
    const data = {
      data: {
        users: this.allUsers,
        staffList: this.staffList,
        roles: this.roles,
        offices: this.offices,
        currentValue: '',
      },
    };
    const dialogRef = this.dialog.open(DepotOfficerFormComponent, { data });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }
}

// interface FieldOfficer {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   role: string;
//   office: string;
//   location: string;
//   status: string;
// }
