import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
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
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { MatStep, MatStepper } from '@angular/material/stepper';
import { ICoqRequirement } from '../../../../src/app/shared/interfaces/ICoqRequirement';
import { IPlant } from 'src/app/shared/interfaces/IPlant';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { MatDialog } from '@angular/material/dialog';
import { CoqApplicationPreviewComponent } from './coq-application-preview/coq-application-preview.component';
import { Location } from '@angular/common';
import { Util } from 'src/app/shared/lib/Util';
import { GenericService } from 'src/app/shared/services';
import { MatPaginator } from '@angular/material/paginator';

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
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  private allSubscriptions = new Subscription();

  isEditMode = false;
  depotSelection: FormControl;
  configuredTank: FormGroup;
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
  
  fetchingRequirement = false;
  requirement: ICoqRequirement;
  coqId: number;
  existingCoq: IExistingCoQ;
  selectedDepotId: number;
  application: any;

  isSubmitted = false;
  isSubmitting = false;

  isGasProduct: boolean | null = null;

  noPlantFetched: boolean | null = null;
  noTankConfigured: boolean | null = null;

  public pageSizeOptions = [5, 10, 15, 20, 30];
  public pageSize = 10;

  @ViewChild('container') container: ElementRef;
  @ViewChild('coqStepper') coqStepper: MatStepper;
  @ViewChild('tankInfoStepper') tankInfoStepper: MatStepper;
  @ViewChild('paginator', { read: MatPaginator }) paginator!: MatPaginator;
  // public dataSource = new MatTableDataSource<any>();

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
    private cd: ChangeDetectorRef,
    public coqFormService: CoqAppFormService,
    private popUp: PopupService,
    private dialog: MatDialog,
    private applicationService: ApplicationService,
    private location: Location,
    private generic: GenericService,
  ) {
    this.route.params.subscribe((params: Params) => {
      this.appId = parseInt(params['id']);
      this.coqId = parseInt(params['coqId']);
      this.isEditMode = !isNaN(this.coqId);
    });
  }

  ngOnInit(): void {
    this.initForms();
    
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

  ngAfterViewChecked(): void {
    this.container.nativeElement.scrollTop = this.container.nativeElement?.scrollHeight;
  }

  goBack(): void {
    this.location.back();
  }

  public fetchAllData(): void {
    this.spinner.open();

    if (this.isEditMode) {
      localStorage.removeItem(LocalDataKey.COQFORMREVIEWDATA);
      this.coqService.viewCoqApplication(this.coqId).subscribe({
        next: (res: any) => {
          this.populateEditForms(res);
          this.spinner.close();
          this.restoreReviewData();

          // Advance to the last step and scroll into view
          for (let i =0; i < 4; i++) {
            this.coqStepper.next();
          }

          this.cd.markForCheck();
        },
        error: (err: unknown) => {
          console.error(err);
          this.spinner.close();
          this.popUp.open(
            'Something went wrong while fetching all data',
            'error'
          );
        }
      })
    } else {
      forkJoin([
        this.applicationService.viewApplication(this.appId),
        this.libService.getAllDepotByNoaAppId(this.appId),
      ]).subscribe({
        next: (res: any[]) => {
          this.application = res[0]?.data;
          this.depots = res[1]?.data;
          this.noPlantFetched = !this.depots.length;
          
          this.spinner.close();
        },
        error: (error: unknown) => {
          console.error(error);
          this.noPlantFetched = true;
          this.spinner.close();
          this.popUp.open(
            'Something went wrong while fetching all data',
            'error'
          );
        },
      });
    }
  }

  private populateEditForms(res: any): void {
    this.existingCoq = res.data;
    this.documents$.next([this.existingCoq.docs]);
    this.application = res.data?.coq;
    
    this.isGasProduct = res.data?.coq?.productType?.toLowerCase() === 'gas';
  
    // Populate depot
    this.selectedDepotId = this.existingCoq?.coq.plantId;
    this.depotSelection.setValue(this.existingCoq?.coq?.plantId);

    const tankList: any[] = res.data?.tankList || [];

    const coqData: CoQData[] = tankList.map((el: any) => {
      let beforeReading = el?.tankMeasurement.find((r: any) => {
        return r?.measurementType === 'Before'
      });
      beforeReading = { 
        ...beforeReading, 
        id: el?.tankId, 
        tank: el?.tankName, 
        status: 'before' 
      };
      let afterReading = el?.tankMeasurement.find((r: any) => {
        return r?.measurementType === 'After'
      });
      afterReading = { 
        ...afterReading, 
        id: el?.tankId, 
        tank: el?.tankName, 
        status: 'after' 
      };
      delete beforeReading.tankName;
      delete beforeReading.measurementType;
      delete afterReading.tankName;
      delete afterReading.measurementType;
      return { before: beforeReading, after: afterReading };
    })

    // Populate Shore Tank Ullage Details
    if (this.isGasProduct) {
      const vesselDetailsMap = {
        vesselArrivalDate: "dateOfVesselArrival",
        prodDischargeCommenceDate: "dateOfVesselUllage",
        prodDischargeCompletionDate: "dateOfSTAfterDischarge",
        qtyBillLadingMtAir: "quauntityReflectedOnBill",
        arrivalShipMtAir: "arrivalShipFigure",
        shipDischargedMtAir: "dischargeShipFigure",
        nameConsignee: "nameConsignee",
        depotPrice: "depotPrice"
      }
      for (let key in this.vesselGasInfoForm.controls) {
        this.vesselGasInfoForm.controls[key].patchValue(
          this.existingCoq?.coq[vesselDetailsMap[key]]
        )
      }
    } else {
      for (let key in this.vesselLiqInfoForm.controls) {
        this.vesselLiqInfoForm.controls[key].patchValue(
          this.existingCoq?.coq[key]
        )
      }
    }

    localStorage.setItem(LocalDataKey.COQFORMREVIEWDATA, JSON.stringify(coqData));
  }

  public initForms() {
    this.depotSelection = new FormControl(
      this.isEditMode ? this.selectedDepotId : '', 
      Validators.required
    );

    this.configuredTank = this.fb.group({
      id: ['', [Validators.required, this.isUniqueTank()]],
      name: ['', [Validators.required]],
    });

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

    this.cd.markForCheck();
  }

  fetchRequirement(depotId: number): void {
    this.spinner.show('Loading requirement data...');
    this.fetchingRequirement = true;
    this.allSubscriptions.add(
      this.coqService.getCoqRequirement(this.appId, depotId).subscribe({
        next: (res: any) => {
          this.requirement = res?.data;
          this.noTankConfigured = !this.requirement.tanks.length;
          
          this.isGasProduct =
            this.requirement?.productType.toLowerCase() === 'gas';

          if (this.noTankConfigured) {
            this.popUp.open(
              'No tanks configured for this depot. You may not proceed to the next step.',
              'error'
            );
            localStorage.removeItem(LocalDataKey.COQFORMREVIEWDATA);
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
          console.error(error);
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
      shrinkageFactorLiquid: ['', [Validators.required]],
      shrinkageFactorVapour: ['', [Validators.required]],
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
        if (val && !this.isEditMode) {
          this.fetchRequirement(parseInt(val));
        }
      })
    );
  }

  subscribeTankSelection(): void {
    this.allSubscriptions.add(
      this.configuredTank.controls['id'].valueChanges.subscribe((val) => {
        // Populate tankName control
        const tank = (this.requirement.tanks || []).find((t) => t?.id === parseInt(val));
        const tankName = tank?.name;
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
          // Remove invalid upload responses with FileId < 1
          val = val.filter((r) => r?.FileId > 0 && r?.name);
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
    this.dataSource.paginator = this.paginator;
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

    // Reinitialize upload progress
    this.documents = this.documents.map(
      (d) => d?.docIndex === docIndex ? ({...d, percentProgress: 0}) : d
    )

    this.allSubscriptions.add(
      this.fileUpload.uploadFile(file, url, docIndex).subscribe({
        next: (val: number) => {
          // Update file upload progress
          this.documents = this.documents.map((el, i) => {
            if (i === docIndex) {
              console.log('FileId =======> ', el?.fileId);
              const uploadFailed = val === 100 && el?.fileId < 0 ? false : null
              if (uploadFailed === false) {
                this.popUp.open(`Failed to upload file (${file.name})`, 'error');
              }
              return {
                ...el,
                docIndex,
                percentProgress: val,
                success: val === 100 && el?.fileId >= 0 ? true : uploadFailed
              };
            }
            return el;
          });
          this.documents$.next(this.documents);
          this.cd.markForCheck();
        },
        error: (error: any) => {
          console.error(error);
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
      productName: this.isEditMode 
        ? this.existingCoq?.coq?.productName 
        : this.requirement.productName,
      vesselName: this.application.vessel.name,
      motherVessel: this.application.motherVessel,
      loadingPort: this.application.loadingPort,
      jetty: this.application.jetty,
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

  resetFormOnSubmitted() {
    if (this.isSubmitted) {
      if (this.isGasProduct) {
        this.vesselGasInfoForm.reset();  
      } else {
        this.vesselLiqInfoForm.reset();
      }
      this.depotSelection.reset();
      this.documents = [];
      this.uploadedDocInfo = [];
    }
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
          this.resetFormOnSubmitted();

          this.restoreReviewData();
          this.coqStepper.selectedIndex = 0;
          this.router.navigate([
            'admin',
            'coq',
            'coq-applications-by-depot',
          ]);
        } else {
          this.popUp.open('CoQ Application Creation Failed', 'error');
        }
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.isSubmitting = false;
        console.error(error);
        this.spinner.close();
        this.popUp.open('CoQ Application Creation Failed', 'error');
        this.cd.markForCheck();
      },
    });
  }

  constructPayload(): any {
    let payload: any;
    const reference = {
      plantId: this.depotSelection.value,
      noaAppId: this.appId,
    };

    if (this.isGasProduct) {
      payload = {
        ...reference,
        productId: null,
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
        productId: null,
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
      shrinkageFactorLiquid,
      shrinkageFactorVapour,
      tankVolume,
      vapourFactor,
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
        shrinkageFactorVapour,
        vcf,
        tankVolume,
        vapourFactor,
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
      temperature,
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
        temperature,
        density,
        vcf,
      },
    };
  }

  /**
   * Restores previous COQ data from localStorage only if data is for the current product type (gas or liquid),
   * thus eliminating pollution of localStorage with data of different product type, in which case 
   * there will be a high chance of eventually submitting some COQ data set (before & after) with empty readings.
   */
  restoreReviewData(): void {
    let reviewData = JSON.parse(
      localStorage.getItem(LocalDataKey.COQFORMREVIEWDATA)
    );
    if (Array.isArray(reviewData) && reviewData.length) { 
      if (!this.isEditMode && this.requirement?.tanks?.length) {
        // Remove previously stored readings for tanks not configured for current depot
        reviewData = reviewData.filter(
          (d) => this.requirement.tanks.some((t) => t.id === parseInt(d.before.id))
        )
        localStorage.setItem(LocalDataKey.COQFORMREVIEWDATA, JSON.stringify(reviewData));
      }

      if (this.isGasProduct !== null && reviewData.length) {
        if (!this.isGasProduct 
          && Util.hasProperties(reviewData[0]?.before, this.coqFormService.liquidProductProps)) 
        {
          this.coqFormService.liquidProductReviewData$.next(reviewData);
        } else if (this.isGasProduct 
          && Util.hasProperties(reviewData[0]?.before, this.coqFormService.gasProductProps)) 
        {
          this.coqFormService.gasProductReviewData$.next(reviewData);
        } else {
          localStorage.removeItem(LocalDataKey.COQFORMREVIEWDATA);
        }
      }
    }
  }

  isUniqueTank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tank = (this.requirement?.tanks || []).find(
        (t) => t.id === parseInt(control.value)
      );
      if (this.isGasProduct !== null && !this.isGasProduct) {
        return !this.coqFormService.liquidProductReviewData.some(
          (val) => val.before.id === parseInt(control.value)
        )
          ? null
          : { duplicate: control.value };
      } else if (this.isGasProduct !== null && this.isGasProduct) {
        return !this.coqFormService.gasProductReviewData.some(
          (val) => val.before.id === parseInt(control.value)
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

interface IExistingCoQ {
  coq?: any;
  tankList: any[];
  docs: DocumentInfo;
  appHistories?: any;
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
  id: number;
  vcf: number;
  tank: string;
  status: string;
  tankVolume: number;
  vapourFactor: number;
  tapeCorrection: number;
  vapourPressure: number;
  molecularWeight: number;
  liquidDensityVac: number;
  observedSounding: number;
  vapourTemperature: number;
  liquidTemperature: number;
  observedLiquidVolume: number;
  shrinkageFactorLiquid: number;
  shrinkageFactorVapour: number;
}

export interface LiquidTankReading {
  id: number;
  tank: string;
  status: string;
  density: number;
  dip: number;
  floatRoofCorr: number;
  gov: number;
  temperature: number;
  tov: number;
  vcf: number;
  waterDIP: number;
  waterVolume: number;
}

export type GasProductReviewData = { before: GasTankReading, after: GasTankReading };
export type LiquidProductReviewData = { before: LiquidTankReading, after: LiquidTankReading };