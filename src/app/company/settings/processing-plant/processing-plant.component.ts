import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { ApplicationProcessesService } from '../../../../../src/app/shared/services/application-processes.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';
import { ProcessingPlantFormComponent } from '../../../../../src/app/shared/reusable-components/processing-plant-form/processing-plant-form.component';
import { CompanyService } from '../../../../../src/app/shared/services/company.service';
import { TanksComponent } from './tanks/tanks.component';

@Component({
  selector: 'app-processing-plant',
  templateUrl: './processing-plant.component.html',
  styleUrls: ['./processing-plant.component.css'],
})
export class ProcessingPlantComponent implements OnInit {
  public plants: IPlant[];
  public plants2: IPlant[];
  //public plants2: IPlant[];
  public plantTypes: IPlantType[] = [
    { id: 1, name: 'Processing' },
    { id: 2, name: 'Depot' },
  ];

  public tableTitles = {
    branches: 'PROCESSING PLANTS',
  };

  public branchKeysMappedToHeaders = {
    //id: 'Id',
    name: 'Plant Name',
    // company: 'Company Name',
    // email: 'Email',
    state: 'State',
    lga: 'LGA',
    city: 'City',
    plantType: 'Plant Type',
    tanks: 'Tanks',
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
    this.getplants();
  }

  getplants() {
    this.spinner.open();
    this.companyService.getcompanyPlants().subscribe({
      next: (res) => {
        this.plants = res.data;

        const idToNameMap = this.plantTypes.reduce(
          (map: IPlantType, item: IPlantType) => {
            map[item.id] = item.name;
            return map;
          },
          {} as IPlantType
        );

        // Replace applicationTypeId with the corresponding name
        this.plants2 = res.data.map((item) => {
          return {
            ...item,
            plantType: idToNameMap[item.plantType],
          };
        });
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
      pp: {
        data: {
          plantTypes: this.plantTypes,
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
      pp: {
        id: 'id',
      },
    };
    const listOfDataToDelete = [...event];
    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'pp') {
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
          this.getplants();
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
      pp: {
        data: {
          plantTypes: this.plantTypes,
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
      this.getplants();
      this.cd.markForCheck();
    });
  }

  viewTank(event: any, type: string) {
    const operationConfiguration = {
      pp: {
        data: {
          plant: event,
        },
        form: TanksComponent,
      },
    };
    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
      panelClass: 'pannelClass',
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getplants();
      this.cd.markForCheck();
    });
  }
}

export interface IPlantType {
  id: number;
  name: string;
}

export interface IPlant {
  id?: number;
  name: string;
  company?: string;
  email?: string;
  state: string;
  plantType: string;
  tanks?: any;
  stateId?: number;
  lgaid?: number;
  city?: string;
}
