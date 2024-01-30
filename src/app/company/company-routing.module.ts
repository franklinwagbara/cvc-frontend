import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { ApplyComponent } from './apply/apply.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { MyApplicationComponent } from './my-applications/myapplication.component';
import { MyScheduleComponent } from './schedules/myschedule.component';
import { MyapprovalsComponent } from './approvals/myapprovals.component';
import { RegisterDirectorComponent } from './director/registerdirector.component';
import { CompanyInformationComponent } from './company-information/companyinformation.component';
import { UploadComponent } from './apply/upload.component';
import { PreviewAppComponent } from './apply/edit-preview/previewapp.component';
import { PaymentSumComponent } from './payment-summary/paymentsum.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { NewApplicationComponent } from './apply/new-application/new-application.component';
import { RenewApplicationComponent } from './apply/renew-application/renew-application.component';
import { ViewApplicationInFullComponent } from '../shared/reusable-components/view-application-in-full/view-application-in-full.component';
import { ViewCoqCertsComponent } from './view-coq-certs/view-coq-certs.component';
import { ViewDebitNotesComponent } from './view-debit-notes/view-debit-notes.component';
import { ProcessingPlantComponent } from './settings/processing-plant/processing-plant.component';
import { StsApplicationComponent } from './apply/sts-application/sts-application.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'myschedule', component: MyScheduleComponent },
  { path: 'changepassword', component: ChangePasswordComponent },
  // { path: 'mypermits', component: MypermitsComponent },
  { path: 'apply', component: ApplyComponent },
  { path: 'myapplication', component: MyApplicationComponent },
  { path: 'processing-plant', component: ProcessingPlantComponent },
  { path: 'registerdirector', component: RegisterDirectorComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'previewapp/:id', component: PreviewAppComponent },
  { path: 'paymentsum/:id', component: PaymentSumComponent },
  { path: 'upload-document/:id', component: DocumentUploadComponent },
  { 
    path: 'application/new-clearance',
    component: NewApplicationComponent,
    pathMatch: 'full'
  },
  { 
    path: 'application/ship-to-ship', 
    component: StsApplicationComponent,
    pathMatch: 'full' 
  },
  { path: 'view-application/:id', component: ViewApplicationComponent },
  { path: 'approvals/:id/coqs', component: ViewCoqCertsComponent },
  {
    path: 'approvals/:id/debit-notes',
    component: ViewDebitNotesComponent,
  },
  {
    path: 'view-application-in-full/:id',
    component: ViewApplicationInFullComponent,
  },
  { path: 'approvals', component: MyapprovalsComponent },
  {
    path: 'companyinformation',
    component: CompanyInformationComponent,
    loadChildren: () =>
      import('./company-information/company-information.module').then(
        (m) => m.CompanyInformationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
