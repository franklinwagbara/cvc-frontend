import { ITank } from './ITank';
import { IPlant } from './IPlant';

export interface IApplication {
  id?: any;
  reference?: string;
  applicationTypeId?: number;
  vesselTypeId?: number;
  imoNumber?: string | null;
  vesselName?: string | null;
  companyName?: string | null;
  companyEmail?: string | null;
  rrr?: string | null;
  capacity?: number;
  status?: string;
  vessel?: any;
  appJetty?: { 
    id: number; 
    name: string; 
    isDeleted: boolean, 
    deletedAt: string, 
    deletedBy: string; 
  }
  loadingPort?: string | null;
  dischargePort?: string | null;
  marketerName?: string | null;
  motherVessel?: string;
  jetty?: string | null;
  deportStateId?: number;
  tankList?: Array<ITank> | null;
  depotList?: Array<IPlant> | null;
  eta?: string;
  createdDate?: string;

  applicationType?: string;
}

export interface IDoc {
  docName: string;
  docSource: string;
}
