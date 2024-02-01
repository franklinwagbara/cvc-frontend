export interface IExtractPayload {
  extract: () => IExtractResult;
}

export interface IExtractResult {
  tankId: number;
  tankReading: any;
}

export type SMType = {
  status: 'before' | 'after';
  measurementType: 'static' | 'dynamic';
};
