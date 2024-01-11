import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-coq-application-preview',
  templateUrl: './coq-application-preview.component.html',
  styleUrls: ['./coq-application-preview.component.css']
})
export class CoqApplicationPreviewComponent implements OnInit {
  @Input() liquidProductData: any;
  @Input() gasProductData: any;
  dataSource: MatTableDataSource<any[]>;


  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any[]>([]);
  }


}
