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
  depotCoQs: any[];
  ppCoQs: any[];
  isHppitiStaff: boolean;

  depotCoQKeysMappedToHeaders = {
    companyName: 'Company Name',
    licenseNo: 'Certificate No',
    vesselName: 'Vessel Name',
    depotName: 'Depot Name',
    issuedDate: 'Issued Date',
  }
  
  ppCoQKeysMappedToHeaders = {
    companyName: 'Company Name',
    licenseNo: 'Certificate No',
    plantName: 'Plant Name',
    issuedDate: 'Issued Date',
  }

  constructor(
    private spinner: SpinnerService,
    private coqService: CoqService,
    private popUp: PopupService,
    private dialog: MatDialog,
    private auth: AuthenticationService
  ) {
    this.isHppitiStaff = auth.isHppitiStaff;
  }

  ngOnInit(): void {
    this.spinner.open();
    this.fetchData();
  }

  fetchData() {
    this.coqService.getAllCoQCerts().subscribe({
      next: (res: any) => {
        this.depotCoQs = res.data?.depotCOQList;
        this.ppCoQs = res.data?.ppCoQList;
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
