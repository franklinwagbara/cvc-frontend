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
  grandTotalWeightAir: number;
  grandTotalWeightVac: number;
  grandTotalWeightKg: number;
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
      this.tankData = this.tankData.map((item) => {
        const correctedLiqVolB4 = item?.before?.observedLiquidVolume + item?.before?.shrinkageFactor;
        const correctedLiqVolAft = item?.after?.observedLiquidVolume + item?.after?.shrinkageFactor;
        const grossStdVolB4 = correctedLiqVolB4 * item?.before?.vcf;
        const grossStdVolAft = correctedLiqVolAft * item?.after?.vcf;
        const vapourVolB4 = item?.before?.tankVolume - item?.before?.observedLiquidVolume;
        const vapourVolAft = item?.after?.tankVolume - item?.after?.observedLiquidVolume;
        const correctedVapVolB4 = vapourVolB4 * item?.before.shrinkageFactor;
        const correctedVapVolAft = vapourVolAft * item?.after.shrinkageFactor;
        const vapourWtVacB4 = correctedVapVolB4 * item?.before?.vapourFactor;
        const vapourWtVacAft = correctedVapVolAft * item?.after?.vapourFactor;
        const vapourWtAirB4 = (item?.before?.liquidDensityAir / item?.before?.liquidDensityVac) * vapourWtVacB4;
        const vapourWtAirAft = (item?.after?.liquidDensityAir / item?.after?.liquidDensityVac) * vapourWtVacAft;
        const totalWtVacB4 = item?.before?.liquidDensityVac + vapourWtVacB4;
        const totalWtVacAft = item?.after?.liquidDensityVac + vapourWtVacAft;
        const totalWtAirB4 = item?.before?.liquidDensityAir + vapourWtAirB4;
        const totalWtAirAft = item?.before?.liquidDensityAir + vapourWtAirAft;

        item.calc.before = {
          correctedLiquidLevel: item?.before?.observedSounding + item?.before?.tapeCorrection,
          correctedLiquidVolume: correctedLiqVolB4,
          grossStandardVolume: grossStdVolB4,
          liquidWeightVac: item?.before?.liquidDensityVac * grossStdVolB4,
          liquidWeightAir: item?.before?.liquidDensityAir * grossStdVolB4,
          vapourVolume: vapourVolB4,
          correctedVapourVolume: correctedVapVolB4,
          vapourWeightVac: vapourWtVacB4,
          vapourWeightAir: vapourWtAirB4,
          totalWeightVac: totalWtVacB4,
          totalWeightAir: totalWtAirB4,
        }
        item.calc.after = {
          correctedLiquidLevel: item?.before?.observedSounding + item?.before?.tapeCorrection,
          correctedLiquidVolume: correctedLiqVolAft,
          grossStandardVolume: grossStdVolAft,
          liquidWeightVac: item?.after?.liquidDensityVac * grossStdVolAft,
          liquidWeightAir: item?.after?.liquidDensityAir * grossStdVolAft,
          vapourVolume: vapourVolAft, 
          correctedVapourVolume: correctedVapVolAft,
          vapourWeightVac: vapourWtVacAft,
          vapourWeightAir: vapourWtAirAft,
          totalWeightVac: totalWtVacAft,
          totalWeightAir: totalWtAirAft,
        }
        item.calc.quantityReceivedMtAir = item
        return item;
      })

      const sumOfTotalWtVacB4 = this.tankData.reduce((accum, curr) => accum + curr?.before?.totalWeightVac, 0);
      const sumOfTotalWtVacAft = this.tankData.reduce((accum, curr) => accum + curr?.after?.totalWeightVac, 0);
      this.grandTotalWeightVac = sumOfTotalWtVacAft - sumOfTotalWtVacB4;
      
      const sumOfTotalWtAirB4 = this.tankData.reduce((accum, curr) => accum + curr?.before?.totalWeightAir, 0);
      const sumOfTotalWtAirAft = this.tankData.reduce((accum, curr) => accum + curr?.after?.totalWeightAft, 0);
      this.grandTotalWeightAir = sumOfTotalWtAirAft - sumOfTotalWtAirB4;

      this.grandTotalWeightKg = this.grandTotalWeightVac * 1000;
    }
  }

  setDataSource(): void {
    
  }

  trackByFn(index: number) {
    return index;
  }

  print() {
    const printContents = document.getElementById('coq-data-preview-content');
    const windowPrt = window.open('', '', 'left=0,top=0,width=1000,height=1000,toolbar=0,scrollbars=0,status=0');
    windowPrt.document.write(printContents.innerHTML);
    windowPrt.document.close();
    windowPrt.focus()
    windowPrt.print();
    windowPrt.close();
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