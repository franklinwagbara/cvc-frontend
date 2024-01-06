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
import { IApplication } from '../../shared/interfaces/IApplication';
import { ProgressBarService } from '../../shared/services/progress-bar.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LicenceService } from '../../shared/services/licence.service';
import { PopupService } from '../../shared/services/popup.service';
import { environment } from '../../../environments/environment';
import { Category } from '../settings/modules-setting/modules-setting.component';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css'],
})
export class CertificatesComponent implements OnInit, AfterViewInit {
  public applications: IApplication[];
  public categories: Category[];

  public tableTitles = {
    applications: 'All Licences',
  };

  public applicationKeysMappedToHeaders = {
    companyName: 'Company Name',
    email: 'Company Email',
    vesselName: 'Vessel Name',
    vesselTypeType: 'Vessel Type',
    licenseNo: 'Licence Number',
    issuedDate: 'Issued Date',
    expiryDate: 'Expiry Date',
    // appType: 'Application Type',
    // status: 'Status',
  };

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private progressBar: ProgressBarService,
    private spinner: SpinnerService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private licenceService: LicenceService,
    private popup: PopupService
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    forkJoin([this.licenceService.getLicences()]).subscribe({
      next: (res) => {
        if (res[0].success) this.applications = res[0].data;

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
    // this.router.navigate([`/admin/view-application/${event.appId}`], {
    //   queryParams: { id: event.id, appSource: AppSource.Licence },
    // });
    window.location.assign(
      `${environment.apiUrl}/licenses/view_license?id=${event.id}`
    );
  }
}
