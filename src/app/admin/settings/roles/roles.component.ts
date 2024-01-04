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
import { RoleFormComponent } from '../../../../../src/app/shared/reusable-components/role-form/role-form.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  // public permitStages: PermitStage[];
  // public branches: IBranch[];
  // public roles: IRole[];
  // public actions: string[];
  //public statuses: string[];
  // public facilityTypes: IFacilityType[];
  public roles: IRole[];

  public tableTitles = {
    branches: 'ROLES',
  };

  public branchKeysMappedToHeaders = {
    //id: 'Id',
    name: 'Name',
    description: 'Description',
    userRoles: 'User Roles',
    normalizedName: 'Normalized Name',
    concurrencyStamp: 'Concurrency Stamp',
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
    this.spinner.open();

    forkJoin([this.adminService.getRoles()]).subscribe({
      next: (res) => {
        if (res[0].success) this.roles = res[0].data;
        // const idToNameMap = this.applicationTypes.reduce(
        //   (map: IApplicationType, item: IApplicationType) => {
        //     map[item.id] = item.name;
        //     return map;
        //   },
        //   {} as IApplicationType
        // );

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
      roles: {
        data: {},
        form: RoleFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.ngOnInit();
      this.cd.markForCheck();
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      roles: {
        id: 'id',
        name: 'name',
        description: 'description',
        userRoles: 'userRoles',
        normalizedName: 'normalizedName',
        concurrencyStamp: 'concurrencyStamp',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'roles') {
        return this.adminService.deleteRoles(req[typeToModelMapper[type].id]);
      } else {
        return this.adminService.deleteRoles(req[typeToModelMapper[type].id]);
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
        this.snackBar.open(
          'Something went wrong while deleting record!',
          null,
          {
            panelClass: ['error'],
          }
        );
        this.progressBarService.close();
        this.cd.markForCheck();
      },
    });
  }

  onEditData(event: any, type: string) {
    const operationConfiguration = {
      roles: {
        data: {
          roles: event,
          action: 'EDIT',
        },
        form: RoleFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.ngOnInit();
      this.cd.markForCheck();
    });
  }
}
