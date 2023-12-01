import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IApplication } from 'src/app/shared/interfaces/IApplication';

@Component({
  selector: 'app-paymentfilterleft',
  templateUrl: './payment-filterleft.component.html',
  styleUrls: ['./payment-filterleft.component.css'],
})
export class PaymentFilterleftComponent implements OnInit {
  @Input() applications: IApplication[];
  checked = false;
  @Output() sortedApps: EventEmitter<IApplication[]> = new EventEmitter<
    IApplication[]
  >();
  @Output() onChecked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  sortData(eventData, type: string) {
    this.checked = eventData.target.checked;
    let sorted: IApplication[];

    if (type === 'date') {
      if (this.checked) {
        sorted = [...this.applications].sort(
          (a: any, b: any) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        );
        this.sortedApps.emit(sorted);
        this.onChecked.emit(this.checked);
      } else {
        this.sortedApps.emit(this.applications);
        this.onChecked.emit(this.checked);
      }
    } else {
      if (this.checked) {
        sorted = [...this.applications].sort((a, b) =>
          a.companyName.localeCompare(b.companyName)
        );
        this.sortedApps.emit(sorted);
        this.onChecked.emit(this.checked);
      } else {
        this.sortedApps.emit(this.applications);
        this.onChecked.emit(this.checked);
      }
    }
  }

  // sortData(eventData, type: string) {
  //   this.checked = eventData.target.checked;
  //   let sorted: IApplication[];
  //   if (this.checked) {
  //     if (type === 'date') {
  //       sorted = this.applications.sort(
  //         (a: any, b: any) =>
  //           new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
  //       );
  //       this.sortedApps.emit(sorted);
  //       this.onChecked.emit(this.checked);
  //     }
  //   } else {
  //     this.sortedApps.emit(this.applications);
  //     this.onChecked.emit(this.checked);
  //   }
  //   if (this.checked) {
  //     if (type === 'alphabetical') {
  //       sorted = this.applications.sort((a, b) =>
  //         a.companyName.localeCompare(b.companyName)
  //       );
  //       this.sortedApps.emit(sorted);
  //       this.onChecked.emit(this.checked);
  //     }
  //   } else {
  //     this.sortedApps.emit(this.applications);
  //     this.onChecked.emit(this.checked);
  //   }
  // }
}
