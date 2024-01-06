import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from 'src/app/shared/services/application-processes.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { ProcessingPlantFormComponent } from 'src/app/shared/reusable-components/processing-plant-form/processing-plant-form.component';
import { CompanyService } from 'src/app/shared/services/company.service';
import { IPlant } from '../processing-plant.component';

@Component({
  selector: 'app-tanks',
  templateUrl: './tanks.component.html',
  styleUrls: ['./tanks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TanksComponent implements OnInit {
  @Input('plants') plants: IPlant[];
  public tanks: ITank[];
  public tanks2: ITank[];
  //public tanks2: IPlant[];

  public tableTitles = {
    branches: 'TANKS',
  };

  public branchKeysMappedToHeaders = {
    // id: 0,

    tankName: 'Tank Name',
    plantId: 'Plant Name',
    product: 'Poduct',
    capacity: 'Capacity',
    position: 'Position',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBarService: ProgressBarService,
    private adminHttpService: AdminService,
    private spinner: SpinnerService,
    private processFlow: ApplicationProcessesService,
    private libraryService: LibaryService,
    private companyService: CompanyService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.companyService.getcompanytanks().subscribe({
      next: (res) => {
        this.tanks = [
          {
            // id: 0,
            plantId: 1,
            tankName: 'Tank Name',
            product: 'Poduct',
            capacity: 2,
            position: 'Position',
          },
        ];
        if (this.plants && this.plants.length > 0) {
          const idToNameMap = this.plants.reduce(
            (map: IPlant, item: IPlant) => {
              map[item.id] = item.name;
              return map;
            },
            {} as IPlant
          );

          // Replace applicationTypeId with the corresponding name
          if (idToNameMap) {
            this.tanks2 = this.tanks.map((item) => {
              return {
                ...item,
                plantId: idToNameMap[item.plantId],
              };
            });
          }
        }
        console.log(this.tanks2);
        this.spinner.close();
        this.cd.markForCheck();
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
        this.cd.markForCheck();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      tanks: {
        data: {
          //plantTypes: this.plantTypes,
        },
        form: ProcessingPlantFormComponent,
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
      tanks: {
        id: 'id',
        name: 'Plant name',
        company: 'Company Name',
        email: 'Email',
        state: 'Location',
        type: 'Plant Type',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'tanks') {
        return this.companyService.deletePlant(req[typeToModelMapper[type].id]);
      } else {
        return this.companyService.deletePlant(req[typeToModelMapper[type].id]);
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
          // plantTypes: this.plantTypes,
          plantId: event.id,
          action: 'EDIT',
        },
        form: ProcessingPlantFormComponent,
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

export interface ITank {
  id?: number;
  plantId: number;
  tankName: string;
  product: string;
  capacity: number;
  position: string;
}
