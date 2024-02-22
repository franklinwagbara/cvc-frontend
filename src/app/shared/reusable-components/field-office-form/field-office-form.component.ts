import { State } from '../../../../../src/app/admin/settings/field-zonal-office/field-zonal-office.component';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldOfficeFormComponent implements OnInit {
  public form: FormGroup;
  public stateList: State[];
  public location: string[] = ['HQ', 'ZO', 'FO'];
  public office: any;
  editMode: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FieldOfficeFormComponent>,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private spinner: SpinnerService,
    private popup: PopupService,
    private cd: ChangeDetectorRef
  ) {
    this.stateList = data.data.stateList;
    this.office = data?.data?.office;
    this.editMode = data?.editMode;

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      stateId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data.data.action === 'EDIT') {
      this.form.get('name').setValue(this.office?.name);
      this.form.get('stateId').setValue(this.office?.stateId);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  createOffice() {
    this.spinner.open();
    this.adminService.createOffice(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.open('Office created successfully!', 'success');
          this.dialogRef.close('submitted');
        }

        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popup.open(error.message, 'error');
        this.spinner.close();
      },
    });
  }

  editOffice() {
    this.spinner.open();
    const formData = this.form.value;
    formData.id = this.office.id;
    this.adminService.editOffice(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.open('Office modified successfully!', 'success');
          this.dialogRef.close('submitted');
        }

        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popup.open(error.message, 'error');
        this.spinner.close();
      },
    });
  }
}
