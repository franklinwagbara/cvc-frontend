import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProgressBarService } from '../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { PaymentService } from '../../../../src/app/shared/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  //public payments: Ipayment[];
  public payments: any[]; // temporal
  //public categories: Category[];

  public tableTitles = {
    payments: 'Payments',
  };

  public paymentKeysMappedToHeaders = {
    // Id: 'id',
    appReference: 'Reference Number',
    companyName: 'Company Name',
    companyEmail: 'Company Email',
    vesselName: 'Vessel Name',
    rrr: 'RRR',
    amount: 'Amount',
    paymentStatus: 'Payment Status',
    // extraPaymentReference: 'Extra Payment Reference',
    // paymentDate: 'Payment Date',
  };
  constructor(
    private paymentService: PaymentService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.progressBar.open();
    this.spinner.open();

    forkJoin([
      this.paymentService.getAllPayment(),
      // this.adminService.getModule(),
    ]).subscribe({
      next: (res) => {
        if (res[0].success) this.payments = res[0].data;

        // this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        // this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  ngAfterViewInit(): void {
    // this.categories = [...this.categories];
  }

  onViewData(event: any, type: string) {
    console.log(event);
    this.router.navigate([`/admin/payment/${event.id}`], {
      //queryParams: { id: event.id, appSource: AppSource.Application },
    });
  }
}
