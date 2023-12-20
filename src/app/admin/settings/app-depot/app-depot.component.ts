import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from 'src/app/shared/services/application-processes.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import {
  IDepot,
  IApplicationType,
} from 'src/app/company/apply/new-application/new-application.component';
import { LocationService } from 'src/app/shared/services/location/location.service';

@Component({
  selector: 'app-app-depot',
  templateUrl: './app-depot.component.html',
  styleUrls: ['./app-depot.component.css'],
})
export class AppDepotComponent implements OnInit {
  // public permitStages: PermitStage[];
  // public branches: IBranch[];
  // public roles: IRole[];
  // public actions: string[];
  //public statuses: string[];
  // public facilityTypes: IFacilityType[];
  public appDepots: IDepot[];
  public appDepots2: IDepot[];
  public applicationTypes: IApplicationType[];

  public tableTitles = {
    branches: 'APPLICATION DEPOTS',
  };

  public branchKeysMappedToHeaders = {
    //id: 'Id',
    applicationTypeId: 'Application Type',
    serciveCharge: 'Sercive Charge',
    noaDepot: 'NOA Depot',
    coqDepot: 'COQ Depot',
    processingDepot: 'Processing Depot',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinner: SpinnerService,
    private locService: LocationService,
    private libraryService: LibaryService,
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.progressBarService.open();
    this.spinner.open();

    forkJoin([
      this.locService.getAppDepots(),
      this.libraryService.getApplicationTypes(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) this.appDepots = res[0].data;
        if (res[1].success) this.applicationTypes = res[1].data;

        const idToNameMap = this.applicationTypes.reduce(
          (map: IApplicationType, item: IApplicationType) => {
            map[item.id] = item.name;
            return map;
          },
          {} as IApplicationType
        );

        // Replace applicationTypeId with the corresponding name
        this.appDepots2 = res[0].data.map((item) => {
          return {
            ...item,
            applicationTypeId: idToNameMap[item.applicationTypeId],
          };
        });

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
      applicationDepots: {
        data: {
          applicationTypes: this.applicationTypes,
        },
        form: AppDepotFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      //this.progressBarService.open();
      this.ngOnInit();
      this.cd.markForCheck();
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      applicationDepots: {
        id: 'id',
        applicationType: 'Application Type',
        serciveCharge: 'Sercive Charge',
        noaDepot: 'NOA Depot',
        coqDepot: 'COQ Depot',
        processingDepot: 'Processing Depot',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'applicationDepots') {
        return this.adminService.deleteAppDepot(
          req[typeToModelMapper[type].id]
        );
      } else {
        return this.adminService.deleteAppDepot(
          req[typeToModelMapper[type].id]
        );
      }
    });
    this.progressBarService.open();
    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(
            `${
              res.length > 1
                ? res.length + ' records '
                : res.length + ' record '
            } deleted successfully.`,
            null,
            {
              panelClass: ['success'],
            }
          );
          this.ngOnInit();
          // const responses = res
          //   .map((r) => r.data.data)
          //   .sort((a, b) => a.length - b.length);
          // if (type === 'branches') this.applicationProcesses = responses[0];
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
      applicationDepots: {
        data: {
          applicationTypes: this.applicationTypes,
          appDepotId: event.id,
          action: 'EDIT',
        },
        form: AppDepotFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      //this.progressBarService.open();

      this.ngOnInit();
      //this.progressBarService.close();
      this.cd.markForCheck();
    });
  }
}
