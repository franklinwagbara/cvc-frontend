import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CoQData } from '../coq-application-form.component';
import { AuthenticationService } from 'src/app/shared/services';
import { CoqAppFormService } from 'src/app/shared/services/coq-app-form.service';
import { Util } from 'src/app/shared/lib/Util';

@Component({
  selector: 'app-coq-application-preview',
  templateUrl: './coq-application-preview.component.html',
  styleUrls: ['./coq-application-preview.component.css'],
})
export class CoqApplicationPreviewComponent implements OnInit {
  liquidColumns = [
    'dip',
    'waterDIP',
    'tov',
    'waterVolume',
    'floatRoofCorr',
    'gov',
    'temperature',
    'density',
    'vcf',
  ];
  gasColumns = [
    'liquidDensityVac',
    'observedSounding',
    'tapeCorrection',
    'liquidTemperature',
    'observedLiquidVolume',
    'shrinkageFactorLiquid',
    'shrinkageFactorVapour',
    'vcf',
    'tankVolume',
    'vapourTemperature',
    'vapourPressure',
    'molecularWeight',
    'vapourFactor',
  ];
  displayedColumns: any[];
  tankData: CoQData[] = [];
  tankData$ = new BehaviorSubject<any[]>([]);
  dischargeData: any;
  isGasProduct: boolean | null;
  grandTotalWeightAir: number;
  grandTotalWeightVac: number;
  grandTotalWeightKg: number;
  previewSource: 'coq-form-view' | 'submitted-coq-view';
  userInfo: any;

  @ViewChild('coqPreview') coqPreview: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreviewData,
    private dialogRef: MatDialogRef<CoqApplicationPreviewComponent>,
    private auth: AuthenticationService,
    private coqFormService: CoqAppFormService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.auth.currentUser;

    this.displayedColumns = this.data?.isGasProduct
      ? this.gasColumns
      : this.liquidColumns;
    this.tankData = this.data?.tankData;
    this.previewSource = this.data?.previewSource;
    this.dischargeData = this.data?.vesselDischargeData;
    this.isGasProduct = this.data.isGasProduct;

    if (!this.isGasProduct) {
      this.tankData = this.coqFormService.getLiquidCalculatedParams(this.tankData);
    } else {
      this.tankData = this.coqFormService.getGasCalculatedParams(this.tankData);

      this.dischargeData.sumOfTotalWtVacB4 = this.tankData.reduce(
        (accum, curr) => accum + curr.calc?.totalMetricTonsVac,
        0
      );
      this.dischargeData.sumOfTotalWtVacAft = this.tankData.reduce(
        (accum, curr) => accum + curr.calc?.totalMetricTonsVac,
        0
      );
      this.dischargeData.totalReceivedQtyVac = this.tankData.reduce(
        (accum, curr) => accum + curr.calc.receivedQtyVac,
        0
      )
      this.dischargeData.grandTotalWeightVac = 
        this.dischargeData.sumOfTotalWtVacAft - this.dischargeData.sumOfTotalWtVacB4;

      this.dischargeData.sumOfTotalWtAirB4 = this.tankData.reduce(
        (accum, curr) => accum + curr.calc?.totalMetricTonsAir,
        0
      );
      this.dischargeData.sumOfTotalWtAirAft = this.tankData.reduce(
        (accum, curr) => accum + curr.calc?.totalMetricTonsAir,
        0
      );
      this.dischargeData.totalReceivedQtyAir = this.tankData.reduce(
        (accum, curr) => accum + curr.calc.receivedQtyAir,
        0
      )
      this.dischargeData.grandTotalWeightAir = 
        this.dischargeData.sumOfTotalWtAirAft - this.dischargeData.sumOfTotalWtAirB4;

      this.grandTotalWeightKg = this.grandTotalWeightVac * 1000;
    }
  }

  trackByFn(index: number) {
    return index;
  }

  print() {
    // remove unwanted elements from print preview
    (
      document.querySelector('#coq-application-preview-table') as HTMLElement
    ).style.display = 'none';
    (
      document.querySelector('#coq-preview-print-wrapper') as HTMLElement
    ).style.display = 'none';
    setTimeout(() => {
      (
        document.querySelector('#coq-preview-print-wrapper') as HTMLElement
      ).style.display = 'block';
    }, 2000);

    Util.printHtml('coq-data-preview-content');
  }

  public close() {
    this.dialogRef.close();
  }
}

interface PreviewData {
  tankData: CoQData[];
  isGasProduct: boolean;
  productName?: string;
  vesselDischargeData: any;
  previewSource: 'coq-form-view' | 'submitted-coq-view';
  remark: string;
}
