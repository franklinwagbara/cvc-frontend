import { ProductType } from 'src/app/shared/constants/productType';

export type MeasurementSystem = 'Dynamic' | 'Static';

export interface ITankReading {
  tankId: number;
  tankReading: any;
}

export type SMType = {
  status: 'before' | 'after';
  measurementType: 'static' | 'dynamic';
};

export type IPayloadParams =
  | IPayloadParamsLiquid
  | IPayloadParamsGas
  | IPayloadParamsCondensate;

export interface IPayloadParamsLiquid {
  identifiers: IIdentifiers;
  processingDetails: IProcessingDetailsLiquid;
  documents: ISubmitDocument[];
  staticReadings: any[];
  dynamicReadings: any[];
}

export interface IPayloadParamsGas {
  identifiers: IIdentifiers;
  processingDetails: IProcessingDetailsGas;
  documents: ISubmitDocument[];
  staticReadings: any[];
  dynamicReadings: any[];
}

export interface IPayloadParamsCondensate {
  identifiers: IIdentifiers;
  processingDetails: IProcessingDetailsCondensate;
  documents: ISubmitDocument[];
  staticReadings: any[];
  dynamicReadings: any[];
}

export interface ISubmitDocument {
  fileId: number;
  docType: any;
  docName: string;
  docSource: string;
}

export interface IIdentifiers {
  plantId: number;
  productId: number;
  productType: ProductType;
  meterTypeId: number;
  dipMethodId: number;
}

export interface IProcessingDetailsLiquid {
  startTime: any;
  endTime: any;
  consignorName: string;
  consignee: string;
  terminal: string;
  destination: string;
  shipmentNo: string;
  shoreFigure: number;
  shipFigure: number;
  prevUsBarrelsAt15Degree: number;
  prevWTAir: number;
  deliveredMCubeAt15Degree: number;
  deliveredUsBarrelsAt15Degree: number;
  deliveredMTVac: number;
  deliveredMTAir: number;
  deliveredLongTonsAir: number;
  price: number;
}
export interface IProcessingDetailsGas {
  startTime: any;
  endTime: any;
  consignorName: string;
  consignee: string;
  terminal: string;
  destination: string;
  shipmentNo: string;
  shoreFigure: number;
  shipFigure: number;
  prevUsBarrelsAt15Degree: number;
  prevWTAir: number;
  deliveredMCubeAt15Degree: number;
  deliveredUsBarrelsAt15Degree: number;
  deliveredMTVac: number;
  deliveredMTAir: number;
  deliveredLongTonsAir: number;
  price: number;
}

export interface IProcessingDetailsCondensate {
  // plantId: number;
  // productId: number;
  // measurementSystem: MeasurementSystem;
  // meterTypeId: number;
  // dipMethodId: number;
  startTime: any;
  endTime: any;
  consignorName: string;
  consignee: string;
  terminal: string;
  destination: string;
  shipmentNo: string;
  shipFigure: number;
  price: number;
  averageBsw: number;
  apiGravity: number;
  location: string;
}
