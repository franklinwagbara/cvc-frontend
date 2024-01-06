export interface ICoqRequirement {
  productName: string;
  productType: string;
  tanks: [{id: number; name: string;}];
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