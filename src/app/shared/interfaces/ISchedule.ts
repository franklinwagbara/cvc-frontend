export interface ISchedule {
  id: any;
  approver: string;
  comment: string;
  companyCooment: string;
  companyStatus: string;
  scheduleBy: string;
  scheduleDate: string;
  inspectionDate?: string;
  scheduleExpiry: string;
  status: string;
  venue: string;
  typeOfAppoinment: string;
  scheduleMessage?: string;
  scheduleType?: string;
  nominatedStaffId?: string;
  time: string;
}
