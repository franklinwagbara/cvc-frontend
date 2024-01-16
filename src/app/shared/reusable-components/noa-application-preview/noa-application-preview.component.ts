import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-noa-application-preview',
  templateUrl: './noa-application-preview.component.html',
  styleUrls: ['./noa-application-preview.component.css']
})
export class NoaApplicationPreviewComponent implements OnInit {
  noaInfo: any;
  comment: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.noaInfo = this.data?.application;
    this.comment = this.data?.remark;
    console.log('Preview Dialog Data ===========> ', this.data);
  }

  print() {
    // remove unwanted elements from print preview
    (document.querySelector('#coq-preview-print-wrapper') as HTMLElement).style.display = 'none';
    setTimeout(() => {
      (document.querySelector('#coq-preview-print-wrapper') as HTMLElement).style.display = 'block';
    }, 2000);
    const printContents = document.querySelector('#noa-application-preview');
    const windowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrt.document.write(printContents.innerHTML);
    windowPrt.document.close();
    windowPrt.focus();
    windowPrt.print();
    windowPrt.close();
  }

  trackByFn(index: number) {
    return index;
  }
  
}
