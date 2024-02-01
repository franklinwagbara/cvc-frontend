import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
import { FileuploadWithProgressService } from '../../shared/services/fileupload-with-progress.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoqService } from '../../../../src/app/shared/services/coq.service';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { ActivatedRoute, Navigation, Params, Router } from '@angular/router';
import { ICOQ } from '../../../../src/app/shared/interfaces/ICoQApplication';
import { environment } from '../../../../src/environments/environment';
import {
  DocumentConfig,
  DocumentInfo,
} from '../../../../src/app/company/document-upload/document-upload.component';
import { ApplicationService } from '../../../../src/app/shared/services/application.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { LibaryService } from '../../../../src/app/shared/services/libary.service';
import { CoqAppFormService } from '../../../../src/app/shared/services/coq-app-form.service';
import { MatStepper } from '@angular/material/stepper';
import { ICoqRequirement } from '../../../../src/app/shared/interfaces/ICoqRequirement';
import { ApplicationTerm } from '../../../../src/app/shared/constants/applicationTerm';
import { PlantService } from '../../../../src/app/shared/services/plant.service';
import { IPlant } from 'src/app/shared/interfaces/IPlant';
import { ITank } from 'src/app/shared/interfaces/ITank';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { MatDialog } from '@angular/material/dialog';
import { CoqApplicationPreviewComponent } from './coq-application-preview/coq-application-preview.component';
import { Location } from '@angular/common';
import { Util } from 'src/app/shared/lib/Util';

@Component({
  selector: 'app-coq-application-form',
  templateUrl: './coq-application-form.component.html',
  styleUrls: ['./coq-application-form.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CoqApplicationFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private allSubscriptions = new Subscription();

  depotSelection = new FormControl('', Validators.required);
  plantSelection = new FormControl('', Validators.required);
  productSelection = new FormControl('', Validators.required);
  configuredTank = this.fb.group({
    id: ['', [Validators.required, this.isUniqueTank()]],
    name: ['', [Validators.required]],
  });
  tankLiqInfoForm: FormGroup;
  tankGasInfoForm: FormGroup;
  tankLiqBeforeInfoForm: FormGroup;
  tankLiqAfterInfoForm: FormGroup;
  tankGasBeforeInfoForm: FormGroup;
  tankGasAfterInfoForm: FormGroup;
  vesselLiqInfoForm: FormGroup;
  vesselGasInfoForm: FormGroup;
  displayedColumns = ['document', 'action', 'source', 'progress'];
  dataSource: MatTableDataSource<any>;
  listOfRequiredDocs: any[] = [];
  vesselInfo: IVesselDetail;
  appId: number;
  documentConfig: DocumentConfig;
  uploadedDocInfo: any[];
  documents: DocumentInfo[] = [];
  depots: IPlant[];
  products: IProduct[];
  processingPlants: IPlant[];
  plantTanks: ITank[] = [];
  fetchingRequirement = false;
  requirement: ICoqRequirement;
  coqId: number;
  coq: ICOQ;
  noaApplication: any;

  isSubmitted = false;
  isSubmitting = false;

  isGasProduct: boolean | null = null;

  isProcessingPlant = false;

  noPlantFetched: boolean | null = null;
  noTankConfigured: boolean | null = null;

  @ViewChild('coqstepper') coqStepper: MatStepper;
  @ViewChild('tankInfoStepper') tankInfoStepper: MatStepper;

  tankLiqBeforeFormTempCtx: any;
  tankLiqAfterFormTempCtx: any;
  tankGasBeforeFormTempCtx: any;
  tankGasAfterFormTempCtx: any;

  dateValidation = {
    min: new Date(new Date().getFullYear() - 10, 0, 1),
    max: new Date(),
  };

  documents$ = new BehaviorSubject<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private fileUpload: FileuploadWithProgressService,
    private elRef: ElementRef,
    private snackBar: MatSnackBar,
    private coqService: CoqService,
    public spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private popup: PopupService,
    private libService: LibaryService,
    private productService: ProductService,
    private plantService: PlantService,
    private cd: ChangeDetectorRef,
    public coqFormService: CoqAppFormService,
    private popUp: PopupService,
    private dialog: MatDialog,
    private applicationService: ApplicationService,
    private location: Location
  ) {
    this.route.params.subscribe((params: Params) => {
      this.appId = parseInt(params['id']);
    });

    this.route.data.subscribe((val) => {
      if (val['type'] === ApplicationTerm.PROCESSINGPLANT) {
        this.isProcessingPlant = true;
      }
    });
  }

  ngOnInit(): void {
    this.initForms();

    this.dataSource = new MatTableDataSource<any>([]);

    this.documents$.subscribe((res: any[]) => {
      if (Array.isArray(res) && res.length) {
        res.forEach((el) => {
          const found = this.documents.find(
            (doc) => el.docIndex === doc?.docIndex
          );
          if (!found) {
            this.documents.push(el);
          } else {
            this.documents = this.documents.map((item) => {
              if (el?.docIndex === found?.docIndex) {
                return {
                  ...found,
                  docSource: el?.docSource,
                  fileId: el?.fileId,
                };
              }
              return item;
            });
          }
        });
        this.setDataSource();
        this.cd.markForCheck();
      }
    });

    this.subscribeUploadResponses();
    this.subscribeReviewDataAction();

    this.restoreReviewData();
    this.fetchAllData();
  }

  goBack(): void {
    this.location.back();
  }

  public fetchAllData(): void {
    this.spinner.open();
    if (!this.isProcessingPlant) {
      forkJoin([
        this.applicationService.viewApplication(this.appId),
        this.libService.getAllDepotByNoaAppId(this.appId),
        // this.applicationService.getUploadDocuments(this.appId)
      ]).subscribe({
        next: (res: any[]) => {
          this.noaApplication = res[0]?.data;
          this.depots = res[1]?.data;
          this.noPlantFetched = !this.depots.length;
          // this.documents$.next((res[2]?.data?.docs as any[]).map((el, i) => {
          //   return { ...el, success: null, docIndex: i, percentProgress: 0 }
          // }));
          // console.log('Uploaded Documents ============> ', res[2]?.data.docs);
          this.spinner.close();
        },
        error: (error: unknown) => {
          console.log(error);
          this.spinner.close();
          this.popUp.open(
            'Something went wrong while fetching all data',
            'error'
          );
        },
      });
    } else {
      forkJoin([
        this.productService.getAllProducts(),
        this.plantService.getAllProcessingPlants(),
      ]).subscribe({
        next: (res: any[]) => {
          this.products = res[0]?.data;
          this.processingPlants = res[1]?.data;
          this.processingPlants.forEach((plant) => {
            if (plant?.tanks.length) {
              this.plantTanks.push(...plant.tanks);
            }
          });
          this.noPlantFetched = !this.processingPlants.length;
          this.spinner.close();
        },
        error: (error: unknown) => {
          console.log(error);
          this.spinner.close();
          this.popUp.open('Something went wrong while fetching data', 'error');
        },
      });
    }
  }

  subscribeProductSelection(): void {
    this.allSubscriptions.add(
      this.productSelection.valueChanges.subscribe((val) => {
        this.isGasProduct =
          this.products
            .find((p) => p?.id === parseInt(val))
            ?.productType.toLowerCase() === 'gas';
        this.restoreReviewData();
      })
    );
  }

  subscribePlantSelection(): void {
    this.allSubscriptions.add(
      this.plantSelection.valueChanges.subscribe((val) => {
        this.noTankConfigured = !this.plantTanks.length;
        this.fetchRequirement(parseInt(val));
      })
    );
  }

  public initForms() {
    this.vesselLiqInfoForm = this.fb.group({
      dateOfVesselArrival: ['', [Validators.required, Validators.max]],
      dateOfVesselUllage: ['', [Validators.required]],
      dateOfSTAfterDischarge: ['', [Validators.required]],
      depotPrice: ['', [Validators.required]],
    });

    this.vesselGasInfoForm = this.fb.group({
      vesselArrivalDate: ['', [Validators.required]],
      prodDischargeCommenceDate: ['', [Validators.required]],
      prodDischargeCompletionDate: ['', [Validators.required]],
      qtyBillLadingMtAir: ['', [Validators.required]],
      arrivalShipMtAir: ['', [Validators.required]],
      shipDischargedMtAir: ['', [Validators.required]],
      nameConsignee: ['', [Validators.required]],
      depotPrice: ['', [Validators.required]],
    });

    this.initTemplateFormContexts();
    this.subscribeTankSelection();
    this.subscribeDepotSelection();
    this.subscribeProductSelection();
    this.subscribePlantSelection();

    this.cd.markForCheck();
  }

  fetchRequirement(depotId: number): void {
    this.spinner.show('Fetching requirement data...');
    this.fetchingRequirement = true;
    this.appId = this.isProcessingPlant ? null : this.appId;
    this.allSubscriptions.add(
      this.coqService.getCoqRequirement(this.appId, depotId).subscribe({
        next: (res: any) => {
          this.requirement = res?.data;
          this.noTankConfigured = this.isProcessingPlant
            ? !this.plantTanks.length
            : !this.requirement.tanks.length;
          if (!this.isProcessingPlant) {
            this.isGasProduct =
              this.requirement?.productType.toLowerCase() === 'gas';
          }
          if (this.noTankConfigured) {
            this.popUp.open(
              'No tanks configured for this depot. You may not proceed to next step.',
              'error'
            );
          } else {
            this.restoreReviewData();
          }
          this.documents$.next(
            this.requirement.requiredDocuments.map((el) => {
              return { ...el, success: null, percentProgress: 0 };
            })
          );
          this.fetchingRequirement = false;
          this.spinner.close();
        },
        error: (error: unknown) => {
          console.log(error);
          this.fetchingRequirement = false;
          this.popUp.open(
            'Something went wrong while fetching requirement data.',
            'error'
          );
          this.spinner.close();
        },
      })
    );
  }

  public initLiqTankFormGroup(status?: string) {
    return this.fb.group({
      id: ['', [Validators.required]],
      tank: ['', [Validators.required]],
      status: [status || '', [Validators.required]],
      dip: ['', [Validators.required]],
      waterDIP: ['', [Validators.required]],
      tov: ['', [Validators.required]],
      waterVolume: ['', [Validators.required]],
      floatRoofCorr: ['', [Validators.required]],
      gov: ['', [Validators.required]],
      temperature: ['', [Validators.required]],
      density: ['', [Validators.required]],
      vcf: ['', [Validators.required]],
    });
  }

  public initGasTankFormGroup(status?: string) {
    return this.fb.group({
      id: ['', [Validators.required]],
      tank: ['', [Validators.required]],
      status: [status || '', [Validators.required]],
      liquidDensityVac: ['', [Validators.required]],
      observedSounding: ['', [Validators.required]],
      tapeCorrection: ['', [Validators.required]],
      liquidTemperature: ['', [Validators.required]],
      observedLiquidVolume: ['', [Validators.required]],
      shrinkageFactor: ['', [Validators.required]],
      vcf: ['', [Validators.required]],
      tankVolume: ['', [Validators.required]],
      vapourTemperature: ['', [Validators.required]],
      vapourPressure: ['', [Validators.required]],
      molecularWeight: ['', [Validators.required]],
      vapourFactor: ['', [Validators.required]],
    });
  }

  public initTemplateFormContexts(): void {
    this.tankLiqBeforeInfoForm = this.initLiqTankFormGroup('before');
    this.tankLiqBeforeFormTempCtx = {
      formGroup: this.tankLiqBeforeInfoForm,
    };

    this.tankLiqAfterInfoForm = this.initLiqTankFormGroup('after');
    this.tankLiqAfterFormTempCtx = {
      formGroup: this.tankLiqAfterInfoForm,
    };

    this.tankGasBeforeInfoForm = this.initGasTankFormGroup('before');
    this.tankGasBeforeFormTempCtx = {
      formGroup: this.tankGasBeforeInfoForm,
    };

    this.tankGasAfterInfoForm = this.initGasTankFormGroup('after');
    this.tankGasAfterFormTempCtx = {
      formGroup: this.tankGasAfterInfoForm,
    };
  }

  subscribeDepotSelection(): void {
    this.allSubscriptions.add(
      this.depotSelection.valueChanges.subscribe((val: string) => {
        if (val) {
          this.fetchRequirement(parseInt(val));
        }
      })
    );
  }

  subscribeTankSelection(): void {
    this.allSubscriptions.add(
      this.configuredTank.controls['id'].valueChanges.subscribe((val) => {
        // Populate tankName control
        const tank = (
          (this.isProcessingPlant ? this.plantTanks : this.requirement.tanks) ||
          []
        ).find(
          (t) =>
            (this.isProcessingPlant ? t?.plantTankId : t?.id) === parseInt(val)
        );
        const tankName = this.isProcessingPlant ? tank?.tankName : tank?.name;
        this.configuredTank.controls['name'].setValue(tankName || '');
        if (!this.isGasProduct) {
          this.tankLiqBeforeInfoForm.controls['tank'].setValue(tankName);
          this.tankLiqBeforeInfoForm.controls['id'].setValue(val);
          this.tankLiqAfterInfoForm.controls['tank'].setValue(tankName);
          this.tankLiqAfterInfoForm.controls['id'].setValue(val);
        } else if (this.isGasProduct) {
          this.tankGasBeforeInfoForm.controls['tank'].setValue(tankName);
          this.tankGasBeforeInfoForm.controls['id'].setValue(val);
          this.tankGasAfterInfoForm.controls['tank'].setValue(tankName);
          this.tankGasAfterInfoForm.controls['id'].setValue(val);
        }
      })
    );
  }

  subscribeUploadResponses(): void {
    this.allSubscriptions.add(
      this.fileUpload.uploadResponses$.subscribe((val) => {
        if (Array.isArray(val) && val.length) {
          console.log('Uploaded Responses =============> ', val);
          this.uploadedDocInfo = val;
          val.forEach((el) => {
            this.documents$.next(
              this.documents.map((doc) => {
                if (doc?.docIndex === el?.docIndex) {
                  return {
                    ...doc,
                    fileId: el?.FileId,
                    docSource: el?.source,
                    percentProgress: 0,
                  };
                }
                return doc;
              })
            );
          });
          this.cd.markForCheck();
        }
      })
    );
  }

  subscribeReviewDataAction(): void {
    this.allSubscriptions.add(
      this.coqFormService.formDataEvent.subscribe((val) => {
        if (val === 'removed') {
          this.configuredTank.reset();
          this.cd.markForCheck();
        }
      })
    );
  }

  public getDepots() {
    this.libService.getAllDepotByNoaAppId(this.appId).subscribe({
      next: (res: any) => {
        this.depots = res.data;
        this.cd.markForCheck();
      },
      error: (e) => {
        this.popup.open(e?.message, 'error');
        this.cd.markForCheck();
      },
    });
  }

  ngAfterViewInit(): void {
    this.setDataSource();
  }

  private setDataSource() {
    this.dataSource = new MatTableDataSource(this.documents);
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }

  get hasUploadedAllRequiredDocs(): boolean {
    if (this.documents.length) {
      return this.documents.every((info) => !!info.docSource);
    }
    return false;
  }

  onFileSelected(evt: Event, index: number): void {
    const file = (evt.target as any).files[0];
    if (file) {
      if (!this.isValidFile) return;

      const fileSizeInKb = file.size / 1024;

      this.documents = this.documents.map((el, i) => {
        if (i === index) {
          return {
            ...el,
            fileName: file.name,
            fileSizeInKb: fileSizeInKb.toFixed(2),
          };
        }
        return el;
      });

      let uploadParams = {
        docTypeId: this.documents[index].docId,
        compId: this.requirement?.apiData.companyElpsId,
        email: this.requirement?.apiData.apiEmail,
        apiHash: this.requirement?.apiData.apiHash,
        docName: this.documents[index].docName,
        uniqueid: '',
        facilityId: this.requirement?.apiData?.facilityElpsId,
      };

      this.uploadFacilityDocAndReportProgress(file, uploadParams, index);
    }
  }

  public isValidFile(file: File): boolean {
    let isAccepted = /(\.png|\.jpg|\.jpeg|\.pdf)$/i.test(file.name);
    if (!isAccepted) {
      this.snackBar.open(`Invalid file (${file.name}) format`);
      return false;
    }

    const fileSizeInBytes = file.size;
    const fileSizeInKb = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKb / 1024;
    if (fileSizeInMB > 20) {
      this.popUp.open(`File ${file.name} size too large`, 'error');
      return false;
    }
    return true;
  }

  /**
   *
   * @param file
   * @param params Required path params
   * @param docIndex Index of the document type in {@link documents} array to be uploaded. It determines which {@link documents} element's {@link DocumentInfo.docSource} to be updated.
   */
  public uploadFacilityDocAndReportProgress(
    file: File,
    params: any,
    docIndex: number
  ): void {
    let url = '';
    // If replacing the existing file
    if (this.documents[docIndex]?.docSource) {
      let { docTypeId, facilityId } = params;
      url = `${environment.elpsBase}/api/FacilityDocument/UpdateFile/${docTypeId}/${facilityId}?docid=${docTypeId}`;
    } else {
      // Uploading for the first time
      let { docTypeId, compId, facilityId, email, apiHash, docName, uniqueid } =
        params;
      url = `${environment.elpsBase}/api/Facility/UploadFile/${docTypeId}/${compId}/${facilityId}/${email}/${apiHash}?docName=${docName}&uniqueid=${uniqueid}`;
    }

    this.allSubscriptions.add(
      this.fileUpload.uploadFile(file, url, docIndex).subscribe({
        next: (val: number) => {
          // Update file upload progress
          this.documents = this.documents.map((el, i) => {
            if (i === docIndex) {
              console.log('File upload in progress ==========> ', {
                ...el,
                docIndex,
                percentProgress: val,
                success: val === 100 || null,
              });
              return {
                ...el,
                docIndex,
                percentProgress: val,
                success: val === 100 || null,
              };
            }
            return el;
          });
          this.documents$.next(this.documents);
          this.cd.markForCheck();
        },
        error: (error: any) => {
          console.log(error);
          this.documents = this.documents.map((el, i) => {
            if (i === docIndex) {
              return { ...el, success: false };
            }
            return el;
          });
          this.documents$.next(this.documents);
          this.popUp.open('Could not upload file', 'error');
          this.cd.markForCheck();
        },
      })
    );
  }

  triggerFileInput(index: number) {
    const collections =
      this.elRef.nativeElement.querySelectorAll('.file-input');
    const inputEl = collections[index];
    inputEl.click();
  }

  preview() {
    const vesselData = {
      dateOfArrival: this.isGasProduct
        ? new Date(
            this.vesselGasInfoForm.controls['vesselArrivalDate'].value
          ).toLocaleDateString()
        : new Date(
            this.vesselLiqInfoForm.controls['dateOfVesselArrival'].value
          ).toLocaleDateString(),
      dateOfUllage: this.isGasProduct
        ? new Date(
            this.vesselGasInfoForm.controls['prodDischargeCommenceDate'].value
          ).toLocaleDateString()
        : new Date(
            this.vesselLiqInfoForm.controls['dateOfVesselUllage'].value
          ).toLocaleDateString(),
      dateOfShoreTank: this.isGasProduct
        ? new Date(
            this.vesselGasInfoForm.controls['prodDischargeCompletionDate'].value
          ).toLocaleDateString()
        : new Date(
            this.vesselLiqInfoForm.controls['dateOfSTAfterDischarge'].value
          ).toLocaleDateString(),
      depotPrice: this.isGasProduct
        ? this.vesselGasInfoForm.controls['depotPrice'].value
        : this.vesselLiqInfoForm.controls['depotPrice'].value,
      documents: this.documents,
      productName: this.requirement.productName,
    };
    this.dialog.open(CoqApplicationPreviewComponent, {
      data: {
        tankData: this.isGasProduct
          ? this.coqFormService.gasProductReviewData
          : this.coqFormService.liquidProductReviewData,
        isGasProduct: this.isGasProduct,
        vesselDischargeData: this.isGasProduct
          ? {
              ...vesselData,
              quauntityReflectedOnBill:
                this.vesselGasInfoForm.controls['qtyBillLadingMtAir'].value,
              arrivalShipFigure:
                this.vesselGasInfoForm.controls['arrivalShipMtAir'].value,
              dischargeShipFigure:
                this.vesselGasInfoForm.controls['shipDischargedMtAir'].value,
            }
          : vesselData,
      },
    });
  }

  submit() {
    const payload = this.constructPayload();
    this.isSubmitting = true;
    this.spinner.show('Submitting CoQ Application...');

    (this.isGasProduct
      ? this.coqService.createGasProductCoq(payload)
      : this.coqService.createLiqProductCoq(payload)
    ).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.spinner.close();
        if (res?.success) {
          this.snackBar.open(
            'CoQ Application Created Successfully. Redirecting...',
            null,
            { panelClass: ['success'], duration: 2500 }
          );
          localStorage.removeItem(LocalDataKey.COQFORMREVIEWDATA);
          if (this.isGasProduct) {
            this.vesselGasInfoForm.reset();
          } else {
            this.vesselLiqInfoForm.reset();
          }
          this.restoreReviewData();
          this.coqStepper.selectedIndex = 0;
        } else {
          this.popUp.open('CoQ Application Creation Failed', 'error');
        }
        this.cd.markForCheck();
        setTimeout(() => {
          this.router.navigate([
            'admin',
            'coq-and-plant',
            'coq-applications-by-depot',
          ]);
        }, 2400);
      },
      error: (error: unknown) => {
        this.isSubmitting = false;
        console.log(error);
        this.spinner.close();
        this.popUp.open('CoQ Application Creation Failed', 'error');
        this.cd.markForCheck();
      },
    });
  }

  constructPayload(): any {
    let payload: any;
    const reference = {
      plantId: this.isProcessingPlant
        ? this.plantSelection.value
        : this.depotSelection.value,
      noaAppId: this.appId,
    };

    if (this.isGasProduct) {
      payload = {
        ...reference,
        productId: this.isProcessingPlant ? this.productSelection.value : null,
        quauntityReflectedOnBill:
          this.vesselGasInfoForm.controls['qtyBillLadingMtAir'].value,
        arrivalShipFigure:
          this.vesselGasInfoForm.controls['arrivalShipMtAir'].value,
        dischargeShipFigure:
          this.vesselGasInfoForm.controls['shipDischargedMtAir'].value,
        dateOfVesselArrival: new Date(
          this.vesselGasInfoForm.controls['vesselArrivalDate'].value
        ).toISOString(),
        dateOfVesselUllage: new Date(
          this.vesselGasInfoForm.controls['prodDischargeCommenceDate'].value
        ).toISOString(),
        dateOfSTAfterDischarge: new Date(
          this.vesselGasInfoForm.controls['prodDischargeCompletionDate'].value
        ).toISOString(),
        depotPrice: this.vesselGasInfoForm.controls['depotPrice'].value,
        nameConsignee: this.vesselGasInfoForm.controls['nameConsignee'].value,
        tankBeforeReadings: [],
        tankAfterReadings: [],
        submitDocuments: [],
      };

      this.coqFormService.gasProductReviewData.forEach((el) => {
        payload.tankBeforeReadings.push(this.getGasCoQPayload(el.before));
        payload.tankAfterReadings.push(this.getGasCoQPayload(el.after));
      });
    } else {
      payload = {
        ...reference,
        productId: this.isProcessingPlant ? this.productSelection.value : null,
        dateOfVesselArrival:
          this.vesselLiqInfoForm.controls[
            'dateOfVesselArrival'
          ].value.toISOString(),
        dateOfVesselUllage:
          this.vesselLiqInfoForm.controls[
            'dateOfVesselUllage'
          ].value.toISOString(),
        dateOfSTAfterDischarge:
          this.vesselLiqInfoForm.controls[
            'dateOfSTAfterDischarge'
          ].value.toISOString(),
        depotPrice: this.vesselLiqInfoForm.controls['depotPrice'].value,
        tankBeforeReadings: [],
        tankAfterReadings: [],
        submitDocuments: [],
      };

      this.coqFormService.liquidProductReviewData.forEach((el) => {
        payload.tankBeforeReadings.push(this.getLiqCoQPayload(el.before));
        payload.tankAfterReadings.push(this.getLiqCoQPayload(el.after));
      });
    }

    this.documents.forEach((doc) => {
      payload.submitDocuments.push({
        fileId: doc.fileId,
        docType: doc.docType,
        docName: doc.docName,
        docSource: doc.docSource,
      });
    });

    return payload;
  }

  public getGasCoQPayload(data: any) {
    const {
      liquidDensityVac,
      observedSounding,
      tapeCorrection,
      liquidTemperature,
      observedLiquidVolume,
      shrinkageFactor: shrinkageFactorLiquid,
      tankVolume,
      vapourFactor: shrinkageFactorVapour,
      vapourTemperature,
      vapourPressure,
      molecularWeight,
      vcf,
    } = data;

    return {
      tankId: data?.id,
      coQGasTankDTO: {
        liquidDensityVac,
        observedSounding,
        tapeCorrection,
        liquidTemperature,
        observedLiquidVolume,
        shrinkageFactorLiquid,
        vcf,
        tankVolume,
        shrinkageFactorVapour,
        vapourTemperature,
        vapourPressure,
        molecularWeight,
      },
    };
  }

  public getLiqCoQPayload(data: any) {
    const {
      id,
      dip,
      waterDIP,
      tov,
      waterVolume,
      floatRoofCorr,
      gov,
      temp,
      density,
      vcf,
    } = data;

    return {
      tankId: id,
      coQTankDTO: {
        dip,
        waterDIP,
        tov,
        waterVolume,
        floatRoofCorr,
        gov,
        temp,
        density,
        vcf,
      },
    };
  }

  restoreReviewData(): void {
    const localFormReviewData = JSON.parse(
      localStorage.getItem(LocalDataKey.COQFORMREVIEWDATA)
    );
    if (Array.isArray(localFormReviewData) && localFormReviewData.length) {
      if (this.isGasProduct !== null && !this.isGasProduct) {
        this.coqFormService.liquidProductReviewData$.next(localFormReviewData);
      } else if (this.isGasProduct !== null && this.isGasProduct) {
        this.coqFormService.gasProductReviewData$.next(localFormReviewData);
      }
    }
  }

  isUniqueTank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tank = (
        (this.isProcessingPlant ? this.plantTanks : this.requirement?.tanks) ||
        []
      ).find(
        (t) =>
          (this.isProcessingPlant ? t.plantTankId : t.id) ===
          parseInt(control.value)
      );
      const tankName = this.isProcessingPlant ? tank?.tankName : tank?.name;
      if (this.isGasProduct !== null && !this.isGasProduct) {
        return !this.coqFormService.liquidProductReviewData.some(
          (val) => val.before.tank === tankName
        )
          ? null
          : { duplicate: control.value };
      } else if (this.isGasProduct !== null && this.isGasProduct) {
        return !this.coqFormService.gasProductReviewData.some(
          (val) => val.before.tank === tankName
        )
          ? null
          : { duplicate: control.value };
      }
      return null;
    };
  }

  saveToReview(): void {
    let coqData: CoQData;

    if (!this.isGasProduct) {
      coqData = {
        before: this.tankLiqBeforeInfoForm.value,
        after: this.tankLiqAfterInfoForm.value,
      };
    } else if (this.isGasProduct) {
      coqData = {
        before: this.tankGasBeforeInfoForm.value,
        after: this.tankGasAfterInfoForm.value,
      };
    }

    // Check for form review data in local storage
    let coqFormDataArr = JSON.parse(
      localStorage.getItem(LocalDataKey.COQFORMREVIEWDATA)
    );
    if (Array.isArray(coqFormDataArr) && coqFormDataArr.length) {
      coqFormDataArr.push(coqData);
    } else {
      coqFormDataArr = [coqData];
    }

    if (!this.isGasProduct) {
      this.coqFormService.liquidProductReviewData$.next(coqFormDataArr);
      for (let control in this.tankLiqBeforeInfoForm.controls) {
        if (control !== 'status') {
          this.tankLiqBeforeInfoForm.controls[control].setValue('');
          this.tankLiqAfterInfoForm.controls[control].setValue('');
        }
      }
    } else if (this.isGasProduct) {
      this.coqFormService.gasProductReviewData$.next(coqFormDataArr);
      for (let control in this.tankGasBeforeInfoForm.controls) {
        if (control !== 'status') {
          this.tankGasBeforeInfoForm.controls[control].setValue('');
          this.tankGasAfterInfoForm.controls[control].setValue('');
        }
      }
    }

    localStorage.setItem(
      LocalDataKey.COQFORMREVIEWDATA,
      JSON.stringify(coqFormDataArr)
    );

    this.configuredTank.reset();
    this.tankInfoStepper.selectedIndex = 0;
    this.cd.markForCheck();
  }

  @HostListener('keydown', ['$event'])
  blockSpecialNonNumerics(evt: KeyboardEvent): void {
    Util.blockSpecialNonNumerics(evt);
  }
}

export interface CoQData {
  before: any;
  after: any;
  calc?: any;
}

export enum LocalDataKey {
  COQFORMPREVIEWDATA = 'coq-form-preview-data-arr',
  COQFORMREVIEWDATA = 'coq-form-review-data-arr',
}

export interface IVesselDetail {
  marketerName: string;
  depotCapacity: string;
  productName: string;
  volume: number;
  vesselName: string;
  motherVessel: string;
  jetty: string;
  eta: string;
  recievingTerminal: string;
}

export interface GasTankReading {
  tank?: string;
  status?: string;
  liquidDensityVac: number;
  observedSounding: number;
  tapeCorrection: number;
  liquidTemperature: number;
  observedLiquidVolume: number;
  shrinkageFactorLiquid: number;
  vcf: number;
  tankVolume: number;
  shrinkageFactorVapour: number;
  vapourTemperature: number;
  vapourPressure: number;
  molecularWeight: number;
  vapourFactor: number;
}
