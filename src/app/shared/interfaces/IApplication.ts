import { ITank } from './ITank';
import { IPlant } from './IPlant';

export interface IApplication {
  id?: any;
  reference?: string;
  applicationTypeId?: number;
  vesselTypeId?: number;
  imoNumber?: string | null;
  vesselName?: string | null;
  vessel?: any;
  loadingPort?: string | null;
  dischargePort?: string | null;
  marketerName?: string | null;
  motherVessel?: string;
  jetty?: string | null;
  deportStateId?: number;
  tankList?: Array<ITank> | null;
  depotList?: Array<IPlant> | null;
  eta?: string;

  applicationType?: string;
}

export interface IDoc {
  docName: string;
  docSource: string;
}
