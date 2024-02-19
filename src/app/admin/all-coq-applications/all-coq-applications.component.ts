import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CoqService } from 'src/app/shared/services/coq.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ProcessingPlantCOQService } from 'src/app/shared/services/processing-plant-coq/processing-plant-coq.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-all-coq-applications',
  templateUrl: './all-coq-applications.component.html',
  styleUrls: ['./all-coq-applications.component.css']
})
export class AllCoqApplicationsComponent implements OnInit {
  coqs: any[];
  ppCoqs: any[];

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

  ppCoqKeysMappedToHeaders = {
    plantName: "Plant Name",
    productName: "Product Name",
    reference: "Reference",
    measurementSystem: "Measurement System",
    startTime: "Start Time",
    endTime: "End Time",
    consignorName: "Consignor Name",
    consignee: "Consignee",
    terminal: "Terminal",
    destination: "Destination",
    shipmentNo: "Shipment Number",
  }

  constructor(
    private router: Router,
    private coqService: CoqService,
    private spinner: SpinnerService,
    private popUp: PopupService,
    private ppCoqService: ProcessingPlantCOQService
  ) {}

  ngOnInit(): void {
    this.fetchAllCoqs();
  }

  fetchAllCoqs(): void {
    this.spinner.show('Loading applications...');
    forkJoin([
      this.coqService.getAllCOQs(),
      this.ppCoqService.getAllCoqs()
    ]).subscribe({
      next: (res: any[]) => {
        this.coqs = res[0].data;
        this.ppCoqs = res[1].data;
        this.spinner.close();
      },
      error: (error: unknown) => {
        console.error(error);
        this.spinner.close();
        this.popUp.open('Something went wrong while retrieving data', 'error');
      }
    })
  }

  onViewData(event: any, type: 'COQ' | 'PPCOQ'): void {
    if (type === 'COQ') {
      this.router.navigate(['admin', 'applications', 'coq-applications', event.id]);
    } else {
      this.router.navigate(
        ['admin', 'applications', 'processing-plant', 'coq-applications', event.id],
        {
          queryParams: {
            id: event.id,
            isPPCOQ: true
          },
        });
    }
  }

}
