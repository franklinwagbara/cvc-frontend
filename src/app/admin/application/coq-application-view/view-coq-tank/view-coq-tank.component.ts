import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoqAppFormService } from 'src/app/shared/services/coq-app-form.service';

@Component({
  selector: 'app-view-coq-tank',
  templateUrl: './view-coq-tank.component.html',
  styleUrls: ['./view-coq-tank.component.css'],
})
export class ViewCoqTankComponent implements OnInit {
  public tanks: any;
  public productType: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: DialogRef<ViewCoqTankComponent>,
    private coqFormService: CoqAppFormService,
  ) {}

  ngOnInit(): void {
    this.tanks = this.data.tanks;
    this.productType = this.data.productType;
  }

  public tableTitles = {
    branches: 'TANKS READINGS',
  };

  public liquidTankKeysMappedToHeaders = {
    measurementType: 'MEASUREMENT TYPE',
    // tankName: 'TANK NAME',
    dip: 'DIP',
    waterDIP: 'WATER DIP',
    tov: 'TOV',
    waterVolume: 'WATER VOLUME (Ltr)',
    floatRoofCorr: 'FLOAT ROOF CORR',
    gov: 'GOV',
    temperature: 'TEMPERATURE (Celsius)',
    density: 'DENSITY (Kg/L)',
    vcf: 'VCF',
  };

  gasTankKeysMappedToHeaders = {
    measurementType: 'MEASUREMENT TYPE',
    // tankName: 'TANK NAME',
    liquidDensityVac: 'LIQUID DENSITY VAC (Kg/L)',
    observedSounding: 'OBSERVED SOUNDING (m)',
    tapeCorrection: 'TAPE CORRECTION (m)',
    liquidTemperature: 'LIQUID TEMPERATURE (Celsius)',
    observedLiquidVolume: 'OBSERVED LIQUID VOLUME (Ltr)',
    shrinkageFactorLiquid: 'SHRINKAGE FACTOR (LIQUID)',
    vcf: 'VCF',
    tankVolume: 'TANK VOLUME (Ltr)',
    shrinkageFactorVapour: 'SHRINKAGE FACTOR (VAPOUR)',
    vapourTemperature: 'VAPOUR TEMPERATURE (Celsius)',
    vapourPressure: 'VAPOUR PRESSURE (Bar)',
    molecularWeight: 'MOLECULAR WEIGHT',
    vapourFactor: 'VAPOUR FACTOR',
  };
}
