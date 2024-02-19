import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthenticationService, GenericService } from 'src/app/shared/services';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { ApplyService } from 'src/app/shared/services/apply.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-debitnote-paymentsum',
  templateUrl: './debitnote-paymentsum.component.html',
  styleUrls: ['./debitnote-paymentsum.component.css']
})
export class DebitnotePaymentsumComponent {
  genk: GenericService;
  application_id: number = null;
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
      this.application_id = params['id'];
      this.getPaymentSummary();
      this.cd.markForCheck();
    });
  }

  getPaymentSummary() {
    this.spinner.show('Fetching payment details');
    this.progressbar.open();
    this.applicationServer.getpaymentbyappId(this.application_id).subscribe({
      next: (res) => {
        if (res.success) {
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
      this.application_id = params['id'];

      this.applicationServer.createPayment_RRR(this.application_id).subscribe({
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

  submitPayment() {
    //this.router.navigate(['/auth/pay-online?rrr=' + this.rrr]);
    window.location.href =
      environment.apiUrl + '/payment/pay-online?rrr=' + this.rrr;
  }

  uploadDocument() {
    this.router.navigate([`/company/upload-document/${this.application_id}`]);
  }
}

interface PaymentSummary {
  appReference: string;
  vesselName: string;
  fee: string;
  rrr: string;
  serviceCharge: string;
  totalAmount: string;
  paymentType: string;
  paymentStatus: string;
  paymentDescription?: string;

  applicationType: string;
  applicationFee: number;
  facilityType: string;
  description?: string;
}