import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services';
import { CoqService } from 'src/app/shared/services/coq.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-coq-certificates',
  templateUrl: './all-coq-certificates.component.html',
  styleUrls: ['./all-coq-certificates.component.css']
})
export class AllCoqCertificatesComponent implements OnInit {
  certificates: any[]

  certificateKeysMappedToHeaders = {
    certifcateNo: 'Certificate No',
    issuedDate: 'Issued Date',
  }

  constructor(
    private spinner: SpinnerService,
    private coqService: CoqService,
    private popUp: PopupService,
    private dialog: MatDialog,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.fetchData();
  }

  fetchData() {
    this.coqService.getAllCoQCerts().subscribe({
      next: (res: any) => {
        this.certificates = res?.data;
        if (this.auth.currentUser.directorate) {
          this.certificates = this.certificates.filter((item) => !item.certifcateNo?.includes(
            (this.auth.isHppitiStaff && 'DSSRI') || (this.auth.isDssriStaff && 'HPPITI'))
          );
        }
        this.spinner.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close();
        this.popUp.open('Something went wrong while retreiving data', 'error');
      }
    })
  }

  onViewData(event: any): void {
    window.open(`${environment.apiUrl}/coq/view_coq_cert?id=${event.id}`);
  }

}
