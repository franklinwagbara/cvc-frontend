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

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
  public form: FormGroup;
  public productTypes: IApplicationType[];
  public product: any;
  public isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private popUp: PopupService,
    private adminService: AdminService,
    private spinner: SpinnerService
  ) {
    this.productTypes = data.data.productType;
    this.product = data.data.product;

    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      productType: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if (this.data.data.action === 'EDIT') {
      this.getProduct();
      this.form.get('name').setValue(this.product.name);
      this.form.get('productType').setValue(this.product.productType);
    }
  }

  get f() {
    return this.form.controls;
  }

  getProduct() {
    this.adminService.getproductsById(this.data.data.product.id).subscribe({
      next: (res) => {
        this.product = res.data;
        this.form.get('name').setValue(this.product.name);
        this.form.get('productType').setValue(this.product.productType);

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

  createProduct() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();
    this.adminService.addproducts(this.form.value).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open('Product was created successfully!', null, {
          panelClass: ['success'],
        });
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

  EditProduct() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.progressBar.open();

    let formData = this.form.value;
    formData.id = this.data.data.product.id;
    this.adminService.editproducts(formData).subscribe({
      next: (res) => {
        this.progressBar.close();
        this.snackBar.open('Product was modified successfully!', null, {
          panelClass: ['success'],
        });
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
