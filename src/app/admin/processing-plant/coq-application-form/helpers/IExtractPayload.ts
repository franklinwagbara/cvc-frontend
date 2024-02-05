import { ILSDataBatches } from 'src/app/shared/services/processing-plant-context/processing-plant-context.service';
import { ISubmitDocument, ITankReading, MeasurementSystem } from './Types';

export interface IExtractPayload {
  extract: () => ExtractPayloadResult;
}

export type ExtractPayloadResult = ILiquidStaticExtractResult;

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
  coqBatches: ILSDataBatches[];
  submitDocuments: ISubmitDocument[];
}
