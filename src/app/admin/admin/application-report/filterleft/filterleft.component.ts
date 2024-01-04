import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IApplication } from 'src/app/shared/interfaces/IApplication';

@Component({
  selector: 'app-filterleft',
  templateUrl: './filterleft.component.html',
  styleUrls: ['./filterleft.component.css'],
})
export class FilterleftComponent implements OnInit {
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
          a.marketerName.localeCompare(b.marketerName)
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
