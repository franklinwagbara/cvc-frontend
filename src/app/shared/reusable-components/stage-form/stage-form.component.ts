import {
  PermitStage,
  Phase,
} from 'src/app/admin/settings/modules-setting/modules-setting.component';

import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from '../../services/admin.service';
import { AppException } from '../../exceptions/AppException';
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-stage-form',
  templateUrl: './stage-form.component.html',
  styleUrls: ['./stage-form.component.css'],
})
export class StageFormComponent {
  public form: FormGroup;
  public phases: Phase[];
  public permitStage: PermitStage[];
  public currentValue: PermitStage;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StageFormComponent>,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService
  ) {
    this.phases = data.data.phases;
    this.permitStage = data.data.permitStages;
    this.currentValue = data.data?.currentValue;

    this.form = this.formBuilder.group({
      code: [
        this.currentValue ? this.currentValue.code : '',
        Validators.required,
      ],
      name: [
        this.currentValue ? this.currentValue.name : '',
        Validators.required,
      ],
      description: [
        this.currentValue ? this.currentValue.description : '',
        Validators.required,
      ],
      phaseId: [
        this.currentValue ? this.currentValue.phaseId : '',
        [Validators.required, Validators.pattern(/^\d+$/)],
      ], //Asyc validation
      fee: [
        this.currentValue ? this.currentValue.fee : '',
        Validators.required,
      ],
      serviceCharge: [
        this.currentValue ? this.currentValue.serviceCharge : '',
        Validators.required,
      ],
      sort: [
        this.currentValue ? this.currentValue.sort : '',
        Validators.required,
      ],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  createPermitStage() {
    this.progressBar.open();

    this.adminService.createPermitStage(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Permit stage was created successfully!', null, {
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

  editPermitStage() {
    this.progressBar.open();

    const formValue = this.form.value as any;
    formValue.id = this.currentValue.id;

    this.adminService.editPermitStage(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Permit Stage was created successfully!', null, {
            panelClass: ['success'],
          });

          this.dialogRef.close();
        }

        this.progressBar.close();
      },
      error: (error) => {
        this.snackBar.open(
          'Operation failed! Could not create the Permit Stage.',
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
