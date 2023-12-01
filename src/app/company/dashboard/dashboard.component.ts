import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/shared/services/company.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { GenericService } from '../../shared/services/generic.service';
import { AuthenticationService } from '../../shared/services';
import { LoginModel } from '../../shared/models/login-model';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public title = 'AUS2FrontEnd';
  public showapply = false;
  public showaccount = false;
  public generic: GenericService;
  public currentUsername: LoginModel;
  public dashboard: IDashboard;
  public messages: IMessage;

  constructor(
    private gen: GenericService,
    private router: Router,
    private auth: AuthenticationService,
    private companyService: CompanyService,
    private progress: ProgressBarService,
    private cd: ChangeDetectorRef,
    private popUp: PopupService,
    private adminService: AdminService
  ) {
    this.generic = gen;
    this.currentUsername = auth.currentUser;
  }

  ngOnInit(): void {
    this.getCompanyDashboard();
    this.getCompanyMessages();
  }

  public getCompanyDashboard() {
    this.progress.open();

    this.adminService.getStaffDashboard().subscribe({
      next: (res) => {
        this.dashboard = res.data;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: any) => {
        this.popUp.open(error?.message, 'error');
        this.progress.close();
      },
    });
  }

  public getCompanyMessages() {
    this.progress.open();

    this.companyService.getCompanyMessages().subscribe({
      next: (res) => {
        this.messages = res.data;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: any) => {
        this.popUp.open(error?.message, 'error');
        this.progress.close();
      },
    });
  }

  showApply() {
    if (this.showapply) {
      this.showapply = false;
    } else {
      this.showapply = true;
    }
  }

  showAccount() {
    if (this.showaccount) {
      this.showaccount = false;
    } else {
      this.showaccount = true;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/' + this.generic.home]);
  }
}

export interface IDashboard {
  deskCount: number;
  tAmount: number;
  tApproved: number;
  tFixedFacs: number;
  tLicensedfacs: number;
  tMobileFacs: number;
  tProcessing: number;
  tRejected: number;
  tValidLicense: number;
  totalApps: number;
  totalLicenses: number;
}

export interface IMessage {}
