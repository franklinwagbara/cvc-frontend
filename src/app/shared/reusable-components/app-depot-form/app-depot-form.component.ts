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
  IDepot,
  IApplicationType,
} from 'src/app/company/apply/new-application/new-application.component';
import { ProgressBarService } from '../../services/progress-bar.service';
import { PopupService } from '../../services/popup.service';
import { AdminService } from '../../services/admin.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-app-depot-form',
  templateUrl: './app-depot-form.component.html',
  styleUrls: ['./app-depot-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDepotFormComponent implements OnInit {
  public form: FormGroup;
  public appDepots: IDepot;
  public applicationTypes: IApplicationType[];
  public isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppDepotFormComponent>,
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
      noaDepot: ['', [Validators.required]],
      coqDepot: ['', [Validators.required]],
      processingDepot: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if (this.data.data.action === 'EDIT') this.getAppDepot();
  }

  get f() {
    return this.form.controls;
  }

  getAppDepot() {
    this.adminService.getAppDepotById(this.data.data.appDepotId).subscribe({
      next: (res) => {
        this.appDepots = res.data;
        this.form.get('noaDepot').setValue(this.appDepots.noaDepot);
        this.form.get('coqDepot').setValue(this.appDepots.coqDepot);
        this.form
          .get('processingDepot')
          .setValue(this.appDepots.processingDepot);
        this.form.get('serciveCharge').setValue(this.appDepots.serciveCharge);
        this.form
          .get('applicationTypeId')
          .setValue(this.appDepots.applicationTypeId);
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

  createDepot() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();
    this.adminService.addAppDepots(this.form.value).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open(
          'Application depot was created successfully!',
          null,
          {
            panelClass: ['success'],
          }
        );
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

  EditDepot() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();

    let formData = this.form.value;
    formData.id = this.data.data.appDepotId;
    this.adminService.editAppDepots(formData).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open(
          'Application depot was modified successfully!',
          null,
          {
            panelClass: ['success'],
          }
        );
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
