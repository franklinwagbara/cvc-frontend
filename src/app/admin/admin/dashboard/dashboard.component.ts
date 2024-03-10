import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  GenericService,
  AuthenticationService,
} from '../../../../../src/app/shared/services';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { environment } from '../../../../../src/environments/environment';


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
  isNOAProcessor: boolean;
  isCOQProcessor: boolean;

  tableTitles = {
    messages: 'Messages',
    processingForThreeWeeks: 'Applications in Process in the Past Three Weeks',
    onStaffDeskForFiveDays: 'Applcations on My Desk in the Last Five Days',
  };

  messageKeysMappedToHeaders = {
    subject: 'Subject',
    isRead: 'Seen',
    content: 'Content',
    date: 'Date',
  };

  processingForThreeWeekKeysMappedToHeaders = {
    id: 'Application ID',
    categoryId: 'Category ID',
    // phaseStage: 'Phase Stage',
    location: 'Location',
    doc: 'Document',
  };

  onStaffDeskForFiveDayMappedToHeaders = {
    id: 'Application ID',
    categoryId: 'Category ID',
    // phaseStage: 'Phase Stage',
    location: 'Location',
    doc: 'Document',
  };
  // displapAppFiveDays = true;

  constructor(
    public generic: GenericService,
    private auth: AuthenticationService,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.isNOAProcessor = auth.isNOAProcessor;
    this.isCOQProcessor = auth.isCOQProcessor;
  }

  ngOnInit(): void {
    this.spinner.show('Loading dashboard...');

    this.auth.getStaffDashboard().subscribe({
      next: (result) => {
        if (result.success) {
          console.log(result.data);
          this.dashboardInfo = result.data;
          this.processingForThreeWeeks =
            this.dashboardInfo.inProcessingForThreeWeeks;
          this.onStaffDeskForFiveDays =
            this.dashboardInfo.onStaffDeskForFiveDays;

          this.spinner.close();
          this.cd.markForCheck();
        }
      },
      error: (error: any) => {
        console.error(error);
        this.spinner.close();
        this.snackBar.open('Could not get dashboard', null, {
          panelClass: ['error'],
        });
      },
    });
  }

  logout(): void {
    this.auth.logout();
    // this.router.navigate([]);
    window.location.href = environment.apiUrl + '/account/logout';
  }
}

export class DashBoardModel {
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
