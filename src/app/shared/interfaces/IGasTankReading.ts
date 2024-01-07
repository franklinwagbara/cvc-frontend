export interface IGasTankReading {
  tankId?: string | number,
  tank?: string;
  status?: string;
  liquidDensityVac: number;
  observedSounding: number,
  tapeCorrection: number,
  liquidTemperature: number,
  observedLiquidVolume: number,
  shrinkageFactorLiquid: number,
  vcf: number,
  tankVolume: number,
  shrinkageFactorVapour: number,
  vapourTemperature: number,
  vapourPressure: number,
  molecularWeight: number,
  vapourFactor: number
}