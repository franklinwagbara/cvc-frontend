import { MeasurementType } from 'src/app/shared/constants/measurement-type';
import {
  ExtractPayloadResult,
  ICondensateDynamicExtractResult,
  ICondensateExtractResult,
  ICondensateStaticExtractResult,
  IExtractPayload,
} from './IExtractPayload';
import {
  IPayloadParams,
  IPayloadParamsCondensate,
  ITankReading,
} from './Types';

export class ExtractCondensatePayload implements IExtractPayload {
  private payloadParams: IPayloadParams;

  constructor(payload: IPayloadParams) {
    this.payloadParams = payload;
  }
  public extract = (): ExtractPayloadResult => {
    return this.extractPayload(this.payloadParams);
  };

  private extractPayload(payloadParams: IPayloadParams) {
    payloadParams = payloadParams as IPayloadParamsCondensate;

    let staticResult: ICondensateStaticExtractResult = {
      coqBatches: this.payloadParams.staticReadings,
    };
    let dynamicResult: ICondensateDynamicExtractResult = {
      coqBatches: this.payloadParams.dynamicReadings,
    };

    let result: ICondensateExtractResult = {
      plantId: payloadParams.identifiers.plantId,
      productId: payloadParams.identifiers.productId,
      measurementSystem: MeasurementType.DYNAMIC,
      meterTypeId: payloadParams.identifiers.meterTypeId,
      dipMethodId: payloadParams.identifiers.dipMethodId,
      startTime: payloadParams.processingDetails.startTime,
      endTime: payloadParams.processingDetails.endTime,
      consignorName: payloadParams.processingDetails.consignorName,
      consignee: payloadParams.processingDetails.consignee,
      terminal: payloadParams.processingDetails.terminal,
      destination: payloadParams.processingDetails.destination,
      shipmentNo: payloadParams.processingDetails.shipmentNo,
      shipFigure: payloadParams.processingDetails.shipFigure,
      price: payloadParams.processingDetails.price,
      averageBsw: payloadParams.processingDetails.averageBsw,
      apiGravity: payloadParams.processingDetails.apiGravity,
      location: payloadParams.processingDetails.location,
      submitDocuments: payloadParams.documents,
      static: staticResult,
      dynamic: dynamicResult,
      // prevUsBarrelsAt15Degree:
      //   payloadParams.processingDetails.prevUsBarrelsAt15Degree,
      // prevWTAir: payloadParams.processingDetails.prevWTAir,
      // deliveredMCubeAt15Degree:
      //   payloadParams.processingDetails.deliveredMCubeAt15Degree,
      // deliveredUsBarrelsAt15Degree:
      //   payloadParams.processingDetails.deliveredUsBarrelsAt15Degree,
      // deliveredMTVac: payloadParams.processingDetails.deliveredMTVac,
      // deliveredMTAir: payloadParams.processingDetails.deliveredMTAir,
      // deliveredLongTonsAir:
      //   payloadParams.processingDetails.deliveredLongTonsAir,
    };

    return result;
  }
}
