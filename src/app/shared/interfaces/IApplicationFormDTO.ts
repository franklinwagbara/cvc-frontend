import { IAppDepot } from "./IAppDepot";
import { IFacility } from "./IFacility";
import { IVessel } from "./IVessel";

export interface IApplicationFormDTO {
  vesselName?: string;
  loadingPort?: string;
  marketerName?: string;
  vesselTypeId?: number;
  imoNumber?: string;
  motherVessel?: string;
  capacity?: number;
  jetty?: string;
  eta?: string;
  totalVolume?: number;

  applicationTypeId?: number;
  facilityName?: string;

  facilitySources?: IFacility[];
  depotList?: IAppDepot[];
  transferDate?: string;
  destinationVessels?: IVessel[];
}