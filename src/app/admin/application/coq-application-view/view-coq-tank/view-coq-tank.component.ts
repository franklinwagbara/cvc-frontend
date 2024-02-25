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
    dip: 'DIP',
    waterDIP: 'WATER DIP',
    tov: 'TOV',
    waterVolume: 'WATER VOLUME',
    floatRoofCorr: 'CORR',
    gov: 'GOV',
    temperature: 'TEMPERATURE',
    density: 'DENSITY',
    vcf: 'VCF',
  };

  gasTankKeysMappedToHeaders = {
    measurementType: 'MEASUREMENT TYPE',
    // tankName: 'TANK NAME',
    liquidDensityVac: 'LIQUID DENSITY VAC',
    observedSounding: 'OBSERVED SOUNDING',
    tapeCorrection: 'TAPE CORRECTION',
    liquidTemperature: 'LIQUID TEMPERATURE',
    observedLiquidVolume: 'OBSERVED LIQUID VOLUME',
    shrinkageFactorLiquid: 'SHRINKAGE FACTOR (LIQUID)',
    vcf: 'VCF',
    tankVolume: 'TANK VOLUME',
    shrinkageFactorVapour: 'SHRINKAGE FACTOR (VAPOUR)',
    vapourTemperature: 'VAPOUR TEMPERATURE',
    vapourPressure: 'VAPOUR PRESSURE',
    molecularWeight: 'MOLECULAR WEIGHT',
    vapourFactor: 'VAPOUR FACTOR',
  };
}
