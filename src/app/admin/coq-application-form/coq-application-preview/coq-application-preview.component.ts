import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, debounce } from 'rxjs';
import { CoQData } from '../coq-application-form.component';

@Component({
  selector: 'app-coq-application-preview',
  templateUrl: './coq-application-preview.component.html',
  styleUrls: ['./coq-application-preview.component.css']
})
export class CoqApplicationPreviewComponent implements OnInit {
  liquidColumns = [
    'dip', 'waterDIP', 'tov', 'waterVolume', 'floatRoofCorr', 'gov', 'temperature', 'density', 'vcf'
  ];
  gasColumns = [
    'liquidDensityVac', 'observedSounding', 'tapeCorrection', 'liquidTemperature', 'observedLiquidVolume',
    'shrinkageFactor', 'vcf', 'tankVolume', 'vapourTemperature', 'vapourPressure', 'molecularWeight', 'vapourFactor'
  ]
  displayedColumns: any[];
  tankData: CoQData[] = [];
  tankData$ = new BehaviorSubject<any[]>([]);
  vesselDischargeData: any;
  previewSource: 'coq-form-view' | 'submitted-coq-view';

  @ViewChild('coqPreview') coqPreview: ElementRef

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreviewData,
    private dialogRef: MatDialogRef<CoqApplicationPreviewComponent>,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.data?.isGasProduct ? this.gasColumns : this.liquidColumns;
    this.tankData = this.data?.tankData;
    this.previewSource = this.data?.previewSource;
    this.vesselDischargeData = this.data?.vesselDischargeData;
    if (!this.data.isGasProduct) {
      this.tankData = this.tankData.map((item) => {
        item.calc = {
          dip: parseFloat(item?.after?.dip) - parseFloat(item?.before?.dip),
          waterDIP: parseFloat(item?.after?.waterDIP) - parseFloat(item?.before?.waterDIP),
          tov: parseFloat(item?.after?.tov) - parseFloat(item?.before?.tov),
          waterVolume: parseFloat(item?.after?.waterVolume) - parseFloat(item?.before?.waterVolume),
          floatRoofCorr: parseFloat(item?.after?.floatRoofCorr) - parseFloat(item?.before?.floatRoofCorr),
          gov: parseFloat(item?.after?.gov) - parseFloat(item?.before?.gov),
          temperature: parseFloat(item?.after?.temperature) - parseFloat(item?.before?.temperature),
          density: parseFloat(item?.after?.density) - parseFloat(item?.before?.density),
          vcf: parseFloat(item?.after?.vcf) - parseFloat(item?.before?.vcf)
        }
        return item;
      })
    } else {

    }
  }

  setDataSource(): void {
    
  }

  trackByFn(index: number) {
    return index;
  }

  print() {
   const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');

    window.print();
  
    // document.body.innerHTML = originalContents;
  }

  onClose() {
    
  }

}

interface PreviewData {
  tankData: CoQData[];
  isGasProduct: boolean;
  productName?: string;
  vesselDischargeData: any;
  previewSource: 'coq-form-view' | 'submitted-coq-view';
  officer?: { name: string; role: string; remarks: string; }
}