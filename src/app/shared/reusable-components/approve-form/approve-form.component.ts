import { Category } from 'src/app/admin/settings/modules-setting/modules-setting.component';

import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Staff } from 'src/app/admin/settings/all-staff/all-staff.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services';
import { ProgressBarService } from '../../services/progress-bar.service';
import { AdminService } from '../../services/admin.service';
import { IApplication } from '../../interfaces/IApplication';
import { ApplyService } from '../../services/apply.service';
import { ApplicationActionType } from '../../constants/applicationActions';
import { PopupService } from '../../services/popup.service';
import { CoqService } from '../../services/coq.service';

@Component({
  selector: 'app-approve-form',
  templateUrl: './approve-form.component.html',
  styleUrls: ['./approve-form.component.css'],
})
export class ApproveFormComponent implements OnInit {
  public form: FormGroup;
  public application: IApplication;
  public currentUser: Staff;
  public isFO: boolean;
  public coqId: number;

  constructor(
    public dialogRef: MatDialogRef<ApproveFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private appService: ApplyService,
    private progressBarService: ProgressBarService,
    private auth: AuthenticationService,
    private popup: PopupService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private coqService: CoqService
  ) {
    this.application = data.data.application;
    this.isFO = data.data.isFO;
    this.coqId = data.data.coqId;

    this.form = this.formBuilder.group({
      comment: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    const tempUser = this.auth.currentUser;

    this.auth.getAllStaff().subscribe({
      next: (res) => {
        this.currentUser = res.data.data.find(
          (u) => u.email === tempUser.userId
        );

        this.progressBarService.close();
      },

      error: (error: unknown) => {
        this.popup.open(
          'Operation failed! Could not user information!',
          'error'
        );
        this.progressBarService.close();
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  public approve() {
    debugger;
    if (this.isFO) this.approveFO();
    else this.approveOther();
  }

  private approveOther() {
    this.progressBarService.open();

    const model = {
      applicationId: this.application.id,
      action: ApplicationActionType.Approve,
      comment: this.form.controls['comment'].value,
      // currentUserId: this.currentUser.id,
      // delegatedUserId: '',
    };

    this.appService.processApplication(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.open('Operation was successfully!', 'success');
          this.dialogRef.close();
        }

        this.progressBarService.close();
        this.router.navigate(['/admin/my-desk']);
        this.cd.markForCheck();
      },

      error: (error: unknown) => {
        this.popup.open(
          'Operation failed! Could not user information!',
          'error'
        );

        this.progressBarService.close();
      },
    });
  }

  private approveFO() {
    this.progressBarService.open();

    const model = {
      applicationId: this.coqId,
      action: ApplicationActionType.Approve,
      comment: this.form.controls['comment'].value,
    };

    this.coqService.processApplication(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.open('Operation was successfully!', 'success');
          this.dialogRef.close();
        }

        this.progressBarService.close();
        this.router.navigate(['/admin/my-desk']);
        this.cd.markForCheck();
      },

      error: (error: unknown) => {
        this.popup.open(
          'Operation failed! Could not user information!',
          'error'
        );

        this.progressBarService.close();
      },
    });
  }
}
