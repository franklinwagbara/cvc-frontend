import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IApplication } from '../../shared/interfaces/IApplication';
import { ApplicationService } from '../../shared/services/application.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AuthenticationService } from 'src/app/shared/services';
import { Directorate, UserRole } from 'src/app/shared/constants/userRole';
import { Subscription } from 'rxjs';
import { AppSource } from 'src/app/shared/constants/appSource';

@Component({
  selector: 'app-noa-applications-by-jetty',
  templateUrl: './noa-applications-by-jetty.component.html',
  styleUrls: ['./noa-applications-by-jetty.component.css'],
})
export class NoaApplicationsByJettyComponent implements OnInit, OnDestroy {
  public applications: IApplication[];
  products: any[];
  currentUser: any;
  private allSubscriptions = new Subscription();

  public tableTitles = {
    applications: 'Approved NoA Applications',
  };

  public applicationKeysMappedToHeaders = {
    reference: 'Reference',
    companyName: 'Company Name',
    companyEmail: 'Company Email',
    vesselName: 'Vessel Name',
    vesselType: 'Vessel Type',
    jetty: 'Jetty',
    status: 'Status',
    createdDate: 'Initiated Date',
  };

  constructor(
    private applicationService: ApplicationService,
    private spinner: SpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private popUp: PopupService,
    private auth: AuthenticationService,
    private progressBar: ProgressBarService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
    this.fetchAllData();
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }

  public fetchAllData() {
    this.spinner.show('Loading applications...');
    this.getApplicationByJetty();
  }

  getApplicationByJetty() {
    this.allSubscriptions.add(
      this.applicationService.viewAppByJettyOfficer().subscribe({
        next: (res: any) => {
          this.applications = res?.data; 
          this.spinner.close();
          this.progressBar.close();
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.error(error);
          this.popUp.open('Something went wrong while retrieving data', 'error');
          this.spinner.close();
          this.progressBar.close();
          this.cdr.markForCheck();
        },
      })
    );
  }

  viewApplication(event: any): void {
    this.router.navigate([
      'admin',
      'vessel-clearance',
      'noa-applications-by-jetty-officer',
      event.id,
    ], {
      queryParams: { appSource: AppSource.Application }
    });
  }

  public get isDSSRIFieldOfficer(): boolean {
    return this.currentUser?.userRoles === UserRole.FIELDOFFICER 
      && this.currentUser?.directorate === Directorate.DSSRI;
  }

  onAllowDischarge(value: boolean) {
    if (value) {
      this.progressBar.open();
      this.getApplicationByJetty();
    }
  }

  initiateCoQ(event: any) {
    this.router.navigate([
      'admin',
      'coq',
      'noa-applications-by-jetty',
      event.id,
      'certificate-of-quantity',
      'new-application',
    ]);
  }
}
