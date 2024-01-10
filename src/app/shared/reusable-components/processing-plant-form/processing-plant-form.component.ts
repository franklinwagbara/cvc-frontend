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
  IAppFee,
  IApplicationType,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import { ProgressBarService } from '../../services/progress-bar.service';
import { PopupService } from '../../services/popup.service';
import { AdminService } from '../../services/admin.service';
import { Chain } from '@angular/compiler';
import { SpinnerService } from '../../services/spinner.service';
import {
  IPlant,
  IPlantType,
} from '../../../../../src/app/company/settings/processing-plant/processing-plant.component';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-processing-plant-form',
  templateUrl: './processing-plant-form.component.html',
  styleUrls: ['./processing-plant-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessingPlantFormComponent implements OnInit {
  public form: FormGroup;
  public plant: IPlant;
  public plantTypes: IPlantType[];
  public isSubmitted = false;
  public states: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProcessingPlantFormComponent>,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private popUp: PopupService,
    private companyService: CompanyService,
    private spinner: SpinnerService
  ) {
    this.plantTypes = data.data.plantTypes;

    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      state: ['', [Validators.required]],
      plantType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getState();
    console.log('this', this.data);
    if (this.data.data.action === 'EDIT') this.getPlant();
  }

  get f() {
    return this.form.controls;
  }

  getState() {
    this.companyService.getStates().subscribe({
      next: (res) => {
        this.states = res.data;
        this.cd.markForCheck();
      },
      error: (err) => {},
    });
  }

  getPlant() {
    this.progressBar.open();
    this.companyService.getPlantById(this.data.data.plantId).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.plant = res.data;
        this.form.get('name').setValue(this.plant.name);
        this.form.get('state').setValue(this.plant.state);
        this.form.get('plantType').setValue(this.plant.plantType);
        this.cd.markForCheck();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
        this.cd.markForCheck();
      },
    });
  }

  createPlant() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();
    this.companyService.addPlant(this.form.value).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open('Plant created successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
        this.cd.markForCheck();
      },
    });
  }

  editPlant() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();
    let formData = this.form.value;
    formData.id = this.data.data.plantId;
    this.companyService.editPlant(this.data.data.plantId, formData).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open('Plant edited successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        this.progressBar.close();
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.cd.markForCheck();
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
