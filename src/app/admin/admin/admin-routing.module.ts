import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { TestComponent } from 'src/app/company/test/test.component';
import { ApplicationReportComponent } from './application-report/application-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { LicenceComponent } from '../licence/licence.component';
import { ScheduleComponent } from '../schedule/schedule.component';

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
  { path: 'phasedocuments', component: PhasedocumentsComponent },
  { path: 'application-process', component: AppProcessComponent },
  { path: 'my-desk', component: MyDeskComponent },
  { path: 'view-application/:id', component: ViewApplicationComponent },
  { path: 'test', component: TestComponent },
  { path: 'application-report', component: ApplicationReportComponent },
  { path: 'payment-report', component: PaymentReportComponent },
  { path: 'licences', component: LicenceComponent },
  { path: 'schedules', component: ScheduleComponent },
  { path: 'view-schedule/:id', component: ScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
