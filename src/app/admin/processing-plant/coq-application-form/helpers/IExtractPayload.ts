import {
  ICDDataBatches,
  ICSDataBatches,
  ILSDataBatches,
} from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { ISubmitDocument, ITankReading, MeasurementSystem } from './Types';

export interface IExtractPayload {
  extract: () => ExtractPayloadResult;
}

export type ExtractPayloadResult =
  | ILiquidExtractResult
  | ICondensateExtractResult;

export interface ILiquidExtractResult {
  static: ILiquidStaticExtractResult;
  dynamic: ILiquidDynamicExtractResult;
}

export interface ILiquidStaticExtractResult {
  plantId: number;
  productId: number;
  measurementSystem: MeasurementSystem;
  dipMethodId: number;
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
  coqBatches: ILSDataBatches[];
  submitDocuments: ISubmitDocument[];
}

export interface ILiquidDynamicExtractResult {
  plantId: number;
  productId: number;
  measurementSystem: MeasurementSystem;
  dipMethodId: number;
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
  coqBatches: ILSDataBatches[];
  submitDocuments: ISubmitDocument[];
}
export interface ICondensateExtractResult {
  plantId: number;
  productId: number;
  measurementSystem: MeasurementSystem;
  meterTypeId: number;
  dipMethodId: number;
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
  static: ICondensateStaticExtractResult;
  dynamic: ICondensateDynamicExtractResult;
  submitDocuments: ISubmitDocument[];
  // shoreFigure: number;
  // prevUsBarrelsAt15Degree: number;
  // prevWTAir: number;
  // deliveredMCubeAt15Degree: number;
  // deliveredUsBarrelsAt15Degree: number;
  // deliveredMTVac: number;
  // deliveredMTAir: number;
  // deliveredLongTonsAir: number;
}
export interface ICondensateDynamicExtractResult {
  coqBatches: ICDDataBatches[];
}

export interface ICondensateStaticExtractResult {
  coqBatches: ICSDataBatches[];
}
