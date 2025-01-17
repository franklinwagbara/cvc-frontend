import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ApplyService } from '../../../../src/app/shared/services/apply.service';
import { ProgressBarService } from '../../../../src/app/shared/services/progress-bar.service';
import { environment } from '../../../../src/environments/environment';

import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { AuthenticationService, GenericService } from '../../shared/services';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { ApplicationService } from '../../../../src/app/shared/services/application.service';

@Component({
  templateUrl: 'paymentsum.component.html',
  styleUrls: ['./paymentsum.component.scss'],
})
export class PaymentSumComponent implements OnInit {
  genk: GenericService;
  appid: number = null;
  paymentSummary: PaymentSummary;
  public rrr$ = new Subject<string>();
  public applicationStatus$ = new Subject<string>();
  private rrr: string;
  public isPaymentConfirmed$ = new Subject<boolean>();
  public isPaymentNotComfirmed$ = new Subject<boolean>();

  constructor(
    private gen: GenericService,
    private router: Router,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private progressbar: ProgressBarService,
    private applicationServer: ApplyService,
    private appService: ApplicationService,
    private popUp: PopupService,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef
  ) {
    this.genk = gen;
    this.rrr$.subscribe((data) => {
      this.rrr = data;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.appid = params['id'];
      this.getPaymentSummary();
      this.cd.markForCheck();
    });
  }

  getPaymentSummary() {
    this.spinner.show('Fetching payment details');
    this.progressbar.open();
    this.applicationServer.getpaymentbyappId(this.appid).subscribe({
      next: (res) => {
        if (res?.success) {
          this.paymentSummary = res.data;
          this.rrr$.next(this.paymentSummary?.rrr);
          this.applicationStatus$.next(this.paymentSummary?.paymentStatus);

          this.isPaymentConfirmed$.next(
            this.paymentSummary?.rrr &&
              this.paymentSummary?.paymentStatus === 'PaymentCompleted'
          );

          this.isPaymentNotComfirmed$.next(
            this.paymentSummary?.rrr &&
              this.paymentSummary?.paymentStatus !== 'PaymentCompleted'
          );
          if (this.paymentSummary?.paymentStatus === 'PaymentCompleted') {
            this.popUp.open('Payment completed successfully!', 'success');
          }
        }
        this.spinner.close();
        this.progressbar.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.spinner.close();
        this.progressbar.close();
        this.cd.markForCheck();
      },
    });
  }

  generateRRR() {
    this.route.params.subscribe((params) => {
      this.progressbar.open();
      this.spinner.show('Generating RRR');
      this.appid = params['id'];

      this.applicationServer.createPayment_RRR(this.appid).subscribe({
        next: (res) => {
          if (res.success) {
            this.rrr$.next(res.data.rrr);

            this.isPaymentNotComfirmed$.next(
              res.data.rrr &&
                this.paymentSummary.paymentStatus !== 'PaymentConfirmed'
            );

            this.popUp.open('RRR was generated successfully!', 'success');
            this.spinner.close();
            this.progressbar.close();
            this.cd.markForCheck();
          }
        },
        error: (error: unknown) => {
          //todo: display error dialog
          this.popUp.open('RRR generation failed!', 'error');
          this.spinner.close();
          this.progressbar.close();
          this.cd.markForCheck();
        },
      });
    });
  }

  payNow() {
    this.spinner.show('Redirecting to Payment Gateway...');
    window.location.href =
      environment.apiUrl + '/payment/pay-online?rrr=' + this.rrr;
  }

  uploadDocument() {
    this.router.navigate([`/company/upload-document/${this.appid}`]);
  }

  back() {
    // this.router.navigate([`/company/new`]);
  }
}

export class PaymentSummary {
  appReference = '';
  vesselName = '';
  permitType = '';
  docList: string[] = [];
  facilityAddress = '';
  fee = '';
  rrr = '';
  serviceCharge = '';
  serciveCharge: number;
  totalAmount = '';
  // status: string = '';
  paymentStatus = '';
  paymentDescription?: string;

  applicationType: string;
  accreditationFee: number;
  administrativeFee: number;
  applicationFee: number;
  facilityType: string;
  inspectionFee: number;
  total: number;
  vesselLicenseFee: number;
  coqFee: number;
  noaFee: number;

  description: string;
}
