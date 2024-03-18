export interface IApplicationProcess {
  id: number;
  vesselTypeId: number;
  facilityTypeId: number;
  applicationTypeId: number;
  triggeredByRole: string;
  triggeredByRoleId: string;
  action: string;
  targetRole: string;
  targetRoleId: string;
  toLocation: string;
  toLocationId: string;
  fromLocation: string;
  fromLocationId: string;
  status: string;
  fromDirectorate: string;
  toDirectorate: string;
  rate: string;
  isArchived: boolean;
  permitStageId?: number;
  permitStageName?: string;
  branchId?: number;
  branchName?: string;
  office?: string;
}
