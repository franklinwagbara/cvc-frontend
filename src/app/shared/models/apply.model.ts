import { string } from '@amcharts/amcharts4/core';

export class uploadFile {
  constructor() {}

  id = 0;
  upload;
}

export class PreviewModel {
  id: number;
  categoryId: number;
  categoryCode: string;
  phaseId: number;
  phaseStageId: number;
  phase: string;
  applicationType: string;
  lgaId: number;
  stateId: number;
  location: string;
  applicationforms: any[];
}

export class previewForm {
  id: number;
  wellLocationCategory: string;
  field: string;
  block: string;
  terrain: string;
  spudDate: string;
  wellSpudDate: string;
  wellClassApplied: string;
  wellSurfaceCoordinates: string;
  proposedRig: string;
  expectedVoloume: string;
  targetReserves: string;
  afe: string;
  estimatedOperationDays: string;
  wellName: string;
  natureOfOperation: string;
  wellCompletionInterval: string;
  rigForOperation: string;
  preOperationProductionRate: string;
  postOperationProductionRate: string;
  initialReservesAllocationOfWell: string;
  cumulativeProductionForWell: string;
  plugbackInterval: string;
  lastProductionRate: string;
}

export class companyProfile {
  accident?: string;
  accident_Report?: string;
  affiliate?: string;
  business_Type?: string;
  contact_FirstName?: string;
  contact_LastName?: string;
  operating_Facility?: any;
  contact_Phone?: string;
  date?: string;
  elps_Id?: string;
  hse?: string;
  hseDoc?: string;
  id?: number;
  mission_Vision?: string;
  name?: string;
  nationality?: string;
  no_Expatriate?: string;
  no_Staff?: string;
  operational_Address_Id?: string;
  rC_Number?: string;
  registered_Address_Id?: string;
  tin_Number?: string;
  total_Asset?: string;
  training_Program?: string;
  user_Id?: string;
  year_Incorporated?: string;
  yearly_Revenue?: string;

  address_1?: string;
  address_2?: string;
  city?: string;
  countryName?: string;
  country_Id?: string;
  postal_code?: string;
  stateId?: string;
  stateName?: string;
  type?: string;

  company_Id?: string;
  firstName?: string;
  lastName?: string;
  address_Id?: number;
  telephone?: string;
}
