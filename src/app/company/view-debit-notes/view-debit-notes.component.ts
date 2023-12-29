import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoqService } from 'src/app/shared/services/coq.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-view-debit-notes',
  templateUrl: './view-debit-notes.component.html',
  styleUrls: ['./view-debit-notes.component.css']
})
export class ViewDebitNotesComponent implements OnInit {
  debitNotes: any[];

  debitNoteKeysMappedToHeaders = {
    reference: 'Reference',
    issuedDate: 'Issued Date'
  }

  constructor(
    private router: Router,
    private coqService: CoqService,
    private spinner: SpinnerService,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.coqService.getAllDebitNotes(1).subscribe({
      next: (res: any) => {
        this.spinner.close();
        this.debitNotes = res.data;
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.close();
        this.popUp.open('Something went wrong. Failed to fetch debit notes.', 'error');
      }
    });
  }

  viewDebitNote(row: any) {

  }
}
