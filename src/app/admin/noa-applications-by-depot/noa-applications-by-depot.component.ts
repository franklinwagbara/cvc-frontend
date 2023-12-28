import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IApplication } from '../../shared/interfaces/IApplication';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-noa-applications-by-depot',
  templateUrl: './noa-applications-by-depot.component.html',
  styleUrls: ['./noa-applications-by-depot.component.css'],
})
export class NoaApplicationsByDepotComponent implements OnInit {
  public applications: IApplication[];

  public tableTitles = {
    applications: 'NOA Applications',
  };

  public applicationKeysMappedToHeaders = {
    // marketerName: 'Marketer Name',
    vesselName: 'Vessel Name',
    loadingPort: 'Loading Port',
    imoNumber: 'IMO Number',
    eta: 'Estimated Time of Arrival',
  };

  constructor(
    private applicationService: ApplicationService,
    private spinner: SpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private popUp: PopupService
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  public fetchAllData() {
    this.spinner.open();

    this.applicationService.viewApplicationByDepot(1).subscribe({
      next: (res) => {
        this.applications = res.data;
        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open('Something went wrong while retrieving data.', 'error');

        this.spinner.close();
        this.cdr.markForCheck();
      },
    });
  }

  initiateCoq(event: any) {
    const row = event;
    // Call the endpoint to create an empty coq
    this.router.navigate([
      `/admin/noa-applications-by-depot/${event.id}/certificate-of-quantity/new-application`,
    ]);
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
