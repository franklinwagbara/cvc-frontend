import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  templateUrl: 'messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['seen', 'messageSubject', 'date', 'link'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    // Sample data array
    const sampleData = [
      {
        id: 1,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 2,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 3,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 4,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 5,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 6,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 7,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 8,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 9,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 10,
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        id: 11,
        seen: true,
        messageSubject: 'Survey Proposal Application Initiated with Ref : 345041621103430',
        date: '5/22/2021 10:44:54 PM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ=='
      }
      // Add more data entries as needed
    ];

    // Create the data source with the sample data
    this.dataSource = new MatTableDataSource(sampleData);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterEvent: Event) {
    // Convert the filter value to lowercase
    let filterValue = (filterEvent.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data, value) => data.messageSubject.toLowerCase().startsWith(value);
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
