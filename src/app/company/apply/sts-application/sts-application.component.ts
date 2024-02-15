import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppException } from '../../../shared/exceptions/AppException';
import { IVesselType } from '../../../shared/reusable-components/permit-stage-doc-form/permit-stage-doc-form.component';
import { ApplicationService } from '../../../shared/services/application.service';
import { LibaryService } from '../../../shared/services/libary.service';
import { PopupService } from '../../../shared/services/popup.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { IVessel } from 'src/app/shared/interfaces/IVessel';
import { IFacility, IFacilityType } from 'src/app/shared/interfaces/IFacility';
import { IApplicationFormDTO } from 'src/app/shared/interfaces/IApplicationFormDTO';
import { IAppDepot } from 'src/app/shared/interfaces/IAppDepot';
import { Util } from 'src/app/shared/lib/Util';
import { ShipToShipService } from 'src/app/shared/services/ship-to-ship.service';


@Component({
  selector: 'app-sts-application',
  templateUrl: './sts-application.component.html',
  styleUrls: ['./sts-application.component.css']
})
export class StsApplicationComponent {
  public applicationTypes: IApplicationType[];
  public facilityTypes: IFacilityType[];
  public lga: ILGA[];
  public isLicenceVerified = false;
  public applicationTypeId: number;
  public isLoading = false;
  // public tanks: ITank[];
  public appDepots: IAppDepot[];
  public products: IProduct[];
  public depots: IDepot[];
  public jetties: any[];
  // public selectedTanks: ITankDTO[] = [];
  public selectedRecipientVessels: IVessel[] = [];
  public isMobile = false;
  public selectedFacility: IFacility[] = [];
  public vesselTypes: IVesselType[] = [];
  public vesselInfo: IVessel | any;
  public imoNumber: string;
  public showLoader: boolean = false;

  public segmentState: 1 | 2 | 3;

  public facilityForm: FormGroup;
  public vesselForm: FormGroup;
  // public tankForm: FormGroup;
  public recipientVesselForm: FormGroup;

  submitting = false;
  submitted = false;

  dateValidation = {
    max: new Date()
  }

  constructor(
    private libraryService: LibaryService,
    private popUp: PopupService,
    private formBuilder: FormBuilder,
    private appService: ApplicationService,
    private shipToShip: ShipToShipService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.vesselForm = this.formBuilder.group({
      imoNumber: ['', Validators.required],
      vesselName: ['', Validators.required],
      motherVessel: ['', Validators.required],
      loadingPort: ['', Validators.required],
      totalVolume: ['', [Validators.required, Validators.min(1)]],
      vesselTypeId: ['', Validators.required],
      transferDate: ['', Validators.required]
    });
    
    this.recipientVesselForm = this.formBuilder.group({
      imoNumber: ['', Validators.required],
      vesselName: ['', Validators.required],
      offtakeVolume: ['', [Validators.required, Validators.min(1)]],
      productId: ['', Validators.required],
    });

    this.segmentState = 1;
    this.fetchAllData();
  }

  getAllJetty() {
    this.spinner.open();
    this.libraryService.getAllJetty().subscribe({
      next: (res: any) => {
        this.jetties = res?.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.log(error);
        this.spinner.close();
        this.popUp.open('Something went wrong while fetching jetties', 'error');
        this.cd.markForCheck();
      }
    });
  }

  fetchAllData() {
    this.getFacilityTypes();
    this.getApplicationTypes();
    this.getProducts();
    this.getVesselTypes();
    this.getDepots();
    this.getAllJetty();
  }

  public get vesselFormControl() {
    return this.vesselForm.controls;
  }

  public get destVesselFormControl() {
    return this.recipientVesselForm.controls;
  }

  public get activateFirstSegment() {
    return this.segmentState === 1;
  }

  public get activateSecondSegment() {
    return this.segmentState === 2;
  }

  public get activateThirdSegment() {
    return this.segmentState == 3;
  }

  public get isNext() {
    return this.vesselForm.valid;
  }

  public get licenseNumberControl() {
    return this.facilityForm.controls['licenseNumber'];
  }

  public get productIdControl() {
    return this.recipientVesselForm.controls['productId'];
  }

  public updateState(s: 1 | 2 | 3) {
    Util.scrollToTop();
    this.segmentState = s;
    this.cd.markForCheck();
  }

  public submit() {
    const payload: IApplicationFormDTO = {
      vesselName: this.vesselForm.value.vesselName,
      loadingPort: this.vesselForm.value.loadingPort,
      imoNumber: this.vesselForm.value.imoNumber,
      totalVolume: this.vesselForm.value.totalVolume,
      motherVessel: this.vesselForm.value.motherVessel,
      vesselTypeId: this.vesselForm.value.vesselTypeId,
      transferDate: new Date(this.vesselForm.value.transferDate).toISOString(),
      destinationVessels: this.selectedRecipientVessels.map((el) => ({ 
        imoNumber: el.imoNumber,
        vesselName: el.vesselName,
        offtakeVolume: el.offtakeVolume,
        productId: el.productId, 
      })),
    };

    this.spinner.show('Submitting application...');
    this.submitting = true;
    this.shipToShip.addRecord(payload).subscribe({
      next: (res) => {
        this.submitting = false;
        this.submitted = true;
        this.spinner.close();
        this.popUp.open('Application submitted successfully.', 'success');
        setTimeout(() => {
          this.router.navigate(['company', 'sts-applications']);
        }, 2500)
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.submitting = false;
        this.popUp.open(error.message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  public addRecipientVessel() {
    const formValue = this.recipientVesselForm.value;
    const newVessel: any = {
      ...formValue,
      offtakeVolume: formValue.offtakeVolume as number,
      productId: formValue.productId as number,
      productName: this.products.find((x) => x.id == formValue.productId).name,
    };

    const isExist = this.selectedRecipientVessels.find((x) => x.imoNumber == newVessel.imoNumber);
    const volumeMismatch = this.selectedRecipientVessels.reduce((prev, curr) => {
      prev += curr?.offtakeVolume;
      return prev;
    }, 0) + newVessel.offtakeVolume > (this.vesselForm.controls['totalVolume'].value as number);

    if (!isExist && !volumeMismatch) {
      this.selectedRecipientVessels.push(newVessel);
      this.recipientVesselForm.reset();
    } else if (isExist) {
      this.popUp.open('This depot has been added before!', 'error');
    } else {
      this.popUp.open('Total volume to transfer cannot exceed the total volume of source vessel', 'error');
    }

    this.cd.markForCheck();
  }

  public removeVessel(vessel: IVessel) {
    this.selectedRecipientVessels = this.selectedRecipientVessels.filter(
      (x) => x.vesselName !== vessel.vesselName
    );
    this.cd.markForCheck();
  }

  public removeFacility(facility: IFacility) {
    this.selectedFacility = this.selectedFacility.filter(
      (x) => x.sourceOfProducts !== facility.sourceOfProducts
    );
    this.cd.markForCheck();
  }

  public getFacilityTypes() {
    this.spinner.open();

    this.libraryService.getFacilityTypes().subscribe({
      next: (res) => {
        this.facilityTypes = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popUp.open(error.message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  public getApplicationTypes() {
    this.spinner.open();

    this.libraryService.getApplicationTypes().subscribe({
      next: (res) => {
        this.applicationTypes = res.data;
        this.applicationTypeId = this.applicationTypes.find(
          (x) => x.name.toLowerCase() == 'new'
        )?.id;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popUp.open(error.message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  public getProducts() {
    this.spinner.open();
    this.libraryService.getProducts().subscribe({
      next: (res) => {
        this.products = res?.data.sort((a: any, b: any) => {
          const aGreaterThanB = 
            a?.name.toLowerCase() > b?.name.toLowerCase() ? 1 : 0;
          const predicate = 
            a?.name.toLowerCase() < b?.name.toLowerCase ? -1 : aGreaterThanB
          return predicate;
        });
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.spinner.close();
        this.popUp.open(error.message, 'error');
        this.cd.markForCheck();
      },
    });
  }

  public getDepots() {
    this.spinner.open();
    this.libraryService.getAppDepots().subscribe({
      next: (res) => {
        this.depots = (res?.data || []).sort((a: any, b: any) => {
          const aGreaterThanB = 
            a?.name.toLowerCase() > b?.name.toLowerCase() ? 1 : 0;
          const predicate = 
            a?.name.toLowerCase() < b?.name.toLowerCase ? -1 : aGreaterThanB
          return predicate;
        });
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popUp.open(error.message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  public getVesselTypes() {
    this.spinner.open();
    this.libraryService.getVesselTypes().subscribe({
      next: (res) => {
        this.vesselTypes = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popUp.open(error.message, 'error');
        this.spinner.close();
      },
    });
  }

  public CheckVesselDetails(vesselType: 'source' | 'recipient') {
    this.spinner.show(' Searching vessel details');
    this.imoNumber = vesselType === 'source' 
      ? this.vesselForm.get('imoNumber').value
      : this.recipientVesselForm.get('imoNumber').value;
    this.appService.getVesselByImoNumber(this.imoNumber).subscribe({
      next: (res) => {
        if (res.data) {
          this.vesselInfo = res.data;
          if (vesselType === 'source') {
            this.vesselForm.get('vesselName').setValue(this.vesselInfo.name);
          } else {
            this.recipientVesselForm.get('vesselName').setValue(this.vesselInfo.name);
          }
        }
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.vesselInfo = null;
        if (vesselType === 'source') {
          this.vesselForm.get('vesselName').setValue('');
        } else {
          this.recipientVesselForm.get('vesselName').setValue('');
        }
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  validateImo(vesselType: 'source' | 'recipient') {
    if ((vesselType === 'source' && this.vesselForm.get('imoNumber').value != '')
      || (vesselType === 'recipient' && this.recipientVesselForm.get('imoNumber').value != '')) 
    {
      this.CheckVesselDetails(vesselType);
    }
  }

  @HostListener('keydown', ['$event'])
  blockSpecialNonNumerics(evt: KeyboardEvent) {
    Util.blockSpecialNonNumerics(evt);
  }
}

export interface IState {
  id: number;
  name: string;
  countryID: number;
  countryName: string;
  code: string;
}

export interface ILGA {
  id: number;
  name: string;
  stateId: number;
}
export interface ITank {
  id: number;
  name: string;
  capacity: number;
  product: string;
}

export interface ITankDTO {
  id: number;
  name: string;
  capacity: number;
  productId: number;
  product?: string;
  facilityId: number;
  // applicationId?: string;
}

export interface IProduct {
  id: number;
  name: string;
}

export interface IApplicationType {
  id: number;
  name: string;
}

export interface IAppFee {
  id: number;
  applicationTypeId: number;
  applicationFee: number;
  processingFee: number;
  serciveCharge: number;
  noaFee: number;
  coqFee: number;
}

export interface IDepot {
  id: number;
  name: string;
  stateId: number;
  capacity: number;
  state: IState;
  stateName: string;
}
