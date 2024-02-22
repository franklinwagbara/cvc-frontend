import { forkJoin } from 'rxjs';
import { FieldOfficeFormComponent } from '../../../../../src/app/shared/reusable-components/field-office-form/field-office-form.component';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ApplyService } from '../../../../../src/app/shared/services/apply.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';
import { AppException } from 'src/app/shared/exceptions/AppException';

@Component({
  selector: 'app-field-zonal-office',
  templateUrl: './field-zonal-office.component.html',
  styleUrls: ['./field-zonal-office.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldZonalOfficeComponent implements OnInit {
  public offices: FieldOffice[];
  public stateList: State[] = [];

  public tableTitles = {
    fieldOffices: 'FIELD OFFICES SETTINGS',
  };

  public fieldOfficeKeysMappedToHeaders = {
    name: 'Name',
    state: 'State',
    // address: 'Address',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private applyHttpService: ApplyService,
    private progressBarService: ProgressBarService,
    private spinner: SpinnerService,
    private adminHttpService: AdminService,
    private libraryService: LibaryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([
      this.adminHttpService.getOffices(),
      this.libraryService.getStates(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) {
          this.offices = res[0].data;
        }

        if (res[1].success) this.stateList = res[1].data;

        if (res[0].success && res[1].success) {
          this.offices = this.offices.map((el) => ({
            ...el,
            state: this.stateList.find(s => s.id === el.stateId)?.name 
          }))
        }
        // this.progressBarService.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      fieldOffices: {
        data: { stateList: this.stateList, },
        form: FieldOfficeFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
        editMode: false
      },
    });

    dialogRef.afterClosed().subscribe((result: 'submitted') => {
      if (result) {
        this.progressBarService.open();
        this.adminHttpService.getOffices().subscribe((res) => {
          this.offices = res.data;
  
          this.progressBarService.close();
        });
      }
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      fieldOffices: {
        name: 'Field Office',
        id: 'id',
      },
    };

    const listOfDataToDelete = [...event];

    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'fieldOffices') {
        return this.adminHttpService.deleteOffice(
          req[typeToModelMapper[type].id]
        );
      } else {
        return this.adminHttpService.deleteOffice(
          req[typeToModelMapper[type].id]
        );
      }
    });

    this.progressBarService.open();

    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(
            `${typeToModelMapper.fieldOffices.name} was deleted successfully!`,
            null,
            {
              panelClass: ['success'],
            }
          );
          const responses = res
            .map((r) => r.data.data)
            .sort((a, b) => a.length - b.length);
          if (type === 'fieldOffices') this.offices = responses[0];
        }
        this.progressBarService.close();
      },
      error: (error: AppException) => {
        console.error(error);
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });
        this.progressBarService.close();
      },
    });
  }

  onEditData(event: any, type: string) {
    const operationConfiguration = {
      fieldOffices: {
        data: { stateList: this.stateList, office: event, action: 'EDIT' },
        form: FieldOfficeFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
        editMode: true
      },
    });

    dialogRef.afterClosed().subscribe((res: 'submitted') => {
      if (res) {
        this.ngOnInit();
        this.cd.markForCheck();
      }
    });
  }
}

export class FieldOffice {
  id: number;
  name: string;
  address: string;
  stateName: string;
  stateId: number;

  constructor(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.address = item.address;
    this.stateId = item.stateId;
    this.stateName = item.stateName;
  }
}

export interface State {
  id: number;
  stateName: string;
  stateCode: string;
  name?: string;
}
