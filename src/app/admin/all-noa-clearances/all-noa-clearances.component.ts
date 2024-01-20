import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LicenceService } from 'src/app/shared/services/licence.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-noa-clearances',
  templateUrl: './all-noa-clearances.component.html',
  styleUrls: ['./all-noa-clearances.component.css']
})
export class AllNoaClearancesComponent implements OnInit {
  clearances: any[]

  clearanceKeysMappedToHeaders = {
    licenseNo: 'Clearance ID',
    issuedDate: 'Issue Date',
    companyName: 'Company Name',
    vesselName: 'Vessel Name',
    vesselTypeType: 'Vessel Type',
    email: 'Company Email'
  }

  constructor(
    private licenseService: LicenceService,
    private spinner: SpinnerService,
    private popUp: PopupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllClearances();
  }

  getAllClearances() {
    this.spinner.show('Loading clearances...');
    this.licenseService.getLicences().subscribe({
      next: (res: any) => {
        this.clearances = res?.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close();
        this.popUp.open('Something went wrong while fetching clearances', 'error');
        this.cd.markForCheck();
      }
    })
  }

  onViewData(event: any): void {
    window.open(`${environment.apiUrl}/licenses/view_license?id=${event?.id}`);
  }
}
