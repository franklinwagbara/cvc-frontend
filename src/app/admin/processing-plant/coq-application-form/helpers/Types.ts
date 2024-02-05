export type MeasurementSystem = 'Dynamic' | 'Static';

export interface ITankReading {
  tankId: number;
  tankReading: any;
}

export type SMType = {
  status: 'before' | 'after';
  measurementType: 'static' | 'dynamic';
};

export interface IPayloadParams {
  identifiers: IIdentifiers;
  processingDetails: IProcessingDetails;
  documents: ISubmitDocument[];
  readings: any[];
}

export interface ISubmitDocument {
  fileId: number;
  docType: any;
  docName: string;
  docSource: string;
}

export interface IIdentifiers {
  isGas: boolean;
  plantId: number;
  productId: number;
  measurementSystem: MeasurementSystem;
  meterTypeId: number;
  dipMethodId: number;
}

export interface IProcessingDetails {
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
}
