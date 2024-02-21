import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../src/app/shared/services/company.service';
import { ProgressBarService } from '../../../../src/app/shared/services/progress-bar.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { AdminService } from '../../../../src/app/shared/services/admin.service';
import { GenericService } from '../../shared/services/generic.service';
import { AuthenticationService } from '../../shared/services';
import { LoginModel } from '../../shared/models/login-model';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewMessageComponent } from '../messages/view-message/view-message.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { OperatingFacility } from '../company.component';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public showapply = false;
  public showaccount = false;
  public generic: GenericService;
  public currentUsername: LoginModel;
  public dashboard: IDashboard;
  public messages: Observable<IMessage[]>;
  public length = 10;
  public pageSizeOptions = [5, 10, 15, 20];
  public pageSize = 10;
  @ViewChild('paginator', { read: MatPaginator })
  paginator!: MatPaginator;
  public dataSource = new MatTableDataSource<any>();
  public messagesCopy: IMessage[];
  public OperatingFacility = OperatingFacility;

  public NavigatePath = {
    applications: 'myapplication',
    processing: 'processing',
    approvals: 'approvals',
  };

  msgColumns = [
    {
      columnDef: 'isRead',
      header: 'Seen',
    },
    {
      columnDef: 'subject',
      header: 'Subject',
    },
    {
      columnDef: 'date',
      header: 'Date',
    },
  ];

  constructor(
    private gen: GenericService,
    private router: Router,
    private auth: AuthenticationService,
    private companyService: CompanyService,
    private progress: ProgressBarService,
    private cd: ChangeDetectorRef,
    private popUp: PopupService,
    private adminService: AdminService,
    private spinner: SpinnerService,
    private dialog: MatDialog
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
    this.spinner.open();

    this.adminService.getStaffDashboard().subscribe({
      next: (res) => {
        this.dashboard = res.data;
        this.progress.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: any) => {
        this.popUp.open(error?.message, 'error');
        this.progress.close();
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  public getCompanyMessages() {
    this.spinner.open();

    this.companyService.getCompanyMessages().subscribe({
      next: (res) => {
        this.messagesCopy = res.data;
        this.length = this.messagesCopy.length;
        this.dataSource = new MatTableDataSource<any>(this.messagesCopy);
        this.cd.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.messages = this.dataSource.connect();
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: any) => {
        this.popUp.open(error?.message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  viewMessage(index: number) {
    this.dialog.open(ViewMessageComponent, {
      data: { index: index, messages: this.messagesCopy },
      panelClass: 'view-message-content',
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

  public navigateTo(path: string) {
    if (path == this.NavigatePath.processing) {
      this.router.navigate([`company`, this.NavigatePath.applications], {
        queryParams: { processing: true },
      });
      return;
    }
    this.router.navigate([`company`, path]);
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
  debitNote?: number;
}

export interface IMessage {
  id: number;
  subject: string;
  isRead: boolean;
  content: string;
  date: string;
}
