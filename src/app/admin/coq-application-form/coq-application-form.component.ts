import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FileuploadWithProgressService } from '../../shared/services/fileupload-with-progress.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoqService } from 'src/app/shared/services/coq.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ICoQApplication } from 'src/app/shared/interfaces/ICoQApplication';
import { environment } from 'src/environments/environment';
import { DocumentConfig } from 'src/app/company/document-upload/document-upload.component';


@Component({
  selector: 'app-coq-application-form',
  templateUrl: './coq-application-form.component.html',
  styleUrls: ['./coq-application-form.component.css'],
})

export class CoqApplicationFormComponent implements OnInit, AfterViewInit, OnDestroy {
  liquidProductForm: FormGroup;
  displayedColumns = ['document', 'action', 'progress'];
  private allSubscriptions = new Subscription();
  dataSource: MatTableDataSource<any>;
  listOfRequiredDocs: any[] = [];
  vesselInfo: any;
  appId: number;
  documentConfig: DocumentConfig;

  dateValidation = {
    minDate: '',
    maxDate: new Date()
  }

  tableData = [
    { document: 'Document A', action: 'upload', progress: 'Progress'},
    { document: 'Document B', action: 'upload', progress: 'Progress'},
    { document: 'Document C', action: 'upload', progress: 'Progress'},
  ]
  uploadedDocs: File[] = [];
  uploadedDoc$ = new BehaviorSubject<File>(null);
  uploadInfo: any[] = [
    { document: 'Document A', fileName: '', fileSizeKB: '', progressPercent: 0, success: null },
    { document: 'Document B', fileName: '', fileSizeKB: '', progressPercent: 0, success: null },
    { document: 'Document C', fileName: '', fileSizeKB: '', progressPercent: 0, success: null },
  ];
  uploadInfo$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private fb: FormBuilder, 
    private fileUpload: FileuploadWithProgressService,
    private elRef: ElementRef,
    private snackBar: MatSnackBar,
    private coqService: CoqService,
    private spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params: Params) => {
      this.appId = parseInt(params['id']);
    })
  }
  
  ngOnInit(): void {
    this.spinner.open();

    this.liquidProductForm = this.fb.group({
      dateOfVesselArrival: ['', [Validators.required, Validators.max]],
      dateOfVesselUllage: ['', [Validators.required]],
      dateOfSTAfterDischarge: ['', [Validators.required]],
      gov: ['', [Validators.required]],
      gsv: ['', [Validators.required]],
      mt_VAC: ['', [Validators.required]],
      depotPrice: ['', [Validators.required]]
    })

    this.uploadedDoc$.subscribe((file) => {
      this.uploadedDocs.push(file);
    })

    // Get list of required coq docs
    // this.coqService.getListOfRequiredDocs().subscribe({
    //   next: (val: any[]) => {
    //     this.listOfRequiredDocs = val;
    //   },
    //   error: (error: any) => {
    //     alert('Unable to initiate CoQ Application at the moment. Please try again.');
    //     this.router.navigate(['/admin/noa-applications-by-depot']);
    //   }
    // })

    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngAfterViewInit(): void {
    this.spinner.close();
    this.dataSource = new MatTableDataSource(this.tableData)
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }

  get hasUploadedAllRequiredDocs(): boolean {
    if (this.uploadInfo.length) {
      return this.uploadInfo.every((info) => info.success);
    }
    return false;
  }

  onFileSelected(evt: Event, index: number): void {
    const file = (evt.target as any).files[0];
    console.log('File =========== ', file);
    if (file) {
      let isAccepted = /(\.png|\.jpg|\.jpeg|\.pdf)$/i.test(file.name);
      if (!isAccepted) {
        this.snackBar.open(`Invalid file (${file.name}) format`);
        (evt.target as any).value = '';
        return;
      }

      const fileSizeInBytes = file.size;
      const fileSizeInKb = fileSizeInBytes / 1024
      const fileSizeInMB = fileSizeInKb / 1024;
      if (fileSizeInMB > 20) {
        this.snackBar.open(`File ${file.name} size too large`, null, { panelClass: ['error'] });
        (evt.target as any).value = '';
        return;
      }

      this.uploadInfo = this.uploadInfo.map((el, i) => {
        if (i === index) {
          return { ...el, fileName: file.name, fileSizeInKb: fileSizeInKb.toFixed(2) }
        }
        return el;
      })
      
      const dateId = Date.now();
      const { docTypeId, compId, email, apiHash, docName, uniqueid } = {
        docTypeId: dateId,
        compId: this.documentConfig.companyElpsId,
        email: this.documentConfig.apiEmail,
        apiHash: this.documentConfig.apiHash,
        docName: file.name,
        uniqueid: dateId
      };
      const uploadUrl = `${environment.elpsBase}/api/UploadCompanyDoc/${docTypeId}/${compId}/${email}/${apiHash}?docName=${docName}&uniqueid=${uniqueid}`;

      this.allSubscriptions.add(this.fileUpload.uploadFile(file, uploadUrl).subscribe({
        next: (val: number) => {
          this.uploadInfo = this.uploadInfo.map((el, i) => {
            if (i === index) {
              return { ...el, percentProgress: val, success: val === 100 || null  };
            }
            return el;
          })
          this.uploadInfo$.next(this.uploadInfo);
        },
        error: (error: any) => {
          console.log(error);
          this.uploadInfo = this.uploadInfo.map((el, i) => {
            if (i === index) {
              return { ...el, success: false };
            }
            return el;
          })
          this.uploadInfo$.next(this.uploadInfo);
          this.snackBar.open('Could not upload file', null, { panelClass: ['error'] });
        }
      }));
    }
  }

  uploadDoc(index: number) {
    const collections = this.elRef.nativeElement.querySelectorAll('.file-input');
    const inputEl = collections[index];
    inputEl.click();
  }

  submit():  void {
    let data: ICoQApplication = {...this.liquidProductForm.value, appId: this.appId, depotId: '', };
    this.coqService.createCoQ(data);
  }

  @HostListener('keydown', ['$event'])
  blockSpecialNonNumerics(evt: KeyboardEvent): void {
    if (["e", "E", "+"].includes(evt.key)) {
      evt.preventDefault()
    } 
  }
}
