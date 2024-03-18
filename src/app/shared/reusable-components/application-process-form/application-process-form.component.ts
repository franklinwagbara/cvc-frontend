import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { PermitStage } from '../../../../../src/app/admin/settings/modules-setting/modules-setting.component';
import {
  IApplicationType,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import { IAction } from '../../interfaces/IAction';
import { IApplicationProcess } from '../../interfaces/IApplicationProcess';
import { IBranch } from '../../interfaces/IBranch';
import { IRole } from '../../interfaces/IRole';
import { IStatus } from '../../interfaces/IStatus';
import { ProgressBarService } from '../../services/progress-bar.service';
import { PermitStageDocFormComponent } from '../permit-stage-doc-form/permit-stage-doc-form.component';
import { ApplicationProcessesService } from '../../services/application-processes.service';
import { LibaryService } from '../../services/libary.service';
import { PopupService } from '../../services/popup.service';
import { ILocation } from '../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { IFacilityType } from '../../interfaces/IFacility';
import { IVessel } from '../../interfaces/IVessel';

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
  public locations: ILocation[];
  public rates: string[] = RATES;
  public facilityTypes: IFacilityType[];
  public applicationTypes: IApplicationType[];
  public vesselTypes: IVessel[];
  public editMode: boolean = false;
  public loading = false;
  public directorates: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PermitStageDocFormComponent>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private processFlow: ApplicationProcessesService,
    private libService: LibaryService,
    private popUp: PopupService
  ) {
    this.editMode = data.data?.editMode;
    this.permitStages = data.data.permitStages;
    this.branches = data.data.branches;
    this.roles = data.data.roles;
    this.actions = data.data.actions;
    this.statuses = data.data.statuses;
    this.applicationProccess = data.data?.applicationProcess;
    this.facilityTypes = data.data?.facilityTypes;
    this.applicationTypes = data.data?.applicationTypes;
    this.locations = data.data?.locations;
    this.directorates = data.data?.directorates;

    this.form = this.formBuilder.group({
      vesselTypeId: [
        this.applicationProccess
          ? this.applicationProccess.vesselTypeId
          : '',
        Validators.required,
      ],
      applicationTypeId: [
        this.applicationProccess
          ? this.applicationProccess.applicationTypeId
          : '',
        Validators.required,
      ],
      triggeredByRoleId: [
        this.applicationProccess
          ? this.applicationProccess.triggeredByRoleId
          : '',
        Validators.required,
      ],
      action: [
        this.applicationProccess ? this.applicationProccess.action : '',
        Validators.required,
      ],
      targetRoleId: [
        this.applicationProccess
          ? this.applicationProccess.targetRoleId
          : '',
        Validators.required,
      ],
      fromLocationId: [
        this.applicationProccess
          ? this.applicationProccess.fromLocationId
          : '',
        Validators.required,
      ],
      toLocationId: [
        this.applicationProccess
          ? this.applicationProccess.toLocationId
          : '',
        Validators.required,
      ],
      toDirectorate: [
        this.applicationProccess
          ? this.applicationProccess.toDirectorate
          : ''
      ],
      fromDirectorate: [
        this.applicationProccess 
          ? this.applicationProccess.fromDirectorate 
          : ''
      ],
      status: [
        this.applicationProccess ? this.applicationProccess.status : '',
        Validators.required,
      ],
      rate: [
        this.applicationProccess ? this.applicationProccess.rate : '',
        Validators.required,
      ],
      isArchived: [
        this.applicationProccess ? this.applicationProccess.isArchived : '',
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
      error: (err: any) => {
        this.progressBar.close();
        this.popUp.open(err?.message, 'error');
      },
    });
  }

  createProcessFlow() {
    this.loading = true;
    this.progressBar.open();

    this.processFlow.createApplicationProcess(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.popUp.open(
            'Application Process was created successfully!', 
            'success'
          );
          this.dialogRef.close('submitted');
        }

        this.progressBar.close();
      },
      error: (error: any) => {
        this.loading = false;
        this.popUp.open(error?.message, 'error');
        this.progressBar.close();
      },
    });
  }

  editProcessFlow() {
    this.loading = true;
    this.progressBar.open();
    const payload = { id: this.applicationProccess.id, ...this.form.value };
    this.processFlow.editApplicationProcess(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.popUp.open('Application process updated successfully', 'success');
          this.dialogRef.close('submitted');
        }
        this.progressBar.close();
      },
      error: (error: any) => {
        this.loading = false;
        this.popUp.open(error?.message, 'error');
        this.progressBar.close();
      },
    });
  }
}
