import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenericService, AuthenticationService } from 'src/app/shared/services';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dashboardInfo: DashBoardModel;
  processingForThreeWeeks: IProcessingForThreeWeeks[] = [];
  onStaffDeskForFiveDays: IOnStaffDeskForFiveDays[] = [];
  messages: IMessages[] = [];

  tableTitles = {
    messages: 'Messages',
    processingForThreeWeeks: 'Applications in Process in the Pass Three Weeks',
    onStaffDeskForFiveDays: 'Applcations on My Desk in the Last Five Days',
  };

  messageKeysMappedToHeaders = {};

  processingForThreeWeekKeysMappedToHeaders = {
    id: 'Application ID',
    categoryId: 'Category ID',
    // phaseStage: 'Phase Stage',
    location: 'Location',
    doc: 'Document',
  };

  onStaffDeskForFiveDayMappedToHeaders = {};
  // displapAppFiveDays = true;

  constructor(
    public generic: GenericService,
    private auth: AuthenticationService,
    private router: Router,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.spinner.open();

    this.auth.getStaffDashboard().subscribe((result) => {
      if (result.success) {
        console.log(result.data);
        this.dashboardInfo = result.data;
        this.processingForThreeWeeks =
          this.dashboardInfo.inProcessingForThreeWeeks;
        this.onStaffDeskForFiveDays = this.dashboardInfo.onStaffDeskForFiveDays;

        this.spinner.close();
        this.cd.markForCheck();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    // this.router.navigate([]);
    window.location.href = environment.apiUrl + '/auth/log-out';
  }
}

class DashBoardModel {
  deskCount: number;
  tApproved: number;
  rejectedCount: number;
  tProcessing: number;
  tAmount: number;
  tFixedFacs: number;
  tLicensedfacs: number;
  tMobileFacs: number;
  tRejected: number;
  tValidLicense: number;
  totalApps: number;
  totalLicenses: number;
  onStaffDeskForFiveDays: [];
  inProcessingForThreeWeeks: [];

  constructor(obj: any) {
    this.deskCount = obj?.deskCount;
    this.tApproved = obj.approvedCount;
    this.rejectedCount = obj.rejectedCount;
    this.tProcessing = obj.processingCount;
    this.onStaffDeskForFiveDays = obj.onStaffDeskForFiveDays;
    this.inProcessingForThreeWeeks = obj.inProcessingForThreeWeeks;
  }
}

interface IProcessingForThreeWeeks {
  id: number;
  categoryId: number;
  lgaId: 0;
  location: string;
  phaseStageId: number;
  applicationforms: [];
}

interface IOnStaffDeskForFiveDays {}

interface IMessages {}
