import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IApplication } from '../../shared/interfaces/IApplication';
import { ApplicationService } from '../../shared/services/application.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AuthenticationService } from 'src/app/shared/services';
import { UserRole } from 'src/app/shared/constants/userRole';


@Component({
  selector: 'app-noa-applications-by-depot',
  templateUrl: './noa-applications-by-depot.component.html',
  styleUrls: ['./noa-applications-by-depot.component.css'],
})
export class NoaApplicationsByDepotComponent implements OnInit {
  public applications: IApplication[];
  products: any[];
  currentUser: any;

  public tableTitles = {
    applications: 'NOA Applications',
  };

  public applicationKeysMappedToHeaders = {
    reference: 'Reference',
    companyName: 'Company Name',
    companyEmail: 'Company Email',
    vesselName: 'Vessel Name',
    vesselType: 'Vessel Type',
    jetty: 'Jetty',
    capacity: 'Capacity',
    status: 'Status',
    rrr: 'RRR',
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

  public fetchAllData() {
    this.spinner.show('Loading applications...');
    this.getApplicationByDepot();
  }

  getApplicationByDepot() {
    this.applicationService.viewApplicationByDepot().subscribe({
      next: (res: any) => {
        // get apps and add allowDischarge prop to each one
        this.applications = res?.data
        // .map((el) => ({...el, allowDischarge: false }));
        this.applications = this.applications
          .map((el) => ({...el, createdDate: new Date(el?.createdDate).toLocaleDateString()}))
          .filter((app) => app.status !== 'Completed')
          .reverse();
        this.spinner.close();
        this.progressBar.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.popUp.open('Something went wrong while retrieving data', 'error');
        this.spinner.close();
        this.progressBar.close();
        this.cdr.markForCheck();
      }
    })
  }

  viewApplication(event: any): void {
    this.router.navigate(['admin', 'coq-and-plant', 'noa-applications-by-depot', event.id]);
  }

  public get isFieldOfficer(): boolean {
    return this.currentUser && this.currentUser?.userRoles === UserRole.FIELDOFFICER;
  }

  onAllowDischarge(value: boolean) {
    if (value) {
      this.progressBar.open();
      this.getApplicationByDepot();
    }
  }

  initiateCoQ(event: any) {
    this.router.navigate([
      'admin',
      'coq-and-plant',
      'noa-applications-by-depot',
      event.id,
      'certificate-of-quantity',
      'new-application',
    ]);
  }
}
