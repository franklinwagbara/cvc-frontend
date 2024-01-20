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
    private cd: ChangeDetectorRef
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

        this.progressBar.close();
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        this.snackBar.open('Fetching upload documents failed!', null, {
          panelClass: ['error'],
        });
        this.progressBar.close();
        this.cd.markForCheck();
      },
    });
  }

  uploadFile(data) {
    this.progressBar.open();

    const fileEvent = data.file;
    const doc: DocumentInfo = data.doc;

    const action = doc.docSource ? 'update' : 'create';

    const file = fileEvent.target.files[0];
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
        action
      )
      .subscribe({
        next: (res) => {
          this.documents = this.documents.map((d) => {
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
          this.documents$.next(this.documents);

          this.progressBar.close();
          this.snackBar.open('File was uploaded successfully!', null, {
            panelClass: ['success'],
          });
          this.cd.markForCheck();
        },
        error: (error: unknown) => {
          this.progressBar.close();
          this.snackBar.open('File upload was not successfull.', null, {
            panelClass: ['error'],
          });
          this.cd.markForCheck();
        },
      });
  }

  uploadAdditionalFile(data) {
    this.progressBar.open();

    const fileEvent = data.file;
    const doc: DocumentInfo = data.doc;

    const action = doc.docSource ? 'update' : 'create';

    const file = fileEvent.target.files[0];
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
        action
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
        },
        error: (error: unknown) => {
          this.progressBar.close();
          this.snackBar.open('File upload was not successfull.', null, {
            panelClass: ['error'],
          });
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

  submitApplication() {
    this.progressBar.open();

    const payload = {
      appId: Number(this.application_id),
      docs: [...this.documents, ...this.additionalDocuments],
    };

    this.applicationService.submitApplication(payload).subscribe({
      next: (res) => {
        this.progressBar.close();
        // this.popUp.open('Document(s) upload was successfull.', 'success');
        this.popUp.open('Application was submitted successfully', 'success');
        this.router.navigate(['/company/dashboard']);
      },
      error: (res: unknown) => {
        this.progressBar.close();
        // this.popUp.open('Document(s) upload failed!', 'error');
        this.popUp.open('Application submission failed!', 'error');
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
  source?: string;
  fileId?: string;
  available?: string;
  docType?: string;
  company?: string;
  success?: boolean;
  fileSizeInKb?: any;
  percentProgress?: any;
  fileName?: string;
  docIndex?: number
}

export interface IUploadDocInfo {
  documentConfig: DocumentConfig;
  documentInfo: DocumentInfo[];
}
