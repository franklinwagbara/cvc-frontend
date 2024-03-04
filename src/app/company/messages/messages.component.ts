import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Util } from 'src/app/shared/lib/Util';
import { CompanyService } from 'src/app/shared/services/company.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';


@Component({
  templateUrl: 'messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['seen', 'subject', 'date'];
  dataSource: MatTableDataSource<any>;
  messages: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef,
    private popUp: PopupService,
    private companyService: CompanyService,
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any[]>([]);
    this.getCompanyMessages();
  }

  public getCompanyMessages() {
    this.spinner.show('Loading messages...');

    this.companyService.getCompanyMessages().subscribe({
      next: (res) => {
        this.messages = res.data;
        this.dataSource = new MatTableDataSource<any>(this.messages);
        this.cd.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.spinner.close();
        this.cd.markForCheck();
      },
      error: (error: any) => {
        console.error(error);
        this.popUp.open(error?.message, 'error');
        this.spinner.close();
        this.cd.markForCheck();
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterEvent: Event) {
    // Convert the filter value to lowercase
    let filterValue = (filterEvent.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data, value) => data.subject.toLowerCase().startsWith(value);
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportTable(format: 'csv' | 'excel' | 'pdf', tableId: string) {
    Util.exportTable(format, tableId);
  }

  printTable() {
    Util.printHtml('company-messages-table');
  }
}
