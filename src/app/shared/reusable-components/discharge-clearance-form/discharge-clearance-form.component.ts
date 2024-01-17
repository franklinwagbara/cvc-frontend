import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupService } from '../../services/popup.service';
import { DischargeClearanceService } from '../../services/discharge-clearance.service';

@Component({
  selector: 'app-discharge-clearance-form',
  templateUrl: './discharge-clearance-form.component.html',
  styleUrls: ['./discharge-clearance-form.component.css'],
})
export class DischargeClearanceFormComponent implements OnInit {
  noaApp: any;
  allowDischarge: boolean;
  public form: FormGroup;
  public roles: any;
  submitting = false;
  errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productTypes: any[], noaApp: any, allowDischarge: boolean },
    public dialogRef: MatDialogRef<DischargeClearanceFormComponent>,
    private popUp: PopupService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private dischargeClearance: DischargeClearanceService
  ) {
    this.noaApp = this.data.noaApp;
    this.allowDischarge = this.data.allowDischarge;
  }
  
  ngOnInit(): void {
    if (this.allowDischarge) {
      this.form = this.formBuilder.group({
        vesselName: [this.noaApp?.vesselName || '', Validators.required],
        vesselPort: [this.noaApp?.loadingPort || '', Validators.required],
        product: ['', Validators.required],
        density: ['', Validators.required],
        ron: ['', Validators.required],
        finalBoilingPoint: ['', Validators.required],
        flashPoint: ['', Validators.required],
        color: ['', Validators.required],
        odour: ['', Validators.required],
        oxygenate: ['', Validators.required],
        others: ['', Validators.required],
        comment: ['', Validators.required],
      });
      
      ['vesselName', 'vesselPort'].forEach((field) => {
        this.form.controls[field].disable();
      })
    } else {
      this.form = this.formBuilder.group({
        comment: ['', Validators.required],
      })
    }
  }

  submit() {
    this.submitting = true;
    const formData = { 
      ...this.form.getRawValue(),
      appId: this.noaApp.id, 
      dischargeId: this.noaApp?.dischargeId || 0,
      depotId: 0
    };

    if (this.allowDischarge) {
      this.dischargeClearance.createVesselDischargeClearance(formData).subscribe({
        next: (res: any) => {
          this.submitting = false;
          if (res?.success) {
            this.popUp.open('Form submitted successfully!', 'success');
            this.dialogRef.close({ submitted: true });
          } else {
            this.errorMessage = 'An error occurred: ' + res?.message;
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000)
          }
          this.cd.markForCheck();
        },
        error: (error: any) => {
          this.submitting = false;
          this.errorMessage = 'Something went wrong while submitting clearance';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000)
          console.log(error);
          this.cd.markForCheck();
        },
      });
    } else {
      setTimeout(() => {
        this.submitting = false;
        this.dialogRef.close({ submitted: true });
        this.popUp.open('A notification has been sent to Supervisor(s)', 'success');
      }, 3000)
    }
  }
}
