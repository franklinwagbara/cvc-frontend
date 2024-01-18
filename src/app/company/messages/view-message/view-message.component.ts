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
import { CompanyService } from '../../../../../src/app/shared/services/company.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.scss'],
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
    private dialogRef: DialogRef,
    private companyService: CompanyService
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
      this.readMessage(this.message.id);
    }
    this.cd.markForCheck();
  }

  readMessage(id: number) {
    this.companyService.getMessagesById(id).subscribe({
      next: (res) => {},
      error: (error) => {
        console.log(error);
      },
    });
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
