import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IApplication } from '../../shared/interfaces/IApplication';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-noa-applications-by-depot',
  templateUrl: './noa-applications-by-depot.component.html',
  styleUrls: ['./noa-applications-by-depot.component.css']
})
export class NoaApplicationsByDepotComponent implements OnInit {
  public applications: IApplication[];
  
  public tableTitles = {
    applications: 'NOA Applications',
  };

  public applicationKeysMappedToHeaders = {
    applicationTypeId: 'Application Type Id',
    marketerName: 'Marketer Name',
    imoNumber: 'IMO Number',
    vesselName: 'Vessel Name',
    loadingPort: 'Loading Port',
    dischargePort: 'Discharge Port',
    vesselTypeId: 'Vessel Type Id',
    eta: 'Estimated Time of Arrival'
  };

  dummyApplications = [
    {
      applicationTypeId: '343982',
      marketerName: 'AGIP',
      imoNumber: '38493184392',
      vesselName: 'Casablanca',
      loadingPort: 'Jos',
      dischargePort: 'Niger',
      vesselTypeId: '893483',
      eta: '2 weeks'
    },
    {
      applicationTypeId: '343982',
      marketerName: 'Conoil',
      imoNumber: '38493184392',
      vesselName: 'Casablanca',
      loadingPort: 'Jos',
      dischargePort: 'Niger',
      vesselTypeId: '893483',
      eta: '2 weeks'
    },
    {
      applicationTypeId: '343982',
      marketerName: 'Mobil',
      imoNumber: '38493184392',
      vesselName: 'Casablanca',
      loadingPort: 'Lagos',
      dischargePort: 'Abuja',
      vesselTypeId: '893483',
      eta: '2 weeks'
    },
  ]

  constructor(
    private applicationService: ApplicationService,
    private spinner: SpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    this.applicationService.viewApplicationByDepot(1).subscribe({
      next: (res) => {
        if (res[0]?.success) this.applications = res[0].data;
        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
        this.cdr.markForCheck();
      },
    });
  }

  initiateCoq(event: any) {
    const row = event;
    // Call the endpoint to create an empty coq
    this.router.navigate([`/admin/noa-applications-by-depot/${event.id}/certificate-of-quantity/new-application`]);
  }
}

// export interface CoQApplication {
//   marketerName: string;
//   imoNumber: string;
//   vesselName: string;
//   loadingPort: string; 
//   dischargePort: string;
// }