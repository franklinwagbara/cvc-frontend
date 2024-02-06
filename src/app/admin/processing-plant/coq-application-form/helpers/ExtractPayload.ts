import { ExtractGasDynamicPayload } from './ExtractGasDynamicPayload';
import { ExtractGasStaticPayload } from './ExtractGasStaticPayload';
import { ExtractLiquidDynamicPayload } from './ExtractLiquidDynamicPayload';
import { ExtractLiquidStaticPayload } from './ExtractLiquidStaticPayload';
import { IExtractPayload, ExtractPayloadResult } from './IExtractPayload';
import { IPayloadParams, MeasurementSystem } from './Types';

export class ExtractPayload {
  private _payloadParams: IPayloadParams;
  private _isGas: boolean;
  private measurementSystem: MeasurementSystem;

  constructor(payloadParams: IPayloadParams) {
    this._payloadParams = payloadParams;
    this._isGas = payloadParams.identifiers.isGas;
    this.measurementSystem = payloadParams.identifiers.measurementSystem;
  }

  public extract(): ExtractPayloadResult {
    let ExtractPayload: IExtractPayload;

    if (!this._isGas && this.measurementSystem == 'Dynamic')
      ExtractPayload = new ExtractLiquidDynamicPayload(this._payloadParams);
    else if (!this._isGas && this.measurementSystem == 'Static')
      ExtractPayload = new ExtractLiquidStaticPayload(this._payloadParams);
    else if (this._isGas && this.measurementSystem == 'Dynamic')
      ExtractPayload = new ExtractGasDynamicPayload(this._payloadParams);
    else if (this._isGas && this.measurementSystem == 'Static')
      ExtractPayload = new ExtractGasStaticPayload(this._payloadParams);

    return ExtractPayload.extract();
  }
}
