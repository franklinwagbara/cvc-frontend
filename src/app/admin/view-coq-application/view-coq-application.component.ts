import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Util } from '../../../../src/app/shared/lib/Util';
import { CoqAppFormService } from 'src/app/shared/services/coq-app-form.service';

@Component({
  selector: 'app-view-coq-application',
  templateUrl: './view-coq-application.component.html',
  styleUrls: ['./view-coq-application.component.css']
})
export class ViewCoqApplicationComponent implements OnInit {
  application: any;
  @Input() isGasProduct: boolean;
  dataSources: MatTableDataSource<any>[];

  displayedColumns: string[]

  objNotEmpty = Util.objNotEmpty

  isIMG = Util.isIMG;
  isPDF = Util.isPDF;

  constructor(public coqFormService: CoqAppFormService) {}

  ngOnInit(): void {
    
  }

}
