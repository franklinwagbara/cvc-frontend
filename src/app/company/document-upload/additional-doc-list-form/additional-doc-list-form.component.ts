import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { forkJoin, Subject } from 'rxjs';
import { AppException } from '../../../../../src/app/shared/exceptions/AppException';
import { AdminService } from '../../../../../src/app/shared/services/admin.service';
import { ApplyService } from '../../../../../src/app/shared/services/apply.service';
import { ProgressBarService } from '../../../../../src/app/shared/services/progress-bar.service';

import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DocumentConfig, DocumentInfo } from '../document-upload.component';

@Component({
  selector: 'app-additional-doc-list-form',
  templateUrl: './additional-doc-list-form.component.html',
  styleUrls: ['./additional-doc-list-form.component.css'],
})
export class AdditionalDocListFormComponent implements OnInit {
  public form: FormGroup;
  public docs$ = new Subject<DocumentType[]>();
  public docs: DocumentType[];
  public documentConfig: DocumentConfig;
  public additionalDocuments$: Subject<DocumentInfo[]>;
  public selectedDocs = [];
  public docsDropdownSettings: IDropdownSettings = {};
  public loading$ = new Subject<boolean>();
  public modalSize$ = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdditionalDocListFormComponent>,
    private snackBar: MatSnackBar,
    private adminServe: AdminService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private applicationService: ApplyService
  ) {
    this.loading$.next(false);
    this.modalSize$.next(false);
    this.documentConfig = data.data.documentConfig;
    this.additionalDocuments$ = data.data.additionalDocuments$;

    this.form = this.formBuilder.group({
      doc: formBuilder.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.docsDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    this.getListOfDocuments();
  }

  getListOfDocuments() {
    this.loading$.next(true);

    forkJoin([
      this.applicationService.getAllCompanyDocuments(
        'company',
        this.documentConfig.apiEmail,
        this.documentConfig.apiHash
      ),
      this.applicationService.getAllCompanyDocuments(
        'facility',
        this.documentConfig.apiEmail,
        this.documentConfig.apiHash
      ),
    ]).subscribe({
      next: (res) => {
        const data = (res[0] as DocumentType[]).concat(
          res[1] as DocumentType[]
        );

        this.docs = data;
        this.docs$.next(data);
        this.loading$.next(false);
        this.modalSize$.next(true);
      },
      error: (error: unknown) => {
        this.snackBar.open(
          'Something went wrong while trying to add additional documents.',
          null,
          {
            panelClass: ['error'],
          }
        );
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  addDocuments() {
    const docTypes: DocumentType[] = this.form.value.doc;
    let newDocTypes: DocumentType[] = [];

    docTypes.forEach((dt) => {
      newDocTypes = [
        ...newDocTypes,
        ...this.docs.filter((d) => d.id === dt.id),
      ];
    });

    const additionalDocuments = newDocTypes.map((d) => {
      const doc: DocumentInfo = new DocumentInfo();
      doc.docId = d.id;
      doc.available = 'Not Uploaded';
      doc.docType = d.type;
      doc.docName = d.name;
      doc.source = `<img width="20" ../../../../../src="assets/image/no-document.png" />`;

      return doc;
    });

    console.log('additionalDocuments...', additionalDocuments);

    this.additionalDocuments$.next(additionalDocuments);
    this.dialogRef.close();
    // this.adminServe.addDocuments(this.form.value).subscribe({
    //   next: (res) => {
    //     if (res.success) {
    //       this.snackBar.open(
    //         'Permit Stage document was created successfull!',
    //         null,
    //         {
    //           panelClass: ['success'],
    //         }
    //       );

    //       this.dialogRef.close();
    //     }
    //   },
    //   error: (error: AppException) => {
    //     this.snackBar.open(error.message, null, {
    //       panelClass: ['error'],
    //     });
    //   },
    // });
  }

  onItemSelect(event: ListItem) {
    (this.form.get('doc') as FormArray).push(new FormControl(event));
  }

  onSelectAll(event: ListItem[]) {
    event.forEach((item) => {
      (this.form.get('doc') as FormArray).push(new FormControl(item));
    });
  }

  onDeSelect(event: ListItem) {
    const targetIndex = (
      (this.form.get('doc') as FormArray).value as Array<number>
    ).indexOf(event.id as number);
    (this.form.get('doc') as FormArray).removeAt(targetIndex);
  }
}

export class DocumentType {
  id: string;
  name: string;
  type: 'company' | 'facility';
}
