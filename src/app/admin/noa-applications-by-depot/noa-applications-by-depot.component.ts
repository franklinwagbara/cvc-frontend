import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IApplication } from '../../shared/interfaces/IApplication';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-noa-applications-by-depot',
  templateUrl: './noa-applications-by-depot.component.html',
  styleUrls: ['./noa-applications-by-depot.component.css']
})
export class NoaApplicationsByDepotComponent implements OnInit {
  public applications: IApplication[];
  
  public tableTitles = {
    applications: 'NOA Applications',
  };

  public applicationKeysMappedToHeaders = {
    reference: 'Reference Number',
    companyName: 'Company Name',
    vesselName: 'Vessel Name',
    createdDate: 'Initiation Date',
    capacity: 'Capacity',
    status: 'Status',
  };

  constructor(
    private applicationService: ApplicationService,
    private spinner: SpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.spinner.open();

    this.applicationService.getAllApplications().subscribe({
      next: (res) => {
        if (res[0].success) this.applications = res[0].data;

        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.spinner.close();
        this.cdr.markForCheck();
      },
    });
  }

  onInitiateCoq(event: any) {
    this.router.navigate([`/admin/noa-applications-by-depot/${event.id}/certificate-of-quantity/new-application`]);
  }
}
