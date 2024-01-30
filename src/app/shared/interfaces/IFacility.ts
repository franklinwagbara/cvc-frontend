export interface IFacility {
  sourceOfProducts: string;
  facilityName: string;
  name?: string;
  address: string;
  licenseNumber: string;
  stateId: string;
  lgaId: string;
}

export interface IFacilityType {
  id: number;
  name: string;
  code: string;
}