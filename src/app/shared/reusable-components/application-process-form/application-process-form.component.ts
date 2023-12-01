import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermitStage } from 'src/app/admin/settings/modules-setting/modules-setting.component';
import {
  IApplicationType,
  IFacilityType,
  IVessel,
} from 'src/app/company/apply/new-application/new-application.component';
import { AppException } from '../../exceptions/AppException';
import { IAction } from '../../interfaces/IAction';
import { IApplicationProcess } from '../../interfaces/IApplicationProcess';
import { IBranch } from '../../interfaces/IBranch';
import { IRole } from '../../interfaces/IRole';
import { IStatus } from '../../interfaces/IStatus';
import { AdminService } from '../../services/admin.service';
import { ProgressBarService } from '../../services/progress-bar.service';
import { PermitStageDocFormComponent } from '../permit-stage-doc-form/permit-stage-doc-form.component';
import { ApplicationProcessesService } from '../../services/application-processes.service';
import { LibaryService } from '../../services/libary.service';
import { PopupService } from '../../services/popup.service';

const RATES = [
  '0%',
  '5%',
  '10%',
  '15%',
  '20%',
  '25%',
  '30%',
  '35%',
  '40%',
  '45%',
  '50%',
  '55%',
  '60%',
  '65%',
  '70%',
  '75%',
  '80%',
  '85%',
  '90%',
  '95%',
  '100%',
];

@Component({
  selector: 'app-application-process-form',
  templateUrl: './application-process-form.component.html',
  styleUrls: ['./application-process-form.component.css'],
})
export class ApplicationProcessFormComponent implements OnInit {
  public form: FormGroup;
  public applicationProccess: IApplicationProcess;
  public permitStages: PermitStage[];
  public branches: IBranch[];
  public office: string[] = ['HQ', 'ZO', 'FO'];
  public roles: IRole[];
  public actions: IAction[];
  public statuses: IStatus[];
  public rates: string[] = RATES;
  public facilityTypes: IFacilityType[];
  public applicationTypes: IApplicationType[];
  public vesselTypes: IVessel[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PermitStageDocFormComponent>,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private processFlow: ApplicationProcessesService,
    private libService: LibaryService,
    private popUp: PopupService
  ) {
    this.permitStages = data.data.permitStages;
    this.branches = data.data.branches;
    this.roles = data.data.roles;
    this.actions = data.data.actions;
    this.statuses = data.data.statuses;
    this.applicationProccess = data.data?.applicationProcess;
    this.facilityTypes = data.data?.facilityTypes;
    this.applicationTypes = data.data?.applicationTypes;

    this.form = this.formBuilder.group({
      // permitStageId: [
      //   this.applicationProccess
      //     ? this.applicationProccess.permitStageId
      //     : 'none',
      //   Validators.required,
      // ],
      // branchId: [
      //   this.applicationProccess ? this.applicationProccess.branchId : 'none',
      //   Validators.required,
      // ],
      // facilityTypeId: [
      //   this.applicationProccess
      //     ? this.applicationProccess.facilityTypeId
      //     : 'none',
      //   Validators.required,
      // ],
      vesselTypeId: [
        this.applicationProccess
          ? this.applicationProccess.vesselTypeId
          : 'none',
        Validators.required,
      ],
      applicationTypeId: [
        this.applicationProccess
          ? this.applicationProccess.applicationTypeId
          : 'none',
        Validators.required,
      ],
      triggeredByRole: [
        this.applicationProccess
          ? this.applicationProccess.triggeredByRole
          : 'none',
        Validators.required,
      ],
      action: [
        this.applicationProccess ? this.applicationProccess.action : 'none',
        Validators.required,
      ],
      targetRole: [
        this.applicationProccess ? this.applicationProccess.targetRole : 'none',
        Validators.required,
      ],
      fromLocation: [
        this.applicationProccess
          ? this.applicationProccess.fromLocation
          : 'none',
        Validators.required,
      ],
      toLocation: [
        this.applicationProccess ? this.applicationProccess.toLocation : 'none',
        Validators.required,
      ],
      status: [
        this.applicationProccess ? this.applicationProccess.status : 'none',
        Validators.required,
      ],
      rate: [
        this.applicationProccess ? this.applicationProccess.rate : 'none',
        Validators.required,
      ],
      isArchived: [
        this.applicationProccess ? this.applicationProccess.isArchived : 'none',
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {
    this.getVesselTypes();
  }

  onClose() {
    this.dialogRef.close();
  }

  public getVesselTypes() {
    this.progressBar.open();
    this.libService.getVesselTypes().subscribe({
      next: (res) => {
        this.vesselTypes = res.data;
        this.progressBar.close();
      },
      error: (err: unknown) => {
        this.progressBar.close();
        this.popUp.open(err.message, 'error');
      },
    });
  }

  createProcessFlow() {
    this.progressBar.open();

    this.processFlow.createApplicationProcess(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open(
            'Application Process was created successfully!',
            null,
            {
              panelClass: ['success'],
            }
          );

          this.dialogRef.close();
        }

        this.progressBar.close();
      },
      error: (error: AppException) => {
        this.snackBar.open(error.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
      },
    });
  }

  get;
}
