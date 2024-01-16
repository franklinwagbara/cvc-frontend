export interface ILiquidTankReading {
  tankId: string | number;
  tank?: string;
  status?: string;
  dip: number;
  waterDIP: number;
  tov: number;
  waterVolume: number;
  floatRoofCorr: number;
  gov: number;
  temp: number;
  density: number;
  vcf: number;
}