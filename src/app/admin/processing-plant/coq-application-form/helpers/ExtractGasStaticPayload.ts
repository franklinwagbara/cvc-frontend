import { IStaticReadings } from './ExtractLiquidStaticPayload';
import {
  ExtractPayloadResult,
  IExtractPayload,
  ILiquidStaticExtractResult,
} from './IExtractPayload';
import { IPayloadParams, ITankReading } from './Types';

export class ExtractGasStaticPayload implements IExtractPayload {
  private payloadParams: IPayloadParams;

  constructor(payload: IPayloadParams) {
    this.payloadParams = payload;
  }
  public extract = (): ExtractPayloadResult => {
    return this.extractPayload(this.payloadParams);
  };

  private extractPayload(payloadParams: IPayloadParams) {
    let result: ILiquidStaticExtractResult = {
      plantId: payloadParams.identifiers.plantId,
      productId: payloadParams.identifiers.productId,
      measurementSystem: payloadParams.identifiers.measurementSystem,
      dipMethodId: payloadParams.identifiers.dipMethodId,
      startTime: payloadParams.processingDetails.startTime,
      endTime: payloadParams.processingDetails.endTime,
      consignorName: payloadParams.processingDetails.consignorName,
      consignee: payloadParams.processingDetails.consignee,
      terminal: payloadParams.processingDetails.terminal,
      destination: payloadParams.processingDetails.destination,
      shipmentNo: payloadParams.processingDetails.shipmentNo,
      shoreFigure: payloadParams.processingDetails.shoreFigure,
      shipFigure: payloadParams.processingDetails.shipFigure,
      prevUsBarrelsAt15Degree:
        payloadParams.processingDetails.prevUsBarrelsAt15Degree,
      prevWTAir: payloadParams.processingDetails.prevWTAir,
      deliveredMCubeAt15Degree:
        payloadParams.processingDetails.deliveredMCubeAt15Degree,
      deliveredUsBarrelsAt15Degree:
        payloadParams.processingDetails.deliveredUsBarrelsAt15Degree,
      deliveredMTVac: payloadParams.processingDetails.deliveredMTVac,
      deliveredMTAir: payloadParams.processingDetails.deliveredMTAir,
      deliveredLongTonsAir:
        payloadParams.processingDetails.deliveredLongTonsAir,
      submitDocuments: payloadParams.documents,
      coqBatches: this.payloadParams.readings,
    };

    return result;
  }

  // private extractBeforeReadings(readings: IStaticReadings[]) {
  //   const result: ITankReading[] = [];

  //   readings.forEach((r) => {
  //     const reading = {
  //       tankId: r.before.id,
  //       tankReading: {
  //         measurementType: r.before.measurementType,
  //         readingM: r.before.readingM,
  //         temperature: r.before.temperature,
  //         density: r.before.density,
  //         specificGravityObs: r.before.specificGravityObs,
  //         barrelsAtTankTables: r.before.barrelsAtTankTables,
  //         volumeCorrectionFactor: r.before.volumeCorrectionFactor,
  //         wtAir: r.before.wtAir,
  //       },
  //     };
  //     result.push(reading);
  //   });

  //   return result;
  // }

  // private extractAfterReadings(readings: IStaticReadings[]) {
  //   const result: ITankReading[] = [];

  //   readings.forEach((r) => {
  //     const reading = {
  //       tankId: r.after.id,
  //       tankReading: {
  //         measurementType: r.after.measurementType,
  //         readingM: r.after.readingM,
  //         temperature: r.after.temperature,
  //         density: r.after.density,
  //         specificGravityObs: r.after.specificGravityObs,
  //         barrelsAtTankTables: r.after.barrelsAtTankTables,
  //         volumeCorrectionFactor: r.after.volumeCorrectionFactor,
  //         wtAir: r.after.wtAir,
  //       },
  //     };
  //     result.push(reading);
  //   });

  //   return result;
  // }
}