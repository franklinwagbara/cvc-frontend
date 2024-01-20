import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/shared/constants/userRole';
import { IApplication } from 'src/app/shared/interfaces/IApplication';
import { AuthenticationService } from 'src/app/shared/services';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';

@Component({
  selector: 'app-noa-vessel-clearance',
  templateUrl: './noa-vessel-clearance.component.html',
  styleUrls: ['./noa-vessel-clearance.component.css']
})
export class NoaVesselClearanceComponent implements OnInit {
  applications: IApplication[];
  currentUser: any;

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
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth: AuthenticationService,
    private progressBar: ProgressBarService
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
  }

  getApplicationByJetty(): void {

  }
    
  public get isFieldOfficer(): boolean {
    return this.currentUser && this.currentUser?.userRoles === UserRole.FIELDOFFICER;
  }

  viewApplication(event: any) {
    this.router.navigate(['admin', 'vessel-clearance', 'noa-applications', event.id]);
  }

  onAllowDischarge(value: boolean) {
    if (value) {
      this.progressBar.open();
      this.getApplicationByJetty();
    }
  }

}
