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
import { LicenceComponent } from '../licence/licence.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { AppFeeComponent } from '../settings/app-fee/app-fee.component';
import { ApplicationReportComponent } from './application-report/application-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
//import { ViewApplicationInFullComponent } from 'src/app/shared/view-application-in-full/view-application-in-full.component';
import { PaymentComponent } from '../payment/payment.component';
import { ViewPaymentComponent } from '../payment/view-payment/view-payment.component';
import { RolesComponent } from '../settings/roles/roles.component';
import { ViewApplicationInFullComponent } from 'src/app/shared/reusable-components/view-application-in-full/view-application-in-full.component';
import { CoqApplicationFormComponent } from '../coq-application-form/coq-application-form.component';
import { NoaApplicationsByDepotComponent } from '../noa-applications-by-depot/noa-applications-by-depot.component';
import { CoqApplicationsByDepotComponent } from '../coq-applications-by-depot/coq-applications-by-depot.component';
import { FieldOfficerSettingComponent } from '../settings/field-officer-setting/field-officer-setting.component';
import { JettySettingComponent } from '../settings/jetty-setting/jetty-setting.component';
import { CoqGuard } from 'src/app/shared/guards/coq.guard';
import { NominatedSurveyorSettingComponent } from '../settings/nominated-surveyor-setting/nominated-surveyor-setting.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'staff-dashboard', component: DashboardComponent },
  { path: 'staff-desk', component: StaffdeskComponent },
  { path: 'all-applications', component: ApplicationComponent },
  { path: 'all-staff', component: AllStaffComponent },
  { path: 'modules-setting', component: ModulesSettingComponent },
  { path: 'application-stage-docs', component: AppStageDocsComponent },
  { path: 'field-zone-office', component: FieldZonalOfficeComponent },
  { path: 'branch-setting', component: BranchSettingComponent },
  { path: 'jetty-setting', component: JettySettingComponent },
  { path: 'phasedocuments', component: PhasedocumentsComponent },
  { path: 'application-process', component: AppProcessComponent },
  { path: 'field-officer-setting', component: FieldOfficerSettingComponent },
  { path: 'nominated-surveyor-setting', component: NominatedSurveyorSettingComponent },
  { path: 'my-desk', component: MyDeskComponent },
  { path: 'view-application/:id', component: ViewApplicationComponent },
  {
    path: 'view-application-in-full/:id',
    component: ViewApplicationInFullComponent,
  },
  { path: 'application-report', component: ApplicationReportComponent },
  { path: 'payment-report', component: PaymentReportComponent },
  { path: 'licences', component: LicenceComponent },
  { path: 'schedules', component: ScheduleComponent },
  { path: 'view-schedule/:id', component: ScheduleComponent },
  { path: 'app-fees', component: AppFeeComponent },
  { path: 'payments', component: PaymentComponent },
  { path: 'payment/:id', component: ViewPaymentComponent },
  { path: 'roles', component: RolesComponent },
  {
    path: 'noa-applications-by-depot',
    component: NoaApplicationsByDepotComponent,
    canActivate: [CoqGuard]
  },
  {
    path: 'certificate-of-quantity/all-applications-by-depot',
    component: CoqApplicationsByDepotComponent,
    canActivate: [CoqGuard]
  },
  {
    path: 'noa-applications-by-depot/:id/certificate-of-quantity/new-application',
    component: CoqApplicationFormComponent,
    canActivate: [CoqGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
