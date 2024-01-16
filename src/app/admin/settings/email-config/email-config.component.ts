import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from '../../../../../src/app/shared/services/application-processes.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';
import {
  IAppFee,
  IApplicationType,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import { PermitStage } from '../modules-setting/modules-setting.component';
import { AppFeeFormComponent } from '../../../../../src/app/shared/reusable-components/app-fee-form/app-fee-form.component';
import { number } from '@amcharts/amcharts4/core';
import { EmailConfigFormComponent } from 'src/app/shared/reusable-components/email-config-form/email-config-form.component';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.css'],
})
export class EmailConfigComponent implements OnInit {
  // public permitStages: PermitStage[];
  // public branches: IBranch[];
  // public roles: IRole[];
  // public actions: string[];
  //public statuses: string[];
  // public facilityTypes: IFacilityType[];
  public emailList: IEmailList[];

  public tableTitles = {
    branches: 'EMAIL CONFIGURATION',
  };

  public branchKeysMappedToHeaders = {
    //id: 'Id',
    name: 'Name',
    email: 'Email',
    isActive: 'Active',
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

    forkJoin([this.adminService.getEmailList()]).subscribe({
      next: (res) => {
        if (res[0].success) this.emailList = res[0].data;

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

        this.spinner.close();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      emailList: {
        form: EmailConfigFormComponent,
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
      emailList: {
        id: 'id',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'applicationFees') {
        return this.adminService.deleteEmail(req[typeToModelMapper[type].id]);
      } else {
        return this.adminService.deleteEmail(req[typeToModelMapper[type].id]);
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
      emailList: {
        data: {
          emailList: event,
          action: 'EDIT',
        },
        form: EmailConfigFormComponent,
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

export interface IEmailList {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}
