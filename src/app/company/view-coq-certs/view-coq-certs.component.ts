import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoqService } from '../../shared/services/coq.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view-coq-certs',
  templateUrl: './view-coq-certs.component.html',
  styleUrls: ['./view-coq-certs.component.css']
})
export class ViewCoqCertsComponent implements OnInit {
  coqs: any[];
  appId: number;

  coqsKeysMappedToHeaders = {
    licenseNo: 'Certificate No',
    vesselName: 'Vessel Name',
    depotName: 'Depot',
    issuedDate: 'Issued Date',
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private coqService: CoqService,
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
    this.coqService.getCoqCerts(this.appId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.coqs = res.data
        }
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.spinner.close();
        this.popUp.open('No certificate found for this CVC', 'error');
        this.cd.markForCheck();
      }
    })
  }

  viewCoQCert(row: any) {
    window.open(`${environment.apiUrl}/coq/view_coq_cert?id=${row.coqId}`, '_blank');
  }

}
