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
  liqProductColumns = ['tank', 'status', 'dip', 'waterDIP', 'tov', 'waterVolume', 'floatRoofCorr', 'gov', 'temp', 'density', 'vcf', 'actions'];
  gasProductColumns = [
    'tank', 'status', 'liquidDensityVac', 'observedSounding', 'tapeCorrection', 'liquidTemperature', 'observedLiquidVolume',
    'shrinkageFactor', 'vcf', 'tankVolume', 'vapourTemperature', 'vapourPressure', 'molecularWeight', 'vapourFactor', 'actions'
  ]
  displayedColumns: string[];
  localDataKey = LocalDataKey.COQFORMREVIEWDATA;
  dataSources: MatTableDataSource<any[]>[] = [];
  formData: any[] = [];
  @Input() isGasProduct: boolean | null;

  objNotEmpty = Util.objNotEmpty;

  constructor(
    public coqFormService: CoqAppFormService,
    public dialog: MatDialog,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    if (this.isGasProduct !== null && this.isGasProduct) {
      this.coqFormService.gasProductReviewData$.subscribe((val) => {
        this.setFormData(val);
      })  
    } else if (this.isGasProduct !== null && !this.isGasProduct) {
      this.coqFormService.liquidProductReviewData$.subscribe((val) => {
        this.setFormData(val);
      })
    }

    this.displayedColumns = this.isGasProduct ? this.gasProductColumns : this.liqProductColumns;
  }

  private setFormData(val: any): void {
    this.dataSources = [];
    this.formData = this.coqFormService.flattenCoQDataArr(val);
    this.formData = this.formData.filter((el) => Object.values(el).every((val) => !!val))
    console.log('Coq App Form Service =============> ', this.formData);
    for (let i = 0; i < this.formData.length; i += 2) {
      const tableData = [this.formData[i], this.formData[i+1]];
      this.dataSources.push(new MatTableDataSource<any[]>(tableData));
    }
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
