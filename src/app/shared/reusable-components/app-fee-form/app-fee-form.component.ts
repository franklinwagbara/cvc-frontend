import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IAppFee,
  IApplicationType,
} from 'src/app/company/apply/new-application/new-application.component';
import { ProgressBarService } from '../../services/progress-bar.service';
import { PopupService } from '../../services/popup.service';
import { AdminService } from '../../services/admin.service';
import { Chain } from '@angular/compiler';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-app-fee-form',
  templateUrl: './app-fee-form.component.html',
  styleUrls: ['./app-fee-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFeeFormComponent implements OnInit {
  public form: FormGroup;
  public appFees: IAppFee;
  public applicationTypes: IApplicationType[];
  public isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppFeeFormComponent>,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private popUp: PopupService,
    private adminService: AdminService,
    private spinner: SpinnerService
  ) {
    this.applicationTypes = data.data.applicationTypes;

    this.form = formBuilder.group({
      applicationTypeId: ['', [Validators.required]],
      serciveCharge: ['', [Validators.required]],
      noaFee: ['', [Validators.required]],
      coqFee: ['', [Validators.required]],
      processingFee: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if (this.data.data.action === 'EDIT') this.getAppFee();
  }

  get f() {
    return this.form.controls;
  }

  getAppFee() {
    this.adminService.getAppFeeById(this.data.data.appFeeId).subscribe({
      next: (res) => {
        this.appFees = res.data;
        this.form.get('noaFee').setValue(this.appFees.noaFee);
        this.form.get('coqFee').setValue(this.appFees.coqFee);
        this.form.get('processingFee').setValue(this.appFees.processingFee);
        this.form.get('serciveCharge').setValue(this.appFees.serciveCharge);
        this.form
          .get('applicationTypeId')
          .setValue(this.appFees.applicationTypeId);
        this.cd.markForCheck();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
      },
    });
  }

  createFee() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();
    this.adminService.addAppFees(this.form.value).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open('Application fee was created successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
      },
    });
  }

  EditFee() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();

    let formData = this.form.value;
    formData.id = this.data.data.appFeeId;
    this.adminService.editAppFees(formData).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open('Application fee was modified successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
      },
      error: (err) => {
        this.progressBar.close();
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
      },
    });
  }

  onClose() {}
}
