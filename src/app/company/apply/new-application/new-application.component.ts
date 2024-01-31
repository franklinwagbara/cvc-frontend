import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppException } from '../../../../../src/app/shared/exceptions/AppException';
import { IVesselType } from '../../../../../src/app/shared/reusable-components/permit-stage-doc-form/permit-stage-doc-form.component';
import { ApplicationService } from '../../../../../src/app/shared/services/application.service';
import { LibaryService } from '../../../../../src/app/shared/services/libary.service';
import { PopupService } from '../../../../../src/app/shared/services/popup.service';
import { SpinnerService } from '../../../../../src/app/shared/services/spinner.service';
import { IAppDepot } from 'src/app/shared/interfaces/IAppDepot';
import { IFacility, IFacilityType } from 'src/app/shared/interfaces/IFacility';
import { IApplicationFormDTO } from 'src/app/shared/interfaces/IApplicationFormDTO';
import { IVessel } from 'src/app/shared/interfaces/IVessel';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css', '../apply.component.scss'],
})
export class NewApplicationComponent implements OnInit {
  public applicationTypes: IApplicationType[];
  public facilityTypes: IFacilityType[];
  public states: IState[];
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
  public selectedAppDepots: IAppDepot[] = [];
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
  public appDepotForm: FormGroup;

  dateValidation = {
    min: new Date()
  }

  constructor(
    private libraryService: LibaryService,
    private popUp: PopupService,
    private formBuilder: FormBuilder,
    private appService: ApplicationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.vesselForm = this.formBuilder.group({
      vesselName: ['', Validators.required],
      loadingPort: ['', Validators.required],
      jetty: ['', Validators.required],
      motherVessel: ['', Validators.required],
      marketerName: ['', Validators.required],
      productId: ['', Validators.required],
      eta: ['', Validators.required],
      vesselTypeId: ['', Validators.required],
      imoNumber: ['', Validators.required],
    });

    this.facilityForm = this.formBuilder.group({
      sourceOfProducts: ['', Validators.required],
      // applicationTypeId: ['', Validators.required],
      facilityName: ['', Validators.required],
      address: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      stateId: ['', Validators.required],
      lgaId: ['', Validators.required],
    });

    this.appDepotForm = this.formBuilder.group({
      // name: ['', Validators.required],
      depotId: ['', Validators.required],
      volume: ['', Validators.required],
      productId: ['', Validators.required],
    });

    this.stateControl.valueChanges.subscribe((value) => {
      if (!value) return;
      this.getLGAByStateId(value);
    });

    this.segmentState = 1;
    // this.validateImo();
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
    })
  }

  fetchAllData() {
    this.getFacilityTypes();
    this.getApplicationTypes();
    this.getStates();
    this.getProducts();
    this.getVesselTypes();
    this.getDepots();
    this.getAllJetty();
  }

  public get vesselFormControl() {
    return this.vesselForm.controls;
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

  public get stateControl() {
    return this.facilityForm.controls['stateId'];
  }

  public get isNext() {
    return (
      this.vesselForm.controls['vesselName'].valid &&
      this.vesselForm.controls['loadingPort'].valid &&
      this.vesselForm.controls['jetty'].valid &&
      this.vesselForm.controls['motherVessel'].valid &&
      this.vesselForm.controls['vesselTypeId'].valid &&
      this.vesselForm.controls['imoNumber'].valid &&
      this.vesselForm.controls['eta'].valid
    );
  }

  public get licenseNumberControl() {
    return this.facilityForm.controls['licenseNumber'];
  }

  public get productIdControl() {
    return this.appDepotForm.controls['productId'];
  }

  public updateState(s: 1 | 2 | 3) {
    this.segmentState = s;
    this.cd.markForCheck();
  }

  public submit() {
    const payload: IApplicationFormDTO = {
      vesselName: this.vesselForm.value.vesselName,
      loadingPort: this.vesselForm.value.loadingPort,
      vesselTypeId: this.vesselForm.value.vesselTypeId,
      imoNumber: (this.vesselForm.value.imoNumber as number).toString(),
      jetty: this.vesselForm.value.jetty,
      motherVessel: this.vesselForm.value.motherVessel,
      eta: new Date(this.vesselForm.value.eta).toISOString(),
      applicationTypeId: this.applicationTypeId,
      depotList: this.selectedAppDepots,

      facilityName: this.vesselForm.value.vesselName,
      facilitySources: this.selectedFacility,
      marketerName: this.vesselForm.value.marketerName,
    };

    this.spinner.show('Saving vessel details');
    this.appService.apply(payload).subscribe({
      next: (res) => {
        const appId = res.data.appId;
        this.spinner.close();
        this.cd.markForCheck();
        this.popUp.open(
          `${this.selectedAppDepots.length} ${
            this.selectedAppDepots.length > 1 ? 'Depots' : 'Depot'
          } added successfully.`,
          'success'
        );
        this.router.navigate(['company', 'paymentsum', appId]);
      },
      error: (error: AppException) => {
        this.popUp.open(error.message, 'error');
        this.spinner.close();
      },
    });
  }

  public addAppDepot() {
    const formValue = this.appDepotForm.value;
    const newDepot: any = {
      id: 0,
      depotId: formValue.depotId,
      name: this.depots.find((d) => d.id == formValue?.depotId)?.name,
      volume: formValue.volume as number,
      productId: formValue.productId,
      product: this.products.find((x) => x.id == formValue.productId).name,
    };

    const isExist = this.selectedAppDepots.find((x) => x.name == newDepot.name);

    if (!isExist) {
      this.selectedAppDepots.push(newDepot);
      this.appDepotForm.reset();
    }
    else this.popUp.open('This depot has been added before!', 'error');

    this.cd.markForCheck();
  }

  public addFacility() {
    const formValue = this.facilityForm.value;
    const newFacility: IFacility = {
      sourceOfProducts: formValue.sourceOfProducts,
      facilityName: formValue.facilityName,
      name: formValue.facilityName,
      address: formValue.address,
      licenseNumber: formValue.licenseNumber,
      stateId: formValue.stateId,
      lgaId: formValue.lgaId,
    };

    const isExist = this.selectedFacility.find(
      (x) => x.sourceOfProducts == newFacility.sourceOfProducts
    );

    this.facilityForm.reset();

    if (!isExist) this.selectedFacility.push(newFacility);
    else this.popUp.open('This facility has been added before!', 'error');
    this.cd.markForCheck();
  }

  public removeDepot(tank: IAppDepot) {
    this.selectedAppDepots = this.selectedAppDepots.filter(
      (x) => x.name !== tank.name
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
          return a?.name.toLowerCase() < b?.name.toLowerCase
            ? -1
            : a?.name.toLowerCase() > b?.name.toLowerCase()
            ? 1
            : 0;
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

  public getDepots() {
    this.spinner.open();
    this.libraryService.getAppDepots().subscribe({
      next: (res) => {
        this.depots = (res?.data || []).sort((a: any, b: any) => {
          return a?.name.toLowerCase() < b?.name.toLowerCase()
            ? -1
            : a?.name.toLowerCase() > b?.name.toLowerCase()
            ? 1
            : 0;
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

  public getStates() {
    this.spinner.open();

    this.libraryService.getStates().subscribe({
      next: (res) => {
        this.states = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popUp.open(error.message, 'error');
        this.spinner.close();
      },
    });
  }

  public getLGAByStateId(id: number) {
    this.spinner.open();

    this.libraryService.getLGAByStateId(id).subscribe({
      next: (res) => {
        this.lga = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: AppException) => {
        this.popUp.open(error.message, 'error');
        this.spinner.close();
      },
    });
  }

  public CheckVesselDetails() {
    // this.showLoader = true;
    this.spinner.show(' Searching vessel details');
    this.imoNumber = this.vesselForm.get('imoNumber').value;
    this.appService.getVesselByImoNumber(this.imoNumber).subscribe({
      next: (res) => {
        if (res.data) {
          this.vesselInfo = res.data;
          this.vesselForm.get('vesselName').setValue(this.vesselInfo.name);
        }
        // this.showLoader = false;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.vesselInfo = null;
        this.vesselForm.get('vesselName').setValue('');
        // this.showLoader = false;
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  validateImo() {
    if (this.vesselForm.get('imoNumber').value != '') this.CheckVesselDetails();
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
