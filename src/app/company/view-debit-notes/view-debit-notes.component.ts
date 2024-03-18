import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { environment } from 'src/environments/environment';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-debit-notes',
  templateUrl: './view-debit-notes.component.html',
  styleUrls: ['./view-debit-notes.component.css']
})
export class ViewDebitNotesComponent implements OnInit, AfterViewInit {
  debitNotes: any[];
  appId: number;
  rrr$ = new Subject<string>();

  showFloatingBackBtn = false;

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

  ngAfterViewInit(): void {
    const scrollListener = () => {
      let body: HTMLElement;
      if (document.body) {
        body = document.body;
        // Enables the scroll event to propagate to the company layout div
        body.click();
      } else {
        body = document.documentElement;
        // Enables the scroll event to propagate to the company layout div
        body.click();
      }
      const element = body.querySelector('#back-to-clearances');
     
      if (element) {
        let clientRect = element.getBoundingClientRect();
        this.showFloatingBackBtn = clientRect.top < 75;
        if (this.showFloatingBackBtn) {
          (element as HTMLElement).style.left = clientRect.left + 'px';
        } else {
          (element as HTMLElement).style.left = '0px';
        }
      }
    }
    document.addEventListener('scroll', scrollListener);
  }

  getDebitNotes(): void {
    this.paymentService.getAllDebitNotes(this.appId).subscribe({
      next: (res: any) => {
        this.debitNotes = (res?.data || [])
          .map((el: any) => ({ 
            ...el,
            amount: parseFloat(el.amount).toFixed(2),
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
        this.popUp.open('No debit notes found for the CVC', 'error');
        this.cd.markForCheck();
      }
    });
  }

  confirmPayment(event: any) {
    this.progressBar.open();
    this.spinner.open();

    this.paymentService.confirmPayment(event.paymentId).subscribe({
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
          this.router.navigate([`/company/approvals/${this.appId}/debit-notes/${event.paymentId}`]);
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
        this.router.navigate([`/company/approvals/${this.appId}/debit-notes/${event.paymentId}`]);
        this.progressBar.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  generateRRR(event: any) {
    this.progressBar.open();
    this.spinner.open();
    this.paymentService.createDebitNoteRRR(event.paymentId).subscribe({
      next: (res) => {
        if (res.success) {
          this.rrr$.next(res.data.rrr);
          this.router.navigate([`/company/approvals/${this.appId}/debit-notes/` + event.paymentId]);

          this.popUp.open('RRR was generated successfully!', 'success');
          this.progressBar.close();
          this.spinner.close();
          this.cd.markForCheck();
        }
      },
      error: (error: unknown) => {
        console.error(error);
        this.progressBar.close();
        this.spinner.close();
        this.popUp.open('RRR generation failed!', 'error');
        this.router.navigate([`/company/approvals/${this.appId}/debit-notes/` + event.paymentId]);
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
      event.paymentId
    ])
  }

  viewDebitNote(row: any) {
    window.open(`${environment.apiUrl}/CoQ/debit_note/${row.paymentId}`);
  }
}
