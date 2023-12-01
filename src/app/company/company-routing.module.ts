import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewApplicationComponent } from '../admin/application/view-application/view-application.component';
import { ApplyComponent } from './apply/apply.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messeges.component';
import { MyApplicationComponent } from './my-applications/myapplication.component';
import { MyScheduleComponent } from './schedules/myschedule.component';
import { MypermitsComponent } from './permits/mypermits.component';
import { RegisterDirectorComponent } from './director/registerdirector.component';
import { CompanyInformationComponent } from './company-information/companyinformation.component';
import { UploadComponent } from './apply/upload.component';
import { PreviewAppComponent } from './apply/edit-preview/previewapp.component';
import { PaymentSumComponent } from './payment-summary/paymentsum.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { TestComponent } from './test/test.component';
import { NewApplicationComponent } from './apply/new-application/new-application.component';
import { RenewApplicationComponent } from './apply/renew-application/renew-application.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'myschedule', component: MyScheduleComponent },
  { path: 'changepassword', component: ChangePasswordComponent },
  { path: 'mypermits', component: MypermitsComponent },
  { path: 'apply', component: ApplyComponent },
  { path: 'myapplication', component: MyApplicationComponent },
  { path: 'registerdirector', component: RegisterDirectorComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'previewapp/:id', component: PreviewAppComponent },
  { path: 'paymentsum/:id', component: PaymentSumComponent },
  { path: 'upload-document/:id', component: DocumentUploadComponent },
  { path: 'new', component: NewApplicationComponent },
  { path: 'renew', component: RenewApplicationComponent },
  { path: 'view-application/:id', component: ViewApplicationComponent },
  // { path: 'test', component: TestComponent },

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
