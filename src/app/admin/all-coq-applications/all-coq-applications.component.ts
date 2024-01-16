import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoqService } from 'src/app/shared/services/coq.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-all-coq-applications',
  templateUrl: './all-coq-applications.component.html',
  styleUrls: ['./all-coq-applications.component.css']
})
export class AllCoqApplicationsComponent implements OnInit {
  coqs: any[];

  coqKeysMappedToHeaders = {
    importName: 'Importer Name',
    vesselName: 'Vessel Name',
    dateOfSTAfterDischarge: 'Shore Tank Date',
    dateOfVesselUllage: 'Vessel Ullage Date',
    depotName: 'Depot Name',
    depotPrice: 'Depot Price',
    gov: 'GOV',
    gsv: 'GSV',
  }

  constructor(
    private router: Router,
    private coqService: CoqService,
    private spinner: SpinnerService,
    private popUp: PopupService,
  ) {}

  ngOnInit(): void {
    this.spinner.open();
    this.coqService.getAllCOQs().subscribe({
      next: (res: any) => {
        this.coqs = res?.data;
        console.log('CoQ Applications ==========> ', this.coqs);
        this.spinner.close(); 
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close();
        this.popUp.open('Something went wrong while retrieving data', 'error');
      }
    })
  }

  onViewData(event: any): void {
    this.router.navigate(['admin', 'applications', 'coq-applications', event.id]);
  }

}
