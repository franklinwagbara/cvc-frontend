import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IApplication } from '../../shared/interfaces/IApplication';
import { ApplicationService } from '../../shared/services/application.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';


@Component({
  selector: 'app-noa-applications',
  templateUrl: './noa-applications.component.html',
  styleUrls: ['./noa-applications.component.css'],
})
export class NoaApplicationsComponent implements OnInit {
  public applications: IApplication[];
  depotOfficerMappings: any[];

  public tableTitles = {
    applications: 'NOA Applications',
  };

  public applicationKeysMappedToHeaders = {
    reference: 'Reference',
    companyName: 'Company Name',
    companyEmail: 'Company Email',
    vesselName: 'Vessel Name',
    vesselType: 'Vessel Type',
    imoNumber: 'IMO Number',
    capacity: 'Capacity',
    status: 'Status',
    paymnetStatus: 'Payment Status',
    rrr: 'RRR',
    createdDate: 'Initiated Date',
  };
  
  constructor(
    private applicationService: ApplicationService,
    private spinner: SpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private popUp: PopupService,
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  public fetchAllData() {
    this.spinner.show('Fetching all applications...');

    this.applicationService.getAllApplications().subscribe({
      next: (res) => {
        this.applications = res.data;
        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.popUp.open('Something went wrong while retrieving data.', 'error');
        this.spinner.close();
        this.cdr.markForCheck();
      },
    });

  }

  viewApplication(event: any): void {
    this.router.navigate(['admin', 'view-application', event.id]);
  }

  public get isFieldOfficer(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser && currentUser?.userRoles.includes('Field_Officer');
  }
}

// export interface CoQApplication {
//   marketerName: string;
//   imoNumber: string;
//   vesselName: string;
//   loadingPort: string;
//   dischargePort: string;
// }
