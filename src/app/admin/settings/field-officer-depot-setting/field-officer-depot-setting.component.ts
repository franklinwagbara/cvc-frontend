import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { IPlant } from '../../../shared/interfaces/IPlant';
import { IDepotOfficer } from '../../../shared/interfaces/IDepotOfficer';
import { IRole } from '../../../shared/interfaces/IRole';
import { AdminService } from '../../../shared/services/admin.service';
import { Staff } from '../all-staff/all-staff.component';
import { DepotOfficerService } from '../../../shared/services/depot-officer/depot-officer.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { PopupService } from '../../../shared/services/popup.service';
import { DepotOfficerFormComponent } from '../../../shared/reusable-components/depot-officer-form/depot-officer-form.component';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { LibaryService } from '../../../shared/services/libary.service';

@Component({
  selector: 'app-field-officer-depot-setting',
  templateUrl: './field-officer-depot-setting.component.html',
  styleUrls: ['./field-officer-depot-setting.component.css'],
})
export class FieldOfficerDepotSettingComponent implements OnInit {
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
    private popUp: PopupService,
    private cdr: ChangeDetectorRef
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
        dialogTitle: 'Add New Mapping' 
      },
    };
    const dialogRef = this.dialog.open(DepotOfficerFormComponent, { data });

    dialogRef.afterClosed().subscribe((result: 'submitted') => {
      if (result) {
        this.progressBar.open();
        this.refreshMappings();
      }
    })
  }

  deleteData(selected: any[]) {
    if (selected?.length) {
      const requests = selected.map((req) => {
        console.log('Selected DepotOfficer Mappings ==========> ', req);
        return this.depotOfficerService.deleteMapping(req?.plantFieldOfficerID);
      });
      
      this.progressBar.open();
  
      forkJoin(requests).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.popUp.open(
              `Mapping${res.length > 1 ? 's' : ''} was deleted successfully!`,
              'success'
            );

            const responses = res
              .map((r) => r.data.data)
              .sort((a, b) => a.length - b.length);
  
            this.allUsers = responses[0];
          }
          this.refreshMappings();
        },
        error: (error: unknown) => {
          console.log(error);
          this.progressBar.close();
          this.popUp.open('Something went wrong while deleting mapping!', 'error');
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
        depotId: event?.depotId,
        currentData: event,
        dialogTitle: 'Edit Mapping'
      },
    };
    const dialogRef = this.dialog.open(DepotOfficerFormComponent, { data });
    dialogRef.afterClosed().subscribe((res: 'submitted') => {
      if (res) {
        this.progressBar.open();
        this.refreshMappings();
      }
    });
  }

  refreshMappings(): void {
    this.depotOfficerService.getAllMappings().subscribe({
      next: (res) => {
        this.depotOfficers = res?.data;
        this.progressBar.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.progressBar.close();
        this.popUp.open('Could not refresh mappings', 'error');
        this.cdr.markForCheck();
      }
    })
  }
}
