import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PhaseFormComponent } from '../../../../../src/app/shared/reusable-components/phase-form/phase-form.component';
import { CategoryFormComponent } from '../../../../../src/app/shared/reusable-components/category-form/category-form.component';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StageFormComponent } from '../../../../../src/app/shared/reusable-components/stage-form/stage-form.component';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { PopupService } from '../../../../../src/app/shared/services/popup.service';

@Component({
  selector: 'app-modules-setting',
  templateUrl: './modules-setting.component.html',
  styleUrls: ['./modules-setting.component.css'],
})
export class ModulesSettingComponent implements OnInit {
  tableTitles = {
    categories: 'Categories Settings',
    phases: 'Phases Settings',
    permitStages: 'Permit Stages Settings',
  };
  categories: Category[];
  phases: Phase[];
  permitStages: PermitStage[];
  closeResult: string;

  categoryTableKeysMappedToHeaders = {
    code: 'Code',
    name: 'Name',
    description: 'Description',
  };

  phasesTableKeysMappedToHeaders = {
    code: 'Code',
    shortName: 'Name',
    categoryName: 'Category',
    description: 'Description',
    status: 'Status',
  };

  permitStagesTableKeysMappedToHeaders = {
    phaseId: 'Phase ID',
    code: 'Code',
    name: 'Name',
    description: 'Description',
    fee: 'Fee (₦)',
    serviceCharge: 'Service Charge (₦)',
    status: 'Status',
    licenseSerial: 'Licence Serial No.',
  };

  constructor(
    public snackBar: MatSnackBar,
    private adminHttpService: AdminService,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    // this.progressBar.open();
    this.spinner.open();

    this.adminHttpService.getPhaseCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data.data.allModules.map((cat) => cat);
        this.phases = res.data.data.allPermits.map((phase) => phase);
        this.permitStages = res.data.data.permitStages.map((stage) => stage);
        this.spinner.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.popUp.open('Something went wrong while retrieving data', 'error');
        this.spinner.close();
      }
    });
  }

  onAddData(event: Event, type: string) {
    const operationConfiguration = {
      category: {
        data: this.categories,
        form: CategoryFormComponent,
      },
      phase: {
        data: {
          categories: this.categories,
          phases: this.phases,
        },
        form: PhaseFormComponent,
      },
      permitStages: {
        data: { permitStages: this.permitStages, phases: this.phases },
        form: StageFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.progressBar.open();

      this.adminHttpService.getPhaseCategories().subscribe((result) => {
        this.categories = result.data.data.allModules;
        this.phases = result.data.data.allPermits;
        this.permitStages = result.data.data.permitStages;

        this.progressBar.close();
      });
    });
  }

  onDeleteData(event: any, type: string) {
    const typeToModelMapper = {
      category: {
        name: 'Category',
        id: 'id',
      },
      phase: {
        name: 'Phase',
        id: 'id',
      },
      permitStage: {
        name: 'Permit stage',
        id: 'id',
      },
    };

    const listOfDataToDelete = [...event];

    const requests = (listOfDataToDelete as any[]).map((req) => {
      if (type === 'category') {
        return this.adminHttpService.deleteModule(
          req[typeToModelMapper[type].id]
        );
      } else if (type === 'phase') {
        return this.adminHttpService.deletePhase(
          req[typeToModelMapper[type].id]
        );
      } else {
        return this.adminHttpService.deletePermitStage(
          req[typeToModelMapper[type].id]
        );
      }
    });

    this.progressBar.open();

    forkJoin(requests).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open(
            `${typeToModelMapper.category.name} was deleted successfully!`,
            null,
            {
              panelClass: ['success'],
            }
          );

          const responses = res
            .map((r) => r.data.data)
            .sort((a, b) => a.length - b.length);

          if (type === 'category') this.categories = responses[0];
          else if (type === 'phase') this.phases = responses[0].allPermits;
          else if (type === 'permitStage') this.permitStages = responses[0];
        }
        this.progressBar.close();
      },
      error: (error: unknown) => {
        this.snackBar.open('Something went wrong while deleting data!', null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
      },
    });
  }

  onEditData(event: Event, type: string) {
    const operationConfiguration = {
      category: {
        data: { categories: this.categories, currentValue: event },
        form: CategoryFormComponent,
      },
      phase: {
        data: {
          currentValue: event,
          categories: this.categories,
          phases: this.phases,
        },
        form: PhaseFormComponent,
      },
      permitStages: {
        data: {
          currentValue: event,
          permitStages: this.permitStages,
          phases: this.phases,
        },
        form: StageFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationConfiguration[type].form, {
      data: {
        data: operationConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.progressBar.open();

      this.adminHttpService.getPhaseCategories().subscribe((res) => {
        this.categories = res.data.data.allModules;
        this.phases = res.data.data.allPermits;
        this.permitStages = res.data.data.permitStages;

        this.progressBar.close();
      });
    });
  }
}

export class Category {
  id: number;
  name: string;
  code: string;
  description: string;

  constructor(item: any) {
    this.id = item.id;
    this.code = item.code;
    this.name = item.name;
    this.description = item.description;
  }
}

export class Phase {
  id: number;
  categoryId: number;
  shortName: string;
  code: string;
  sort: number;
  categoryName: string;
  description: string;
  status: boolean;
  fee: number;
  serviceCharge: number;

  constructor(item: any) {
    this.id = item.id;
    this.categoryId = item.categoryId;
    this.code = item.code;
    this.shortName = item.shortName;
    this.sort = item.sort;
    this.categoryName = item.categoryName;
    this.description = item.description;
    this.status = item.status;
    this.fee = item.fee;
    this.serviceCharge = item.serviceCharge;
  }
}

export class PermitStage {
  id: number;
  phaseId: number;
  code: string;
  name: string;
  description: string;
  sort: number;
  fee: number;
  serviceCharge: number;
  status: boolean;
  licenseSerial: number;
  phaseName: string;
  phase: Phase;

  constructor(item: PermitStage) {
    this.id = item.id;
    this.phaseId = item.phaseId;
    this.code = item.code;
    this.name = item.name;
    this.description = item.description;
    this.sort = item.sort;
    this.fee = item.fee;
    this.serviceCharge = item.serviceCharge;
    this.status = item.status;
    this.licenseSerial = item.licenseSerial;
    this.phaseName = item.phaseName;
    this.phase = item.phase;
  }
}
