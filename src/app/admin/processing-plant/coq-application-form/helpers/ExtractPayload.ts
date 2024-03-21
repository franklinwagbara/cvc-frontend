import { ExtractCondensatePayload } from './ExtractCondensatePayload';
import { ExtractGasPayload } from './ExtractGasPayload';
import { ExtractLiquidPayload } from './ExtractLiquidPayload';
import { IExtractPayload, ExtractPayloadResult } from './IExtractPayload';
import { IPayloadParams } from './Types';
import { ProductType } from 'src/app/shared/constants/productType';

export class ExtractPayload {
  private _payloadParams: IPayloadParams;
  private _productType: ProductType;

  constructor(payloadParams: IPayloadParams) {
    this._payloadParams = payloadParams;
    this._productType = payloadParams.identifiers.productType;
  }

  public extract(): ExtractPayloadResult {
    let ExtractPayload: IExtractPayload;

    if (this._productType == ProductType.LIQUID)
      ExtractPayload = new ExtractLiquidPayload(this._payloadParams);
    else if (this._productType == ProductType.GAS)
      ExtractPayload = new ExtractGasPayload(this._payloadParams);
    else if (this._productType == ProductType.CONDENSATE)
      ExtractPayload = new ExtractCondensatePayload(this._payloadParams);

    return ExtractPayload.extract();
  }
}
