import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProgressBarService } from '../../../../src/app/shared/services/progress-bar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyService } from '../../../../src/app/shared/services/apply.service';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationService } from '../../../../src/app/shared/services/application.service';
import { PopupService } from '../../../../src/app/shared/services/popup.service';
import { AdditionalDocListFormComponent } from './additional-doc-list-form/additional-doc-list-form.component';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { GenericService } from 'src/app/shared/services';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  public application_id: number;
  public documentConfig: DocumentConfig;
  public documents$ = new Subject<DocumentInfo[]>();
  public documents: DocumentInfo[] = [];
  public additionalDocuments$ = new Subject<DocumentInfo[]>();
  public additionalDocuments: DocumentInfo[] = [];

  applicationTableKeysMappedToHeaders = {
    docName: 'Document Name',
    source: 'Source',
    available: 'Available',
    action: 'ACTION',
  };

  constructor(
    private applicationService: ApplyService,
    private progressBar: ProgressBarService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public appService: ApplicationService,
    private popUp: PopupService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private spinner: SpinnerService,
    private generic: GenericService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.application_id = params['id'];
      this.getUploadDocuments();
    });

    this.additionalDocuments$.subscribe((data) => {
      this.additionalDocuments = [...data];
    });
  }

  getUploadDocuments() {
    this.progressBar.open();
    this.spinner.open();

    this.appService.getUploadDocuments(this.application_id).subscribe({
      next: (res) => {
        this.documents = res.data.docs;
        this.documents = this.documents.map((d) => {
          d.source = d.docSource
            ? `<a href="${d.docSource}" target="_blank" rel="noopener noreferrer"><img width="20" ../../../../src="assets/image/pdfIcon.png" /></a>`
            : `<img width="20" ../../../../src="assets/image/no-document.png" />`;

          if (d.docSource) d.available = 'Document Uploaded';
          else d.available = 'Not Uploaded';
          return d;
        });
        this.documents$.next(this.documents);
        this.documentConfig = res.data.apiData;

        this.spinner.close();
        this.progressBar.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('Fetching upload documents failed!', null, {
          panelClass: ['error'],
        });
        this.spinner.close();
        this.progressBar.close();
        this.cd.markForCheck();
      },
    });
  }

  uploadFile(data) {
    const fileEvent = data.file;
    let file = fileEvent.target.files[0];

    if (!this.generic.isValidFile(file)) {
      return;
    }

    this.progressBar.open();
    this.spinner.show('Uploading file...');

    const doc: DocumentInfo = data.doc;
    const action = doc.docSource ? 'update' : 'create';

    const formdata = new FormData();
    formdata.append('file', file);

    this.applicationService
      .uploadCompanyFileToElps(
        doc.docId,
        this.documentConfig.companyElpsId,
        this.documentConfig.facilityElpsId,
        this.documentConfig.apiEmail,
        this.documentConfig.apiHash,
        doc.docName,
        doc.docType,
        '',
        formdata,
        action,
        doc.fileId
      )
      .subscribe({
        next: (res) => {
          this.documents = this.documents.map((d) => {
            if (d.docId === doc.docId) {
              d.docSource = res?.FileId > 0 && !!res?.name ? res.source : null;
              d.fileId = res?.FileId;
              d.available = 'Document Uploaded';
              d.source = d.docSource
                ? `<a href="${d.docSource}" target="_blank" rel="noopener noreferrer"><img width="20" ../../../../src="assets/image/pdfIcon.png" /></a>`
                : `<img width="20" ../../../../src="assets/image/no-document.png" />`;
            }

            return d;
          });
          this.documents$.next(this.documents);

          this.progressBar.close();
          this.snackBar.open('File was uploaded successfully!', null, {
            panelClass: ['success'],
          });
          this.spinner.close();
          this.cd.markForCheck();
        },
        error: (error: unknown) => { 
          console.error(error);
          this.progressBar.close();
          this.snackBar.open('File upload was not successfull.', null, {
            panelClass: ['error'],
          });
          this.spinner.close();
          this.cd.markForCheck();
        },
      });
  }


  uploadAdditionalFile(data) {
    const fileEvent = data.file;
    const file = fileEvent.target.files[0];

    if (!this.generic.isValidFile(file)) {
      return;
    }

    this.progressBar.open();
    this.spinner.open();

    const doc: DocumentInfo = data.doc;

    const action = doc.docSource ? 'update' : 'create';

    const fileName = file.name;

    const formdata = new FormData();
    formdata.append('file', file);

    this.applicationService
      .uploadCompanyFileToElps(
        doc.docId,
        this.documentConfig.companyElpsId,
        this.documentConfig.facilityElpsId,
        this.documentConfig.apiEmail,
        this.documentConfig.apiHash,
        doc.docName,
        doc.docType,
        '',
        formdata,
        action,
      )
      .subscribe({
        next: (res) => {
          this.additionalDocuments = this.additionalDocuments.map((d) => {
            if (d.docId === doc.docId) {
              d.docSource = res.source;
              d.fileId = res.fileId;
              d.available = 'Document Uploaded';
              d.source = d.docSource
                ? `<a href="${d.docSource}" target="_blank" rel="noopener noreferrer"><img width="20" ../../../../src="assets/image/pdfIcon.png" /></a>`
                : `<img width="20" ../../../../src="assets/image/no-document.png" />`;
            }

            return d;
          });
          this.additionalDocuments$.next(this.additionalDocuments);

          this.progressBar.close();
          this.snackBar.open('File was uploaded successfully!', null, {
            panelClass: ['success'],
          });
          this.spinner.close();
          this.cd.markForCheck();
        },
        error: (error: unknown) => {
          this.spinner.close();
          this.progressBar.close();
          this.snackBar.open('File upload was not successfull.', null, {
            panelClass: ['error'],
          });
          this.cd.markForCheck();
        },
      });
  }

  getListOfAdditionalDocuments() {
    const operationsConfiguration = {
      additionalDocuments: {
        data: {
          documentConfig: this.documentConfig,
          additionalDocuments$: this.additionalDocuments$,
        },
        form: AdditionalDocListFormComponent,
      },
    };

    const dialogRef = this.dialog.open(
      operationsConfiguration['additionalDocuments'].form,
      {
        data: {
          data: operationsConfiguration['additionalDocuments'].data,
        },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.progressBar.open();

        this.getUploadDocuments();
      }
    });
  }

  get hasUploadedAllRequiredDocs(): boolean {
    if (this.documents.length) {
      return this.documents.every((info) => !!info.docSource);
    }
    return false;
  }

  submitApplication() {
    if (!this.hasUploadedAllRequiredDocs) {
      this.popUp.open('All Required Documents Must Be Uploaded', 'error');
      return;
    }

    this.spinner.show('Submitting application...');

    const payload = {
      appId: Number(this.application_id),
      docs: [...this.documents, ...this.additionalDocuments],
    };

    this.applicationService.submitApplication(payload).subscribe({
      next: (res) => {
        this.spinner.close();
        // this.popUp.open('Document(s) upload was successfull.', 'success');
        this.popUp.open('Application was submitted successfully', 'success');
        this.router.navigate(['/company/cvc-applications']);
        this.cd.markForCheck();
      },
      error: (res: unknown) => {
        this.spinner.close();
        // this.popUp.open('Document(s) upload failed!', 'error');
        this.popUp.open('Application submission failed!', 'error');
        this.cd.markForCheck();
      },
    });
  }
}

export class DocumentConfig {
  apiEmail: string;
  apiHash: string;
  appid?: string;
  companyElpsId: string;
  facilityElpsId: string;
  uniqueid: string;
}

export class DocumentInfo {
  id?: string;
  docId?: string;
  docName?: string;
  docSource?: string;
  applicationId?: number;
  applicationTypeId?: number;
  source?: string;
  fileId?: number;
  available?: string;
  docType?: string;
  company?: string;
  success?: boolean;
  fileSizeInKb?: any;
  percentProgress?: any;
  fileName?: string;
  docIndex?: number;
}

export interface IUploadDocInfo {
  documentConfig: DocumentConfig;
  documentInfo: DocumentInfo[];
}
