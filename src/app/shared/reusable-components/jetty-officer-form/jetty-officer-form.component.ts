import { Category } from '../../../admin/settings/modules-setting/modules-setting.component';

import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { SpinnerService } from '../../services/spinner.service';
import { PopupService } from '../../services/popup.service';
import { Staff } from '../../../admin/settings/all-staff/all-staff.component';
import { IPlant } from '../../interfaces/IPlant';
import { JettyOfficerService } from '../../services/jetty-officer/jetty-officer.service';

@Component({
  selector: 'app-jetty-officer-form',
  templateUrl: './jetty-officer-form.component.html',
  styleUrls: ['./jetty-officer-form.component.css'],
})
export class JettyOfficerFormComponent {
  public form: FormGroup;
  public jettys: IPlant[];
  public staffList: Staff[];

  constructor(
    public dialogRef: MatDialogRef<JettyOfficerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminHttpService: AdminService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private popUp: PopupService,
    private jettyOfficer: JettyOfficerService
  ) {
    this.jettys = data.data.jettys;
    this.staffList = data.data.staffList;

    this.staffList = this.staffList.filter(
      (s) => s.role.toLowerCase() == 'field_officer'.toLowerCase()
    );

    this.form = this.formBuilder.group({
      jettyID: ['', Validators.required],
      userID: ['', Validators.required],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  createBranch() {
    this.onClose();
    this.spinner.open();

    this.jettyOfficer.createMapping(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.popUp.open('Configuration was created successfully!', 'success');
          this.dialogRef.close();
        }
        this.spinner.close();
        setTimeout(() => {
          window.location.reload();
        }, 2500)
      },

      error: (error: unknown) => {
        this.popUp.open(
          'Operation failed! Could not create the Branch!',
          'error'
        );

        this.spinner.close();
      },
    });
  }
}
