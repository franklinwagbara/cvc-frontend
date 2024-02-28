import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { Staff } from '../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services';
import { ProgressBarService } from '../../services/progress-bar.service';
import { IApplication } from '../../interfaces/IApplication';
import { ApplyService } from '../../services/apply.service';
import { ApplicationActionType } from '../../constants/applicationActions';
import { PopupService } from '../../services/popup.service';
import { CoqService } from '../../services/coq.service';
import { CoQData } from 'src/app/admin/coq-application-form/coq-application-form.component';
import { CoqApplicationPreviewComponent } from 'src/app/admin/coq-application-form/coq-application-preview/coq-application-preview.component';
import { NoaApplicationPreviewComponent } from '../noa-application-preview/noa-application-preview.component';

@Component({
  selector: 'app-send-back-form',
  templateUrl: './send-back-form.component.html',
  styleUrls: ['./send-back-form.component.css'],
})
export class SendBackFormComponent implements OnInit {
  public form: FormGroup;
  public application: any;
  public currentUser: Staff;
  public isLoading = false;
  public isCOQProcessor: boolean;
  public tankData: CoQData[];
  public vesselData: any;
  public documents: any[];
  public isPPCOQ: boolean;
  public coqId: number;

  constructor(
    public dialogRef: MatDialogRef<SendBackFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private appService: ApplyService,
    private coqService: CoqService,
    private progressBarService: ProgressBarService,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    private popUp: PopupService,
    private router: Router
  ) {
    this.application = data?.data?.application;
    this.isCOQProcessor = auth.isCOQProcessor;
    this.isPPCOQ = data.data.isPPCOQ;
    this.tankData = data.data?.tankData;
    this.documents = data.data?.documents;
    this.vesselData = data.data?.vesselDischargeData;
    this.coqId = data.data.coqId;

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
        console.error(error);
        this.popUp.open(
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

  public sendBack() {
    if (this.isCOQProcessor || this.isPPCOQ) this.sendBackCOQ();
    else this.sendBackNOA();
  }

  sendBackCOQ() {
    this.progressBarService.open();
    this.isLoading = true;
    const model = {
      applicationId: this.coqId,
      action: ApplicationActionType.Reject,
      comment: this.form.controls['comment'].value,
    };

    this.coqService.processApplication(model, this.isPPCOQ).subscribe({
      next: (res) => {
        if (res.success) {
          this.popUp.open(
            'Application rejected successfully!',
            'success'
          );
          this.dialogRef.close();
        }
        this.isLoading = false;
        this.progressBarService.close();
        this.router.navigate(['/admin/desk']);
        this.cd.markForCheck();
      },

      error: (error: unknown) => {
        console.error(error);
        this.isLoading = false;
        this.popUp.open('Failed to process application', 'error');
        this.progressBarService.close();
        this.cd.markForCheck();
      },
    });
  }

  preview(): void {
    if (this.isCOQProcessor) {
      this.dialog.open(CoqApplicationPreviewComponent, {
        data: {
          tankData: this.tankData,
          vesselDischargeData: this.vesselData,
          remark: this.form.controls['comment'].value,
          previewSource: 'submitted-coq-view',
          isGasProduct: this.application?.productType === 'Gas',
        },
      });
    } else {
      this.dialog.open(NoaApplicationPreviewComponent, {
        data: {
          application: this.application,
          remark: this.form.controls['comment'].value,
        },
        panelClass: 'applicaion-preview',
      });
    }
  }

  private sendBackNOA() {
    this.progressBarService.open();
    this.isLoading = true;
    const model = {
      applicationId: this.application.id,
      action: ApplicationActionType.Reject,
      comment: this.form.controls['comment'].value,
      // currentUserId: this.currentUser.id,
      // delegatedUserId: '',
    };

    this.appService.processApplication(model).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.popUp.open(
            'Application rejected successfully!',
            'success'
          );
          this.dialogRef.close();
        }
        this.progressBarService.close();
        this.router.navigate(['/admin/desk']);
        this.cd.markForCheck();
      },

      error: (error: any) => {
        console.error(error);
        this.popUp.open('Failed to reject application', 'error');

        this.progressBarService.close();
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }
}
