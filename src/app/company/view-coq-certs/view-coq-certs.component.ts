import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoqService } from '../../shared/services/coq.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';


@Component({
  selector: 'app-view-coq-certs',
  templateUrl: './view-coq-certs.component.html',
  styleUrls: ['./view-coq-certs.component.css']
})
export class ViewCoqCertsComponent implements OnInit {
  coqs: any[];

  coqsKeysMappedToHeaders = {
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
    this.coqService.getAllCoQCerts().subscribe({
      next: (res: any) => {
        this.spinner.close();
        this.coqs = res.data;
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.close();
        this.popUp.open('Something went wrong while retrieving data', 'error');
      }
    })
  }

  viewCoQCert(row: any) {
    // window.location.assign(row.url);
  }

}
