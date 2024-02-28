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
import { CoqApplicationsByDepotComponent } from '../coq-applications-by-depot/coq-applications-by-depot.component';
import { FieldOfficerDepotSettingComponent } from '../settings/field-officer-depot-setting/field-officer-depot-setting.component';
import { JettySettingComponent } from '../settings/jetty-setting/jetty-setting.component';
import { NominatedSurveyorSettingComponent } from '../settings/nominated-surveyor-setting/nominated-surveyor-setting.component';
import { ApplicationsGuard } from '../../shared/guards/applications.guard';
import { ProductsComponent } from '../settings/products/products.component';
import { CoqApplicationViewComponent } from '../application/coq-application-view/coq-application-view.component';
import { ApplicationTerm } from 'src/app/shared/constants/applicationTerm';
import { EmailConfigComponent } from '../settings/email-config/email-config.component';
import { AllCoqCertificatesComponent } from '../all-coq-certificates/all-coq-certificates.component';
import { AllNoaClearancesComponent } from '../all-noa-clearances/all-noa-clearances.component';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';
import { AllCoqApplicationsComponent } from '../all-coq-applications/all-coq-applications.component';
import { FieldOfficerGuard } from 'src/app/shared/guards/field-officer.guard';
import { SuperadminGuard } from 'src/app/shared/guards/superadmin.guard';
import { FieldOfficerJettySettingComponent } from '../settings/field-officer-jetty-setting/field-officer-jetty-setting.component';
import { NoaApplicationsByJettyComponent } from '../noa-applications-by-jetty/noa-applications-by-jetty.component';
import { MeterTypeSettingComponent } from '../settings/meter-type-setting/meter-type-setting.component';
import { DipMethodSettingComponent } from '../settings/dip-method-setting/dip-method-setting.component';
import { CoqApplicationPPFormComponent } from '../processing-plant/coq-application-form/coq-application-pp-form.component';
import { StsApplicationsComponent } from '../sts-applications/sts-applications.component';
import { HppitiFieldofficerGuard } from 'src/app/shared/guards/hppiti-fieldofficer.guard';
import { AllPpcoqApplicationsComponent } from '../all-ppcoq-applications/all-ppcoq-applications.component';
import { HppitiCoqGuard } from 'src/app/shared/guards/hppiti-coq.guard';
import { DssriCoqGuard } from 'src/app/shared/guards/dssri-coq.guard';
import { ComingSoonGuard } from 'src/app/shared/guards/coming-soon.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: AdminComponent, 
    pathMatch: 'full',
    title: 'Staff Dashboard | CVC & CoQ Portal'
  },
  {
    path: 'applications',
    redirectTo: 'applications/coq-applications',
    pathMatch: 'full',
  },
  {
    path: 'applications/noa-applications',
    component: ApplicationComponent,
    pathMatch: 'full',
    title: 'NoA Applications | CVC & CoQ Portal'
  },
  {
    path: 'applications/sts-applications',
    component: StsApplicationsComponent,
    pathMatch: 'full',
    title: 'Ship-to-Ship Applications | CVC & CoQ Portal'
  },
  {
    path: 'applications/noa-applications/:id',
    component: ViewApplicationComponent,
    pathMatch: 'full',
    title: 'NoA Application View | CVC & CoQ Portal'
  },
  {
    path: 'applications/coq-applications',
    component: AllCoqApplicationsComponent,
    pathMatch: 'full',
    title: 'All CoQ Applications | CVC & CoQ Portal'
  },
  {
    path: 'applications/coq-applications/:id',
    component: CoqApplicationViewComponent,
    pathMatch: 'full',
    title: 'CoQ Application View | CVC & CoQ Portal'
  },
  {
    path: 'applications/processing-plant/coq-applications/:id',
    component: CoqApplicationViewComponent,
    pathMatch: 'full',
    canActivate: [ApplicationsGuard],
    title: 'CoQ Application View - Processing Plant | CVC & CoQ Portal'
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
    canActivate: [SuperadminGuard],
    title: 'Staff Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/modules',
    component: ModulesSettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Modules Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/application-stage-docs',
    component: AppStageDocsComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Application Document Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/field-zone-office',
    component: FieldZonalOfficeComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Field/Zonal Office | CVC & CoQ Portal'
  },
  {
    path: 'settings/branches',
    component: BranchSettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Branches Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/jetty',
    component: JettySettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Jetty Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/phasedocuments',
    component: PhasedocumentsComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Phase Documents Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/application-process',
    component: AppProcessComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Application Process Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/field-officer-depot',
    component: FieldOfficerDepotSettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Field Officer to Depot Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/field-officer-jetty',
    component: FieldOfficerJettySettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Field Officer to Jetty Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/nominated-surveyors',
    component: NominatedSurveyorSettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Nominated Surveyors Configuration | CVC & CoQ Portal'
  },
  { 
    path: 'desk', 
    component: MyDeskComponent, 
    pathMatch: 'full',
    title: 'Desk | CVC & CoQ Portal'
  },
  {
    path: 'desk/view-application/:id',
    component: ViewApplicationComponent,
    pathMatch: 'full',
    title: 'Desk - NoA Application View | CVC & CoQ Portal'
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
    title: 'Desk - CoQ Application View | CVC & CoQ Portal'
  },
  {
    path: 'vessel-clearance',
    redirectTo: 'vessel-clearance/noa-applications-by-jetty-officer',
    pathMatch: 'full',
  },
  {
    path: 'vessel-clearance/noa-applications-by-jetty-officer',
    component: NoaApplicationsByJettyComponent,
    pathMatch: 'full',
    canActivate: [FieldOfficerGuard],
    title: 'Vessel Clearance - Approved NoA | CVC & CoQ Portal'
  },
  {
    path: 'vessel-clearance/noa-applications-by-jetty-officer/:id',
    component: ViewApplicationComponent,
    pathMatch: 'full',
    canActivate: [FieldOfficerGuard],
    title: 'Vessel Clearance - Approved NoA View | CVC & CoQ Portal'
  },
  {
    path: 'view-application-in-full/:id',
    component: ViewApplicationInFullComponent,
    pathMatch: 'full',
    title: 'Full Application Details | CVC & CoQ Portal'
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
    title: 'Application Report | CVC & CoQ Portal',
    canActivate: [ComingSoonGuard]
  },
  {
    path: 'reports/clearance-report',
    component: ApplicationReportComponent,
    pathMatch: 'full',
    title: 'Clearance Report | CVC & CoQ Portal',
    canActivate: [ComingSoonGuard]
  },
  {
    path: 'reports/payment-report',
    component: PaymentReportComponent,
    pathMatch: 'full',
    title: 'Payment Report | CVC & CoQ Portal',
    canActivate: [ComingSoonGuard]
  },
  {
    path: 'certificates',
    component: CertificatesComponent,
    canActivate: [ApplicationsGuard],
    pathMatch: 'full',
    title: 'Approvals | CVC & CoQ Portal'
  },
  {
    path: 'view-schedule/:id',
    component: ScheduleComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings/app-fees',
    component: AppFeeComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'App Fees Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/app-depots',
    component: AppDepotComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Application Depots | CVC & CoQ Portal'
  },
  { 
    path: 'payments', 
    redirectTo: 'payments/all-payments', 
    pathMatch: 'full' 
  },
  {
    path: 'payments/all-payments',
    component: PaymentComponent,
    pathMatch: 'full',
    title: 'Payments | CVC & CoQ Portal',
    canActivate: [ComingSoonGuard]
  },
  { 
    path: 'payment/:id', 
    component: ViewPaymentComponent, 
    pathMatch: 'full' 
  },
  {
    path: 'settings/roles',
    component: RolesComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Roles Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/products',
    component: ProductsComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Products Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/email-config',
    component: EmailConfigComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Email Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/meter-types',
    component: MeterTypeSettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Meter Types Configuration | CVC & CoQ Portal'
  },
  {
    path: 'settings/dip-method',
    component: DipMethodSettingComponent,
    pathMatch: 'full',
    canActivate: [SuperadminGuard],
    title: 'Dip Method Configuration | CVC & CoQ Portal'
  },
  {
    path: 'coq',
    redirectTo: 'coq/coq-applications-by-depot',
    pathMatch: 'full',
  },
  {
    path: 'coq/coq-applications-by-depot',
    component: CoqApplicationsByDepotComponent,
    pathMatch: 'full',
    canActivate: [DssriCoqGuard],
    title: 'Depot-Filtered CoQ Applications | CVC & CoQ Portal'
  },
  {
    path: 'coq/coq-applications-by-depot/:id',
    component: CoqApplicationViewComponent,
    pathMatch: 'full',
    canActivate: [DssriCoqGuard],
    title: 'Depot-Filtered CoQ Application View | CVC & CoQ Portal'
  },
  {
    path: 'coq/coq-applications-by-depot/:coqId/edit-application',
    component: CoqApplicationFormComponent,
    pathMatch: 'full',
    canActivate: [DssriCoqGuard],
    title: 'Edit CoQ Application | CVC & CoQ Portal',
  },
  {
    path: 'coq/noa-applications-by-depot/:id/certificate-of-quantity/new-application',
    component: CoqApplicationFormComponent,
    pathMatch: 'full',
    canActivate: [DssriCoqGuard],
    title: 'Apply for Depot CoQ | CVC & CoQ Portal'
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
    title: 'All CoQ Certificates | CVC & CoQ Portal'
  },
  {
    path: 'all-approvals/noa-clearances',
    component: AllNoaClearancesComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard],
    title: 'All NoA Clearances | CVC & CoQ Portal'
  },
  {
    path: 'processing-plant/certificate-of-quantity/new-application',
    component: CoqApplicationPPFormComponent,
    pathMatch: 'full',
    canActivate: [HppitiFieldofficerGuard],
    data: {
      type: ApplicationTerm.PROCESSINGPLANT,
    },
    title: 'Apply for Processing Plant CoQ | CVC & CoQ Portal'
  },
  {
    path: 'processing-plant/certificate-of-quantity/applications',
    component: AllPpcoqApplicationsComponent,
    pathMatch: 'full',
    canActivate: [HppitiCoqGuard],
    title: 'Processing Plant CoQ Applications | CVC & CoQ Portal'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
