import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IApplication } from '../../../../../src/app/shared/interfaces/IApplication';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';

@Component({
  selector: 'app-application-report',
  templateUrl: './application-report.component.html',
  styleUrls: ['./application-report.component.css'],
})
export class ApplicationReportComponent implements OnInit {
  showModal = false;
  checked = false;
  searchValue = '';

  constructor(
    private appService: AdminService,
    private snackBar: MatSnackBar,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef
  ) {}
  public applications: IApplication[] = [];
  public filteredApps1: IApplication[] = [];
  public filteredApps2: IApplication[] = [];
  public sortedApps: IApplication[];

  public applicationKeysMappedToHeaders = {
    reference: 'Reference Number',
    companyName: 'Company Name',
    companyEmail: 'Company Email',
    vesselName: 'Vessel Name',
    vesselType: 'Vessel Type',
    status: 'Status',
    createdDate: 'Date',
  };

  ngOnInit(): void {
    this.getApplications();
  }

  printPage() {
    window.print();
  }

  exportPage() {
    console.log('Page exported');
  }

  generateGraph() {
    this.showModal = true;
  }

  closeGraphModal() {
    this.showModal = false;
  }

  getApplications() {
    this.spinner.open();
    this.appService.getApps().subscribe({
      next: (res) => {
        if (res?.data) {
          this.applications = res.data;
          this.filteredApps1 = [...this.applications];
          this.filteredApps2 = [...this.applications];
        }
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (err: unknown) => {
        console.log(err);
        this.spinner.close();
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          { panelClass: 'error' }
        );
        this.cd.markForCheck();
      },
    });
  }

  onSearchValueEntered1(apps: IApplication[]) {
    this.filteredApps1 = apps;
    this.filteredApps2 = apps;

    this.cd.markForCheck();
  }

  onSearchValueEntered2(apps: IApplication[]) {
    this.filteredApps2 = apps;
    this.cd.markForCheck();
  }

  onSortApps(apps: IApplication[]) {
    this.sortedApps = apps;
    // console.log(this.sortedApps);

    this.cd.markForCheck();
  }

  onCheck(data: boolean) {
    this.checked = data;
    // console.log(this.checked);
  }
}
