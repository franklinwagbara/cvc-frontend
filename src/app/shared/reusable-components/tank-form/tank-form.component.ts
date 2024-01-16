import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProgressBarService } from '../../services/progress-bar.service';
import { CompanyService } from '../../services/company.service';


@Component({
  selector: 'app-tank-form',
  templateUrl: './tank-form.component.html',
  styleUrls: ['./tank-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TankFormComponent implements OnInit {
  public form: FormGroup;
  public tank: any;
  public plantId: number;
  public tankId: number;
  public isSubmitted = false;
  public products: any;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TankFormComponent>,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private companyService: CompanyService,
  ) {
    this.plantId = data.data.plantId;
    this.tankId = this.data.data.plantTankId;
    this.form = formBuilder.group({
      tankName: ['', [Validators.required]],
      product: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      position: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getProduct();
    if (this.data.data.action === 'EDIT') this.getTank();
  }

  get f() {
    return this.form.controls;
  }

  getProduct() {
    this.companyService.getproducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.cd.markForCheck();
      },
      error: (err) => {},
    });
  }

  getTank() {
    this.tank = this.data.data.tank;
    this.plantId = this.data.data.tank.plantId;
    this.tankId = this.data.data.tank.plantTankId;
    this.form.get('tankName').setValue(this.tank.tankName);
    this.form.get('product').setValue(this.tank.product);
    this.form.get('capacity').setValue(this.tank.capacity);
    this.form.get('position').setValue(this.tank.position);
    this.cd.markForCheck();
  }

  createTank() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    // this.progressBar.open();
    this.isLoading = true;
    const formData = this.form.value;
    formData.plantId = this.plantId;
    this.companyService.addTank(formData).subscribe({
      next: (res) => {
        // this.progressBar.close();
        this.isLoading = false;
        this.snackBar.open('Record was created successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        // this.progressBar.close();
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }

  editTank() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    // this.progressBar.open();
    this.isLoading = true
    let formData = this.form.value;
    formData.plantId = this.plantId;
    formData.id = this.tankId;
    this.companyService.editTank(formData).subscribe({
      next: (res) => {
        // this.progressBar.close();
        this.isLoading = false
        this.snackBar.open('Record was modified successfully!', null, {
          panelClass: ['success'],
        });
        this.dialogRef.close();
        this.cd.markForCheck();
      },
      error: (err) => {
        // this.progressBar.close();
        this.isLoading = false
        this.snackBar.open(err?.message, null, {
          panelClass: ['error'],
        });
        this.cd.markForCheck();
      },
    });
  }

  onClose() {}
}
