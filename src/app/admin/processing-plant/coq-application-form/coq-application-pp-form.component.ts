import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
import { FileuploadWithProgressService } from 'src/app/shared/services/fileupload-with-progress.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IPlant } from 'src/app/shared/interfaces/IPlant';
import { ITank } from 'src/app/shared/interfaces/ITank';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Util } from 'src/app/shared/lib/Util';
import { MatStep, MatStepper } from '@angular/material/stepper';
import {
  DocumentConfig,
  DocumentInfo,
} from 'src/app/company/document-upload/document-upload.component';
import { ApplicationTerm } from 'src/app/shared/constants/applicationTerm';
import { ICOQ } from 'src/app/shared/interfaces/ICoQApplication';
import { ICoqRequirement } from 'src/app/shared/interfaces/ICoqRequirement';
import { CoqAppFormService } from 'src/app/shared/services/coq-app-form.service';
import { CoqService } from 'src/app/shared/services/coq.service';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { PlantService } from 'src/app/shared/services/plant.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { environment } from 'src/environments/environment';
import { CoqApplicationPreviewPPComponent } from './coq-application-preview/coq-application-preview-pp.component';
import { PLANT_COL_MAPPINGS, PRODUCT_COL_MAPPINGS } from '../colMappings';
import { getDetailsForm, getForm } from './forms';
import { LiquidDataDynamicEntryComponent } from './liquid-data-dynamic-entry/liquid-data-dynamic-entry.component';
import { GasDataDynamicEntryComponent } from './gas-data-dynamic-entry/gas-data-dynamic-entry.component';
import { MeterTypeService } from 'src/app/shared/services/meter-type/meter-type.service';
import { DipMethodService } from 'src/app/shared/services/dip-method/dip-method.service';
import { ProcessingDetailsGasComponent } from './processing-details-gas/processing-details-gas.component';
import { ProcessingDetailsLiquidComponent } from './processing-details-liquid/processing-details-liquid.component';
import { LiquidDataStaticEntryComponent } from './liquid-data-static-entry/liquid-data-static-entry.component';
import { GasDataStaticEntryComponent } from './gas-data-static-entry/gas-data-static-entry.component';
import { ExtractPayload } from './helpers/ExtractPayload';
import { ProcessingPlantCOQService } from 'src/app/shared/services/processing-plant-coq/processing-plant-coq.service';
import { IPayloadParams, ISubmitDocument } from './helpers/Types';
import { GenericService } from 'src/app/shared/services';
import { ProductType } from 'src/app/shared/constants/productType';
import { ProcessingPlantContextService } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { ProcessingDetailsCondensateComponent } from './processing-details-condensate/processing-details-condensate.component';

@Component({
  selector: 'app-coq-application-pp-form',
  templateUrl: './coq-application-pp-form.component.html',
  styleUrls: ['./coq-application-pp-form.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CoqApplicationPPFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private allSubscriptions = new Subscription();

  public readonly PRODUCT_TYPE = ProductType;

  depotSelection = new FormControl('', Validators.required);
  plantSelection = new FormControl('', Validators.required);
  productSelection = new FormControl('', Validators.required);
  measurementSelection = new FormControl('', Validators.required);
  meterTypeSelection = new FormControl('', Validators.required);
  dipMethodSelection = new FormControl('', Validators.required);

  selectedMeterType: IMeterType = null;
  selectedDipMethod: IDipMethod = null;
  selectedPlant: IPlant = null;
  selectedProduct: IProduct = null;
  selectedTank: ITank = null;
  selectedMeasurement: MeasurementType = null;

  measurementTypes = ['Dynamic', 'Static'];
  meterTypes: IMeterType[] = null;
  dipMethods: IDipMethod[] = null;

  // public get getMeterTypeDipForm() {
  //   return this.selectedMeasurement == 'Dynamic'
  //     ? this.meterTypeSelection
  //     : this.dipMethodSelection;
  // }

  // public get getMeterTypeDipItems() {
  //   return this.selectedMeasurement == 'Dynamic'
  //     ? this.meterTypes
  //     : this.dipMethods;
  // }

  plantColMappings = PLANT_COL_MAPPINGS;
  productColMappings = PRODUCT_COL_MAPPINGS;

  activeBeforeTankForm: FormGroup;
  activeAfterTankForm: FormGroup;

  activeProcessingDetailsForm: FormGroup;

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

  isSubmitted = false;
  isSubmitting = false;

  isGasProduct: boolean | null = null;

  isProcessingPlant = false;

  noPlantFetched: boolean | null = null;
  noTankConfigured: boolean | null = null;

  @ViewChild('coqstepper') coqStepper: MatStepper;
  @ViewChild('tankInfoStepper') tankInfoStepper: MatStepper;
  @ViewChild('dataEntryWrapper') dataEntryWrapper: MatStep;
  @ViewChild('staticMeasurement') staticMeasurement: MatStep;
  @ViewChild('ullageStep') ullageStep: MatStep;

  @ViewChildren(LiquidDataDynamicEntryComponent)
  LiquidDataDynamicViews: QueryList<LiquidDataDynamicEntryComponent>;

  @ViewChildren(LiquidDataStaticEntryComponent)
  LiquidDataStaticViews: QueryList<LiquidDataStaticEntryComponent>;

  @ViewChildren(GasDataDynamicEntryComponent)
  GasDataDynamicViews: QueryList<GasDataDynamicEntryComponent>;

  @ViewChildren(GasDataStaticEntryComponent)
  GasDataStaticViews: QueryList<GasDataStaticEntryComponent>;

  @ViewChild(ProcessingDetailsGasComponent)
  ProcessingDetailsGasView: ProcessingDetailsGasComponent;

  @ViewChild(ProcessingDetailsLiquidComponent)
  ProcessingDetailsLiquidView: ProcessingDetailsLiquidComponent;

  @ViewChild(ProcessingDetailsCondensateComponent)
  ProcessingDetailsCondensateView: ProcessingDetailsCondensateComponent;

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
    private generic: GenericService,
    private productService: ProductService,
    private plantService: PlantService,
    private cd: ChangeDetectorRef,
    public coqFormService: CoqAppFormService,
    private popUp: PopupService,
    private dialog: MatDialog,
    private location: Location,
    private meterTypeService: MeterTypeService,
    private dipMethodService: DipMethodService,
    private procPlantCoQService: ProcessingPlantCOQService,
    public ppContext: ProcessingPlantContextService
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
    this.setUpSubscriptions();

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

    this.restoreReviewData();
    this.fetchAllData();
  }

  public setUpSubscriptions() {
    // this.subscribeTankSelection();
    this.subscribeDepotSelection();
    this.subscribeProductSelection();
    this.subscribePlantSelection();
    this.subscribeMeasurementSelection();
    this.subscribeUploadResponses();
    this.subscribeReviewDataAction();
    this.subscribeDipMethodTypeSelection();
    this.subscribeMeterTypeSelection();

    this.cd.markForCheck();
  }

  public gotoStaticMeasurement() {
    this.staticMeasurement?.select();
  }

  public gotoUllageInfo() {
    this.ullageStep?.select();
  }

  public onStepFromMeterType() {
    this.dataEntryWrapper.select();
    this.cd.markForCheck();
  }

  subscribeProductSelection(): void {
    this.allSubscriptions.add(
      this.productSelection.valueChanges.subscribe((val) => {
        this.selectedProduct = this.products.find((x) => x.id == parseInt(val));
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
        this.selectedPlant = this.processingPlants.find(
          (x) => x.id == parseInt(val)
        );
        this.ppContext.selectedProcessingPlant$.next(this.selectedPlant);
        this.ppContext.configuredTanks$.next(this.selectedPlant.tanks);
        this.ppContext.configuredMeters$.next(this.selectedPlant.meters);

        // this.noTankConfigured = !this.plantTanks.length;
        this.fetchRequirement(parseInt(val));
      })
    );
  }

  subscribeMeasurementSelection(): void {
    this.allSubscriptions.add(
      this.measurementSelection.valueChanges.subscribe(
        (val: 'Dynamic' | 'Static') => {
          this.selectedMeasurement = val;

          //todo: re-fetch requirements
        }
      )
    );
  }

  subscribeMeterTypeSelection(): void {
    this.allSubscriptions.add(
      this.meterTypeSelection.valueChanges.subscribe((val) => {
        this.selectedMeterType = this.meterTypes.find((x) => x.id == +val);
      })
    );
  }

  subscribeDipMethodTypeSelection(): void {
    this.allSubscriptions.add(
      this.dipMethodSelection.valueChanges.subscribe((val) => {
        this.selectedDipMethod = this.dipMethods.find((x) => x.id == +val);
      })
    );
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
          // this.configuredTank.reset();
          this.cd.markForCheck();
        }
      })
    );
  }

  public fetchAllData(): void {
    this.spinner.open();
    forkJoin([
      this.productService.getAllProducts(),
      this.plantService.getAllProcessingPlants(),
      this.meterTypeService.getAll(),
      this.dipMethodService.getAll(),
    ]).subscribe({
      next: (res: any[]) => {
        this.products = res[0]?.data;
        this.processingPlants = res[1]?.data;

        this.meterTypes = res[2]?.data;
        this.dipMethods = res[3]?.data;

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

  get hasUploadedAllRequiredDocs(): boolean {
    if (this.documents.length) {
      return this.documents.every((info) => !!info.docSource);
    }
    return false;
  }

  onFileSelected(evt: Event, index: number): void {
    const file = (evt.target as any).files[0];
    if (file) {
      if (!this.generic.isValidFile(file)) return;

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
    this.dialog.open(CoqApplicationPreviewPPComponent, {
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

    this.procPlantCoQService
      .createCoQ(payload, this.selectedProduct.productType)
      .subscribe({
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
            this.router.navigate(['admin', 'coq', 'coq-applications-by-depot']);
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
    debugger;
    let payload: any;

    const submitDocuments: ISubmitDocument[] = [];

    this.documents.forEach((doc) => {
      submitDocuments.push({
        fileId: +doc.fileId,
        docType: doc.docType,
        docName: doc.docName,
        docSource: doc.docSource,
      });
    });

    let staticBatchReadings;
    let dynamicBatchReading;

    if (this.selectedProduct.productType == ProductType.LIQUID) {
      staticBatchReadings = this.ppContext.LSBatchReadings$.value;
      dynamicBatchReading = this.ppContext.LDBatchReadings$.value;
    } else if (this.selectedProduct.productType == ProductType.GAS) {
    } else if (this.selectedProduct.productType == ProductType.CONDENSATE) {
      staticBatchReadings = this.ppContext.CSBatchReadings$.value;
      dynamicBatchReading = this.ppContext.CDBatchReadings$.value;
    }

    const payloadParams: IPayloadParams = {
      identifiers: {
        plantId: this.selectedPlant?.id ?? 0,
        productId: this.selectedProduct?.id ?? 0,
        productType: this.selectedProduct?.productType,
        meterTypeId: this.selectedMeterType?.id ?? 0,
        dipMethodId: this.selectedDipMethod?.id ?? 0,
      },
      processingDetails: this.activeProcessingDetailsForm.value,
      documents: submitDocuments,
      staticReadings: staticBatchReadings,
      dynamicReadings: dynamicBatchReading,
    };

    return new ExtractPayload(payloadParams).extract();
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

  // isUniqueTank(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const tank = (
  //       (this.isProcessingPlant ? this.plantTanks : this.requirement?.tanks) ||
  //       []
  //     ).find(
  //       (t) =>
  //         (this.isProcessingPlant ? t.plantTankId : t.id) ===
  //         parseInt(control.value)
  //     );
  //     const tankName = this.isProcessingPlant ? tank?.tankName : tank?.name;
  //     if (this.isGasProduct !== null && !this.isGasProduct) {
  //       return !this.coqFormService.liquidProductReviewData.some(
  //         (val) => val.before.tank === tankName
  //       )
  //         ? null
  //         : { duplicate: control.value };
  //     } else if (this.isGasProduct !== null && this.isGasProduct) {
  //       return !this.coqFormService.gasProductReviewData.some(
  //         (val) => val.before.tank === tankName
  //       )
  //         ? null
  //         : { duplicate: control.value };
  //     }
  //     return null;
  //   };
  // }

  saveToReview(): void {
    debugger;
    let coqData: CoQData;

    coqData = {
      before: this.activeBeforeTankForm.value,
      after: this.activeAfterTankForm.value,
    };

    // Check for form review data in local storage
    let coqFormDataArr = JSON.parse(
      localStorage.getItem(LocalDataKey.COQFORMREVIEWDATA)
    );

    if (Array.isArray(coqFormDataArr) && coqFormDataArr.length) {
      coqFormDataArr.push(coqData);
    } else {
      coqFormDataArr = [coqData];
    }

    this.coqFormService.liquidProductReviewData$.next(coqFormDataArr);
    for (let control in this.activeBeforeTankForm.controls) {
      if (control !== 'status') {
        this.activeBeforeTankForm.controls[control].setValue('');
        this.activeAfterTankForm.controls[control].setValue('');
      }
    }

    localStorage.setItem(
      LocalDataKey.COQFORMREVIEWDATA,
      JSON.stringify(coqFormDataArr)
    );

    // this.configuredTank.reset();
    this.tankInfoStepper.selectedIndex = 0;
    this.cd.markForCheck();
  }

  public get getActiveProcDetailsForm() {
    this.activeProcessingDetailsForm = this.getProcViewChildForms();
    console.log('form value: ', this.activeProcessingDetailsForm);
    return this.activeProcessingDetailsForm;
  }

  public getProcViewChildForms() {
    return (
      this.ProcessingDetailsGasView ??
      this.ProcessingDetailsLiquidView ??
      this.ProcessingDetailsCondensateView
    )?.form;
  }

  public get isDynamicSystem() {
    return this.selectedMeasurement == 'Dynamic';
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

  public getForm = (status: 'before' | 'after') => {
    return (
      getForm(
        this.selectedProduct?.productType,
        this.selectedMeasurement,
        status
      ) ?? null
    );
  };

  public get getDetailsForm() {
    return getDetailsForm(this.selectedProduct?.productType) ?? null;
  }

  @HostListener('keydown', ['$event'])
  blockSpecialNonNumerics(evt: KeyboardEvent): void {
    Util.blockSpecialNonNumerics(evt);
  }

  goBack(): void {
    this.location.back();
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

export type MeasurementType = 'Dynamic' | 'Static';
export interface IMeterType {
  id: number;
  name: string;
}

export interface IDipMethod {
  id: number;
  name: string;
}
