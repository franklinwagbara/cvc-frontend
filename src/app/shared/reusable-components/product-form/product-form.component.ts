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
  IApplicationType,
} from '../../../../../src/app/company/apply/new-application/new-application.component';
import { ProgressBarService } from '../../services/progress-bar.service';
import { PopupService } from '../../services/popup.service';
import { AdminService } from '../../services/admin.service';


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
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private popUp: PopupService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private progressBar: ProgressBarService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
  ) {
    this.productTypes = data.data.productType;
    this.product = data.data.product;
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      revenueCode: ['', [Validators.required]],
      revenueCodeDescription: ['', [Validators.required]]
    });

    if (this.data.data.action === 'EDIT') {
      this.form.get('name').patchValue(this.product.name);
      this.form.get('productType').patchValue(this.product.productType);
      this.form.get('revenueCode').patchValue(this.product.revenueCode);
      this.form.get('revenueCodeDescription').patchValue(this.product.revenueCodeDescription);
    }
  }

  get f() {
    return this.form.controls;
  }

  createProduct() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.isLoading = true;
    this.adminService.addproducts(this.form.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.popUp.open('Product was created successfully!', 'success');
        this.dialogRef.close('submitted');
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.popUp.open('Product creation failed due an error.', 'error');
      },
    });
  }

  editProduct() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.isLoading = true;
    let formData = this.form.value;
    formData.id = this.data.data.product.id;
    this.adminService.editproducts(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.popUp.open('Product updated successfully!', 'success');
        this.dialogRef.close('submitted');
      },
      error: (err) => { 
        console.error(err);
        this.isLoading = false;
        this.popUp.open('Product update failed due to an error.', 'error');
      },
    });
  }
}
