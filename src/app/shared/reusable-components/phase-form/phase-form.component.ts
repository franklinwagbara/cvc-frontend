import {
  Category,
  Phase,
} from '../../../../../src/app/admin/settings/modules-setting/modules-setting.component';

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppException } from '../../exceptions/AppException';
import { AdminService } from '../../services/admin.service';
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-phase-form',
  templateUrl: './phase-form.component.html',
  styleUrls: ['./phase-form.component.css'],
})
export class PhaseFormComponent {
  public form: FormGroup;
  public categories: Category[];
  public phases: Phase[];
  public currentValue: Phase | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PhaseFormComponent>,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService
  ) {
    this.categories = data.data.categories;
    this.phases = data.data.phases;
    this.currentValue = data.data?.currentValue;

    this.form = this.formBuilder.group({
      id: [this.currentValue ? this.currentValue.id : 0],
      ShortName: [
        this.currentValue ? this.currentValue.shortName : '',
        Validators.required,
      ],
      Code: [
        this.currentValue ? this.currentValue.code : '',
        Validators.required,
      ],
      Description: [
        this.currentValue ? this.currentValue.description : '',
        Validators.required,
      ],
      CategoryId: [
        this.currentValue ? this.currentValue.categoryId : '',
        [Validators.required, Validators.pattern(/^\d+$/)],
      ], //Asyc validation
      Sort: [
        this.currentValue ? this.currentValue.sort : '',
        Validators.required,
      ],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  createPhase() {
    this.progressBar.open();
    this.adminService.createPhase(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Phase was created successfully!', null, {
            panelClass: ['success'],
          });
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

  editPhase() {
    this.progressBar.open();

    this.adminService.editPhase(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Phase was updated successfully!', null, {
            panelClass: ['success'],
          });

          this.dialogRef.close();
        }

        this.progressBar.close();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not update the Phase',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.progressBar.close();
      },
    });
  }
}
