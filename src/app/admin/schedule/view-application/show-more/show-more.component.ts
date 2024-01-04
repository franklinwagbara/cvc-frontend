import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IApplication } from '../../../../../../src/app/shared/interfaces/IApplication';
import { Staff } from '../../../../../../src/app/admin/settings/all-staff/all-staff.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.css'],
})
export class ShowMoreComponent implements OnInit {
  public form: FormGroup;
  public application: IApplication;
  public currentUser: Staff;
  public dataKeysMappedToHeaders$ = new BehaviorSubject<any>({});
  public dataToDisplay$ = new Subject<any[]>();
  public dataToDisplay: any[];
  public tableTitle: string;

  appHistoryKeysMappedToHeaders = {
    triggeredBy: 'Action By',
    targetedTo: 'Action To',
    comment: 'Remark',
    date: 'Date',
  };

  schedulesKeysMappedToHeaders = {
    scheduleBy: 'Scheduled By',
    scheduleDate: 'Schedule Date',
    scheduleExpiry: 'Schedule Expiration',
    comment: 'Remark',
    companyStatus: "Company's Status",
    companyCooment: "Company's Comment",
    approver: 'Approver',
    status: 'Status',
  };

  inspectionFormKeysMappedToHeaders = {
    actionBy: 'Action By',
    actionTo: 'Action To',
    comment: 'Remark',
    date: 'Date',
  };

  extraPaymentsKeysMappedToHeaders = {
    actionBy: 'Action By',
    actionTo: 'Action To',
    comment: 'Remark',
    date: 'Date',
  };

  applicationDocsKeysMappedToHeaders = {
    docSource: 'Source',
    docName: 'Action To',
  };

  constructor(
    public dialogRef: MatDialogRef<ShowMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.data?.appHistory) {
      this.dataKeysMappedToHeaders$.next(this.appHistoryKeysMappedToHeaders);
      this.dataToDisplay = data.data.appHistory;
      this.tableTitle = 'Application History';
    } else if (data.data?.schedules) {
      this.dataKeysMappedToHeaders$.next(this.schedulesKeysMappedToHeaders);
      this.dataToDisplay = data.data.schedules;
      this.tableTitle = 'Schedules';
    } else if (data.data?.inspectionForm) {
      this.dataKeysMappedToHeaders$.next(
        this.inspectionFormKeysMappedToHeaders
      );
      this.dataToDisplay = data.data.inspectionForm;
      this.tableTitle = 'Inspection Forms';
    } else if (data.data?.extraPayments) {
      this.dataKeysMappedToHeaders$.next(this.extraPaymentsKeysMappedToHeaders);
      this.dataToDisplay = data.data.extraPayments;
      this.tableTitle = 'Extra - Payments';
    } else if (data.data?.applicationDocs) {
      this.dataKeysMappedToHeaders$.next(
        this.applicationDocsKeysMappedToHeaders
      );
      this.dataToDisplay = (data.data.applicationDocs as Array<any>).map(
        (d) => {
          d.docSource = d.docSource
            ? `<a href="${d.docSource}" target="_blank" rel="noopener noreferrer"><img width="20" ../../../../../../src="assets/image/pdfIcon.png" /></a>`
            : `<img width="20" ../../../../../../src="assets/image/no-document.png" />`;

          return d;
        }
      );
      this.tableTitle = 'Application Documents';
    } else {
      this.dataKeysMappedToHeaders$.next({});
    }
  }
  ngOnInit(): void {}

  onClose() {
    this.dialogRef.close();
  }
}
