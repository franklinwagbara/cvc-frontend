import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppException } from 'src/app/shared/exceptions/AppException';
import { RecipientsViewComponent } from './recipients-view/recipients-view.component';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { ShipToShipService } from 'src/app/shared/services/ship-to-ship.service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IVessel } from 'src/app/shared/interfaces/IVessel';

@Component({
  selector: 'app-sts-applications',
  templateUrl: './sts-applications.component.html',
  styleUrls: ['./sts-applications.component.css']
})
export class StsApplicationsComponent implements OnInit {
  applications: any[];
  products: IProduct[];

  appKeysMappedToHeaders = {
    imoNumber: 'IMO Number',
    vesselName: 'Vessel Name',
    motherVessel: 'Mother Vessel',
    loadingPort: 'Loading Port',
    transferDate: 'Transfer Date',
    totalVolume: 'Product Volume',
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private popUp: PopupService,
    private libraryService: LibaryService,
    private shipToShipService: ShipToShipService
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }
  
  fetchAllData(): void {
    this.spinner.show('Loading applications...');
    this.getApplications();
    this.getProducts();
  }

  getApplications(): void {
    this.shipToShipService.getAllRecords().subscribe({
      next: (res: any) => {
        this.applications = (res?.data || []).reverse();
        this.spinner.close();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close();
        this.cdr.markForCheck();
        this.popUp.open(`Something went wrong while fetching applications`, 'error');
      }
    })
  }

  getProducts(): void {
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
    });
  }

  viewRecipients(row: any) {
    let recipientVessels = this.applications.find((el) => el.id === row.id)?.transferDetails;
    recipientVessels = recipientVessels.map((v: IVessel) => {
      return { ...v, product: this.products.find((p) => p.id === v.productId)?.name }
    })
    this.dialog.open(RecipientsViewComponent, {
      data: { vessels: recipientVessels }
    });
  }

}
