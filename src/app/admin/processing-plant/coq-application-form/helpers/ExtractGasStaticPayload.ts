import { IExtractPayload, IExtractResult, SMType } from './IExtractPayload';

export class ExtractGasStaticPayload implements IExtractPayload {
  private _data: any;

  constructor(data) {
    this._data = data;
  }
  public extract = (): IExtractResult => {
    return this.extractPayload(this._data);
  };

  private extractPayload<T extends SMType>(data: T) {
    return {
      tankId: (data as any).id,
      tankReading: {
        measurementType: (data as any).measurementType,
        readingM: (data as any).readingM,
        temperature: (data as any).temperature,
        density: (data as any).density,
        specificGravityObs: (data as any).specificGravityObs,
        barrelsAtTankTables: (data as any).barrelsAtTankTables,
        volumeCorrectionFactor: (data as any).volumeCorrectionFactor,
        wtAir: (data as any).wtAir,
      },
    };
  }
}
