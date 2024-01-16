export interface ICoQApplication extends ICOQ {}

export interface ICOQ {
  appId: number;
  createdBy: string;
  createdDate: string;
  dateOfSTAfterDischarge: string;
  dateOfVesselArrival: string;
  dateOfVesselUllage: string;

  dateOfSTAfterDischargeISO: string;
  dateOfVesselArrivalISO: string;
  dateOfVesselUllageISO: string;

  depotId: number;
  depotName: string;
  depotPrice: number;
  gov: number;
  gsv: number;
  id: number;
  importName: string;
  mT_AIR: number;
  mT_VAC: number;
  vesselName: string;

  submittedDate?: string;
}
