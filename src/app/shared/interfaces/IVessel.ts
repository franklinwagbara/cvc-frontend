export interface IVessel {
  id?: number;
  vesselName?: string;
  name?: string;
  capacity?: number;
  operator?: string;
  vesselTypeId?: string;
  vesselType?: string;
  placeOfBuild?: string;
  yearOfBuild?: number;
  flag?: string;
  callSIgn?: string;
  imoNumber: string;
  offtakeVolume?: number;
  productName?: string;
  productId?: number;
}