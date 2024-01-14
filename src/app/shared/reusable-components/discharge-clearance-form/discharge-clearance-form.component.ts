import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { PopupService } from '../../services/popup.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-discharge-clearance-form',
  templateUrl: './discharge-clearance-form.component.html',
  styleUrls: ['./discharge-clearance-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DischargeClearanceFormComponent implements OnInit {
  public form: FormGroup;
  public roles: any;
  submitting = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productTypes: any[] },
    public dialogRef: MatDialogRef<DischargeClearanceFormComponent>,
    private popUp: PopupService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.formBuilder.group({
      vesselName: ['', Validators.required],
      loadingPort: ['', Validators.required],
      product: ['', Validators.required],
      density: ['', Validators.required],
      ron: ['', Validators.required],
      finalBoilingPoint: ['', Validators.required],
      flashPoint: ['', Validators.required],
      colour: ['', Validators.required],
      odour: ['', Validators.required],
      oxygenate: ['', Validators.required],
      others: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  submit() {
    this.submitting = true;
    const formData = this.form.value;
    this.adminService.submitDischargeClearance(formData).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res?.success) {
          this.popUp.open('Form submitted successfully!', 'success');
          this.dialogRef.close({ submitted: true });
        } else {
          this.popUp.open('Discharge clearance submission failed', 'error');
        }
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.submitting = false;
        console.log(error);
        this.popUp.open('An error occurred while submitting the form.', 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }
}
