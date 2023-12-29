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
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-coq-application-form',
  templateUrl: './coq-application-form.component.html',
  styleUrls: ['./coq-application-form.component.css'],
})
export class CoqApplicationFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  liquidProductForm: FormGroup;
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
  selectedDepotId: number = 0;
  coqId: number;
  coq: ICOQ;

  viewOnly: boolean = false;

  dateValidation = {
    minDate: '',
    maxDate: new Date(),
  };

  tableData = [
    { document: 'Document A', action: 'upload', progress: 'Progress' },
    { document: 'Document B', action: 'upload', progress: 'Progress' },
    { document: 'Document C', action: 'upload', progress: 'Progress' },
  ];
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
    private cd: ChangeDetectorRef
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

    if (this.selectedDepotId != 0) this.getVesselDetails();
    this.getAppDepotsByAppId();
    this.getUploadDocuments();
  }

  public initialForms(coqInfo: ICOQ) {
    if (!coqInfo)
      this.liquidProductForm = this.fb.group({
        dateOfVesselArrival: ['', [Validators.required, Validators.max]],
        dateOfVesselUllage: ['', [Validators.required]],
        dateOfSTAfterDischarge: ['', [Validators.required]],
        gov: ['', [Validators.required]],
        gsv: ['', [Validators.required]],
        mt_VAC: ['', [Validators.required]],
        depotPrice: ['', [Validators.required]],
      });
    else {
      this.liquidProductForm = this.fb.group({
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
    this.cd.markForCheck();
  }

  public onSelectDepot(depotId) {
    this.getVesselDetails(depotId);
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

  public getVesselDetails(depotId = null) {
    this.spinner.open();
    this.appService
      .getVesselDetails(this.appId, depotId ?? this.selectedDepotId)
      .subscribe({
        next: (res) => {
          this.vesselInfo = res.data;
          if (res.data.coqExist) {
            this.coqId = res.data.coqId;
            this.getCOQ();
          }
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

  public getUploadDocuments() {
    this.spinner.open();
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
    });
  }

  public getAppDepotsByAppId() {
    this.spinner.open();
    this.libService.getAppDepotsByAppId(this.appId).subscribe({
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
      ...this.liquidProductForm.value,
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

  @HostListener('keydown', ['$event'])
  blockSpecialNonNumerics(evt: KeyboardEvent): void {
    if (['e', 'E', '+'].includes(evt.key)) {
      evt.preventDefault();
    }
  }
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
