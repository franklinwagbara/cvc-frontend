import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { IDepotOfficer } from 'src/app/shared/interfaces/IDepotOfficer';
import { IPlant } from 'src/app/shared/interfaces/IPlant';
import { DepotOfficerFormComponent } from 'src/app/shared/reusable-components/depot-officer-form/depot-officer-form.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Staff } from '../all-staff/all-staff.component';
import { IRole } from 'src/app/shared/interfaces/IRole';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { JettyOfficerService } from 'src/app/shared/services/jetty-officer/jetty-officer.service';
import { JettyOfficerFormComponent } from 'src/app/shared/reusable-components/jetty-officer-form/jetty-officer-form.component';
import { JettyService } from 'src/app/shared/services/jetty.service';

@Component({
  selector: 'app-field-officer-jetty-setting',
  templateUrl: './field-officer-jetty-setting.component.html',
  styleUrls: ['./field-officer-jetty-setting.component.css'],
})
export class FieldOfficerJettySettingComponent implements OnInit, OnDestroy {
  depotOfficers: IDepotOfficer[];
  jettys: IPlant[];
  allUsers: Staff[];
  elpsUsers: any[];
  roles: IRole[];
  locations: any[];
  offices: any[];
  staffList: Staff[];

  private destroy = new Subject<void>();

  officerKeysMappedToHeaders: any = {
    officerName: 'Officer Name',
    jettyName: 'Jetty Name',
  };

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private jettyOfficerService: JettyOfficerService,
    private jettyService: JettyService,
    private libraryService: LibaryService,
    private spinner: SpinnerService,
    private progressBar: ProgressBarService,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.fetchAllData();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.progressBar.close();
  }

  public fetchAllData() {
    forkJoin([
      this.jettyOfficerService.getAllMappings(),
      this.jettyService.getAllJetty(),
      this.adminService.getAllStaff(),
      this.adminService.getElpsStaffList(),
      this.adminService.getRoles(),
    ]).subscribe({
      next: (res: any[]) => {
        this.depotOfficers = res[0].data;
        console.log('Depot -> Officers ============> ', this.depotOfficers)
        this.jettys = res[1].data;
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
        jettys: this.jettys,
        roles: this.roles,
        offices: this.offices,
        editMode: false
      },
    };
    const dialogRef = this.dialog.open(JettyOfficerFormComponent, { data, disableClose: true },);

    dialogRef.afterClosed().subscribe((result: 'submitted') => {
      if (result) {
        this.progressBar.open();
        this.refreshMappings();
      }
    })
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

      const requests = listOfDataToDelete.map((req) => {
        return this.adminService.deleteStaff(req.id);
      });

      this.progressBar.open();

      forkJoin(requests).pipe(takeUntil(this.destroy)).subscribe({
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
          this.fetchAllData();
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
        currentData: event,
        editMode: true,
      },
    };
    const dialogRef = this.dialog.open(JettyOfficerFormComponent, { data, disableClose: true });
    dialogRef.afterClosed().subscribe((res: 'submitted') => {
      if (res) {
        this.progressBar.open();
        this.refreshMappings();
      }
    });
  }

  refreshMappings(): void {
    this.jettyOfficerService.getAllMappings().subscribe({
      next: (res: any) => {
        this.depotOfficers = res?.data;
        this.progressBar.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.progressBar.close();
        this.popUp.open('Could not refresh mappings', 'error');
      }
    })
  }
}
