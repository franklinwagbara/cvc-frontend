import { ITank } from './ITank';
import { IAppDepot } from './IAppDepot';

export interface IApplication {
  applicationTypeId?: number;
  vesselTypeId?: number;
  imoNumber?: string | null;
  vesselName?: string | null;
  loadingPort?: string | null;
  dischargePort?: string | null;
  marketerName?: string | null;
  deportStateId?: number;
  tankList?: Array<ITank> | null;
  depotList?: Array<IAppDepot> | null;
  eta?: string;
}

export interface IDoc {
  docName: string;
  docSource: string;
}
