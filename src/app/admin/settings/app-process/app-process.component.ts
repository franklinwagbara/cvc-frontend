import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { IApplicationProcess } from '../../../../../src/app/shared/interfaces/IApplicationProcess';
import { IBranch } from '../../../../../src/app/shared/interfaces/IBranch';
import { IRole } from '../../../../../src/app/shared/interfaces/IRole';
import { ApplicationProcessFormComponent } from '../../../../../src/app/shared/reusable-components/application-process-form/application-process-form.component';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from '../../../../../src/app/shared/services/application-processes.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';
import {
  IApplicationType,
  IFacilityType,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import { PermitStage } from '../modules-setting/modules-setting.component';
import { ILocation } from '../all-staff/all-staff.component';

@Component({
  selector: 'app-app-process',
  templateUrl: './app-process.component.html',
  styleUrls: ['./app-process.component.css'],
})
export class AppProcessComponent implements OnInit {
  public applicationProcesses: IApplicationProcess[];
  public permitStages: PermitStage[];
  public branches: IBranch[];
  public roles: IRole[];
  public actions: string[];
  public locations: ILocation[];
  public statuses: string[];
  public facilityTypes: IFacilityType[];
  public applicationTypes: IApplicationType[];

  public tableTitles = {
    branches: 'APPLICATION PROCESS',
  };

  public branchKeysMappedToHeaders = {
    applicationType: 'Application Type',
    vesselType: 'Vessel Type',
    triggeredByRole: 'Triggered By',
    action: 'Action',
    targetRole: 'Target Role',
    status: 'Application Status',
    fromLocation: 'From Location',
    toLocation: 'To Location',
    rate: 'State',
    isArchived: 'Archived',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBarService: ProgressBarService,
    private adminHttpService: AdminService,
    private spinner: SpinnerService,
    private processFlow: ApplicationProcessesService,
    private libraryService: LibaryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([
      this.processFlow.getApplicationProcesses(),
      this.libraryService.getRoles(),
      this.libraryService.getAppActions(),
      this.libraryService.getAppStatuses(),
      this.libraryService.getFacilityTypes(),
      this.libraryService.getApplicationTypes(),
      this.libraryService.getAllLocations(),
      // this.adminHttpService.getBranches(),
      // this.adminHttpService.getPhaseCategories(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) this.applicationProcesses = res[0].data;

        if (res[1].success) this.roles = res[1].data;

        if (res[2]) {
          this.actions = res[2];
        }

        if (res[3]) this.statuses = res[3];

        if (res[4].success) this.facilityTypes = res[4].data;

        if (res[5].success) this.applicationTypes = res[5].data;

        if (res[6].success) this.locations = res[6].data;

        // if (res[4].success) this.permitStages = res[4].data.data.permitStages;
        // if (res[1].success) this.branches = res[1].data.data;
        // this.progressBarService.close();
        this.spinner.close();
      },

      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        // this.progressBarService.close();
        this.spinner.close();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      applicationProcesses: {
        data: {
          editMode: false,
          permitStages: this.permitStages,
          branches: this.branches,
          roles: this.roles,
          actions: this.actions,
          statuses: this.statuses,
          locations: this.locations,
          facilityTypes: this.facilityTypes,
          applicationTypes: this.applicationTypes,
        },
        form: ApplicationProcessFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.progressBarService.open();
  
        this.processFlow.getApplicationProcesses().subscribe((res) => {
          this.applicationProcesses = res.data;
          this.progressBarService.close();
          this.cd.markForCheck();
        });
      }
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      applicationProcesses: {
        name: 'Application Process',
        id: 'id',
      },
    };

    const listOfDataToDelete = [...event];

    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'applicationProcesses') {
        return this.processFlow.deleteApplicationProcess(
          req[typeToModelMapper[type].id]
        );
      } else {
        return this.processFlow.deleteApplicationProcess(
          req[typeToModelMapper[type].id]
        );
      }
    });

    this.progressBarService.open();

    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(
            `${typeToModelMapper.applicationProcesses.name} was deleted successfully!`,
            null,
            {
              panelClass: ['success'],
            }
          );

          const responses = res
            .map((r) => r.data.data)
            .sort((a, b) => a.length - b.length);

          if (type === 'branches') this.applicationProcesses = responses[0];
        }

        this.progressBarService.close();
        this.cd.markForCheck();
      },

      error: (error: unknown) => {
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });

        this.progressBarService.close();
        this.cd.markForCheck();
      },
    });
  }

  onEditData(event: any, type: string) {
    const operationConfiguration = {
      applicationProcesses: {
        data: {
          editMode: true,
          permitStages: this.permitStages,
          branches: this.branches,
          roles: this.roles,
          actions: this.actions,
          statuses: this.statuses,
          locations: this.locations,
          applicationProcess: event,
          facilityTypes: this.facilityTypes,
          applicationTypes: this.applicationTypes,
        },
        form: ApplicationProcessFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.progressBarService.open();

      this.processFlow.getApplicationProcesses().subscribe((res) => {
        this.applicationProcesses = res.data;
        this.progressBarService.close();
        this.cd.markForCheck();
      });
    });
  }
}
