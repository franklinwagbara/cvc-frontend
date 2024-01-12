import { Category } from '../../../../../src/app/admin/settings/modules-setting/modules-setting.component';

import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Staff } from '../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services';
import { ProgressBarService } from '../../services/progress-bar.service';
import { AdminService } from '../../services/admin.service';
import { IApplication } from '../../interfaces/IApplication';
import { ApplyService } from '../../services/apply.service';
import { ApplicationActionType } from '../../constants/applicationActions';
import { PopupService } from '../../services/popup.service';
import { CoqService } from '../../services/coq.service';
import { LoginModel } from '../../models/login-model';
import { UserRole } from '../../constants/userRole';

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
  public isCOQProcessor: boolean;
  public coqId: number;
  public isLoading = false;

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
    this.isCOQProcessor = data.data.isCOQProcessor;

    this.form = this.formBuilder.group({
      comment: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    const tempUser = this.auth.currentUser;
    this.auth.getAllStaff().subscribe({
      next: (res) => {
        this.currentUser = res.data.data?.find(
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

  public get isApprover() {
    const currentUser = this.auth.currentUser as LoginModel;
    return (currentUser as any).userRoles === UserRole.APPROVER;
  }

  public get isFAD() {
    const currentUser = this.auth.currentUser as LoginModel;
    return (currentUser as any).userRoles === UserRole.FAD;
  }

  public approve() {
    // if (this.isFO) this.approveFO();
    // else this.approveOther();
    if (this.isCOQProcessor) this.approveFO();
    else this.approveOther();
  }

  private approveOther() {
    this.progressBarService.open();
    this.isLoading = true;
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
          this.popup.open(
            this.isApprover || this.isFAD
              ? 'Application approved successfully!'
              : 'Operation was successful!',
            'success'
          );
          this.dialogRef.close();
        }
        this.progressBarService.close();
        this.isLoading = false;
        this.router.navigate(['/admin/my-desk']);
        this.cd.markForCheck();
      },

      error: (error: unknown) => {
        this.popup.open(
          'Operation failed! Could not user information!',
          'error'
        );

        this.progressBarService.close();
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }

  private approveFO() {
    this.progressBarService.open();
    this.isLoading = true;
    const model = {
      applicationId: this.coqId,
      action: ApplicationActionType.Approve,
      comment: this.form.controls['comment'].value,
    };

    this.coqService.processApplication(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.open('Operation was successful!', 'success');
          this.dialogRef.close();
        }
        this.isLoading = false;
        this.progressBarService.close();
        this.router.navigate(['/admin/my-desk']);
        this.cd.markForCheck();
      },

      error: (error: unknown) => {
        this.popup.open(
          'Operation failed! Could not user information!',
          'error'
        );
        this.isLoading = false;
        this.progressBarService.close();
        this.cd.markForCheck();
      },
    });
  }
}
