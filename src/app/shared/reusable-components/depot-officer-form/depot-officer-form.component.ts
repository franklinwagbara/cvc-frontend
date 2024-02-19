import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { PopupService } from '../../services/popup.service';
import { Staff } from '../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { DepotOfficerService } from '../../services/depot-officer/depot-officer.service';
import { IPlant } from '../../interfaces/IPlant';

@Component({
  selector: 'app-depot-officer-form',
  templateUrl: './depot-officer-form.component.html',
  styleUrls: ['./depot-officer-form.component.css'],
})
export class DepotOfficerFormComponent {
  public form: FormGroup;
  public depots: IPlant[];
  public staffList: Staff[];
  submitting = false;
  selectedData: any;
  editMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<DepotOfficerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private popUp: PopupService,
    private depotOfficer: DepotOfficerService
  ) {
    this.depots = data.data.depots;
    this.staffList = data.data.staffList;
    this.selectedData = data.data?.currentData;
    this.editMode = data.data?.editMode;
    this.staffList = this.staffList.filter(
      (s) => s.role.toLowerCase() == 'field_officer'
    );

    this.form = this.formBuilder.group({
      depotID: [
        { 
          value: this.selectedData?.depotID || '', 
          disabled: this.selectedData?.depotID 
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
    const staff = this.staffList.find((el) => el.id === this.form.value.userID);
    const model = {
      ...this.form.value,
      officerName: staff.firstName + ' ' + staff.lastName,
      depotName: this.depots.find((el) => el.id === this.form.value.depotID)?.name
    };
    this.depotOfficer.createMapping(model).subscribe({
      next: (res) => {
        this.submitting = false;
        this.popUp.open('Configuration was created successfully', 'success');
        this.dialogRef.close('submitted');
      },

      error: (error: unknown) => {
        console.log(error);
        this.submitting = false;
        this.popUp.open(
          'Operation failed! Could not create the Branch!',
          'error'
        );
      },
    });
  }

  editBranch() {
    this.submitting = true;
    const model = { ...this.selectedData, ...this.form.value };
    this.depotOfficer.editMapping(model).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.popUp.open("Configuration updated successfully", 'success')
        this.dialogRef.close('submitted');
      },
      error: (error: unknown) => {
        console.log(error);
        this.submitting = false;
        this.popUp.open("Failed to update configuration", 'error');
      }
    })
  }
}
