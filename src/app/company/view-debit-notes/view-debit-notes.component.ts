import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoqService } from '../../../../src/app/shared/services/coq.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { environment } from 'src/environments/environment';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';

@Component({
  selector: 'app-view-debit-notes',
  templateUrl: './view-debit-notes.component.html',
  styleUrls: ['./view-debit-notes.component.css']
})
export class ViewDebitNotesComponent implements OnInit {
  debitNotes: any[];
  appId: number;

  debitNoteKeysMappedToHeaders = {
    orderId: "CoQ Reference",
    addedDate: "Issued Date",
    status: "Payment Status",
    depotName: "Depot Name",
    rrr: "RRR",
    amount: "Amount (NGN)",
  }

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private spinner: SpinnerService,
    private popUp: PopupService,
    private cd: ChangeDetectorRef,
    private progressBar: ProgressBarService,
    private router: Router,
  ) {
    this.route.params.subscribe((params) => {
      this.appId = parseInt(params['appId']);
    })
  }

  ngOnInit(): void {
    this.spinner.open();
    this.getDebitNotes();
  }

  getDebitNotes(): void {
    this.paymentService.getAllDebitNotes(this.appId).subscribe({
      next: (res: any) => {
        this.debitNotes = (res?.data || [])
          .map((el: any) => ({ 
            ...el, 
            status: el.status === 'PaymentPending' ? 'Payment Pending'
              : el.status === 'PaymentCompleted' ? 'Payment Completed'
              : el.status 
          }));
        this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: any) => {
        console.error(error);
        this.progressBar.close();
        this.spinner.close();
        this.popUp.open('Something went wrong. Failed to fetch debit notes.', 'error');
        this.cd.markForCheck();
      }
    });
  }

  confirmPayment(event: any) {
    this.progressBar.open();
    this.spinner.open();

    this.paymentService.confirmPayment(event.id || event.paymentId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.popUp.open('Payment Confirmed Successfully', 'success');
          this.progressBar.open();
          this.getDebitNotes();
        } else {
          this.popUp.open(
            'Payment confirmation not successful. Please contact support or proceed to pay online.',
            'error'
          );
          this.router.navigate([`/company/approvals/${this.appId}/debit-notes/${event.id || event.paymentId}`]);
        }
        this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.popUp.open(
          'Payment confirmation not successful. Please contact support or proceed to pay online.',
          'error'
        );
        this.router.navigate([`/company/approvals/${this.appId}/debit-notes/${event.id || event.paymentId}`]);
        this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  viewPaymentSummary(event: any) {
    this.router.navigate([
      'company',
      'approvals', 
      this.appId,
      'debit-notes',
      event?.id
    ])
  }

  viewDebitNote(row: any) {
    window.open(`${environment.apiUrl}/CoQ/debit_note/${row.id}`);
  }
}
