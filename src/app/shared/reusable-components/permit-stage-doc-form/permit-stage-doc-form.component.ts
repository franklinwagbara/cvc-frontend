import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AppType,
  Doc,
  IFacilityTypeDoc,
} from '../../../../../src/app/admin/settings/app-stage-docs/app-stage-docs.component';
import {
  Category,
  PermitStage,
  Phase,
} from '../../../../../src/app/admin/settings/modules-setting/modules-setting.component';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import {
  IApplicationType,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import { AppException } from '../../exceptions/AppException';
import { AdminService } from '../../services/admin.service';
import { ProgressBarService } from '../../services/progress-bar.service';
import { AppStageDocumentService } from '../../services/app-stage-document.service';

@Component({
  selector: 'app-permit-stage-doc-form',
  templateUrl: './permit-stage-doc-form.component.html',
  styleUrls: ['./permit-stage-doc-form.component.css'],
})
export class PermitStageDocFormComponent implements OnInit {
  public form: FormGroup;
  public categories: Category[];
  public phases: Phase[];
  public permitStages: PermitStage[];
  public docs: Doc[];
  public appTypes: AppType[];
  public selectedDocs = [];
  public docsDropdownSettings: IDropdownSettings = {};
  // public facilityTypes: IFacilityType[];
  public applicationTypes: IApplicationType[];
  public vesselTypes: IVesselType[];
  public facilityTypeDoc: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PermitStageDocFormComponent>,
    private snackBar: MatSnackBar,
    private appDocService: AppStageDocumentService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService
  ) {
    this.categories = data.data.categories;
    this.permitStages = data.data.permitStages;
    this.phases = data.data.phases;
    // this.facilityTypes = data.data.facilityTypes;
    this.vesselTypes = data.data.vesselTypes;
    this.applicationTypes = data.data.applicationTypes;

    this.docs = data.data.docs;
    this.appTypes = data.data.appTypes || [
      { id: 1, name: 'New' },
      { id: 2, name: 'Renew' },
    ];

    this.form = this.formBuilder.group({
      vesselTypeId: ['', Validators.required],
      applicationTypeId: ['', Validators.required],
      documentTypeId: formBuilder.array([], Validators.required),
      isMandatory: [false, Validators.required],
      status: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.docsDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    if (this.data?.data?.action === 'EDIT') {
      console.log(this.data.data);
      this.facilityTypeDoc = this.data.data.facilityTypeDoc;
      this.form.get('vesselTypeId').setValue(this.facilityTypeDoc.vesselType);
      this.form.get('applicationTypeId').setValue(this.facilityTypeDoc.appType);
      this.form.get('applicationTypeId').setValue(this.facilityTypeDoc.appType);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  createPermitStageDoc() {
    this.progressBar.open();

    this.appDocService.addDoc(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open(
            'Permit Stage document was created successfull!',
            null,
            {
              panelClass: ['success'],
            }
          );

          this.dialogRef.close();
        }

        this.progressBar.close();
      },
      error: (error: AppException) => {
        this.snackBar.open(error.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
      },
    });
  }

  editPermitStageDoc() {
    this.progressBar.open();

    this.appDocService.addDoc(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open(
            'Permit Stage document was created successfull!',
            null,
            {
              panelClass: ['success'],
            }
          );

          this.dialogRef.close();
        }

        this.progressBar.close();
      },
      error: (error: AppException) => {
        this.snackBar.open(error.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
      },
    });
  }

  onItemSelect(event: ListItem | any) {
    (this.form.get('documentTypeId') as FormArray).push(
      new FormControl(event.id)
    );
  }

  onSelectAll(event: (ListItem | any)[]) {
    event.forEach((item) => {
      (this.form.get('documentTypeId') as FormArray).push(
        new FormControl(item.id)
      );
    });
  }

  onDeSelect(event: ListItem | any) {
    const targetIndex = (
      (this.form.get('documentTypeId') as FormArray).value as Array<number>
    ).indexOf(event.id as number);
    (this.form.get('documentTypeId') as FormArray).removeAt(targetIndex);
  }
}

export interface IVesselType {
  id: number;
  name: string;
}
