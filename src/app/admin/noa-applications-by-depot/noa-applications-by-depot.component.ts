import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IApplication } from '../../shared/interfaces/IApplication';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupService } from 'src/app/shared/services/popup.service';
import { forkJoin } from 'rxjs';
import { DepotOfficerService } from 'src/app/shared/services/depot-officer/depot-officer.service';
import { AuthenticationService } from 'src/app/shared/services';
import { decodeFullUserInfo } from 'src/app/helpers/tokenUtils';

@Component({
  selector: 'app-noa-applications-by-depot',
  templateUrl: './noa-applications-by-depot.component.html',
  styleUrls: ['./noa-applications-by-depot.component.css'],
})
export class NoaApplicationsByDepotComponent implements OnInit {
  public applications: IApplication[];
  depotOfficerMappings: any[];

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
    private popUp: PopupService,
    private depotOfficerService: DepotOfficerService,
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  public fetchAllData() {
    this.spinner.open();

    this.depotOfficerService.getAllMappings().subscribe({
      next: (res: any) => {
        this.depotOfficerMappings = res?.data;
        const currUser = decodeFullUserInfo();
        const officerMapping = this.depotOfficerMappings.find((val) => val.userId === currUser.userUUID);
        
        this.applicationService.viewApplicationByDepot(officerMapping?.depotID || 1).subscribe({
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
      },
      error: (error: any) => {
        console.log(error);
        this.popUp.open('Something went wrong while retrieving data.', 'error');
        this.spinner.close();
        this.cdr.markForCheck();
      }
    })

  }

  initiateCoq(event: any) {
    const row = event;
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
