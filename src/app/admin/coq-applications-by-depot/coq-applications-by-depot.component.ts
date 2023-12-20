import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICoQApplication } from 'src/app/shared/interfaces/ICoQApplication';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-coq-applications-by-depot',
  templateUrl: './coq-applications-by-depot.component.html',
  styleUrls: ['./coq-applications-by-depot.component.css']
})
export class CoqApplicationsByDepotComponent implements OnInit {
  public applications: ICoQApplication[];
  
  public tableTitles = {
    applications: 'COQ Applications',
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
  ) {
  }

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

        // this.progressBar.close();
        this.spinner.close();
        this.cdr.markForCheck();
      },
    });
  }

} 
