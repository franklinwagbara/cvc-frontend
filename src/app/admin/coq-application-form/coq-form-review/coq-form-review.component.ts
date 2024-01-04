import { Component, ElementRef, OnInit } from '@angular/core';
import { Util } from '../../../../../src/app/shared/lib/Util';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CoqAppFormService } from '../../../../../src/app/shared/services/coq-app-form.service';
import { LocalDataKey } from '../coq-application-form.component';


@Component({
  selector: 'app-coq-form-review',
  templateUrl: './coq-form-review.component.html',
  styleUrls: ['./coq-form-review.component.css']
})
export class CoqFormReviewComponent implements OnInit {
  displayedColumns = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVOI', 'corr', 'gov', 'temp', 'density', 'vcf', 'gsv', 'mtVAC', 'actions'];
  localDataKey = LocalDataKey.COQFORMREVIEWDATA;
  dataSources: MatTableDataSource<any[]>[] = [];
  formData: any[] = [];


  objNotEmpty = Util.objNotEmpty;

  constructor(
    public coqForm: CoqAppFormService,
    public dialog: MatDialog,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.coqForm.liquidProductReviewData$.subscribe((val) => {
      this.dataSources = [];
      this.formData = this.coqForm.flattenCoQDataArr(val);
      for (let i = 0; i < this.formData.length; i += 3) {
        const tableData = [this.formData[i], this.formData[i+1], this.formData[i+2]];
        this.dataSources.push(new MatTableDataSource<any[]>(tableData));
      }
    })
  }

  openAccordion(index: number): void {
    const collection = this.elRef.nativeElement.querySelectorAll('.my-accordion');
    // close previously opened accordion
    for (let i = 0; i < collection.length; i++) {
      if (i !== index) {
        collection[i].classList.remove('accordion-open');
      }
    }
    for (let i = 0; i < collection.length; i++) {
      if (i === index) {
        collection[i].classList.toggle('accordion-open');
        break;
      }
    }
  }

}
