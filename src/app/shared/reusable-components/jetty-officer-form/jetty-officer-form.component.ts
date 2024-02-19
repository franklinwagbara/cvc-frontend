import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
  editMode: boolean;
  submitting = false;
  selectedData: any;

  constructor(
    public dialogRef: MatDialogRef<JettyOfficerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private popUp: PopupService,
    private jettyOfficer: JettyOfficerService
  ) {
    this.editMode = data.data?.editMode;
    this.jettys = data.data.jettys;
    this.staffList = data.data.staffList;
    this.selectedData = data?.data?.currentData;
    this.staffList = this.staffList.filter(
      (s) => s.role.toLowerCase() == 'field_officer'
    );

    this.form = this.formBuilder.group({
      jettyID: [
        { 
          value: this.selectedData?.jettyID || '', 
          disabled: this.selectedData?.jettyID 
        }, 
        Validators.required
      ],
      userID: [this.selectedData?.userID || '', Validators.required],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  createBranch() {
    this.submitting = true;
    console.log('STAFF LIST ==========> ', this.staffList);
    const staff = (this.staffList as any[]).find((el) => el.id === this.form.value.userID);
    const model = {
      ...this.form.value,
      officerName: staff.firstName + ' ' + staff.lastName,
      jettyName: this.jettys.find((el) => el.id === this.form.value.jettyID)?.name
    };
    this.jettyOfficer.createMapping(model).subscribe({
      next: (res) => {
        this.submitting = false;
        this.popUp.open('Configuration was created successfully!', 'success');
        this.dialogRef.close('submitted');
      },

      error: (error: unknown) => {
        console.log(error);
        this.submitting = false;
        this.popUp.open(
          'Could not create the Branch!',
          'error'
        );
      },
    });
  }

  editBranch() {
    this.submitting = true;
    const model = { ...this.selectedData, ...this.form.value };
    this.jettyOfficer.editMapping(model?.jettyFieldOfficerID, model).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.popUp.open('Configuration was updated successfully!', 'success');
        this.dialogRef.close('submitted');
      },
      error: (error: unknown) => {
        console.error(error);
        this.submitting = false;
        this.popUp.open(
          'Could not update the Branch!',
          'error'
        );
      }
    })
  }
}
