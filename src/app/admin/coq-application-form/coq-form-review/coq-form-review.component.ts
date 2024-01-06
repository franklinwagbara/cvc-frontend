import { Component, ElementRef, Input, OnInit } from '@angular/core';
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
  liqProductColumns = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVOI', 'corr', 'gov', 'temp', 'density', 'vcf', 'gsv', 'mtVAC', 'actions'];
  gasProductColumns = [
    'tank', 'status', 'liqDensityVac', 'obsSounding', 'tapeCorr', 'liqTemp', 'observedLiqVol',
    'shrinkageFactor', 'vcf', 'tankVol100', 'vapTemp', 'vapPressure', 'molWt', 'vapFactor', 'actions'
  ]
  displayedColumns: string[];
  localDataKey = LocalDataKey.COQFORMREVIEWDATA;
  dataSources: MatTableDataSource<any[]>[] = [];
  formData: any[] = [];
  @Input() isGasProduct = false;

  objNotEmpty = Util.objNotEmpty;

  constructor(
    public coqFormService: CoqAppFormService,
    public dialog: MatDialog,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.coqFormService.liquidProductReviewData$.subscribe((val) => {
      this.dataSources = [];
      this.formData = this.coqFormService.flattenCoQDataArr(val);
      for (let i = 0; i < this.formData.length; i += 3) {
        const tableData = [this.formData[i], this.formData[i+1], this.formData[i+2]];
        this.dataSources.push(new MatTableDataSource<any[]>(tableData));
      }
    })

    this.coqFormService.gasProductReviewData$.subscribe((val) => {
      this.dataSources = [];
      this.formData = this.coqFormService.flattenCoQDataArr(val);
      for (let i = 0; i < this.formData.length; i += 2) {
        const tableData = [this.formData[i], this.formData[i+1]];
        this.dataSources.push(new MatTableDataSource<any[]>(tableData));
      }
    })

    this.displayedColumns = this.isGasProduct ? this.gasProductColumns : this.liqProductColumns;
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
