import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
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
  tankData: any[] = [];
  tankData$ = new BehaviorSubject<any[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreviewData,
    private dialogRef: MatDialogRef<CoqApplicationPreviewComponent>
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.data?.isGasProduct ? this.gasColumns : this.liquidColumns;
  }

  setDataSource(): void {
    
  }

  trackByFn(index: number) {
    return index;
  }

  onClose() {
    
  }

}

interface PreviewData {
  tankData: CoQData[];
  isGasProduct: boolean;
}