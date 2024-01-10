import { ITank } from "./ITank";

export interface ICoqRequirement {
  productName: string;
  productType: string;
  tanks: [ITank];
  requiredDocuments: [
    {
      id: number;
      applicationId: number;
      applicationTypeId: number;
      fileId: number;
      docId: number;
      docSource: string | null;
      docType: string;
      docName: string;
    }
  ];
  apiData: {
    companyElpsId: number;
    facilityElpsId: number;
    apiEmail: string;
    apiHash: string;
  }
}