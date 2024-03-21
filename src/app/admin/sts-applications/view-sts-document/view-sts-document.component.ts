import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  IApplication,
  IDoc,
} from '../../../../../src/app/shared/interfaces/IApplication';
import { Staff } from '../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { ShipToShipService } from 'src/app/shared/services/ship-to-ship.service';

@Component({
  selector: 'app-view-sts-document',
  templateUrl: './view-sts-document.component.html',
  styleUrls: ['./view-sts-document.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewStsDocumentComponent implements OnInit {
  public form: FormGroup;
  public documents: IDoc[];
  public currentUser: Staff;
  public dataKeysMappedToHeaders$ = new BehaviorSubject<any>({});
  public isloading$ = new BehaviorSubject<boolean>(false);
  public dataToDisplay: any[];
  public tableTitle: string;

  applicationDocsKeysMappedToHeaders = {
    docSource: 'Source',
    docName: 'Document Name',
  };

  constructor(
    public dialogRef: MatDialogRef<ViewStsDocumentComponent>,
    private stsService: ShipToShipService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tableTitle = 'Uploaded Documents';
  }

  ngOnInit(): void {
    this.getUploadDocuments();
  }

  getUploadDocuments() {
    this.isloading$.next(true);
    this.stsService.getUploadSTSDocuments(this.data.id).subscribe({
      next: (res) => {
        this.documents = res.data.docs;
        this.dataToDisplay = (this.documents as Array<any>)
          .filter((d) => d.docSource != null)
          .map((d) => {
            d.docSource = d.docSource
              ? `<a href="${d.docSource}" target="_blank" rel="noopener noreferrer"><img width="20" ../../../../../src="assets/image/pdfIcon.png" /></a>`
              : `<img width="20" ../../../../../src="assets/image/no-document.png" />`;

            return d;
          });
        this.isloading$.next(false);
        this.cd.markForCheck();
      },
      error: (error: unknown) => {
        console.error(error);
        this.isloading$.next(false);
        this.cd.markForCheck();
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
