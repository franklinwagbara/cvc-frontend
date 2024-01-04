import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { IApplicationProcess } from 'src/app/shared/interfaces/IApplicationProcess';
import { IBranch } from 'src/app/shared/interfaces/IBranch';
import { IRole } from 'src/app/shared/interfaces/IRole';
import { ApplicationProcessFormComponent } from 'src/app/shared/reusable-components/application-process-form/application-process-form.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from 'src/app/shared/services/application-processes.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import {
  IAppFee,
  IApplicationType,
} from 'src/app/company/apply/new-application/new-application.component';
import { PermitStage } from '../modules-setting/modules-setting.component';
import { AppFeeFormComponent } from 'src/app/shared/reusable-components/app-fee-form/app-fee-form.component';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-app-fee',
  templateUrl: './app-fee.component.html',
  styleUrls: ['./app-fee.component.css'],
})
export class AppFeeComponent implements OnInit {
  // public permitStages: PermitStage[];
  // public branches: IBranch[];
  // public roles: IRole[];
  // public actions: string[];
  //public statuses: string[];
  // public facilityTypes: IFacilityType[];
  public appFees: IAppFee[];
  public appFees2: IAppFee[];
  public applicationTypes: IApplicationType[];

  public tableTitles = {
    branches: 'APPLICATION FEES',
  };

  public branchKeysMappedToHeaders = {
    //id: 'Id',
    applicationTypeId: 'Application Type',
    serciveCharge: 'Sercive Charge',
    noaFee: 'NOA Fee',
    coqFee: 'COQ Fee',
    processingFee: 'Processing Fee',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBarService: ProgressBarService,
    private adminHttpService: AdminService,
    private spinner: SpinnerService,
    private processFlow: ApplicationProcessesService,
    private libraryService: LibaryService,
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.progressBarService.open();
    this.spinner.open();

    forkJoin([
      this.adminService.getAppFees(),
      this.libraryService.getApplicationTypes(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) this.appFees = res[0].data;
        if (res[1].success) this.applicationTypes = res[1].data;

        const idToNameMap = this.applicationTypes.reduce(
          (map: IApplicationType, item: IApplicationType) => {
            map[item.id] = item.name;
            return map;
          },
          {} as IApplicationType
        );

        // Replace applicationTypeId with the corresponding name
        this.appFees2 = res[0].data.map((item) => {
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
      applicationFees: {
        data: {
          applicationTypes: this.applicationTypes,
        },
        form: AppFeeFormComponent,
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
      applicationFees: {
        id: 'id',
        applicationType: 'Application Type',
        serciveCharge: 'Sercive Charge',
        noaFee: 'NOA Fee',
        coqFee: 'COQ Fee',
        processingFee: 'Processing Fee',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'applicationFees') {
        return this.adminService.deleteAppFee(req[typeToModelMapper[type].id]);
      } else {
        return this.adminService.deleteAppFee(req[typeToModelMapper[type].id]);
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
      applicationFees: {
        data: {
          applicationTypes: this.applicationTypes,
          appFeeId: event.id,
          action: 'EDIT',
        },
        form: AppFeeFormComponent,
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
