import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IMessage } from '../../dashboard/dashboard.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewMessageComponent implements OnInit {
  public message: IMessage;
  public messages: IMessage[];
  public index: number;
  public content: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private dialogRef: DialogRef
  ) {
    this.index = this.data.index;
    this.messages = this.data.messages;
  }
  ngOnInit(): void {
    this.filterMessage();
  }

  filterMessage() {
    if (this.index >= 0 && this.index <= this.messages.length) {
      this.message = this.data.messages[this.index];
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        this.message.content
      );
    }
    this.cd.markForCheck();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  next() {
    if (this.index < this.messages.length) {
      this.index++;
      this.filterMessage();
    }
  }
  back() {
    if (this.index > 0) {
      this.index--;
      this.filterMessage();
    }
  }
}
