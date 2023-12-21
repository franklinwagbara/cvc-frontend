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
import { PopupService } from '../../services/popup.service';
import { SpinnerService } from '../../services/spinner.service';
import { LocationService } from '../../services/location/location.service';

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
    private popUp: PopupService,
    private locService: LocationService,
    private spinner: SpinnerService
  ) {
    this.form = formBuilder.group({
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
    this.locService.getDepot(this.data.data.appDepotId).subscribe({
      next: (res) => {
        this.appDepots = res.data;
        // this.form.get('noaDepot').setValue(this.appDepots.noaDepot);
        // this.form.get('coqDepot').setValue(this.appDepots.coqDepot);
        this.cd.markForCheck();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.spinner.close();
      },
    });
  }

  createDepot() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.spinner.open();
    this.locService.createDepot(this.form.value).subscribe({
      next: (res) => {
        this.spinner.close();
        this.popUp.open(
          'Application depot was created successfully!',
          'success'
        );
        this.dialogRef.close();
      },
      error: (err) => {
        this.popUp.open(err?.message, 'error');
        this.spinner.close();
      },
    });
  }

  EditDepot() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.spinner.open();

    let formData = this.form.value;
    formData.id = this.data.data.appDepotId;
    this.locService.editDepot(formData).subscribe({
      next: (res) => {
        this.spinner.close();
        this.popUp.open(
          'Application depot was modified successfully!',
          'success'
        );
        this.dialogRef.close();
      },
      error: (err) => {
        this.spinner.close();
        this.popUp.open(err?.message, 'error');
      },
    });
  }

  onClose() {}
}
