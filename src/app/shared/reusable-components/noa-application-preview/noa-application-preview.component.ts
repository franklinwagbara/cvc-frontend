import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../services';
import { Util } from '../../lib/Util';

@Component({
  selector: 'app-noa-application-preview',
  templateUrl: './noa-application-preview.component.html',
  styleUrls: ['./noa-application-preview.component.css'],
})
export class NoaApplicationPreviewComponent implements OnInit {
  noaInfo: any;
  comment: string;
  userInfo: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NoaApplicationPreviewComponent>,
    private auth: AuthenticationService
  ) {
    this.userInfo = auth.currentUser;
  }

  ngOnInit(): void {
    this.noaInfo = this.data?.application;
    this.comment = this.data?.remark;
  }

  print() {
    // remove unwanted elements from print preview
    (
      document.querySelector('#coq-preview-print-wrapper') as HTMLElement
    ).style.display = 'none';
    setTimeout(() => {
      (
        document.querySelector('#coq-preview-print-wrapper') as HTMLElement
      ).style.display = 'block';
    }, 2000);
    Util.printHtml('noa-application-preview');
  }

  trackByFn(index: number) {
    return index;
  }

  public close() {
    this.dialogRef.close();
  }
}
