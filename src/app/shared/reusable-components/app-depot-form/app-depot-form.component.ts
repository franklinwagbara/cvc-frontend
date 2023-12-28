import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IDepot,
  IApplicationType,
  IState,
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
  public appDepots: IDepot[];
  public isSubmitted = false;
  public states: IState[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppDepotFormComponent>,
    private cd: ChangeDetectorRef,
    private popUp: PopupService,
    private locService: LocationService,
    private spinner: SpinnerService
  ) {
    this.states = data.data.states;
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
    });

    if (this.data.data.action === 'EDIT') this.getAppDepot();
  }

  get f() {
    return this.form.controls;
  }

  getAppDepot() {
    this.spinner.open();
    this.locService.getDepot(this.data.data.appDepotId).subscribe({
      next: (res) => {
        this.appDepots = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.popUp.open(e?.message ?? e?.Message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
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

interface DepotForm {
  name: FormControl<string>;
  stateId: FormControl<number>;
  capacity: FormControl<number>;
}
