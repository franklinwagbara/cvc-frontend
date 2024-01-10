import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StaffdeskComponent } from '../staffdesk/staffdesk.component';
import { ApplicationComponent } from '../application/application.component';
import { AllStaffComponent } from '../settings/all-staff/all-staff.component';
import { ModulesSettingComponent } from '../settings/modules-setting/modules-setting.component';
import { FieldZonalOfficeComponent } from '../settings/field-zonal-office/field-zonal-office.component';
import { AppStageDocsComponent } from '../settings/app-stage-docs/app-stage-docs.component';
import { PhasedocumentsComponent } from '../settings/phasedocuments/phasedocuments.component';
import { BranchSettingComponent } from '../settings/branch-setting/branch-setting.component';
import { AppProcessComponent } from '../settings/app-process/app-process.component';
import { MyDeskComponent } from '../desk/my-desk/my-desk.component';
import { ViewApplicationComponent } from '../application/view-application/view-application.component';
import { CertificatesComponent } from '../certificates/certificates.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { AppFeeComponent } from '../settings/app-fee/app-fee.component';
import { ApplicationReportComponent } from './application-report/application-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { AppDepotComponent } from '../settings/app-depot/app-depot.component';
import { PaymentComponent } from '../payment/payment.component';
import { ViewPaymentComponent } from '../payment/view-payment/view-payment.component';
import { RolesComponent } from '../settings/roles/roles.component';
import { ViewApplicationInFullComponent } from '../../../../src/app/shared/reusable-components/view-application-in-full/view-application-in-full.component';
import { CoqApplicationFormComponent } from '../coq-application-form/coq-application-form.component';
import { AllNoaApplicationsComponent } from '../all-noa-applications/all-noa-applications.component';
import { AllCoqApplicationsComponent } from '../all-coq-applications/all-coq-applications.component';
import { FieldOfficerSettingComponent } from '../settings/field-officer-setting/field-officer-setting.component';
import { JettySettingComponent } from '../settings/jetty-setting/jetty-setting.component';
import { CoqGuard } from '../../../../src/app/shared/guards/coq.guard';
import { NominatedSurveyorSettingComponent } from '../settings/nominated-surveyor-setting/nominated-surveyor-setting.component';
import { NoaAndApplicationsGuard } from '../../../../src/app/shared/guards/noa-and-applications.guard';
import { ProductsComponent } from '../settings/products/products.component';
import { CoqApplicationViewComponent } from '../application/coq-application-view/coq-application-view.component';
import { ApplicationTerm } from 'src/app/shared/constants/applicationTerm';


const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'staff-dashboard', component: DashboardComponent },
  { path: 'staff-desk', component: StaffdeskComponent },
  {
    path: 'all-applications',
    component: ApplicationComponent,
    canActivate: [NoaAndApplicationsGuard],
  },
  { path: 'all-staff', component: AllStaffComponent },
  { path: 'modules-setting', component: ModulesSettingComponent },
  { path: 'application-stage-docs', component: AppStageDocsComponent },
  { path: 'field-zone-office', component: FieldZonalOfficeComponent },
  { path: 'branch-setting', component: BranchSettingComponent },
  { path: 'jetty-setting', component: JettySettingComponent },
  { path: 'phasedocuments', component: PhasedocumentsComponent },
  { path: 'application-process', component: AppProcessComponent },
  { path: 'field-officer-setting', component: FieldOfficerSettingComponent },
  {
    path: 'nominated-surveyor-setting',
    component: NominatedSurveyorSettingComponent,
  },
  { path: 'my-desk', component: MyDeskComponent },
  { path: 'view-application/:id', component: ViewApplicationComponent },
  { path: 'view-coq-application/:id', component: CoqApplicationViewComponent },
  {
    path: 'view-application-in-full/:id',
    component: ViewApplicationInFullComponent,
  },
  { path: 'application-report', component: ApplicationReportComponent },
  { path: 'payment-report', component: PaymentReportComponent },
  {
    path: 'certificates',
    component: CertificatesComponent,
    canActivate: [NoaAndApplicationsGuard],
  },
  { path: 'schedules', component: ScheduleComponent },
  { path: 'view-schedule/:id', component: ScheduleComponent },
  { path: 'app-fees', component: AppFeeComponent },
  { path: 'app-depots', component: AppDepotComponent },
  { path: 'payments', component: PaymentComponent },
  { path: 'payment/:id', component: ViewPaymentComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'products', component: ProductsComponent },
  {
    path: 'all-noa-applications',
    component: AllNoaApplicationsComponent,
  },
  {
    path: 'all-coq-applications',
    component: AllCoqApplicationsComponent,
  },
  {
    path: 'certificate-of-quantity/coq-applications-by-depot/:id',
    component: CoqApplicationViewComponent,
    canActivate: [CoqGuard],
  },
  {
    path: 'noa-applications-by-depot/:id/certificate-of-quantity/new-application',
    component: CoqApplicationFormComponent,
    canActivate: [CoqGuard],
  },
  {
    path: 'certificate-of-quantity/new-application',
    component: CoqApplicationFormComponent,
    canActivate: [CoqGuard],
    data: {
      type: ApplicationTerm.PROCESSINGPLANT
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
