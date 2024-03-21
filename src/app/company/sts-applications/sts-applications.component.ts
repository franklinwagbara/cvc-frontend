import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppException } from 'src/app/shared/exceptions/AppException';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ShipToShipService } from 'src/app/shared/services/ship-to-ship.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { RecipientsViewComponent } from './recipients-view/recipients-view.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-sts-applications',
  templateUrl: './sts-applications.component.html',
  styleUrls: ['./sts-applications.component.css'],
})
export class StsApplicationsComponent implements OnInit, OnDestroy {
  applications: any[];
  products: IProduct[];
  private allSubscriptions = new Subscription();

  appKeysMappedToHeaders = {
    imoNumber: 'IMO Number',
    vesselName: 'Vessel Name',
    motherVessel: 'Mother Vessel',
    loadingPort: 'Loading Port',
    transferDate: 'Transfer Date',
    totalVolume: 'Product Volume',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private popUp: PopupService,
    private router: Router,
    private libraryService: LibaryService,
    private shipToShipService: ShipToShipService
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  ngOnDestroy(): void {
    if (this.allSubscriptions) {
      this.allSubscriptions.unsubscribe();
    }
  }

  fetchAllData(): void {
    this.spinner.show('Loading applications...');
    this.getApplications();
    this.getProducts();
  }

  getApplications(): void {
    this.allSubscriptions.add(
      this.shipToShipService.getAllRecordsByCompany().subscribe({
        next: (res: any) => {
          this.applications = (res?.data || []).reverse();
          this.spinner.close();
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.log(error);
          this.spinner.close();
          this.cdr.markForCheck();
          this.popUp.open(
            `Something went wrong while fetching applications`,
            'error'
          );
        },
      })
    );
  }

  getProducts(): void {
    this.allSubscriptions.add(
      this.libraryService.getProducts().subscribe({
        next: (res) => {
          this.products = res?.data;
          this.spinner.close();
          this.cdr.markForCheck();
        },
        error: (error: AppException) => {
          console.log(error);
          this.spinner.close();
          this.cdr.markForCheck();
        },
      })
    );
  }

  uploadDocument(row: any) {
    this.router.navigate(['/company/sts-document-upload', row.id]);
  }

  viewRecipients(row: any) {
    let recipientVessels = this.applications.find(
      (el) => el.id === row.id
    )?.transferDetails;
    recipientVessels = recipientVessels.map((v) => {
      return {
        ...v,
        product: this.products.find((p) => p.id === v.productId)?.name,
      };
    });
    this.dialog.open(RecipientsViewComponent, {
      data: { vessels: recipientVessels },
    });
  }
}
