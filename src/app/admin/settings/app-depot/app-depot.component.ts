import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';
import {
  IDepot,
  IApplicationType,
  IState,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import { LocationService } from '../../../../../src/app/shared/services/location/location.service';
import { PopupService } from '../../../../../src/app/shared/services/popup.service';
import { AppDepotFormComponent } from '../../../../../src/app/shared/reusable-components/app-depot-form/app-depot-form.component';

@Component({
  selector: 'app-app-depot',
  templateUrl: './app-depot.component.html',
  styleUrls: ['./app-depot.component.css'],
})
export class AppDepotComponent implements OnInit {
  public appDepots: IDepot[];
  public applicationTypes: IApplicationType[];
  public states: IState[];

  public tableTitles = {
    depots: 'APPLICATION DEPOTS',
  };

  public depotsKeysMappedToHeaders = {
    name: 'Depot Name',
    state: 'State',
    capacity: 'Depot Capacity',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinner: SpinnerService,
    private locService: LocationService,
    private libraryService: LibaryService,
    private adminService: AdminService,
    private cd: ChangeDetectorRef,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    this.getAllDepots();
    this.getAllStates();
  }

  public getAllStates() {
    this.spinner.open();
    return this.libraryService.getStates().subscribe({
      next: (res) => {
        this.states = res.data;
        this.cd.markForCheck;
        this.spinner.close();
      },
      error: (e) => {
        this.spinner.close();
        this.popUp.open(e.message ?? e.Message, 'error');
        this.cd.markForCheck();
      },
    });
  }

  public getAllDepots() {
    this.spinner.open();
    this.libraryService.getAppDepots().subscribe({
      next: (res) => {
        this.appDepots = res.data;
        this.appDepots = this.appDepots.map((d) => {
          d.stateName = d.state.name;
          return d;
        });

        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open('Something went wrong while retrieving data.', 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      applicationDepots: {
        data: {
          appDepots: this.appDepots,
          states: this.states,
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
      this.getAllDepots();
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
        return this.locService.deleteAppDepot(req[typeToModelMapper[type].id]);
      } else {
        return this.locService.deleteAppDepot(req[typeToModelMapper[type].id]);
      }
    });

    this.spinner.open();
    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.popUp.open(
            `${
              res.length > 1
                ? res.length + ' records '
                : res.length + ' record '
            } deleted successfully.`,
            'success'
          );
          this.getAllDepots();
        }
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });
        this.popUp.open('Something went wrong while deleting deta!', 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  onEditData(event: any, type: string) {
    const operationConfiguration = {
      applicationDepots: {
        data: {
          appDepots: this.appDepots,
          appDepotId: event.id,
          states: this.states,
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
      this.getAllDepots();
      this.cd.markForCheck();
    });
  }
}
