import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProgressBarService } from '../../shared/services/progress-bar.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LicenceService } from '../../shared/services/licence.service';
import { PopupService } from '../../shared/services/popup.service';
import { environment } from '../../../environments/environment';
import { IPermit } from '../../shared/interfaces/IPermit';
import { LoginModel } from 'src/app/shared/models/login-model';
import { OperatingFacility } from '../company.component';
import { AuthenticationService } from 'src/app/shared/services';

@Component({
  selector: 'app-my-permits',
  templateUrl: 'myapprovals.component.html',
  styleUrls: ['./myapprovals.component.scss'],
})
export class MyapprovalsComponent implements OnInit {
  public approvals: IPermit[];
  currentUser: LoginModel;
  OperatingFacility = OperatingFacility;

  public tableTitles = {
    approvals: 'MY CERTIFICATES',
  };

  public applicationKeysMappedToHeaders = {
    // companyName: 'Company Name',
    // email: 'Company Email',
    vesselName: 'Vessel Name',
    vesselTypeType: 'Vessel Type',
    licenseNo: 'Clearance No',
    issuedDate: 'Issued Date',
    expiryDate: 'Expiry Date',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private router: Router,
    private licenseService: LicenceService,
    private cd: ChangeDetectorRef,
    private licenceService: LicenceService,
    private popup: PopupService,
    public auth: AuthenticationService
  ) {
    this.currentUser = this.auth.currentUser;
  }

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([this.licenceService.getCompanyLicences()]).subscribe({
      next: (res) => {
        if (res[0].success) this.approvals = res[0].data;

        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.popup.open('Something went wrong while retrieving data.', 'error');

        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  onViewData(event: any) {
    window.open(
      `${environment.apiUrl}/licenses/view_license?id=${event.id}`,
      '_blank'
    );
  }

  viewCoQCerts(row: any) {
    this.router.navigateByUrl(`/company/approvals/${row.applicationId}/coqs`);
  }

  viewDebitNotes(row: any) {
    this.router.navigateByUrl(`/company/approvals/${row.applicationId}/debit-notes`);
  }
}
