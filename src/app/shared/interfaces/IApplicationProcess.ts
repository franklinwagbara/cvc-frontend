export interface IApplicationProcess {
  id: number;
  vesselTypeId: number;
  facilityTypeId: number;
  applicationTypeId: number;
  triggeredByRole: string;
  action: string;
  targetRole: string;
  toLocation: string;
  fromLocation: string;
  status: string;
  rate: string;
  isArchived: boolean;
  permitStageId?: number;
  permitStageName?: string;
  branchId?: number;
  branchName?: string;
  office?: string;
}
