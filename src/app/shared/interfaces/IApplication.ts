import { IVessel } from 'src/app/company/apply/new-application/new-application.component';
import { IAppHistory } from './IAppHistory';
import { IApplicationForm } from './IApplicationForm';
import { IExtraPayment } from './IExtraPayment';
import { IInspectionForm } from './IInspectionForm';
import { ISchedule } from './ISchedule';

export interface IApplication {
  id: number;
  addedDate: Date;
  appHistories: IAppHistory[];
  reference: string;
  appType: string;
  companyName: string;
  email: string;
  facilityAddress: string;
  currentDesk: string;
  companyAddress: string;
  facilityName: string;
  facilityType: string;
  lga: string;
  paymentDescription: string;
  paymnetDate: string;
  paymnetStatus: string;
  currentUser: string;
  schedules: ISchedule[];
  state: string;
  status: boolean;
  submittedDate: string;
  totalAmount: number;
  createdDate: string;

  extraPayments: IExtraPayment[];
  gpsCordinates: string;
  inspectionForm: IInspectionForm[];
  permitType: string;
  rrr: string;
  lgaId: number;
  location: string;
  phaseName: string;
  phaseStageId: number;
  stateId: number;
  applicationDocs: IDoc[];

  applicationforms: IApplicationForm[];
  category: string;
  categoryCode: string;
  categoryId: string;

  vessel: IVessel;
}

export interface IDoc {
  docName: string;
  docSource: string;
}
