import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/shared/services';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-debitnote-paymentsum',
  templateUrl: './debitnote-paymentsum.component.html',
  styleUrls: ['./debitnote-paymentsum.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DebitnotePaymentsumComponent {
  genk: GenericService;
  debitNoteId: number;
  paymentSummary: PaymentSummary;
  paymentDetails: any[];
  public rrr$ = new Subject<string>();
  public applicationStatus$ = new Subject<string>();
  private rrr: string;
  public isPaymentConfirmed$ = new Subject<boolean>();
  public isPaymentNotComfirmed$ = new Subject<boolean>();

  constructor(
    private gen: GenericService,
    private route: ActivatedRoute,
    private progressbar: ProgressBarService,
    private paymentService: PaymentService,
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
      this.debitNoteId = params['id'];
      this.spinner.show('Fetching payment details...');
      this.getPaymentSummary();
      this.cd.markForCheck();
    });
  }

  getPaymentSummary() {
    this.progressbar.open();
    this.paymentService.getDebitNotePaymentSummary(this.debitNoteId).subscribe({
      next: (res) => {
        if (res.success) {
          const totalAmount = (res?.data?.paymentTypes || [])
            .find((el: PaymentType) => el.paymentType === 'ToTal Amount')?.amount;
          
          this.paymentSummary = { ...res.data, totalAmount };
          this.rrr$.next(this.paymentSummary?.rrr);
          this.paymentDetails = (res.data?.paymentTypes || [])
            .filter((d: any) => d.paymentType !== 'ToTal Amount');

          this.applicationStatus$.next(this.paymentSummary?.status);

          this.isPaymentConfirmed$.next(
            this.paymentSummary?.rrr &&
              this.paymentSummary?.status === 'PaymentCompleted'
          );
          
          this.isPaymentNotComfirmed$.next(
            this.paymentSummary?.rrr &&
              this.paymentSummary?.status !== 'PaymentCompleted'
          );
          if (this.paymentSummary?.status === 'PaymentCompleted') {
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
      this.spinner.show('Generating RRR...');
      this.debitNoteId = params['id'];

      this.paymentService.createDebitNoteRRR(this.debitNoteId).subscribe({
        next: (res) => {
          if (res.success) {
            this.rrr$.next(res.data.rrr);

            this.isPaymentNotComfirmed$.next(
              res.data.rrr &&
                this.paymentSummary.status !== 'PaymentConfirmed'
            );

            this.popUp.open('RRR was generated successfully!', 'success');
            this.progressbar.open();
            this.getPaymentSummary();
            this.spinner.close();
            this.cd.markForCheck();
          }
        },
        error: (error: unknown) => {
          console.error(error);
          this.popUp.open('RRR generation failed!', 'error');
          this.spinner.close();
          this.cd.markForCheck();
        },
      });
    });
  }

  payNow(): void {
    this.spinner.show('Redirecting to Payment Gateway...');
    window.location.href =
      environment.apiUrl + '/payment/pay-online?rrr=' + this.rrr;
  }
}

interface PaymentSummary {
  id: number;
  orderId: string;
  depotName: string;
  rrr: string;
  amount: string;
  totalAmount?: number;
  paymentType: PaymentType[];
  status?: string;
  description?: string;
}

interface PaymentType {
  paymentType: string;
  amount: number;
  createdDate: string;
}