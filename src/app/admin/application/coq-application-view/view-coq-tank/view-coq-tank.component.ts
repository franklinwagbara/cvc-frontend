import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    public dialogRef: DialogRef<ViewCoqTankComponent>
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
    dip: 'DIP (m)',
    waterDIP: 'WATER DIP',
    tov: 'TOV (Ltr)',
    waterVolume: 'WATER VOLUME (Ltr)',
    floatRoofCorr: 'FLOAT ROOF CORR (Ltr)',
    gov: 'GOV (Ltr)',
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
