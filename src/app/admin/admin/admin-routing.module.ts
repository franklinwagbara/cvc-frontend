import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AdminComponent } from './admin.component';
import { AppDepotComponent } from '../settings/app-depot/app-depot.component';
import { PaymentComponent } from '../payment/payment.component';
import { ViewPaymentComponent } from '../payment/view-payment/view-payment.component';
import { RolesComponent } from '../settings/roles/roles.component';
import { ViewApplicationInFullComponent } from '../../../../src/app/shared/reusable-components/view-application-in-full/view-application-in-full.component';
import { CoqApplicationFormComponent } from '../coq-application-form/coq-application-form.component';
import { NoaApplicationsByDepotComponent } from '../noa-applications-by-depot/noa-applications-by-depot.component';
import { CoqApplicationsByDepotComponent } from '../coq-applications-by-depot/coq-applications-by-depot.component';
import { FieldOfficerDepotSettingComponent } from '../settings/field-officer-depot-setting/field-officer-depot-setting.component';
import { JettySettingComponent } from '../settings/jetty-setting/jetty-setting.component';
import { CoqGuard } from '../../../../src/app/shared/guards/coq.guard';
import { NominatedSurveyorSettingComponent } from '../settings/nominated-surveyor-setting/nominated-surveyor-setting.component';
import { NoaAndApplicationsGuard } from '../../../../src/app/shared/guards/noa-and-applications.guard';
import { ProductsComponent } from '../settings/products/products.component';
import { CoqApplicationViewComponent } from '../application/coq-application-view/coq-application-view.component';
import { ApplicationTerm } from 'src/app/shared/constants/applicationTerm';
import { ViewNoaApplicationComponent } from '../noa-applications-by-depot/view-noa-application/view-noa-application.component';
import { EmailConfigComponent } from '../settings/email-config/email-config.component';
import { AllCoqCertificatesComponent } from '../all-coq-certificates/all-coq-certificates.component';
import { AllNoaClearancesComponent } from '../all-noa-clearances/all-noa-clearances.component';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';
import { AllCoqApplicationsComponent } from '../all-coq-applications/all-coq-applications.component';
import { NoaVesselClearanceComponent } from '../noa-vessel-clearance/noa-vessel-clearance.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminComponent, pathMatch: 'full' },
  {
    path: 'applications',
    redirectTo: 'applications/noa-applications',
    pathMatch: 'full',
  },
  {
    path: 'applications/noa-applications',
    component: ApplicationComponent,
    pathMatch: 'full',
    canActivate: [NoaAndApplicationsGuard],
  },
  {
    path: 'applications/noa-applications/:id',
    component: ViewApplicationComponent,
    pathMatch: 'full',
  },
  {
    path: 'applications/coq-applications',
    component: AllCoqApplicationsComponent,
    pathMatch: 'full',
    canActivate: [NoaAndApplicationsGuard],
  },
  {
    path: 'applications/coq-applications/:id',
    component: CoqApplicationViewComponent,
    pathMatch: 'full',
    canActivate: [NoaAndApplicationsGuard],
  },
  {
    path: 'settings',
    redirectTo: 'settings/all-staff',
    pathMatch: 'full',
  },
  {
    path: 'settings/all-staff',
    component: AllStaffComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/modules',
    component: ModulesSettingComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/application-stage-docs',
    component: AppStageDocsComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/field-zone-office',
    component: FieldZonalOfficeComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/branches',
    component: BranchSettingComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/jetty',
    component: JettySettingComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/phasedocuments',
    component: PhasedocumentsComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/application-process',
    component: AppProcessComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/field-officer',
    component: FieldOfficerDepotSettingComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/nominated-surveyors',
    component: NominatedSurveyorSettingComponent,
    pathMatch: 'full',
  },
  { path: 'desk', component: MyDeskComponent, pathMatch: 'full' },
  {
    path: 'desk/view-application/:id',
    component: ViewApplicationComponent,
    pathMatch: 'full',
  },
  {
    path: 'view-application/:id',
    component: ViewApplicationComponent,
    pathMatch: 'full',
  },
  {
    path: 'desk/view-coq-application/:id',
    component: CoqApplicationViewComponent,
    pathMatch: 'full',
  },
  {
    path: 'vessel-clearance',
    redirectTo: 'vessel-clearance/noa-applications',
    pathMatch: 'full'
  },
  {
    path: 'vessel-clearance/noa-applications',
    component: NoaVesselClearanceComponent,
    pathMatch: 'full'
  },
  {
    path: 'vessel-clearance/noa-applications/:id',
    component: ViewApplicationComponent,
    pathMatch: 'full'
  },
  {
    path: 'view-application-in-full/:id',
    component: ViewApplicationInFullComponent,
    pathMatch: 'full',
  },
  {
    path: 'reports',
    redirectTo: 'reports/application-report',
    pathMatch: 'full',
  },
  {
    path: 'reports/application-report',
    component: ApplicationReportComponent,
    pathMatch: 'full',
  },
  {
    path: 'reports/payment-report',
    component: PaymentReportComponent,
    pathMatch: 'full',
  },
  {
    path: 'certificates',
    component: CertificatesComponent,
    canActivate: [NoaAndApplicationsGuard],
    pathMatch: 'full',
  },
  {
    path: 'view-schedule/:id',
    component: ScheduleComponent,
    pathMatch: 'full',
  },
  { path: 'settings/app-fees', component: AppFeeComponent, pathMatch: 'full' },
  {
    path: 'settings/app-depots',
    component: AppDepotComponent,
    pathMatch: 'full',
  },
  { path: 'payments', redirectTo: 'payments/all-payments', pathMatch: 'full' },
  {
    path: 'payments/all-payments',
    component: PaymentComponent,
    pathMatch: 'full',
  },
  { path: 'payment/:id', component: ViewPaymentComponent, pathMatch: 'full' },
  { path: 'settings/roles', component: RolesComponent, pathMatch: 'full' },
  {
    path: 'settings/products',
    component: ProductsComponent,
    pathMatch: 'full',
  },
  { path: 'settings/email-config', component: EmailConfigComponent },
  {
    path: 'coq-and-plant',
    redirectTo: 'coq-and-plant/coq-applications-by-depot',
    pathMatch: 'full',
  },
  {
    path: 'coq-and-plant/coq-applications-by-depot',
    component: CoqApplicationsByDepotComponent,
    pathMatch: 'full',
    canActivate: [CoqGuard],
  },
  {
    path: 'coq-and-plant/coq-applications-by-depot/:id',
    component: CoqApplicationViewComponent,
    pathMatch: 'full',
  },
  {
    path: 'coq-and-plant/noa-applications-by-depot/:id/certificate-of-quantity/new-application',
    component: CoqApplicationFormComponent,
    pathMatch: 'full',
    canActivate: [CoqGuard],
    data: {},
  },
  {
    path: 'all-approvals',
    redirectTo: 'all-approvals/coq-certificates',
    pathMatch: 'full',
  },
  {
    path: 'all-approvals/coq-certificates',
    component: AllCoqCertificatesComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard],
  },
  {
    path: 'all-approvals/noa-clearances',
    component: AllNoaClearancesComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard],
  },
  {
    path: 'coq-and-plant/processing-plant/certificate-of-quantity/new-application',
    component: CoqApplicationFormComponent,
    pathMatch: 'full',
    canActivate: [CoqGuard],
    data: {
      type: ApplicationTerm.PROCESSINGPLANT,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
