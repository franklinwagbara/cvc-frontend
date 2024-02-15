import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ProcessingPlantCOQService } from 'src/app/shared/services/processing-plant-coq/processing-plant-coq.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-all-ppcoq-applications',
  templateUrl: './all-ppcoq-applications.component.html',
  styleUrls: ['./all-ppcoq-applications.component.css']
})
export class AllPpcoqApplicationsComponent implements OnInit {
  coqs: any[];
  coqKeysMappedToHeaders = {
    importName: 'Importer Name',
    vesselName: 'Vessel Name',
    dateOfSTAfterDischarge: 'Shore Tank Date',
    dateOfVesselUllage: 'Vessel Ullage Date',
    plantName: 'Plant Name',
    plantPrice: 'Plant Price',
    gov: 'GOV',
    gsv: 'GSV',
  }

  constructor(
    private router: Router,
    private spinner: SpinnerService,
    private ppcoqService: ProcessingPlantCOQService,
    private cdr: ChangeDetectorRef,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    this.getAllApplications();
  }

  getAllApplications(): void {
    this.spinner.show('Loading applications...');
    this.ppcoqService.getAllCoqs().subscribe({
      next: (res: any) => {
        this.coqs = res?.data;
        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close();
        this.popUp.open('Something went wrong while retrieving data', 'error');
        this.cdr.markForCheck();
      }
    })
  }

  onViewData(event: any): void {
    this.router.navigate(['admin', 'processing-plant', 'certificate-of-quantity', 'applications', event.id]);
  }

}
