import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoqService } from '../../../../src/app/shared/services/coq.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-debit-notes',
  templateUrl: './view-debit-notes.component.html',
  styleUrls: ['./view-debit-notes.component.css']
})
export class ViewDebitNotesComponent implements OnInit {
  debitNotes: any[];
  appId: number;

  debitNoteKeysMappedToHeaders = {
    reference: 'Reference',
    issuedDate: 'Issued Date'
  }

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private spinner: SpinnerService,
    private popUp: PopupService,
    private cd: ChangeDetectorRef
  ) {
    this.route.params.subscribe((params) => {
      this.appId = parseInt(params['id']);
    })
  }

  ngOnInit(): void {
    this.spinner.open();
    this.paymentService.getAllDebitNotes(this.appId).subscribe({
      next: (res: any) => {
        this.spinner.close();
        this.debitNotes = res.data;
        this.cd.markForCheck();
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.close();
        this.cd.markForCheck();
        this.popUp.open('Something went wrong. Failed to fetch debit notes.', 'error');
      }
    });
  }

  viewDebitNote(row: any) {
    window.open(`${environment.apiUrl}/CoQ/debit_note/${row.id}`);
  }
}
