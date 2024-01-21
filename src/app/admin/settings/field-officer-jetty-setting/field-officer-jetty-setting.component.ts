import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { IDepotOfficer } from 'src/app/shared/interfaces/IDepotOfficer';
import { IPlant } from 'src/app/shared/interfaces/IPlant';
import { DepotOfficerFormComponent } from 'src/app/shared/reusable-components/depot-officer-form/depot-officer-form.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { DepotOfficerService } from 'src/app/shared/services/depot-officer/depot-officer.service';
import { Staff } from '../all-staff/all-staff.component';
import { IRole } from 'src/app/shared/interfaces/IRole';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-field-officer-jetty-setting',
  templateUrl: './field-officer-jetty-setting.component.html',
  styleUrls: ['./field-officer-jetty-setting.component.css']
})
export class FieldOfficerJettySettingComponent implements OnInit {

  depotOfficers: IDepotOfficer[];
  depots: IPlant[];
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
    private libraryService: LibaryService,
    private spinner: SpinnerService,
    private progressBar: ProgressBarService,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.fetchAllData();
  }

  public fetchAllData() {
    forkJoin([
      this.depotOfficerService.getAllMappings(),
      this.libraryService.getAppDepots(),
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
        this.progressBar.close();
      },
      error: (error: any) => {
        console.error(error);
        this.popUp.open('Something went wrong while fetching data.', 'error');
        this.spinner.close();
        this.progressBar.close();
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
    this.dialog.open(DepotOfficerFormComponent, { data });
  }

  deleteData(selected: any[]) {
    if (selected?.length) {
      const listOfDataToDelete = selected.filter((s) => {
        if (s.appCount > 0) {
          this.popUp.open(
            'Cannot delete a field officer with an assigned jetty',
            'error'
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
            this.popUp.open(
              `User${res.length > 1 ? 's' : ''} was deleted successfully!`,
              'success'
            );

            const responses = res
              .map((r) => r.data.data)
              .sort((a, b) => a.length - b.length);
  
            this.allUsers = responses[0];
          }
          this.fetchAllData()
        },
        error: (error: unknown) => {
          console.log(error);
          this.progressBar.close();
          this.popUp.open('Something went wrong while deleting data!', 'error');
        },
      });
    }
  }

  editData(event: any) {
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
