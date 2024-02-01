import { ExtractGasDynamicPayload } from './ExtractGasDynamicPayload';
import { ExtractGasStaticPayload } from './ExtractGasStaticPayload';
import { ExtractLiquidDynamicPayload } from './ExtractLiquidDynamicPayload';
import { ExtractLiquidStaticPayload } from './ExtractLiquidStaticPayload';
import { IExtractPayload, IExtractResult, SMType } from './IExtractPayload';

export class ExtractPayload {
  private _data;

  constructor(data) {
    this._data = data;
  }

  public extract(
    type: 'Liquid' | 'Gas',
    measurementSystem: 'Dynamic' | 'Static'
  ): IExtractResult {
    let ExtractPayload: IExtractPayload;

    if (type == 'Liquid' && measurementSystem == 'Dynamic')
      ExtractPayload = new ExtractLiquidDynamicPayload(this._data);
    else if (type == 'Liquid' && measurementSystem == 'Static')
      ExtractPayload = new ExtractLiquidStaticPayload(this._data);
    else if (type == 'Gas' && measurementSystem == 'Dynamic')
      ExtractPayload = new ExtractGasDynamicPayload(this._data);
    else if (type == 'Gas' && measurementSystem == 'Static')
      ExtractPayload = new ExtractGasStaticPayload(this._data);

    return ExtractPayload.extract();
  }
}
