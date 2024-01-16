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
import { IApplication } from '../../../../src/app/shared/interfaces/IApplication';
import { ProgressBarService } from '../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { LicenceService } from '../../../../src/app/shared/services/licence.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { environment } from '../../../../src/environments/environment';
import { IPermit } from '../../../../src/app/shared/interfaces/IPermit';

@Component({
  selector: 'app-my-permits',
  templateUrl: 'mypermits.component.html',
  styleUrls: ['./mypermits.component.scss'],
})
export class MypermitsComponent implements OnInit, AfterViewInit {
  public permits: IPermit[];

  public tableTitles = {
    permits: 'MY CERTIFICATES',
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
        if (res[0].success) this.permits = res[0].data;

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

  onViewData(event: any, type: string) {
    window.location.assign(
      `${environment.apiUrl}/licenses/view_license?id=${event.id}`
    );
  }

  viewCoQCerts(row: any) {
    this.router.navigateByUrl(`/company/mycertificates/${row.id}/coqs`);
  }

  viewDebitNotes(row: any) {
    this.router.navigateByUrl(`/company/mycertificates/${row.id}/debit-notes`);
  }
}
