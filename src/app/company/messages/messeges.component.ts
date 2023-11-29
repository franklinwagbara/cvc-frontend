import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['seen', 'messageSubject', 'date', 'action'];

  ngOnInit(): void {
    // Sample data array
    const sampleData = [
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      {
        seen: true,
        messageSubject: 'Application Approved with Permit NO : NUPRC/UMR/RM/PRS/EPERMIT/2021/0002',
        date: '4/22/2021 10:44:54 AM',
        link: '/Company/Message/TWc9PQ==/TVRZPQ==',
      },
      // Add more data entries as needed
    ];

    // Create the data source with the sample data
    this.dataSource = new MatTableDataSource(sampleData);
  }

  applyFilter(filterValue: string) {
    // Convert the filter value to lowercase
    filterValue = filterValue.trim().toLowerCase();

    // Apply the filter to the data source
    this.dataSource.filter = filterValue;
  }
}
