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
import { ApplyService } from '../../services/apply.service';
import { ApplicationActionType } from '../../constants/applicationActions';
import { PopupService } from '../../services/popup.service';
import { CoqService } from '../../services/coq.service';
import { NoaApplicationPreviewComponent } from '../noa-application-preview/noa-application-preview.component';
import { CoqApplicationPreviewComponent } from 'src/app/admin/coq-application-form/coq-application-preview/coq-application-preview.component';
import { CoQData } from 'src/app/admin/coq-application-form/coq-application-form.component';

@Component({
  selector: 'app-approve-form',
  templateUrl: './approve-form.component.html',
  styleUrls: ['./approve-form.component.css'],
})
export class ApproveFormComponent implements OnInit {
  public form: FormGroup;
  public application: any;
  public currentUser: Staff;
  public isFO: boolean;
  public isFAD: boolean;
  public isApprover: boolean;
  public isCOQProcessor: boolean;
  public tankData: CoQData[];
  public vesselData: any;
  public documents: any[];
  public coqId: number;
  public isLoading = false;

  public isPPCOQ = false;

  constructor(
    public dialogRef: MatDialogRef<ApproveFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private appService: ApplyService,
    private progressBarService: ProgressBarService,
    private auth: AuthenticationService,
    private popup: PopupService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private coqService: CoqService,
    private dialog: MatDialog
  ) {
    this.isFAD = auth.isFAD;
    this.isApprover = auth.isApprover;
    this.application = data.data?.application;
    this.tankData = data.data?.tankData;
    this.documents = data.data?.documents;
    this.vesselData = data.data?.vesselDischargeData;
    this.isFO = data.data.isFO;
    this.coqId = data.data.coqId;
    this.isCOQProcessor = auth.isCOQProcessor;
    this.isPPCOQ = data.data.isPPCOQ;
  }

  ngOnInit(): void {
    if (!this.isApprover && !this.isCOQProcessor)
      this.form = this.formBuilder.group({
        comment: ['', Validators.required],
      });
    else
      this.form = this.formBuilder.group({
        comment: [''],
      });

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
        this.popup.open('Failed to fetch user information!', 'error');
        this.progressBarService.close();
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  public approve() {
    if (this.isCOQProcessor || this.isPPCOQ) this.approveCOQ();
    else this.approveNOA();
  }

  private approveNOA() {
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
          const fadPredicate = this.isFAD
            ? 'Application accepted successfully'
            : 'Application passed successfully!'
          this.popup.open(
            this.isApprover
              ? 'Application approved successfully!'
              : fadPredicate,
            'success'
          );
          this.dialogRef.close();
        }
        this.progressBarService.close();
        this.isLoading = false;
        this.router.navigate(['/admin/desk']);
        this.cd.markForCheck();
      },

      error: (error: any) => {
        console.error(error);
        this.popup.open('Failed to process application', 'error');

        this.progressBarService.close();
        this.isLoading = false;
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
          documents: this.documents,
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

  private approveCOQ() {
    this.progressBarService.open();
    this.isLoading = true;
    const model = {
      applicationId: this.coqId,
      action: ApplicationActionType.Approve,
      comment: this.form.controls['comment'].value,
    };

    this.coqService.processApplication(model, this.isPPCOQ).subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.open(
            this.isFAD
              ? 'Application approved successfully!'
              : 'Operation was successful!',
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
        this.popup.open('Failed to process application', 'error');
        this.isLoading = false;
        this.progressBarService.close();
        this.cd.markForCheck();
      },
    });
  }
}
