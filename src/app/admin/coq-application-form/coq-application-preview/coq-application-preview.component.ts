import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-coq-application-preview',
  templateUrl: './coq-application-preview.component.html',
  styleUrls: ['./coq-application-preview.component.css']
})
export class CoqApplicationPreviewComponent implements OnInit {
  @Input() liquidProductData: any;
  @Input() gasProductData: any;
  @Input() isGasProduct: boolean;
  dataSource: MatTableDataSource<any[]>;
  displayedColumns: any[];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoqApplicationPreviewComponent>
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any[]>([]);
  }

  trackByFn(index: number) {
    return index;
  }

  onClose() {
    
  }

}
