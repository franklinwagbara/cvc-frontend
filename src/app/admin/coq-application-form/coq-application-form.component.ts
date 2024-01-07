import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { IDepot } from '../../../../src/app/shared/interfaces/IDepot';
import { LibaryService } from '../../../../src/app/shared/services/libary.service';
import { CoqAppFormService } from '../../../../src/app/shared/services/coq-app-form.service';
import { MatStepper } from '@angular/material/stepper';
import { ICoqRequirement } from '../../../../src/app/shared/interfaces/ICoqRequirement';
import { IGasTankReading } from '../../../../src/app/shared/interfaces/IGasTankReading';
import { ILiquidTankReading } from '../../../../src/app/shared/interfaces/ILiquidTankReading';


@Component({
  selector: 'app-coq-application-form',
  templateUrl: './coq-application-form.component.html',
  styleUrls: ['./coq-application-form.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CoqApplicationFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private allSubscriptions = new Subscription();
  depotSelection = new FormControl('', Validators.required);;
  configuredTank =  this.fb.group({
    id: ['', [Validators.required, this.isUniqueTank()]],
    name: ['', [Validators.required]],
  })
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
  depots: IDepot[];
  selectedDepotId: number;
  fetchingRequirement = false;
  requirement: ICoqRequirement
  coqId: number;
  coq: ICOQ;
  noaApplication: any;

  isSubmitted = false;
  isSubmitting = false;

  isGasProduct = true;

  @ViewChild('tankInfoStepper') tankInfoStepper: MatStepper;

  tankLiqBeforeFormTempCtx: any;
  tankLiqAfterFormTempCtx: any;
  tankGasBeforeFormTempCtx: any;
  tankGasAfterFormTempCtx: any;

  viewOnly: boolean = false;

  currentYear = new Date().getFullYear();
  dateValidation = {
    min: new Date(this.currentYear - 10, 0, 1),
    max: new Date(),
  };

  documents$: BehaviorSubject<any[]> = new BehaviorSubject([]);

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
    private applicationService: ApplicationService,
  ) {
    this.route.params.subscribe((params: Params) => {
      this.appId = parseInt(params['id']);
    });

    this.route.queryParams.subscribe((qp) => {
      this.viewOnly = qp['view'];
      if (this.viewOnly) {
        this.selectedDepotId = +qp['depotId'];
        this.coqId = +qp['coqId'];
      }
    });
  }

  ngOnInit(): void {
    this.initForms();

    this.dataSource = new MatTableDataSource<any>([]);

    this.documents$.subscribe((res: any[]) => {
      if (Array.isArray(res) && res.length) {
        console.log('Value Passed To documents subject ========', res);
        res.forEach((el) => {
          const found = this.documents.find((doc) => el.docType === doc?.docType && el.docName === doc?.docName);
          if (!found) {
            this.documents.push(el);
          } else {
            this.documents = this.documents.map((item) => {
              if (el?.docIndex === found?.docIndex) {
                return { ...found, docSource: el?.docSource, fileId: el?.fileId }
              }
              return item;
            })
          }
        });
        console.log('Documents after update =========> ', this.documents);
        this.setDataSource();
        this.cd.markForCheck();
      }
    });
 
    this.subscribeUploadResponses();   
    this.subscribeReviewDataAction();

    this.restoreReviewData();
    this.subscribeReviewData();    
    this.fetchAllData();
  }

  public fetchAllData(): void {
    this.spinner.open();
    forkJoin([
      this.applicationService.viewApplication(this.appId), 
      this.libService.getAllDepotByNoaAppId(this.appId), 
      this.applicationService.getUploadDocuments(this.appId)
    ])
      .subscribe({
        next: (res: any[]) => {
          this.noaApplication = res[0]?.data;
          this.depots = res[1]?.data;
          this.documents$.next((res[2]?.data?.docs as any[]).map((el, i) => {
            return { ...el, success: null, docIndex: i, percentProgress: 0 }
          }));
          console.log('Uploaded Documents ============> ', res[2]?.data.docs);
          this.spinner.close();
        },
        error: (error: unknown) => {
          console.log(error);
          this.spinner.close();
          this.popUp.open('Something went wrong while fetching all data', 'error');
        }
      })
  }

  public initForms() {
    this.vesselLiqInfoForm = this.fb.group({
      dateOfVesselArrival: ['', [Validators.required, Validators.max]],
      dateOfVesselUllage: ['', [Validators.required]],
      dateOfSTAfterDischarge: ['', [Validators.required]],
      gov: ['', [Validators.required]],
      gsv: ['', [Validators.required]],
      mt_VAC: ['', [Validators.required]],
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
      depotPrice: ['', [Validators.required]]
    })

    this.initTemplateFormContexts();
    this.subscribeTankSelection();
    this.subscribeDepotSelection();

    this.cd.markForCheck();
  }

  fetchRequirement(depotId: number): void {
    this.spinner.show('Fetching requirement data...');
    this.fetchingRequirement = true;
    this.allSubscriptions.add(this.coqService.getCoqRequirement(this.appId, depotId).subscribe({
      next: (res: any) => {
        this.requirement = res?.data;
        this.isGasProduct = this.requirement?.productType.toLowerCase() === 'gas';
        if (!this.requirement?.tanks?.length) {
          this.popUp.open('No tanks configured for this depot. You may not proceed to next step.', 'error');
        }
        this.documents$.next(this.requirement.requiredDocuments.map((el, i) => {
          return { ...el, success: null, docIndex: i, percentProgress: 0 }
        }))
        this.fetchingRequirement = false;
        this.spinner.close();
      },
      error: (error: unknown) => {
        console.log(error);
        this.fetchingRequirement = false;
        this.popUp.open('Something went wrong while fetching requirement data.', 'error');
        this.spinner.close();
      }
    }))
  }

  public initLiqTankFormGroup(status?: string) {
    return this.fb.group({
      id: ['', [Validators.required]],
      tank: ['', [Validators.required]],
      status: [status || '', [Validators.required]],
      dip: ['', [Validators.required]],
      waterDIP: ['', [Validators.required]],
      tov: ['', [Validators.required]],
      waterVOI: ['', [Validators.required]],
      floatRoofCorr: ['', [Validators.required]],
      gov: ['', [Validators.required]],
      temp: ['', [Validators.required]],
      density: ['', [Validators.required]],
      vcf: ['', [Validators.required]],
      mtVAC: ['', [Validators.required]]
    })
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
    })
  }

  public initTemplateFormContexts(): void {
    this.tankLiqBeforeInfoForm = this.initLiqTankFormGroup('before');
    this.tankLiqBeforeFormTempCtx = {
      formGroup: this.tankLiqBeforeInfoForm
    }

    this.tankLiqAfterInfoForm = this.initLiqTankFormGroup('after');
    this.tankLiqAfterFormTempCtx = {
      formGroup: this.tankLiqAfterInfoForm
    }

    this.tankGasBeforeInfoForm = this.initGasTankFormGroup('before');
    this.tankGasBeforeFormTempCtx = {
      formGroup: this.tankGasBeforeInfoForm
    }

    this.tankGasAfterInfoForm = this.initGasTankFormGroup('after');
    this.tankGasAfterFormTempCtx = {
      formGroup: this.tankGasAfterInfoForm
    }
  }

  subscribeDepotSelection(): void {
    this.allSubscriptions.add(
        this.depotSelection.valueChanges.subscribe((val: string) => {
        if (val) {
          this.fetchRequirement(parseInt(val));
        }
      })
    )
  }

  subscribeTankSelection(): void {
    this.allSubscriptions.add(
      this.configuredTank.controls['id'].valueChanges.subscribe((val) => {
        if (val) {
          // Populate tankName control
          const tankName = this.requirement.tanks.find((t) => t?.id === parseInt(val))?.name;
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
            this.documents$.next(this.documents.map((doc) => {
              if (doc?.docIndex === el?.docIndex) {
                return ({ 
                  ...doc, 
                  fileId: el?.FileId,  
                  docSource: el?.source,                
                  percentProgress: 0 
                })
              }
              return doc;
            }))
          });
          this.cd.markForCheck();
        }
      })
    )
  }

  subscribeReviewDataAction(): void {
    this.allSubscriptions.add(
      this.coqFormService.formDataEvent.subscribe((val) => {
        if (val === 'removed') {
          this.configuredTank.reset();
          this.cd.markForCheck();
        }
      })
    )
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
        facilityId: this.requirement?.apiData?.facilityElpsId
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

  public uploadFacilityDocAndReportProgress(file: File, params: any, docIndex: number): void {
    let url = '';
    // If replacing the existing file
    if (this.documents[docIndex]?.docSource) {
      let { docTypeId, facilityId } = params;
      url = `${environment.elpsBase}/api/FacilityDocument/UpdateFile/${docTypeId}/${facilityId}?docid=${docTypeId}`;
    } else {
      // Uploading for the first time
      let { docTypeId, compId, facilityId, email, apiHash, docName, uniqueid} = params;
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
              })
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

  uploadDoc(index: number) {
    const collections =
      this.elRef.nativeElement.querySelectorAll('.file-input');
    const inputEl = collections[index];
    inputEl.click();
  }

  submit() {
    const payload = this.constructPayload();
    this.isSubmitting = true;
    this.spinner.show('Submitting CoQ Application...');

    this.coqService[this.isGasProduct ? 'createGasProductCoq' : 'createLiqProductCoq'](payload)
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.isSubmitted = true;
          this.spinner.close();
          if (res?.success) {
            this.popUp.open('CoQ Application Created Successfully', 'success');
            localStorage.removeItem(LocalDataKey.COQFORMREVIEWDATA);
          } else {
            this.popUp.open('CoQ Application Creation Failed', 'error');
          }
          this.cd.markForCheck();
        },
        error: (error: unknown) => {
          this.isSubmitting = false;
          console.log(error);
          this.spinner.close();
          this.popUp.open('CoQ Application Creation Failed', 'error');
          this.cd.markForCheck();
        }
      })
  }

  constructPayload(): any {
    let payload: any;
    const reference = { plantId: this.depotSelection.value, noaAppId: this.appId };

    if (this.isGasProduct) {
      payload = {
        ...reference,
        quauntityReflectedOnBill: this.vesselGasInfoForm.controls['qtyBillLadingMtAir'].value,
        arrivalShipFigure: this.vesselGasInfoForm.controls['arrivalShipMtAir'].value,
        dischargeShipFigure: this.vesselGasInfoForm.controls['shipDischargedMtAir'].value,
        dateOfVesselArrival: new Date(this.vesselGasInfoForm.controls['vesselArrivalDate'].value).toISOString(),
        dateOfVesselUllage: new Date(this.vesselGasInfoForm.controls['prodDischargeCommenceDate'].value).toISOString(),
        dateOfSTAfterDischarge: new Date(this.vesselGasInfoForm.controls['prodDischargeCompletionDate'].value).toISOString(),
        depotPrice: this.vesselGasInfoForm.controls['depotPrice'].value,
        nameConsignee: this.vesselGasInfoForm.controls['nameConsignee'].value,
        tankBeforeReadings: [],
        tankAfterReadings: [],
        submitDocuments: []
      }

      this.coqFormService.gasProductReviewData.forEach((el) => {
        payload.tankBeforeReadings.push(this.getGasCoQPayload(el.before));
        payload.tankAfterReadings.push(this.getGasCoQPayload(el.after));
      })
    } else {
      payload = {
        ...reference,
        dateOfVesselArrival: this.vesselLiqInfoForm.controls['dateOfVesselArrival'].value.toISOString(),
        dateOfVesselUllage: this.vesselLiqInfoForm.controls['dateOfVesselUllage'].value.toISOString(),
        dateOfSTAfterDischarge: this.vesselLiqInfoForm.controls['dateOfSTAfterDischarge'].value.toISOString(),
        depotPrice: this.vesselLiqInfoForm.controls['depotPrice'].value,
        tankBeforeReadings: [],
        tankAfterReadings: [],
        submitDocuments: []
      }

      this.coqFormService.gasProductReviewData.forEach((el) => {
        payload.tankBeforeReadings.push(this.getLiqCoQPayload(el.before));
        payload.tankAfterReadings.push(this.getLiqCoQPayload(el.after));
      })
    }

    this.documents.forEach((doc) => {
      payload.submitDocuments.push({ 
        fileId: doc.fileId, 
        docType: doc.docType,
        docName: doc.docName,
        docSource: doc.docSource
      });
    })

    return payload;
  }

  public getGasCoQPayload(data: IGasTankReading) {
    const {
      tankId,
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
      vapourFactor
    } = data;

    return {
      tankId,
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
        vapourFactor 
      }
    }
  }

  public getLiqCoQPayload(data: ILiquidTankReading) {
    const {
      tankId,
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
      tankId,
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
      }
    }
  }

  public onViewCOQ(appId: number, coqId: number, depotId: number) {
    this.router.navigate(
      [
        'admin',
        'noa-applications-by-depot',
        appId,
        'certificate-of-quantity',
        'new-application',
      ],
      { queryParams: { depotId: depotId, view: true, coqId: coqId } }
    );
  }

  restoreReviewData(): void {
    const localFormReviewData = JSON.parse(localStorage.getItem(LocalDataKey.COQFORMREVIEWDATA));
    if (Array.isArray(localFormReviewData) && localFormReviewData.length) {
      if (!this.isGasProduct) {
        this.coqFormService.liquidProductReviewData$.next(localFormReviewData);
      } else if (this.isGasProduct) {
        this.coqFormService.gasProductReviewData$.next(localFormReviewData);
      }
    }
  }

  subscribeReviewData(): void {
    this.allSubscriptions.add(this.coqFormService.liquidProductReviewData$.subscribe((val) => {
      if (Array.isArray(val) && val.length > 0) {

        // Filter off tanks with before, after data in the review area
        const tanksInReview = val.map((coqData) => {
          if (Object.keys(coqData.before).length && Object.keys(coqData.after).length) {
            return coqData.before.tank;
          }
        });
        this.coqFormService.configuredTanks = this.coqFormService.configuredTanks.filter((tank) => !tanksInReview.includes(tank));
      }
    }));
  }

  isUniqueTank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tankName = this.requirement?.tanks.find((t) => t.id === parseInt(control.value))?.name;
      if (!this.isGasProduct) {
        return !this.coqFormService.liquidProductReviewData.some((val) => val.before.tank === tankName) ?
          null : { duplicate: control.value };
      } else {
        return !this.coqFormService.gasProductReviewData.some((val) => val.before.tank === tankName) ?
          null : { duplicate: control.value };
      }
    }
  }

  saveToReview(): void {
    let coqData: CoQData;

    if (!this.isGasProduct) {
      coqData = {
        before: this.tankLiqBeforeInfoForm.value, 
        after: this.tankLiqAfterInfoForm.value,
        diff: {}
      };
      coqData['diff'] = {
        status: 'DIFF',
        tank: coqData.before.tank,
        dip: parseFloat(coqData.after.dip) - parseFloat(coqData.before.dip),
        waterDIP: parseFloat(coqData.after.waterDIP) - parseFloat(coqData.before.waterDIP),
        tov: parseFloat(coqData.after.tov) - parseFloat(coqData.before.tov),
        waterVOI: parseFloat(coqData.after.waterVOI) - parseFloat(coqData.before.waterVOI),
        corr: parseFloat(coqData.after.corr) - parseFloat(coqData.before.corr),
        gov: parseFloat(coqData.after.gov) - parseFloat(coqData.before.gov),
        temp: parseFloat(coqData.after.temp) - parseFloat(coqData.before.temp),
        density: parseFloat(coqData.after.density) - parseFloat(coqData.before.density),
        vcf: parseFloat(coqData.after.vcf) - parseFloat(coqData.before.vcf),
        gsv: parseFloat(coqData.after.gsv) - parseFloat(coqData.before.gsv),
        mtVAC: parseFloat(coqData.after.mtVAC) - parseFloat(coqData.before.mtVAC),
      }
    } else if (this.isGasProduct) {
      coqData = {
        before: this.tankGasBeforeInfoForm.value,
        after: this.tankGasAfterInfoForm.value,
      }
    }
    
    // Check for form review data in local storage
    let coqFormDataArr = JSON.parse(localStorage.getItem(LocalDataKey.COQFORMREVIEWDATA));
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
  
    localStorage.setItem(LocalDataKey.COQFORMREVIEWDATA, JSON.stringify(coqFormDataArr));

    this.configuredTank.reset();
    this.tankInfoStepper.selectedIndex = 0;

    this.cd.markForCheck();
  }

  @HostListener('keydown', ['$event'])
  blockSpecialNonNumerics(evt: KeyboardEvent): void {
    if (["e", "E", "+", "-"].includes(evt.key) && 
      (evt.target as HTMLElement).tagName.toLowerCase() === 'input' && 
      (evt.target as HTMLInputElement).type !== 'text'
    ) {
      evt.preventDefault()
    } 
  }

}

export interface LiquidProductData {
  tank: string;
  status: string;
  dip: number;
  waterDIP: number;
  tov: number;
  waterVOI: number;
  corr: number;
  gov: number;
  temp: number;
  density: number;
  vcf: number;
  gsv: number;
  mtVAC: number;
}


export interface CoQData {
  before: any;
  after: any;
  diff?: any;
}

export enum LocalDataKey {
  COQFORMPREVIEWDATA = 'coq-form-preview-data-arr',
  COQFORMREVIEWDATA = 'coq-form-review-data-arr'
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
  observedSounding: number,
  tapeCorrection: number,
  liquidTemperature: number,
  observedLiquidVolume: number,
  shrinkageFactorLiquid: number,
  vcf: number,
  tankVolume: number,
  shrinkageFactorVapour: number,
  vapourTemperature: number,
  vapourPressure: number,
  molecularWeight: number,
  vapourFactor: number
}

export interface LiquidTankReading {
  tank?: string;
  status?: string;
  dip: number,
  waterDIP: number,
  tov: number,
  waterVolume: number,
  floatRoofCorr: number,
  gov: number,
  temp: number,
  density: number,
  vcf: number
}

interface UploadDocData {
  fileId: number,
  docId: number,
  docSource: string,
  docType: string,
  docName: string
}