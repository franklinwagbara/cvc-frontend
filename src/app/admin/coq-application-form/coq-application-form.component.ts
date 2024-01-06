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
import { BehaviorSubject, Subscription } from 'rxjs';
import { FileuploadWithProgressService } from '../../shared/services/fileupload-with-progress.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoqService } from '../../../../src/app/shared/services/coq.service';
import { SpinnerService } from '../../../../src/app/shared/services/spinner.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ICOQ,
  ICoQApplication,
} from '../../../../src/app/shared/interfaces/ICoQApplication';
import { environment } from '../../../../src/environments/environment';
import {
  DocumentConfig,
  DocumentInfo,
  IUploadDocInfo,
} from '../../../../src/app/company/document-upload/document-upload.component';
import { ApplicationService } from '../../../../src/app/shared/services/application.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { IDepot } from '../../../../src/app/shared/interfaces/IDepot';
import { LibaryService } from '../../../../src/app/shared/services/libary.service';
import { CoqAppFormService } from '../../../../src/app/shared/services/coq-app-form.service';
import { MatStepper } from '@angular/material/stepper';
import { DepotOfficerService } from '../../../../src/app/shared/services/depot-officer/depot-officer.service';
import { ProgressBarService } from '../../../../src/app/shared/services/progress-bar.service';
import { ICoqRequirement } from '../../../../src/app/shared/interfaces/ICoqRequirement';

@Component({
  selector: 'app-coq-application-form',
  templateUrl: './coq-application-form.component.html',
  styleUrls: ['./coq-application-form.component.css'],
})
export class CoqApplicationFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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
  displayedColumns = ['document', 'action', 'progress'];
  private allSubscriptions = new Subscription();
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

  liquidProductColumns = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVOI', 'corr', 'gov', 'temp', 'density', 'vcf', 'gsv', 'mtVAC'];
  gasProductColumns = [
    'tank', 'status', 'liqDensityVac', 'obsSounding', 'tapeCorr', 'liqTemp', 'observedLiqVol',
    'shrinkageFactor', 'vcf', 'tankVol100', 'vapTemp', 'vapPressure', 'molWt', 'vapFactor'
  ]

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

  dummyTanks = [{id: 1, name: 'Tank 1'}, {id: 2, name: 'Tank 2'}]

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
    private progressBar: ProgressBarService,
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
    if (this.coqId) this.getCOQ();

    this.initForms(null);

    this.dataSource = new MatTableDataSource<any>([]);

    this.documents$.subscribe((res) => {
      if (res) {
        this.documents = res;
        this.setDataSource();
      }
    });

    // Subscribe to uploaded data responses
    this.allSubscriptions.add(
      this.fileUpload.uploadResponses$.subscribe((val) => {
        if (Array.isArray(val) && val.length) {
          this.uploadedDocInfo = val;
          this.documents = this.documents.map((el) => {
            const found = this.uploadedDocInfo.find((doc) => el.docId == doc?.docId && el.docType == doc?.docType);
            if (found) {
              return { ...el, docSource: found?.docSource }
            }
            return el;
          })
        }
      })
    )
    
    this.restoreReviewData();
    this.subscribeReviewData();

    this.getNoaApplication();
    this.getDepots();
  }

  public getNoaApplication() {
    this.spinner.open();
    this.applicationService.viewApplication(this.appId).subscribe({
      next: (res: any) => {
        this.noaApplication = res.data;
        this.spinner.close();
      },
      error: (error: any) => {
        console.log(error);
        this.popUp.open('Something went wrong while retrieving data.', 'error');
        this.spinner.close();
      }
    })
  }

  public initForms(coqInfo: ICOQ) {
    if (!coqInfo)
      this.vesselLiqInfoForm = this.fb.group({
        dateOfVesselArrival: ['', [Validators.required, Validators.max]],
        dateOfVesselUllage: ['', [Validators.required]],
        dateOfSTAfterDischarge: ['', [Validators.required]],
        gov: ['', [Validators.required]],
        gsv: ['', [Validators.required]],
        mt_VAC: ['', [Validators.required]],
        depotPrice: ['', [Validators.required]],
      });
    else {
      this.vesselLiqInfoForm = this.fb.group({
        dateOfVesselArrival: [
          new Date(coqInfo.dateOfVesselArrivalISO),
          [Validators.required, Validators.max],
        ],
        dateOfVesselUllage: [
          new Date(coqInfo.dateOfVesselUllageISO),
          [Validators.required],
        ],
        dateOfSTAfterDischarge: [
          new Date(coqInfo.dateOfSTAfterDischargeISO),
          [Validators.required],
        ],
        gov: [coqInfo.gov ?? '', [Validators.required]],
        gsv: [coqInfo.gsv ?? '', [Validators.required]],
        mt_VAC: [coqInfo.mT_VAC ?? '', [Validators.required]],
        depotPrice: [coqInfo.depotPrice ?? '', [Validators.required]],
      });
    }

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

    this.tankLiqBeforeInfoForm = this.getTankLiqProdFormGroup('before');
    this.tankLiqBeforeFormTempCtx = {
      formGroup: this.tankLiqBeforeInfoForm
    }

    this.tankLiqAfterInfoForm = this.getTankLiqProdFormGroup('after');
    this.tankLiqAfterFormTempCtx = {
      formGroup: this.tankLiqAfterInfoForm
    }

    this.tankGasBeforeInfoForm = this.getTankGasProdFormGroup('before');
    this.tankGasBeforeFormTempCtx = {
      formGroup: this.tankGasBeforeInfoForm
    }

    this.tankGasAfterInfoForm = this.getTankGasProdFormGroup('after');
    this.tankGasAfterFormTempCtx = {
      formGroup: this.tankGasAfterInfoForm
    }

    this.configuredTank.controls['id'].valueChanges.subscribe((val) => {
      if (val) {
        // Populate tankName control
        const tankName = this.requirement.tanks.find((t) => t?.id === parseInt(val))?.name;
        this.configuredTank.controls['name'].setValue(tankName || '');
        if (!this.isGasProduct) {
          this.tankLiqBeforeInfoForm.controls['tank'].setValue(tankName);
          this.tankLiqAfterInfoForm.controls['tank'].setValue(tankName);
        } else if (this.isGasProduct) {
          this.tankGasBeforeInfoForm.controls['tank'].setValue(tankName);
          this.tankGasAfterInfoForm.controls['tank'].setValue(tankName);
        }
      }
    })

    this.depotSelection.valueChanges.subscribe((val: string) => {
      if (val) {
        this.fetchRequirement(parseInt(val));
      }
    })

    this.cd.markForCheck();
  }

  public getCOQ() {
    this.coqService.getCOQById(this.coqId).subscribe({
      next: (res) => {
        this.coq = res.data;
        this.initForms(this.coq);
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.spinner.close();
        this.popup.open(e?.message, 'error');
        this.cd.markForCheck();
      },
    });
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
        this.documents$.next(this.requirement.requiredDocuments.map((el) => {
          return { ...el, success: null, percentProgress: el.docSource ? 100 : 0 }
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

  public checkProductType(): void {
    this.isGasProduct = true;
  }

  public getTankLiqProdFormGroup(status?: string) {
    return this.fb.group({
      tank: ['', [Validators.required]],
      status: [status || '', [Validators.required]],
      dip: ['', [Validators.required]],
      waterDIP: ['', [Validators.required]],
      tov: ['', [Validators.required]],
      waterVOI: ['', [Validators.required]],
      corr: '',
      gov: ['', [Validators.required]],
      temp: ['', [Validators.required]],
      density: ['', [Validators.required]],
      vcf: ['', [Validators.required]],
      gsv: ['', [Validators.required]],
      mtVAC: ['', [Validators.required]]
    })
  }

  public getTankGasProdFormGroup(status?: string) {
    return this.fb.group({
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

  public getDepots() {
    this.spinner.open();
    this.libService.getAllDepotByNoaAppId(this.appId).subscribe({
      next: (res: any) => {
        this.depots = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.spinner.close();
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

  onFileSelected(evt: Event, index: number, doc: DocumentInfo): void {
    const file = (evt.target as any).files[0];
    if (file) {
      let isAccepted = /(\.png|\.jpg|\.jpeg|\.pdf)$/i.test(file.name);
      if (!isAccepted) {
        this.snackBar.open(`Invalid file (${file.name}) format`);
        (evt.target as any).value = '';
        return;
      }

      const fileSizeInBytes = file.size;
      const fileSizeInKb = fileSizeInBytes / 1024;
      const fileSizeInMB = fileSizeInKb / 1024;
      if (fileSizeInMB > 20) {
        this.snackBar.open(`File ${file.name} size too large`, null, {
          panelClass: ['error'],
        });
        (evt.target as any).value = '';
        return;
      }

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

      let uploadUrl = '';

      // If replacing the existing file
      if (this.documents[index]?.docSource) {
        let { docTypeId, facilityId } = uploadParams;
        uploadUrl = `${environment.elpsBase}/api/FacilityDocument/UpdateFile/${docTypeId}/${facilityId}?docid=${docTypeId}`;
      } else {
        // Uploading for the first time
        let { docTypeId, compId, facilityId, email, apiHash, docName, uniqueid} = uploadParams;
        uploadUrl = `${environment.elpsBase}/api/Facility/UploadFile/${docTypeId}/${compId}/${facilityId}/${email}/${apiHash}?docName=${docName}&uniqueid=${uniqueid}`;
      }

      this.allSubscriptions.add(
        this.fileUpload.uploadFile(file, uploadUrl).subscribe({
          next: (val: number) => {
            // Update file upload progress
            this.documents = this.documents.map((el, i) => {
              if (i === index) {
                return {
                  ...el,
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
              if (i === index) {
                return { ...el, success: false };
              }
              return el;
            });
            this.documents$.next(this.documents);
            this.snackBar.open('Could not upload file', null, {
              panelClass: ['error'],
            });
            this.cd.markForCheck();
          },
        })
      );
    }
  }

  uploadDoc(index: number) {
    const collections =
      this.elRef.nativeElement.querySelectorAll('.file-input');
    const inputEl = collections[index];
    inputEl.click();
  }

  save(): void {
    if (!this.selectedDepotId) {
      this.popup.open('No depot was selected. Please select a depot', 'error');
      return;
    }

    let data: ICoQApplication = {
      ...this.vesselLiqInfoForm.value,
      appId: this.appId,
      depotId: this.selectedDepotId,
    };
    this.spinner.open();
    this.coqService.createCoQ(data).subscribe({
      next: (res) => {
        this.spinner.close();
        this.popup.open(
          res?.message ?? 'COQ was saved successfully.',
          'success'
        );
        this.coqId = res.data.id;
        this.onViewCOQ(this.appId, this.coqId, this.selectedDepotId);
        this.cd.markForCheck();
      },
      error: (e) => {
        this.spinner.close();
        this.popup.open(e?.message ?? 'Attempt to save COQ failed!', 'error');
        this.cd.markForCheck();
      },
    });
  }

  submit() {
    let payload: any;

    if (this.isGasProduct) {
      payload = {
        plantId: this.depotSelection.value,
        noaAppId: this.appId,
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
    }

    if (this.isGasProduct) {
      this.coqFormService.gasProductReviewData.forEach((el) => {
        payload.tankBeforeReadings.push(this.getGasPayload(el.before));
        payload.tankAfterReadings.push(this.getGasPayload(el.after));
      })

      this.documents.forEach((doc) => {
        payload.submitDocuments.push({ 
          fileId: doc.fileId, 
          docType: doc.docType,
          docName: doc.docName,
          docSource: doc.docSource
        });
      })

      this.isSubmitting = true;
      this.spinner.show('Submitting CoQ Application...');
      this.coqService.createGasProductCoq(payload).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.isSubmitted = true;
          this.spinner.close();
          if (res?.success) {
            this.popUp.open('CoQ Application Created Successfully', 'success');
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
    } else {
      // this.coqService.createLiqProductCoq(payload).subscribe()
    }
  }

  public getGasPayload(data: GasTankReading) {
    const {
      tank,
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

    // There will be issue here if tank name is not unique per id
    const tankId = this.requirement.tanks.find((el) => el?.name === tank)?.id;

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
    if (["e", "E", "+"].includes(evt.key) && 
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

interface GasTankReading {
  tank?: string | null;
  status?: string | null;
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

interface UploadDocData {
  fileId: number,
  docId: number,
  docSource: string,
  docType: string,
  docName: string
}