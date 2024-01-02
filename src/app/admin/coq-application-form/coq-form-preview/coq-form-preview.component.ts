import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Util } from 'src/app/shared/lib/Util';

import { Subscription } from 'rxjs';
import { CoqAppFormService } from 'src/app/shared/services/coq-app-form.service';
import { CoQData, LocalDataKeys } from '../coq-application-form.component';


@Component({
  selector: 'app-coq-form-preview',
  templateUrl: './coq-form-preview.component.html',
  styleUrls: ['./coq-form-preview.component.css'],
})
export class CoqFormPreviewComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVOI', 'corr', 'gov', 'temp', 'density', 'vcf', 'gsv', 'mtVAC', 'actions'];
  formData: any[] = [];
  dataSource: MatTableDataSource<any>;
  allSubscriptions = new Subscription();

  localDataKey = LocalDataKeys.COQFORMPREVIEWDATA;

  objNotEmpty = Util.objNotEmpty;

  constructor(
    public dialog: MatDialog,
    public coqForm: CoqAppFormService,
  ) {}
  
  ngOnInit(): void {
    this.allSubscriptions.add(this.coqForm.liquidProductPreviewData$.subscribe((val: CoQData[]) => {
      this.formData = this.coqForm.flattenCoQDataArr(val);
      this.dataSource = new MatTableDataSource(this.formData);
    }));
    this.dataSource = new MatTableDataSource(this.formData);
  }
  
  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
  }
}
