import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupService } from '../../services/popup.service';
import { DischargeClearanceService } from '../../services/discharge-clearance.service';
import { Util } from '../../lib/Util';
import { AdminService } from '../../services/admin.service';
import { IProduct } from '../../interfaces/IProduct';
import { error } from 'console';
import { LibaryService } from '../../services/libary.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-discharge-clearance-form',
  templateUrl: './discharge-clearance-form.component.html',
  styleUrls: ['./discharge-clearance-form.component.css'],
})
export class DischargeClearanceFormComponent implements OnInit {
  noaApp: any;
  allowDischarge: boolean;
  public form: FormGroup;
  public roles: any;
  submitting = false;
  errorMessage = '';
  public products: IProduct[];
  // public depots: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { productTypes: any[]; noaApp: any; allowDischarge: boolean },
    public dialogRef: MatDialogRef<DischargeClearanceFormComponent>,
    private popUp: PopupService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private dischargeClearance: DischargeClearanceService,
    private adminService: AdminService,
    private libService: LibaryService,
    private spinner: SpinnerService
  ) {
    this.noaApp = this.data.noaApp;
    this.allowDischarge = this.data.allowDischarge;
  }

  ngOnInit(): void {
    if (this.allowDischarge) {
      this.form = this.formBuilder.group({
        vesselName: [this.noaApp?.vesselName || '', Validators.required],
        vesselPort: [this.noaApp?.loadingPort || '', Validators.required],
        product: ['', Validators.required],
        density: ['', Validators.required],
        ron: ['', Validators.required],
        finalBoilingPoint: ['', Validators.required],
        flashPoint: ['', Validators.required],
        color: ['', Validators.required],
        odour: ['', Validators.required],
        oxygenate: ['', Validators.required],
        others: ['', Validators.required],
        comment: ['', Validators.required],
        // depotId: ['', Validators.required],
      });

      ['vesselName', 'vesselPort'].forEach((field) => {
        this.form.controls[field].disable();
      });
    } else {
      this.form = this.formBuilder.group({
        comment: ['', Validators.required],
      });
    }
    // this.getProduct();
    // this.filterProducts();
    // this.getAppDepots();
  }

  // public getAppDepots() {
  //   this.spinner.open();
  //   this.libService.getAllDepotByNoaAppId(this.noaApp.id).subscribe({
  //     next: (res) => {
  //       this.depots = res.data;
  //       this.spinner.close();
  //       this.cd.markForCheck();
  //     },
  //     error: (e) => {
  //       this.popUp.open(e.message, 'error');
  //       this.spinner.close();
  //       this.cd.markForCheck();
  //     },
  //   });
  // }

  @HostListener('keydown', ['$event'])
  blockSpecialNonNumerics(evt: KeyboardEvent): void {
    Util.blockSpecialNonNumerics(evt);
  }

  // getProduct() {
  //   this.adminService.getproducts().subscribe({
  //     next: (res) => {
  //       this.products = res.data;
  //       this.cd.markForCheck();
  //     },
  //     error: (error) => {},
  //   });
  // }

  // filterProducts() {
  //   this.form.get('product').valueChanges.subscribe((res) => {
  //     console.log(res);
  //     this.products = this.products.filter((a) => a.productType == res);
  //     console.log(this.products);
  //   });
  //   this.cd.markForCheck();
  // }

  submit() {
    this.submitting = true;
    this.errorMessage = '';
    const formData = {
      ...this.form.getRawValue(),
      appId: this.noaApp.id,
      dischargeId: ((this.noaApp?.dischargeId || 0) as number).toString(),
      id: 0,
      isAllowed: true,
    };

    if (this.allowDischarge) {
      this.dischargeClearance
        .createVesselDischargeClearance(formData)
        .subscribe({
          next: (res: any) => {
            this.submitting = false;
            if (res?.success) {
              this.popUp.open('Form submitted successfully!', 'success');
              this.dialogRef.close({ submitted: true });
            } else {
              this.errorMessage = 'An error occurred: ' + res?.message;
            }
            this.cd.markForCheck();
          },
          error: (error: any) => {
            console.log(error);
            this.submitting = false;
            this.errorMessage =
              'Something went wrong while submitting clearance';
            this.cd.markForCheck();
          },
        });
    } else {
      setTimeout(() => {
        this.submitting = false;
        this.dialogRef.close({ submitted: true });
        this.popUp.open(
          'A notification has been sent to Supervisor(s)',
          'success'
        );
      }, 3000);
    }
  }
}
