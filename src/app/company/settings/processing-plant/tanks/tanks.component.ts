import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../../src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from '../../../../../../src/app/shared/services/application-processes.service';
import { LibaryService } from '../../../../../../src/app/shared/services/libary.service';
import { ProcessingPlantFormComponent } from '../../../../../../src/app/shared/reusable-components/processing-plant-form/processing-plant-form.component';
import { CompanyService } from '../../../../../../src/app/shared/services/company.service';
import { IPlant } from '../processing-plant.component';
import { TankFormComponent } from '../../../../../../src/app/shared/reusable-components/tank-form/tank-form.component';
import { Console } from 'console';
import { ITank } from '../../../../../../src/app/shared/interfaces/ITank';

@Component({
  selector: 'app-tanks',
  templateUrl: './tanks.component.html',
  styleUrls: ['./tanks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TanksComponent implements OnInit {
  @Input('plants') plants: IPlant[];
  public tanks: ITank[];
  public plantId: number;
  public plantName: string;
  //public tanks: IPlant[];

  public tableTitles = {
    branches: 'TANKS',
  };

  public branchKeysMappedToHeaders = {
    // id: 'id',
    tankName: 'Tank Name',
    product: 'Product',
    capacity: 'Capacity',
    position: 'Position',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBarService: ProgressBarService,
    private adminHttpService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TanksComponent>,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private processFlow: ApplicationProcessesService,
    private libraryService: LibaryService,
    private companyService: CompanyService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //this.getTank();
    console.log(this.data);
    this.plantName = this.data.data.plant.name;
    this.plantId = this.data.data.plant.id;
    this.tanks = this.data.data.plant.tanks;
  }

  getTank() {
    this.progressBar.open();
    this.companyService.getcompanytanks(this.plantId).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.tanks = res.data;

        this.cd.markForCheck();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
        this.cd.markForCheck();
      },
    });
  }

  onAddData(event: any, type: string) {
    const operationConfiguration = {
      tanks: {
        data: {
          plantId: this.plantId,
        },
        form: TankFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getTank();
    });
  }

  onDeleteData(event: any, type: string) {
    console.log(event);
    const typeToModelMapper = {
      tanks: {
        id: 'plantTankId',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'tanks') {
        return this.companyService.deleteTank(req[typeToModelMapper[type].id]);
      } else {
        return this.companyService.deleteTank(req[typeToModelMapper[type].id]);
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
          this.getTank();
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
      tanks: {
        data: {
          tank: event,
          action: 'EDIT',
        },
        form: TankFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getTank();
      this.cd.markForCheck();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
