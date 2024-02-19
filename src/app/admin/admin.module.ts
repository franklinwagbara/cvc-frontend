import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ApplicationComponent } from './application/application.component';
import { ApplicationViewTableComponent } from './application/view-application/application-view-table/application-view-table.component';
import { ViewApplicationComponent } from './application/view-application/view-application.component';
import { AllStaffComponent } from './settings/all-staff/all-staff.component';
import { AppStageDocsComponent } from './settings/app-stage-docs/app-stage-docs.component';
import { BranchSettingComponent } from './settings/branch-setting/branch-setting.component';
import { FieldZonalOfficeComponent } from './settings/field-zonal-office/field-zonal-office.component';
import { ModulesSettingComponent } from './settings/modules-setting/modules-setting.component';
import { AppProcessComponent } from './settings/app-process/app-process.component';
import { MyDeskComponent } from './desk/my-desk/my-desk.component';
import { BarChartComponent } from './admin/dashboard/bar-chart/bar-chart.component';
import { ShowMoreComponent } from '../shared/reusable-components/show-more/show-more.component';
import { PhasedocumentsComponent } from './settings/phasedocuments/phasedocuments.component';
import { FilterleftComponent } from './admin/application-report/filterleft/filterleft.component';
import { PaymentFilterleftComponent } from './admin/payment-report/payment-filterleft/payment-filterleft.component';
import { FilterrightComponent } from './admin/application-report/filterright/filterright.component';
import { PaymentFilterrightComponent } from './admin/payment-report/payment-filterright/payment-filterright.component';
import { ExtrasComponent } from './admin/application-report/extras/extras.component';
import { PaymentExtrasComponent } from './admin/payment-report/payment-extras/payments-extras.component';
import { PaymentGraphModalComponent } from './admin/payment-report/payment-graph/payment-graph-modal.component';
import { GraphModalComponent } from './admin/application-report/graph-modal/graph-modal.component';
import { ApplicationReportComponent } from './admin/application-report/application-report.component';
import { PaymentReportComponent } from './admin/payment-report/payment-report.component';
import { ApplicationReportBarChartComponent } from './admin/application-report/bar-chart/bar-chart.component';
import { PaymentReportBarChartComponent } from './admin/payment-report/bar-chart/bar-chart.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CoqApplicationFormComponent } from './coq-application-form/coq-application-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NoaApplicationsByDepotComponent } from './noa-applications-by-depot/noa-applications-by-depot.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CoqApplicationsByDepotComponent } from './coq-applications-by-depot/coq-applications-by-depot.component';
import { FieldOfficerDepotSettingComponent } from './settings/field-officer-depot-setting/field-officer-depot-setting.component';
import { AppFeeComponent } from './settings/app-fee/app-fee.component';
import { AppDepotComponent } from './settings/app-depot/app-depot.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentViewTableComponent } from './payment/view-payment/payment-view-table/payment-view-table.component';
import { ViewPaymentComponent } from './payment/view-payment/view-payment.component';
import { RolesComponent } from './settings/roles/roles.component';
import { JettySettingComponent } from './settings/jetty-setting/jetty-setting.component';
import { NominatedSurveyorSettingComponent } from './settings/nominated-surveyor-setting/nominated-surveyor-setting.component';
import { MatStepperModule } from '@angular/material/stepper';
import { EditCoqFormComponent } from './coq-application-form/edit-coq-form/edit-coq-form.component';
import { CoqFormReviewComponent } from './coq-application-form/coq-form-review/coq-form-review.component';
import { ProductsComponent } from './settings/products/products.component';
import { MatCardModule } from '@angular/material/card';
import { CoqApplicationViewComponent } from './application/coq-application-view/coq-application-view.component';
import { CoqApplicationViewTableComponent } from './application/coq-application-view/coq-application-view-table/coq-application-view-table.component';
import { ViewCoqTankComponent } from './application/coq-application-view/view-coq-tank/view-coq-tank.component';
import { AllCoqCertificatesComponent } from './all-coq-certificates/all-coq-certificates.component';
import { AllNoaClearancesComponent } from './all-noa-clearances/all-noa-clearances.component';
import { ViewNoaApplicationComponent } from './noa-applications-by-depot/view-noa-application/view-noa-application.component';
import { CoqApplicationPreviewComponent } from './coq-application-form/coq-application-preview/coq-application-preview.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmailConfigComponent } from './settings/email-config/email-config.component';
import { AllCoqApplicationsComponent } from './all-coq-applications/all-coq-applications.component';
import { FieldOfficerJettySettingComponent } from './settings/field-officer-jetty-setting/field-officer-jetty-setting.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { NoaApplicationsByJettyComponent } from './noa-applications-by-jetty/noa-applications-by-jetty.component';
import { CoqFormReviewPPComponent } from './processing-plant/coq-application-form/coq-form-review/coq-form-review-pp.component';
import { EditCoqFormPPComponent } from './processing-plant/coq-application-form/edit-coq-form/edit-coq-form-pp.component';
import { CoqApplicationPreviewPPComponent } from './processing-plant/coq-application-form/coq-application-preview/coq-application-preview-pp.component';
import { GasDataEntryComponent } from './processing-plant/coq-application-form/gas-data-entry/gas-data-entry.component';
import { LiquidDataDynamicEntryComponent } from './processing-plant/coq-application-form/liquid-data-dynamic-entry/liquid-data-dynamic-entry.component';
import { LiquidDataStaticEntryComponent } from './processing-plant/coq-application-form/liquid-data-static-entry/liquid-data-static-entry.component';
import { GasDataDynamicEntryComponent } from './processing-plant/coq-application-form/gas-data-dynamic-entry/gas-data-dynamic-entry.component';
import { GasDataStaticEntryComponent } from './processing-plant/coq-application-form/gas-data-static-entry/gas-data-static-entry.component';
import { DataEntryFormComponent } from './processing-plant/coq-application-form/data-entry-form/data-entry-form.component';
import { PageTitleComponent } from './processing-plant/coq-application-form/page-title/page-title.component';
import { MeterTypeSettingComponent } from './settings/meter-type-setting/meter-type-setting.component';
import { DipMethodSettingComponent } from './settings/dip-method-setting/dip-method-setting.component';
import { ProcessingDetailsLiquidComponent } from './processing-plant/coq-application-form/processing-details-liquid/processing-details-liquid.component';
import { ProcessingDetailsGasComponent } from './processing-plant/coq-application-form/processing-details-gas/processing-details-gas.component';
import { CoqApplicationPPFormComponent } from './processing-plant/coq-application-form/coq-application-pp-form.component';
import { BeforeLiquidDynamicDataEntryComponent } from './processing-plant/coq-application-form/liquid-data-dynamic-entry/before-liquid-dynamic-data-entry/before-liquid-dynamic-data-entry.component';
import { AfterLiquidDynamicDataEntryComponent } from './processing-plant/coq-application-form/liquid-data-dynamic-entry/after-liquid-dynamic-data-entry/after-liquid-dynamic-data-entry.component';
import { AfterLiquidStaticDataEntryComponent } from './processing-plant/coq-application-form/liquid-data-static-entry/after-liquid-static-data-entry/after-liquid-static-data-entry.component';
import { BeforeLiquidStaticDataEntryComponent } from './processing-plant/coq-application-form/liquid-data-static-entry/before-liquid-static-data-entry/before-liquid-static-data-entry.component';
import { BeforeGasDynamicDataEntryComponent } from './processing-plant/coq-application-form/gas-data-dynamic-entry/before-gas-dynamic-data-entry/before-gas-dynamic-data-entry.component';
import { AfterGasDynamicDataEntryComponent } from './processing-plant/coq-application-form/gas-data-dynamic-entry/after-gas-dynamic-data-entry/after-gas-dynamic-data-entry.component';
import { AfterGasStaticDataEntryComponent } from './processing-plant/coq-application-form/gas-data-static-entry/after-gas-static-data-entry/after-gas-static-data-entry.component';
import { BeforeGasStaticDataEntryComponent } from './processing-plant/coq-application-form/gas-data-static-entry/before-gas-static-data-entry/before-gas-static-data-entry.component';
import { StsApplicationsComponent } from './sts-applications/sts-applications.component';
import { RecipientsViewComponent } from './sts-applications/recipients-view/recipients-view.component';
import { AllPpcoqApplicationsComponent } from './all-ppcoq-applications/all-ppcoq-applications.component';
import { PpcoqLiquidAppViewTableComponent } from './application/coq-application-view/ppcoq-application-view-table/ppcoq-liquid-app-view-table/ppcoq-liquid-app-view-table.component';
import { ViewPpcoqTankComponent } from './application/coq-application-view/view-ppcoq-tank/view-ppcoq-tank.component';
import { CondensateDataDynamicEntryComponent } from './processing-plant/coq-application-form/condensate-data-dynamic-entry/condensate-data-dynamic-entry.component';
import { CondensateDataStaticEntryComponent } from './processing-plant/coq-application-form/condensate-data-static-entry/condensate-data-static-entry.component';
import { AfterCondensateDynamicDataEntryComponent } from './processing-plant/coq-application-form/condensate-data-dynamic-entry/after-condensate-dynamic-data-entry/after-condensate-dynamic-data-entry.component';
import { BeforeCondensateDynamicDataEntryComponent } from './processing-plant/coq-application-form/condensate-data-dynamic-entry/before-condensate-dynamic-data-entry/before-condensate-dynamic-data-entry.component';
import { BeforeCondensateStaticDataEntryComponent } from './processing-plant/coq-application-form/condensate-data-static-entry/before-condensate-static-data-entry/before-condensate-static-data-entry.component';
import { AfterCondensateStaticDataEntryComponent } from './processing-plant/coq-application-form/condensate-data-static-entry/after-condensate-static-data-entry/after-condensate-static-data-entry.component';
import { ProcessingDetailsCondensateComponent } from './processing-plant/coq-application-form/processing-details-condensate/processing-details-condensate.component';
import { PpcoqGasAppViewTableComponent } from './application/coq-application-view/ppcoq-application-view-table/ppcoq-gas-app-view-table/ppcoq-gas-app-view-table.component';
import { PpcoqCondensateAppViewTableComponent } from './application/coq-application-view/ppcoq-application-view-table/ppcoq-condensate-app-view-table/ppcoq-condensate-app-view-table.component';
import { ReadingsModalComponent } from './application/coq-application-view/ppcoq-application-view-table/ppcoq-liquid-app-view-table/readings-modal/readings-modal.component';
import { PpcoqApplicationViewTableComponent } from './application/coq-application-view/ppcoq-application-view-table/ppcoq-application-view-table.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    ApplicationComponent,
    AllStaffComponent,
    ModulesSettingComponent,
    FieldZonalOfficeComponent,
    AppStageDocsComponent,
    PhasedocumentsComponent,
    BranchSettingComponent,
    ApplicationViewTableComponent,
    AppFeeComponent,
    AppProcessComponent,
    ViewApplicationComponent,
    MyDeskComponent,
    BarChartComponent,
    ShowMoreComponent,
    FilterleftComponent,
    GraphModalComponent,
    ExtrasComponent,
    FilterrightComponent,
    ApplicationReportComponent,
    PaymentReportComponent,
    PaymentFilterleftComponent,
    PaymentFilterrightComponent,
    PaymentGraphModalComponent,
    PaymentExtrasComponent,
    ApplicationReportBarChartComponent,
    PaymentReportBarChartComponent,
    CertificatesComponent,
    ScheduleComponent,
    AppFeeComponent,
    AppDepotComponent,
    PaymentComponent,
    ViewPaymentComponent,
    PaymentViewTableComponent,
    RolesComponent,
    CoqApplicationFormComponent,
    NoaApplicationsByDepotComponent,
    CoqApplicationsByDepotComponent,
    FieldOfficerDepotSettingComponent,
    JettySettingComponent,
    NominatedSurveyorSettingComponent,
    EditCoqFormComponent,
    CoqFormReviewComponent,
    ProductsComponent,
    CoqApplicationViewComponent,
    CoqApplicationViewTableComponent,
    ViewCoqTankComponent,
    ViewNoaApplicationComponent,
    AllCoqCertificatesComponent,
    AllNoaClearancesComponent,
    CoqApplicationPreviewComponent,
    EmailConfigComponent,
    AllCoqApplicationsComponent,
    FieldOfficerJettySettingComponent,
    NoaApplicationsByJettyComponent,
    CoqFormReviewPPComponent,
    EditCoqFormPPComponent,
    CoqApplicationPreviewPPComponent,
    GasDataEntryComponent,
    LiquidDataDynamicEntryComponent,
    LiquidDataStaticEntryComponent,
    GasDataDynamicEntryComponent,
    GasDataStaticEntryComponent,
    DataEntryFormComponent,
    PageTitleComponent,
    MeterTypeSettingComponent,
    DipMethodSettingComponent,
    ProcessingDetailsLiquidComponent,
    ProcessingDetailsGasComponent,
    CoqApplicationPPFormComponent,
    BeforeLiquidDynamicDataEntryComponent,
    AfterLiquidDynamicDataEntryComponent,
    AfterLiquidStaticDataEntryComponent,
    BeforeLiquidStaticDataEntryComponent,
    BeforeGasDynamicDataEntryComponent,
    AfterGasDynamicDataEntryComponent,
    AfterGasStaticDataEntryComponent,
    BeforeGasStaticDataEntryComponent,
    StsApplicationsComponent,
    RecipientsViewComponent,
    AllPpcoqApplicationsComponent,
    PpcoqLiquidAppViewTableComponent,
    ViewPpcoqTankComponent,
    CondensateDataDynamicEntryComponent,
    CondensateDataStaticEntryComponent,
    AfterCondensateDynamicDataEntryComponent,
    BeforeCondensateDynamicDataEntryComponent,
    BeforeCondensateStaticDataEntryComponent,
    AfterCondensateStaticDataEntryComponent,
    ProcessingDetailsCondensateComponent,
    PpcoqGasAppViewTableComponent,
    PpcoqCondensateAppViewTableComponent,
    ReadingsModalComponent,
    PpcoqApplicationViewTableComponent,
  ],

  imports: [
    CommonModule,
    AdminRoutingModule,
    // NgbModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatGridListModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
  ],
  exports: [],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class AdminModule {}
