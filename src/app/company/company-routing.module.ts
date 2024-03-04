import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { ApplyComponent } from './apply/apply.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { CvcApplicationsComponent } from './cvc-applications/cvc-applications.component';
import { MyScheduleComponent } from './schedules/myschedule.component';
import { MyapprovalsComponent } from './approvals/myapprovals.component';
import { RegisterDirectorComponent } from './director/registerdirector.component';
import { CompanyInformationComponent } from './company-information/companyinformation.component';
import { UploadComponent } from './apply/upload.component';
import { PreviewAppComponent } from './apply/edit-preview/previewapp.component';
import { PaymentSumComponent } from './payment-summary/paymentsum.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { NewApplicationComponent } from './apply/new-application/new-application.component';
import { ViewApplicationInFullComponent } from '../shared/reusable-components/view-application-in-full/view-application-in-full.component';
import { ViewCoqCertsComponent } from './view-coq-certs/view-coq-certs.component';
import { ViewDebitNotesComponent } from './view-debit-notes/view-debit-notes.component';
import { ProcessingPlantComponent } from './settings/processing-plant/processing-plant.component';
import { AuthCompleteProfileGuard } from '../shared/guards/company.guard';
import { StsApplicationComponent } from './apply/sts-application/sts-application.component';
import { StsApplicationsComponent } from './sts-applications/sts-applications.component';
import { DebitnotePaymentsumComponent } from './debitnote-paymentsum/debitnote-paymentsum.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthCompleteProfileGuard],
    pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthCompleteProfileGuard],
    component: DashboardComponent,
    pathMatch: 'full',
    title: 'CVC & CoQ | Company Dashboard',
  },
  {
    path: 'messages',
    canActivate: [AuthCompleteProfileGuard],
    component: MessagesComponent,
    title: 'CVC & CoQ | Company Notifications',
  },
  {
    path: 'myschedule',
    canActivate: [AuthCompleteProfileGuard],
    component: MyScheduleComponent,
  },
  {
    path: 'changepassword',
    canActivate: [AuthCompleteProfileGuard],
    component: ChangePasswordComponent,
    title: 'CVC & CoQ | Change Password',
  },
  // { path: 'mypermits', component: MypermitsComponent },
  {
    path: 'apply',
    canActivate: [AuthCompleteProfileGuard],
    component: ApplyComponent,
    title: 'CVC & CoQ | Apply',
  },
  {
    path: 'cvc-applications',
    canActivate: [AuthCompleteProfileGuard],
    component: CvcApplicationsComponent,
    title: 'CVC & CoQ | CVC Applications',
  },
  {
    path: 'sts-applications',
    component: StsApplicationsComponent,
    title: 'CVC & CoQ | Ship-to-Ship Applications',
  },
  {
    path: 'processing-plant',
    canActivate: [AuthCompleteProfileGuard],
    component: ProcessingPlantComponent,
    title: 'CVC & CoQ | Processing Plant',
  },
  {
    path: 'registerdirector',
    component: RegisterDirectorComponent,
    title: 'CVC & CoQ | Register Director',
  },
  {
    path: 'upload',
    canActivate: [AuthCompleteProfileGuard],
    component: UploadComponent,
  },
  {
    path: 'previewapp/:id',
    canActivate: [AuthCompleteProfileGuard],
    component: PreviewAppComponent,
  },
  {
    path: 'paymentsum/:id',
    canActivate: [AuthCompleteProfileGuard],
    component: PaymentSumComponent,
    title: 'CVC & CoQ | Application Payment Summary',
  },
  {
    path: 'upload-document/:id',
    canActivate: [AuthCompleteProfileGuard],
    component: DocumentUploadComponent,
    title: 'CVC & CoQ | Application Document Upload',
  },

  {
    path: 'view-application/:id',
    canActivate: [AuthCompleteProfileGuard],
    component: ViewApplicationComponent,
    title: 'CVC & CoQ | View Application',
  },
  {
    path: 'approvals/:id/coqs',
    canActivate: [AuthCompleteProfileGuard],
    component: ViewCoqCertsComponent,
    title: 'CVC & CoQ | CoQ Certificates',
  },

  { path: 'upload', component: UploadComponent },
  { path: 'previewapp/:id', component: PreviewAppComponent },
  { path: 'paymentsum/:id', component: PaymentSumComponent },
  { path: 'upload-document/:id', component: DocumentUploadComponent },
  {
    path: 'application/new-clearance',
    component: NewApplicationComponent,
    canActivate: [AuthCompleteProfileGuard],
    pathMatch: 'full',
    title: 'CVC & CoQ | New CVC Application',
  },
  {
    path: 'application/ship-to-ship',
    component: StsApplicationComponent,
    canActivate: [AuthCompleteProfileGuard],
    pathMatch: 'full',
    title: 'CVC & CoQ | New Ship-to-Ship Application',
  },
  {
    path: 'approvals/:appId/debit-notes',
    component: ViewDebitNotesComponent,
    canActivate: [AuthCompleteProfileGuard],
    title: 'CVC & CoQ | Debit Notes',
  },
  {
    path: 'approvals/:appId/debit-notes/:id',
    component: DebitnotePaymentsumComponent,
    // canActivate: [AuthCompleteProfileGuard],
    title: 'Debit Note Payment Summary | CVC & CoQ Portal'
  },
  {
    path: 'view-application-in-full/:id',
    component: ViewApplicationInFullComponent,
    canActivate: [AuthCompleteProfileGuard],
    title: 'CVC & CoQ | Full Application Details',
  },
  {
    path: 'approvals',
    canActivate: [AuthCompleteProfileGuard],
    component: MyapprovalsComponent,
    title: 'CVC & CoQ | Company Approvals',
  },
  {
    path: 'companyinformation',
    component: CompanyInformationComponent,
    loadChildren: () =>
      import('./company-information/company-information.module').then(
        (m) => m.CompanyInformationModule
      ),
    title: 'CVC & CoQ | Company Information',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
