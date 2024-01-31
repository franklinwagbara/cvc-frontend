import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../../../src/app/shared/services';
import { ApplyService } from '../../../../../src/app/shared/services/apply.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { LicenceService } from '../../../../../src/app/shared/services/licence.service';
import { PaymentService } from '../../../../../src/app/shared/services/payment.service';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss'],
})
export class ViewPaymentComponent implements OnInit {
  public payment: any;
  public appActions: any;
  public id: number;
  // public appSource: AppSource;
  //public licence: any;
  public currentUser: any;

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private appService: ApplyService,
    private paymentService: PaymentService,
    public dialog: MatDialog,
    public progressBar: ProgressBarService,
    private spinner: SpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private licenceService: LicenceService
  ) {
    this.route.queryParams.subscribe((params) => {
      //this.id = parseInt(params['id']);
    });

    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id']);
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
    this.getPaymentById();
  }

  public get isSupervisor() {
    return (this.currentUser as any).userRoles === 'Supervisor';
  }

  isCreatedByMe(scheduleBy: string) {
    const currentUser = this.auth.currentUser;
    return currentUser.userId == scheduleBy;
  }

  getPaymentById() {
    this.spinner.open();
    this.paymentService.getPaymentById(this.id).subscribe({
      next: (res) => {
        this.spinner.close();
        if (res.success) {
          this.payment = res.data;
        }

        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.spinner.close();
        this.snackBar.open(
          'Something went wrong while retrieving data.',
          null,
          {
            panelClass: ['error'],
          }
        );

        this.cd.markForCheck();
      },
    });
  }

  viewPaymentInFull() {
    this.router.navigate([`/admin/view-payment-in-full/${this.id}`], {
      //queryParams: { id: this.appId, appSource: this.appSource },
    });
  }
}
