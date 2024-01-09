import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { IApplication } from '../../interfaces/IApplication';
import { ApplyService } from '../../services/apply.service';
import { ApplicationActionType } from '../../constants/applicationActions';

@Component({
  selector: 'app-send-back-form',
  templateUrl: './send-back-form.component.html',
  styleUrls: ['./send-back-form.component.css'],
})
export class SendBackFormComponent implements OnInit {
  public form: FormGroup;
  public application: IApplication;
  public currentUser: Staff;

  constructor(
    public dialogRef: MatDialogRef<SendBackFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private appService: ApplyService,
    private progressBarService: ProgressBarService,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.application = data?.data?.application;

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
        this.snackBar.open(
          'Operation failed! Could not user information!',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.progressBarService.close();
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  sendBack() {
    this.progressBarService.open();

    const model = {
      applicationId: this.application.id,
      action: ApplicationActionType.Reject,
      comment: this.form.controls['comment'].value,
      // delegatedUserId: '',
      // currentUserId: this.currentUser.id,
    };

    this.appService.processApplication(model).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Operation was successfully!', null, {
            panelClass: ['success'],
          });

          this.dialogRef.close();
        }

        this.progressBarService.close();
        this.router.navigate(['/admin/my-desk']);
        this.cd.markForCheck();
      },

      error: (error: unknown) => {
        this.snackBar.open(
          'Operation failed! Could not perform operations!',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.progressBarService.close();
      },
    });
  }
}
