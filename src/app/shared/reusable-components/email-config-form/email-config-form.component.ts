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

import { ProgressBarService } from '../../services/progress-bar.service';
import { PopupService } from '../../services/popup.service';
import { AdminService } from '../../services/admin.service';
import { SpinnerService } from '../../services/spinner.service';
import { IEmailList } from 'src/app/admin/settings/email-config/email-config.component';

@Component({
  selector: 'app-email-config-form',
  templateUrl: './email-config-form.component.html',
  styleUrls: ['./email-config-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfigFormComponent implements OnInit {
  public form: FormGroup;
  public emailList: IEmailList;
  public isSubmitted = false;
  public isLoading = false;

  public emailStatus = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EmailConfigFormComponent>,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private popUp: PopupService,
    private adminService: AdminService,
    private spinner: SpinnerService
  ) {
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      isActive: [''],
    });
  }
  ngOnInit(): void {
    if (this.data.data?.action === 'EDIT') {
      console.log(this.data.data);
      this.emailList = this.data.data.emailList;
      this.form.get('name').setValue(this.emailList.name);
      this.form.get('email').setValue(this.emailList.email);
      this.form.get('isActive').setValue(this.emailList.isActive);
    }
  }

  get f() {
    return this.form.controls;
  }

  // getAppFee() {
  //   this.adminService.getAppFeeById(this.data.data.appFeeId).subscribe({
  //     next: (res) => {
  //       this.appFees = res.data;
  //       this.form.get('noaFee').setValue(this.appFees.noaFee);
  //       this.form.get('coqFee').setValue(this.appFees.coqFee);
  //       this.form.get('processingFee').setValue(this.appFees.processingFee);
  //       this.form.get('serciveCharge').setValue(this.appFees.serciveCharge);
  //       this.form
  //         .get('applicationTypeId')
  //         .setValue(this.appFees.applicationTypeId);
  //       this.cd.markForCheck();
  //     },
  //     error: (err) => {
  //       this.snackBar.open(err?.message, null, {
  //         panelClass: ['error'],
  //       });
  //       this.progressBar.close();
  //     },
  //   });
  // }

  addEmail() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();
    this.isLoading = true;
    const formData = this.form.value;
    formData.isActive = true;
    this.adminService.addEmail(formData).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.isLoading = false;
        this.snackBar.open('Email record added successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }

  editEmail() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();
    this.isLoading = true;
    const formData = this.form.value;
    formData.id = this.data?.data?.emailList?.id;
    this.adminService.editEmail(formData).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.isLoading = false;
        this.snackBar.open('Email record modified successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        this.progressBar.close();
        this.isLoading = false;
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.cd.markForCheck();
      },
    });
  }
}
