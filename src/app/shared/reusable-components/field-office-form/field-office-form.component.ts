import { State } from 'src/app/admin/settings/field-zonal-office/field-zonal-office.component';

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { AppException } from '../../exceptions/AppException';
import { AdminService } from '../../services/admin.service';
import { SpinnerService } from '../../services/spinner.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-field-office-form',
  templateUrl: './field-office-form.component.html',
  styleUrls: ['./field-office-form.component.css'],
})
export class FieldOfficeFormComponent {
  public form: FormGroup;
  public stateList: State[];
  public offices: string[] = ['HQ', 'ZO', 'FO'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FieldOfficeFormComponent>,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private spinner: SpinnerService,
    private popup: PopupService
  ) {
    this.stateList = data.data.stateList;

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      // stateName: ['', Validators.required], // shouldn't be
      stateId: ['', Validators.required],
      address: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  createOffice() {
    this.spinner.open();
    this.adminService.createOffice(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.open('Phase was created successfully!', 'success');
          this.dialogRef.close();
        }

        this.spinner.close();
      },
      error: (error: AppException) => {
        this.popup.open(error.message, 'error');
        this.spinner.close();
      },
    });
  }
}
