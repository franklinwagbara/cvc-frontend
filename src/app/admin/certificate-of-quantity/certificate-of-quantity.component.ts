import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Util } from 'src/app/shared/lib/Util';
import { CoqFormService } from 'src/app/shared/services/coq-form.service';


@Component({
  selector: 'app-certificate-of-quantity',
  templateUrl: './certificate-of-quantity.component.html',
  styleUrls: ['./certificate-of-quantity.component.css'],
})

export class CertificateOfQuantityComponent implements OnInit, AfterViewInit {
  liquidProductForm: FormGroup;
  displayedColumns = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVOI', 'corr', 'gov', 'temp', 'density', 'vcf', 'gsv', 'mtVAC'];

  @ViewChild('before') beforeStatusOption: ElementRef;
  @ViewChild('after') afterStatusOption: ElementRef;
  beforeOptionEl: HTMLOptionElement;
  afterOptionEl: HTMLOptionElement

  configuredTanks: any[] = ['Tank 1', 'Tank 2'];

  constructor(
    private fb: FormBuilder, 
    public coqForm: CoqFormService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.liquidProductForm = this.fb.group({
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


    this.coqForm.liquidProductPreviewData$.subscribe((val) => {
      if (Array.isArray(val) && val.length > 0) {
        // Check whether the last CoQData has either before or after status but not both
        const lastEl = val[val.length - 1];
        if (Util.onlyEitherExists(lastEl.before, lastEl.after)) {
          this.liquidProductForm.controls['tank'].setValue(lastEl.before.tank || lastEl.after.tank);
          this.liquidProductForm.controls['tank'].disable();
        }
      }
    })

    // Check for data in form data preview area
    const localPreviewData = JSON.parse(localStorage.getItem(LocalDataKeys.COQFORMPREVIEWDATA));
    if (Array.isArray(localPreviewData) && localPreviewData.length) {
      this.coqForm.liquidProductPreviewData = localPreviewData.filter((val: CoQData) => {
        return val && (Object.keys(val.before).length > 0 || Object.keys(val.after).length > 0);
      });
      this.coqForm.liquidProductPreviewData$.next(this.coqForm.liquidProductPreviewData);
      const lastEl = localPreviewData[localPreviewData.length - 1];
      if (Util.onlyEitherExists(lastEl.before, lastEl.after)) {
        this.liquidProductForm.controls['tank'].setValue(lastEl.before.tank || lastEl.after.tank);
        this.liquidProductForm.controls['tank'].disable();
      }
    }

    // Check for data in form review area
    const localFormReviewData = JSON.parse(localStorage.getItem(LocalDataKeys.COQFORMREVIEWDATA));
    if (Array.isArray(localFormReviewData) && localFormReviewData.length) {
      this.coqForm.liquidProductReviewData = localFormReviewData;
      this.coqForm.liquidProductReviewData$.next(localFormReviewData);
    }
  }

  ngAfterViewInit(): void {
    this.beforeOptionEl = this.beforeStatusOption.nativeElement;
    this.afterOptionEl = this.afterStatusOption.nativeElement;

    // Check for data in form preview area
    const localPreviewData = JSON.parse(localStorage.getItem(LocalDataKeys.COQFORMPREVIEWDATA));
    if (Array.isArray(localPreviewData) && localPreviewData.length) {
      const lastEl = localPreviewData[localPreviewData.length - 1];
      if (Util.onlyEitherExists(lastEl.before, lastEl.after)) {
        this.toggleStatus(this.beforeOptionEl, this.afterOptionEl, Object.keys(lastEl.before).length ? lastEl.before : lastEl.after);
      }
    }
  }

  toggleStatus(beforeOption: HTMLOptionElement, afterOption: HTMLOptionElement, formData?: any): void {
    if (formData && Object.keys(formData).length) {
      if (formData?.status === 'BEFORE') {
        beforeOption.disabled = true;
      }
      if (formData?.status === 'AFTER') {
        afterOption.disabled = true;
      }
    } else {
      beforeOption.disabled = false;
      afterOption.disabled = false;
    }
  }

  saveToPreview(): void {
    const data = this.liquidProductForm.getRawValue();
    const previewData: CoQData = {before: {}, after: {}, diff: {}};
    previewData[data.status.toLowerCase()] = data;
    
    // Check for form preview data in local storage
    const coqFormDataArr = JSON.parse(localStorage.getItem(LocalDataKeys.COQFORMPREVIEWDATA));
    if (Array.isArray(coqFormDataArr) && coqFormDataArr.length) {
      let isNewTankData = true;
      let lastEl = coqFormDataArr[coqFormDataArr.length - 1];

      // If the status data is not present in most recent arr (this is the point to calculate the diff)
      if (!Object.keys(lastEl[data.status.toLowerCase()]).length) {
        lastEl[data.status.toLowerCase()] = data;
        lastEl['diff'] = {
          status: 'DIFF',
          tank: lastEl.before.tank,
          dip: parseFloat(lastEl.after.dip) - parseFloat(lastEl.before.dip),
          waterDIP: parseFloat(lastEl.after.waterDIP) - parseFloat(lastEl.before.waterDIP),
          tov: parseFloat(lastEl.after.tov) - parseFloat(lastEl.before.tov),
          waterVOI: parseFloat(lastEl.after.waterVOI) - parseFloat(lastEl.before.waterVOI),
          corr: parseFloat(lastEl.after.corr) - parseFloat(lastEl.before.corr),
          gov: parseFloat(lastEl.after.gov) - parseFloat(lastEl.before.gov),
          temp: parseFloat(lastEl.after.temp) - parseFloat(lastEl.before.temp),
          density: parseFloat(lastEl.after.density) - parseFloat(lastEl.before.density),
          vcf: parseFloat(lastEl.after.vcf) - parseFloat(lastEl.before.vcf),
          gsv: parseFloat(lastEl.after.gsv) - parseFloat(lastEl.before.gsv),
          mtVAC: parseFloat(lastEl.after.mtVAC) - parseFloat(lastEl.before.mtVAC),
        }
        this.toggleStatus(this.beforeOptionEl, this.afterOptionEl);
        this.liquidProductForm.controls['tank'].enable();
        isNewTankData = false;
      }
      
      if (isNewTankData) {
        this.toggleStatus(this.beforeOptionEl, this.afterOptionEl, data);
        coqFormDataArr.push(previewData);
      }
      this.coqForm.liquidProductPreviewData = coqFormDataArr.filter((val: CoQData) => {
        return val && (Object.keys(val.before).length > 0 || Object.keys(val.after).length > 0);
      });
      this.coqForm.liquidProductPreviewData$.next(this.coqForm.liquidProductPreviewData);
      localStorage.setItem(LocalDataKeys.COQFORMPREVIEWDATA, JSON.stringify(coqFormDataArr));
    } else {
      this.toggleStatus(this.beforeOptionEl, this.afterOptionEl, data);
      this.coqForm.liquidProductPreviewData.push(previewData);
      this.coqForm.liquidProductPreviewData$.next(this.coqForm.liquidProductPreviewData);
      localStorage.setItem(LocalDataKeys.COQFORMPREVIEWDATA, JSON.stringify(this.coqForm.liquidProductPreviewData));
    }

    for (let control in this.liquidProductForm.controls) {
      if (control !== 'tank') {
        this.liquidProductForm.controls[control].reset();
      }
    }

    this.cdr.detectChanges();
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

export enum LocalDataKeys {
  COQFORMPREVIEWDATA = 'coq-form-preview-data-arr',
  COQFORMREVIEWDATA = 'coq-form-review-data-arr'
}
