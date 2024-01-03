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
import { CoqService } from 'src/app/shared/services/coq.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ICOQ,
  ICoQApplication,
} from 'src/app/shared/interfaces/ICoQApplication';
import { environment } from 'src/environments/environment';
import {
  DocumentConfig,
  DocumentInfo,
  IUploadDocInfo,
} from 'src/app/company/document-upload/document-upload.component';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { IDepot } from 'src/app/shared/interfaces/IDepot';
import { LibaryService } from 'src/app/shared/services/libary.service';
import { Util } from 'src/app/shared/lib/Util';
import { CoqAppFormService } from 'src/app/shared/services/coq-app-form.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-coq-application-form',
  templateUrl: './coq-application-form.component.html',
  styleUrls: ['./coq-application-form.component.css'],
})
export class CoqApplicationFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  depotSelection = new FormControl('', Validators.required);;
  tankName =  new FormControl('', {validators: [Validators.required, this.isUniqueTankName()]});
  tankInfoForm: FormGroup;
  tankBeforeInfoForm: FormGroup;
  tankAfterInfoForm: FormGroup;
  vesselInfoForm: FormGroup;
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

  tankDisplayedColumns = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVOI', 'corr', 'gov', 'temp', 'density', 'vcf', 'gsv', 'mtVAC'];

  @ViewChild('tankInfoStepper') tankInfoStepper: MatStepper;

  tankBeforeFormTemplateCtx: any;
  tankAfterFormTemplateCtx: any;

  viewOnly: boolean = false;

  dateValidation = {
    minDate: '',
    maxDate: new Date(),
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
    public coqFormService: CoqAppFormService
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
    this.initialForms(null);

    this.uploadedDoc$.subscribe((file) => {
      this.uploadedDocs.push(file);
    });

    this.dataSource = new MatTableDataSource<any>([]);

    this.documents$.subscribe((res) => {
      this.setDataSource();
    });

    this.coqFormService.configuredTanks = this.fetchConfiguredTanks();
    
    this.subscribeReviewData();
    this.restoreReviewData();

    this.coqFormService.formDataEvent.subscribe((val) => {
      if (val === 'removed') {
        this.updateConfiguredTanks();
      }
    })

    this.getVesselDetails();
    this.getDepots();
    this.getUploadDocuments();
  }

  public initialForms(coqInfo: ICOQ) {
    if (!coqInfo)
      this.vesselInfoForm = this.fb.group({
        dateOfVesselArrival: ['', [Validators.required, Validators.max]],
        dateOfVesselUllage: ['', [Validators.required]],
        dateOfSTAfterDischarge: ['', [Validators.required]],
        gov: ['', [Validators.required]],
        gsv: ['', [Validators.required]],
        mt_VAC: ['', [Validators.required]],
        depotPrice: ['', [Validators.required]],
      });
    else {
      this.vesselInfoForm = this.fb.group({
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

    this.tankInfoForm = this.fb.group({
      tank: ['', [Validators.required]],
      status: ['', [Validators.required]],
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

    this.tankBeforeInfoForm = this.getTankInfoFormGroup('before');
    this.tankAfterInfoForm = this.getTankInfoFormGroup('after');

    this.tankBeforeFormTemplateCtx = {
      formGroup: this.tankBeforeInfoForm
    }

    this.tankAfterFormTemplateCtx = {
      formGroup: this.tankAfterInfoForm
    }

    this.allSubscriptions.add(
      this.tankName.valueChanges.subscribe((val) => {
      if (val) {
        this.tankBeforeInfoForm.controls['tank'].setValue(val);
        this.tankAfterInfoForm.controls['tank'].setValue(val);
      }
    }))

    this.cd.markForCheck();
  }

  public getCOQ() {
    this.coqService.getCOQById(this.coqId).subscribe({
      next: (res) => {
        this.coq = res.data;
        this.initialForms(this.coq);
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

  public getTankInfoFormGroup(status?: string) {
    return this.fb.group({
      tank: [this.tankName.value || '', [Validators.required]],
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

  public getUploadDocuments() {
    this.spinner.open();
    this.allSubscriptions.add(
      this.appService.getUploadDocuments(this.appId).subscribe({
      next: (res) => {
        this.documentConfig = res.data.apiData;
        this.documents = res.data.docs;
        this.documents$.next(this.documents);
        this.hasUploadedAllRequiredDocs;
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
      ...this.vesselInfoForm.value,
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

  public submit() {
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
      this.coqFormService.liquidProductReviewData$.next(localFormReviewData);
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

  isUniqueTankName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !this.coqFormService.liquidProductReviewData.some((val) => val.before.tank.toLowerCase() === control.value.toLowerCase()) ?
        null : { duplicate: control.value };
    }
  }

  saveToReview(): void {
    const coqData: CoQData = {
      before: this.tankBeforeInfoForm.value, 
      after: this.tankAfterInfoForm.value, 
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
    
    // Check for form preview data in local storage
    let coqFormDataArr = JSON.parse(localStorage.getItem(LocalDataKey.COQFORMREVIEWDATA));
    if (Array.isArray(coqFormDataArr) && coqFormDataArr.length) {
      coqFormDataArr.push(coqData);
    } else {
      coqFormDataArr = [coqData];
    }
    this.coqFormService.liquidProductReviewData$.next(coqFormDataArr);
    localStorage.setItem(LocalDataKey.COQFORMREVIEWDATA, JSON.stringify(coqFormDataArr));

    for (let control in this.tankBeforeInfoForm.controls) {
      if (control !== 'status') {
        this.tankBeforeInfoForm.controls[control].setValue('');
        this.tankAfterInfoForm.controls[control].setValue('');
      }
    }

    this.tankName.setValue('');
    this.tankInfoStepper.selectedIndex = 0;
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
    if (["e", "E", "+"].includes(evt.key)) {
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
  diff: any;
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
