import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import {
  IVesselType,
  PermitStageDocFormComponent,
} from '../../../../../src/app/shared/reusable-components/permit-stage-doc-form/permit-stage-doc-form.component';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { AppStageDocumentService } from '../../../../../src/app/shared/services/app-stage-document.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';
import {
  IApplicationType,
  IFacilityType,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import {
  Category,
  PermitStage,
  Phase,
} from '../modules-setting/modules-setting.component';

@Component({
  selector: 'app-app-stage-docs',
  templateUrl: './app-stage-docs.component.html',
  styleUrls: ['./app-stage-docs.component.css'],
})
export class AppStageDocsComponent implements OnInit {
  form: FormGroup;
  // permitStageDocuments: PermitStageDocument[];
  facilityTypeDocs: IFacilityTypeDoc[];
  categories: Category[];
  phases: Phase[];
  permitStages: PermitStage[];
  docs: Doc[];
  appTypes: AppType[];
  facilityTypes: IFacilityType[];
  applicationTypes: IApplicationType[];
  public vesselTypes: IVesselType[];

  tableTitles = {
    facilityTypeDoc: 'PERMIT STAGE DOCUMENTS SETTINGS',
  };

  facilityTypeDocKeysMappedToHeaders = {
    docId: 'Document ID',
    appType: 'Application Type',
    name: 'Document Name',
    docType: 'Document type',
    facilityType: 'Facility Type',
    isFADDoc: 'FAD Document?',
    // appTypeId: 'Application Type ID',
    // phaseStageId: 'Phase Stage ID',
    // phaseStage: 'Phase Stage',
    // isMandatory: 'Mandatory',
    // status: 'Status',
    // sortId: 'Sort Id',
  };

  constructor(
    private adminHttpService: AdminService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public progressBarService: ProgressBarService,
    private spinner: SpinnerService,
    private appDocService: AppStageDocumentService,
    private libraryService: LibaryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.progressBarService.open();
    this.getAppDocInfo();
  }

  public getAppDocInfo() {
    this.spinner.open();
    forkJoin([
      // this.adminHttpService.getPhaseCategories(), not required at the moment
      this.appDocService.getAllDocs(),
      this.appDocService.getAllELPSDocs(),
      this.libraryService.getVesselTypes(),
      this.libraryService.getApplicationTypes(),
      // this.adminHttpService.getAppTypes(),
    ]).subscribe({
      next: (res) => {
        // if (res[0].success) {
        //   this.categories = res[0].data.allModules;
        //   this.phases = res[0].data.allPermits;

        //   this.permitStages = res[0].data.permitStages;
        // }

        if (res[0].success) this.facilityTypeDocs = res[0].data;

        if (res[1].success) this.docs = res[1].data;

        if (res[2].success) this.vesselTypes = res[2].data;

        if (res[3].success) this.applicationTypes = res[3].data;

        // if (res[3].success) this.appTypes = res[3].data.data;

        // this.progressBarService.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open('Something went wrong while retrieve data!', null, {
          panelClass: ['error'],
        });

        // this.progressBarService.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  onAddData(event: Event, type: string) {
    const operationsConfiguration = {
      permitStageDocument: {
        data: {
          // categories: this.categories,
          // phases: this.phases,
          // permitStages: this.permitStages,
          docs: this.docs,
          appType: this.appTypes,
          facilityTypes: this.facilityTypes,
          applicationTypes: this.applicationTypes,
          vesselTypes: this.vesselTypes,
        },
        form: PermitStageDocFormComponent,
      },
    };

    const dialogRef = this.dialog.open(operationsConfiguration[type].form, {
      data: {
        data: operationsConfiguration[type].data,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.progressBarService.open();

      this.getAppDocInfo();
    });
  }

  onDeleteData(event: any, type: string) {
    debugger;
    this.spinner.open();
    this.appDocService.deleteFacilityTypeDoc(event.id).subscribe({
      next: (res) => {
        this.snackBar.open('Deletion was successfull.', null, {
          panelClass: ['success'],
        });
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open('Deletion failed.', null, {
          panelClass: ['error'],
        });
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
    // const typeToModelMapper = {
    //   permitStageDocument: {
    //     name: 'PermitStageDocument',
    //     id: 'id',
    //   },
    // };
    // const listOfDataToDelete = [...event];
    // const requests = (listOfDataToDelete as any[]).map((req) => {
    //   if (type === 'permitStageDocument')
    //     return this.appDocService.deleteFacilityTypeDoc(
    //       req[typeToModelMapper[type].id]
    //     );
    //   else
    //     return this.appDocService.deleteFacilityTypeDoc(
    //       req[typeToModelMapper[type].id]
    //     );
    // });
    // this.progressBarService.open();
    // forkJoin(requests).subscribe({
    //   next: (res) => {
    //     if (res) {
    //       this.snackBar.open(
    //         `${typeToModelMapper.permitStageDocument.name} was deleted successfully.`,
    //         null,
    //         {
    //           panelClass: ['success'],
    //         }
    //       );
    //       const responses = res
    //         .map((r: any) => r.data)
    //         .sort((a, b) => a.length - b.length);
    //       if (type === 'permitStageDocument')
    //         this.permitStageDocuments = responses[0];
    //     }
    //     this.progressBarService.close();
    //   },
    //   error: (error) => {
    //     this.snackBar.open('Something went wrong while deleting data!', null, {
    //       panelClass: ['error'],
    //     });
    //     this.progressBarService.close();
    //   },
    // });
  }

  onEditData(event: Event, type: string) {}
}

export interface PermitStageDocument {
  id?: number;
  docId: number;
  docType: string;
  isMandatory: boolean;
  status: boolean;
  sortId: number;
  phaseStageId?: number;
  phaseStage?: string;
  appTypeId?: number;
  appType?: string;
}

export interface Doc {
  appType: string;
  docId: number;
  docType: string;
  facilityType: string;
  isFADDoc: boolean;
  name: string;
}

export interface IFacilityTypeDoc {}

export interface AppType {
  id: number;
  name: string;
}
