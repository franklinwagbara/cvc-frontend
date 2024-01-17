import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
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

@Component({
  selector: 'app-my-permits',
  templateUrl: 'myapprovals.component.html',
  styleUrls: ['./myapprovals.component.scss'],
})
export class MyapprovalsComponent implements OnInit, AfterViewInit {
  public approvals: IPermit[];

  public tableTitles = {
    approvals: 'MY CERTIFICATES',
  };

  public applicationKeysMappedToHeaders = {
    // companyName: 'Company Name',
    // email: 'Company Email',
    vesselName: 'Vessel Name',
    vesselTypeType: 'Vessel Type',
    licenseNo: 'Licence Number',
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
    private popup: PopupService
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([this.licenceService.getCompanyLicences()]).subscribe({
      next: (res) => {
        if (res[0].success) this.approvals = res[0].data;

        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popup.open('Something went wrong while retrieving data.', 'error');

        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  ngAfterViewInit(): void {
    // this.categories = [...this.categories];
  }

  onViewData(event: any) {
    window.location.assign(
      `${environment.apiUrl}/licenses/view_license?id=${event.id}`
    );
  }

  viewCoQCerts(row: any) {
    this.router.navigateByUrl(`/company/approvals/${row.id}/coqs`);
  }

  viewDebitNotes(row: any) {
    this.router.navigateByUrl(`/company/approvals/${row.id}/debit-notes`);
  }
}
