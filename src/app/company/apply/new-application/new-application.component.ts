import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { IVesselType } from 'src/app/shared/reusable-components/permit-stage-doc-form/permit-stage-doc-form.component';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

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
  public tanks: ITank[];
  public products: IProduct[];
  public selectedTanks: ITankDTO[] = [];
  public isMobile = false;
  public selectedFacility: IFacility[] = [];
  public vesselTypes: IVesselType[] = [];

  public segmentState: 1 | 2 | 3;

  public facilityForm: FormGroup;
  public vesselForm: FormGroup;
  public tankForm: FormGroup;

  constructor(
    private libraryService: LibaryService,
    private progress: ProgressBarService,
    private popUp: PopupService,
    private formBuilder: FormBuilder,
    private appService: ApplicationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vesselForm = this.formBuilder.group({
      vesselName: ['', Validators.required],
      capacity: ['', Validators.required],
      deadWeight: ['', Validators.required],
      operator: ['', Validators.required],
      vesselTypeId: ['', Validators.required],
      placeOfBuild: ['', Validators.required],
      yearOfBuild: ['', Validators.required],
      flag: ['', Validators.required],
      callSIgn: ['', Validators.required],
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

    this.tankForm = this.formBuilder.group({
      name: ['', Validators.required],
      capacity: ['', Validators.required],
      productId: ['', Validators.required],
    });

    this.isLoading = true;

    // this.licenseNumberControl.valueChanges.subscribe((res) => {
    //   this.isLoading = true;
    //   this.cd.markForCheck();
    // });

    // this.facilityTypeControl.valueChanges.subscribe((res: '1' | '2') => {
    //   if (res == '1') this.isMobile = true;
    //   else this.isMobile = false;
    //   this.cd.markForCheck();
    // });

    this.licenseNumberControl.valueChanges
      .pipe(
        switchMap((res) =>
          this.appService.verifyLicence(res).pipe(
            catchError((error: unknown) => {
              return of(null);
            })
          )
        )
      )
      .subscribe({
        next: (res) => {
          if (res.data == null) {
            this.isLicenceVerified = false;
          } else {
            this.isLicenceVerified = true;
            // this.tanks = res.data.tanks;
          }

          this.isLoading = false;
          this.cd.markForCheck();
        },
        error: (error: unknown) => {
          this.isLicenceVerified = false;

          this.isLoading = false;
          this.cd.markForCheck();
        },
      });

    this.stateControl.valueChanges.subscribe((value) => {
      if (!value) return;
      this.getLGAByStateId(value);
    });

    this.segmentState = 1;

    this.getFacilityTypes();
    this.getApplicationTypes();
    this.getStates();
    this.getProducts();
    this.getVesselTypes();
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
      this.vesselForm.controls['vesselTypeId'].valid &&
      this.vesselForm.controls['operator'].valid &&
      this.vesselForm.controls['capacity'].valid &&
      this.vesselForm.controls['vesselName'].valid
    );
  }

  // public get facilityTypeControl() {
  //   return this.faciltyForm.controls['facilityTypeId'];
  // }

  public get licenseNumberControl() {
    return this.facilityForm.controls['licenseNumber'];
  }

  public get productIdControl() {
    return this.tankForm.controls['productId'];
  }

  public updateState(s: 1 | 2 | 3) {
    this.segmentState = s;
    this.cd.markForCheck();
  }

  public submit() {
    const payload: IApplicationFormDTO = {
      applicationTypeId: this.applicationTypeId,
      facilityName: this.vesselForm.value.vesselName,
      // vesselTypeId: this.vesselForm.value.vesselTypeId,
      vesselTypeId: this.vesselForm.value.vesselTypeId,
      capacity: this.vesselForm.value.capacity,
      deadWeight: this.vesselForm.value.deadWeight,
      operator: this.vesselForm.value.operator,
      placeOfBuild: this.vesselForm.value.placeOfBuild,
      yearOfBuild: this.vesselForm.value.yearOfBuild,
      flag: this.vesselForm.value.flag,
      callSIgn: this.vesselForm.value.callSIgn,
      imoNumber: (this.vesselForm.value.imoNumber as number).toString(),
      facilitySources: this.selectedFacility,
      tankList: this.selectedTanks,
    };

    this.progress.open();
    this.appService.apply(payload).subscribe({
      next: (res) => {
        const appId = res.data.appId;
        this.progress.close();
        this.cd.markForCheck();

        this.router.navigate(['paymentsum', appId]);
      },
      error: (error: unknown) => {
        this.popUp.open(error.message, 'error');
        this.progress.close();
      },
    });
  }

  public addTank() {
    const formValue = this.tankForm.value;
    const newTank: ITankDTO = {
      id: 0,
      name: formValue.name,
      capacity: formValue.capacity as number,
      productId: formValue.productId,
      product: this.products.find((x) => x.id == formValue.productId).name,
      facilityId: 0,
    };

    const isExist = this.selectedTanks.find((x) => x.name == newTank.name);

    this.tankForm.reset();

    if (!isExist) this.selectedTanks.push(newTank);
    else this.popUp.open('This tank has been added before!', 'error');
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

  public removeTank(tank: ITankDTO) {
    this.selectedTanks = this.selectedTanks.filter((x) => x.name !== tank.name);
    this.cd.markForCheck();
  }

  public removeFacility(facility: IFacility) {
    this.selectedFacility = this.selectedFacility.filter(
      (x) => x.sourceOfProducts !== facility.sourceOfProducts
    );
    this.cd.markForCheck();
  }

  public getFacilityTypes() {
    this.progress.open();

    this.libraryService.getFacilityTypes().subscribe({
      next: (res) => {
        this.facilityTypes = res.data;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open(error.message, 'error');
        this.progress.close();
      },
    });
  }

  public getApplicationTypes() {
    this.progress.open();

    this.libraryService.getApplicationTypes().subscribe({
      next: (res) => {
        this.applicationTypes = res.data;
        this.applicationTypeId = this.applicationTypes.find(
          (x) => x.name.toLowerCase() == 'new'
        ).id;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open(error.message, 'error');
        this.progress.close();
      },
    });
  }

  public getProducts() {
    this.progress.open();
    this.libraryService.getProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open(error.message, 'error');
        this.progress.close();
      },
    });
  }

  public getVesselTypes() {
    this.progress.open();
    this.libraryService.getVesselTypes().subscribe({
      next: (res) => {
        this.vesselTypes = res.data;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open(error.message, 'error');
        this.progress.close();
      },
    });
  }

  public getStates() {
    this.progress.open();

    this.libraryService.getStates().subscribe({
      next: (res) => {
        this.states = res.data;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open(error.message, 'error');
        this.progress.close();
      },
    });
  }

  public getLGAByStateId(id: number) {
    this.progress.open();

    this.libraryService.getLGAByStateId(id).subscribe({
      next: (res) => {
        this.lga = res.data;
        this.progress.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.popUp.open(error.message, 'error');
        this.progress.close();
      },
    });
  }
}

export interface IFacilityType {
  id: number;
  name: string;
  code: string;
}

export interface IFacility {
  sourceOfProducts: string;
  facilityName: string;
  name?: string;
  address: string;
  licenseNumber: string;
  stateId: string;
  lgaId: string;
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

export interface IApplicationFormDTO {
  applicationTypeId: number;
  facilityName: string;
  vesselTypeId: number;
  capacity: number;
  operator: string;
  imoNumber: string;
  callSIgn: string;
  flag: string;
  yearOfBuild: string;
  placeOfBuild: string;
  deadWeight: number;
  facilitySources: IFacility[];
  tankList: ITankDTO[];
}

export interface IVessel {
  id?: number;
  vesselName: string;
  name?: string;
  capacity: number;
  operator: string;
  vesselTypeId: string;
  vesselType?: string;
  placeOfBuild: string;
  yearOfBuild: number;
  flag: string;
  callSIgn: string;
  imoNumber: string;
}
