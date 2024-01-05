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
import { Util } from '../../../../src/app/shared/lib/Util';
import { CoqAppFormService } from '../../../../src/app/shared/services/coq-app-form.service';
import { MatStepper } from '@angular/material/stepper';
import { DepotOfficerService } from '../../../../src/app/shared/services/depot-officer/depot-officer.service';

@Component({
  selector: 'app-coq-application-form',
  templateUrl: './coq-application-form.component.html',
  styleUrls: ['./coq-application-form.component.css'],
})
export class CoqApplicationFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  depotSelection = new FormControl('', Validators.required);;
  configuredTank =  new FormControl('', {validators: [Validators.required, this.isUniqueTank()]});
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
  uploadDocInfo: IUploadDocInfo;
  documents: DocumentInfo[] = [];
  depots: IDepot[];
  selectedDepotId: number;
  coqId: number;
  coq: ICOQ;
  noaApplication: any;

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

  uploadedDocs: File[] = [];
  uploadedDoc$ = new BehaviorSubject<File>(null);
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
    private appService: ApplicationService,
    private popup: PopupService,
    private libService: LibaryService,
    private cd: ChangeDetectorRef,
    public coqFormService: CoqAppFormService,
    private depotOfficerService: DepotOfficerService,
    private popUp: PopupService,
    private applicationService: ApplicationService
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

    this.uploadedDoc$.subscribe((file) => {
      this.uploadedDocs.push(file);
    });

    this.dataSource = new MatTableDataSource<any>([]);

    this.documents$.subscribe((res) => {
      this.setDataSource();
    });
    
    this.restoreReviewData();
    this.subscribeReviewData();

    this.getNoaApplication();
    this.getVesselDetails();
    this.getDepots();
    this.getUploadDocuments();
    this.coqFormService.configuredTanks = this.fetchConfiguredTanks();

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
      nameOfConsignor: ['', [Validators.required]],
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

    this.configuredTank.valueChanges.subscribe((val) => {
      if (val) {
        if (!this.isGasProduct) {
          this.tankLiqBeforeInfoForm.controls['tank'].setValue(val);
          this.tankLiqAfterInfoForm.controls['tank'].setValue(val);
        } else if (this.isGasProduct) {
          this.tankGasBeforeInfoForm.controls['tank'].setValue(val);
          this.tankGasAfterInfoForm.controls['tank'].setValue(val);
        }
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

  public getVesselDetails() {
    this.spinner.open();
    this.allSubscriptions.add(
      this.appService.getVesselDetails(this.appId).subscribe({
      next: (res) => {
        this.vesselInfo = res.data;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.spinner.close();
        this.popup.open(e?.message, 'error');
        this.cd.markForCheck();
      },
    }));
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
      liqDensityVac: ['', [Validators.required]], 
      obsSounding: ['', [Validators.required]], 
      tapeCorr: ['', [Validators.required]],
      liqTemp: ['', [Validators.required]],
      observedLiqVol: ['', [Validators.required]], 
      shrinkageFactor: ['', [Validators.required]],
      vcf: ['', [Validators.required]], 
      tankVol100: ['', [Validators.required]], 
      vapTemp: ['', [Validators.required]], 
      vapPressure: ['', [Validators.required]],
      molWt: ['', [Validators.required]],
      vapFactor: ['', [Validators.required]],
    })
  }

  public getUploadDocuments() {
    this.spinner.open();
    this.allSubscriptions.add(
      this.appService.getUploadDocuments(this.appId).subscribe({
      next: (res) => {
        this.documentConfig = res.data.apiData;
        this.documents = res.data.docs;
        this.documents$.next(this.documents);
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.spinner.close();
        this.popup.open(e?.message, 'error');
        this.cd.markForCheck();
      },
    }));
  }

  public getDepots() {
    this.spinner.open();
    this.libService.getAppDepots().subscribe({
      next: (res) => {
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
      return this.documents.every((info) => info.docSource);
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

      const dateId = Date.now();
      // To update with actual dynamic data
      const { docTypeId, compId, email, apiHash, docName, uniqueid } = {
        docTypeId: doc.docId,
        compId: this.documentConfig.companyElpsId,
        email: this.documentConfig.apiEmail,
        apiHash: this.documentConfig.apiHash,
        docName: doc.docName,
        uniqueid: '',
      };

      const uploadUrl = `${environment.elpsBase}/api/UploadCompanyDoc/${docTypeId}/${compId}/${email}/${apiHash}?docName=${docName}&uniqueid=${uniqueid}`;

      this.allSubscriptions.add(
        this.fileUpload.uploadFile(file, uploadUrl).subscribe({
          next: (val: number) => {
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
    this.coqService.submit(this.coqId).subscribe({
      next: (res) => {
        this.popup.open(
          'COQ Application was submitted successfully.',
          'success'
        );
        this.spinner.close();
        this.getCOQ();
        this.cd.markForCheck();
      },
      error: (e) => {
        this.spinner.close();
        this.popup.open(e?.message, 'error');
        this.cd.markForCheck();
      },
    });
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

  public get isSubmitted() {
    return this.coq && this.coq.submittedDate;
  }

  fetchConfiguredTanks(): string[] {
    return ['Tank 1', 'Tank 2', 'Tank 3'];
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
      if (!this.isGasProduct) {
        return !this.coqFormService.liquidProductReviewData.some((val) => val.before.tank.toLowerCase() === control.value.toLowerCase()) ?
          null : { duplicate: control.value };
      } else {
        return !this.coqFormService.gasProductReviewData.some((val) => val.before.tank.toLowerCase() === control.value.toLowerCase()) ?
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

    this.configuredTank.setValue('');
    this.tankInfoStepper.selectedIndex = 0;

    this.cd.markForCheck();
  }

  updateConfiguredTanks() {
    const tanksInReview = this.coqFormService.liquidProductReviewData.map((coqData) => {
      if (Object.keys(coqData.before).length && Object.keys(coqData.after).length) {
        return coqData.before.tank;
      }
    });
    this.coqFormService.configuredTanks = this.fetchConfiguredTanks().filter((tank) => !tanksInReview.includes(tank));
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
