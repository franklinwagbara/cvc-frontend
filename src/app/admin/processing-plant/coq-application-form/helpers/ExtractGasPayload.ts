import { MeasurementType } from 'src/app/shared/constants/measurement-type';
import {
  ExtractPayloadResult,
  IExtractPayload,
  ILiquidDynamicExtractResult,
  ILiquidExtractResult,
  ILiquidStaticExtractResult,
} from './IExtractPayload';
import { IPayloadParams, IPayloadParamsGas } from './Types';

export class ExtractGasPayload implements IExtractPayload {
  private payloadParams: IPayloadParams;

  constructor(payload: IPayloadParams) {
    this.payloadParams = payload;
  }
  public extract = (): ExtractPayloadResult => {
    return this.extractPayload(this.payloadParams);
  };

  private extractPayload(payloadParams: IPayloadParams) {
    payloadParams = payloadParams as IPayloadParamsGas;

    let staticResult: ILiquidStaticExtractResult = {
      plantId: payloadParams.identifiers.plantId,
      productId: payloadParams.identifiers.productId,
      measurementSystem: MeasurementType.STATIC,
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
      price: payloadParams.processingDetails.price,
      submitDocuments: payloadParams.documents,
      coqBatches: this.payloadParams.staticReadings,
    };
    let dynamicResult: ILiquidDynamicExtractResult = {
      plantId: payloadParams.identifiers.plantId,
      productId: payloadParams.identifiers.productId,
      measurementSystem: MeasurementType.DYNAMIC,
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
      price: payloadParams.processingDetails.price,
      submitDocuments: payloadParams.documents,
      coqBatches: this.payloadParams.dynamicReadings,
    };

    let result: ILiquidExtractResult = {
      static: staticResult,
      dynamic: dynamicResult,
    };

    return result;
  }
}
