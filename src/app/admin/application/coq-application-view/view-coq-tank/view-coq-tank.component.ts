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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: DialogRef<ViewCoqTankComponent>) {}

  ngOnInit(): void {
    this.tanks = this.data.data;
  }

  public tableTitles = {
    branches: 'TANKS',
  };

  public tankKeysMappedToHeaders = {
    measurementType: 'MEASUREMENT TYPE',
    dip: 'DIP',
    waterDIP: 'WATER DIP',
    tov: 'TOV',
    waterVolume: 'WATER VOLUME',
    floatRoofCorr: 'CORR',
    gov: 'GOV',
    tempearture: 'TEMPERATURE',
    density: 'DENSITY',
    vcf: 'VCF',
    gsv: 'GSV',
    mtvac: 'MT(VAC)',
    liquidDensityVac: 'LIQUID DENSITY VAC',
    observedSounding: 'OBSERVED SOUNDING',
    tapeCorrection: 'TAPE CORRECTION',
    observedLiquidVolume: 'OBSERVED LIQUID VOLUME',
    shrinkageFactorLiquid: 'SHRINKAGE FACTOR (LIQUID)',
    tankVolume: 'TANK VOLUME',
    //shrinkageFactorVapour: 'SHRINKAGE FACTOR (VAPOUR)',
    vapourTemperature: 'VAPOUR TEMPERATURE',
    vapourPressure: 'VAPOUR PRESSURE',
    molecularWeight: 'MOLECULAR WEIGHT',
    vapourFactor: 'VAPOUR FACTOR',
    liquidDensityAir: 'LIQUID DENSITY AIR',
    correctedLiquidLevel: 'CORRECTED LIQUID LEVEL',
    correctedLiquidVolumeM3: 'CORRECTED LIQUID VOLUME (M3)',
    grossStandardVolumeGas: 'GROSS STANDARD VOLUME (GAS)',
    liquidWeightVAC: 'LIQUID WEIGHT (VAC)',
    liquidWeightAir: 'LIQUID WEIGHT (AIR)',
    vapourVolume: 'VAPOUR VOLUME',
    correctedVapourVolume: 'CORRECTED VAPOUR VOLUME',
    vapourWeightVAC: 'VAPOUR WEIGHT (VAC)',
    vapourWeightAir: 'VAPOUR WEIGHT (AIR)',
    totalGasWeightVAC: 'TOTAL GAS WEIGHT (VAC)',
    totalGasWeightAir: 'TOTAL GAS WEIGHT (AIR)',
  };
}
