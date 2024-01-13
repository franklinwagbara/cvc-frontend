import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { SpinnerComponent } from 'src/app/shared/reusable-components/spinner/spinner.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-discharge-clearance-form',
  templateUrl: './discharge-clearance-form.component.html',
  styleUrls: ['./discharge-clearance-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DischargeClearanceFormComponent implements OnInit {
  public form: FormGroup;
  public products: any;

  public roles: any;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<DischargeClearanceFormComponent>,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.formBuilder.group({
      vesselName: ['', Validators.required],
      loadingPort: ['', Validators.required],
      product: ['', Validators.required],
      density: ['', Validators.required],
      ron: ['', Validators.required],
      finalBoilingPoint: ['', Validators.required],
      flashPoint: ['', Validators.required],
      colour: ['', Validators.required],
      odour: ['', Validators.required],
      oxygenate: ['', Validators.required],
      others: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.adminService.getproducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.cd.markForCheck();
      },
      error: (err) => {},
    });
  }

  submit() {
    const formData = this.form.value;
    this.spinner.show('Submitting form')
    this.adminService.submitDischargeClearance(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Form submitted successfully!', null, {
            panelClass: ['success'],
          });
          this.spinner.close();
          // this.dialogRef.close();
          this.cd.markForCheck();
        }
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'An error occurred while submitting the form.' + error,
          null,
          {
            panelClass: ['error'],
          }
        );
        this.spinner.close();
      },
    });
  }
}
